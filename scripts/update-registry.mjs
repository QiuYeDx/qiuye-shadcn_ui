// scripts/update-registry.mjs
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * CLI:
 * --dir   要扫描的目录（递归），默认 "registry"
 * --base  组件源码所在根目录，默认项目根 "."
 * --dry   仅打印不写入
 *
 * 示例：
 * node scripts/update-registry.mjs --dir registry --base .
 * node scripts/update-registry.mjs --dir ./my-registry --base . --dry
 */
const argv = parseArgs(process.argv.slice(2));
const REGISTRY_DIR = argv.dir ?? "registry";
const COMPONENT_BASE = argv.base ?? ".";
const DRY_RUN = hasFlag(argv, "dry");

function parseArgs(args) {
  const out = {};
  for (let i = 0; i < args.length; i++) {
    const a = args[i];
    if (a.startsWith("--")) {
      const key = a.slice(2);
      const next = args[i + 1];
      if (!next || next.startsWith("--")) {
        out[key] = true;
      } else {
        out[key] = next;
        i++;
      }
    }
  }
  return out;
}
function hasFlag(obj, key) {
  return Object.prototype.hasOwnProperty.call(obj, key) && obj[key] !== "false";
}

async function* walk(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const e of entries) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) yield* walk(p);
    else if (e.isFile()) yield p;
  }
}

async function readJSON(p) {
  const raw = await fs.readFile(p, "utf-8");
  try {
    return JSON.parse(raw);
  } catch (e) {
    throw new Error(`JSON 解析失败: ${p}\n${e.message}`);
  }
}

async function tryReadFileByCandidates(base, relPath) {
  const candidates = [
    path.join(base, relPath),
    // 常见：registry 的 path 带了 src/，而实际源码不在 src 下
    path.join(base, relPath.replace(/^src\//, "")),
    // 有时 path 是以 ./ 开头
    path.join(base, relPath.replace(/^\.\//, "")),
  ];

  for (const c of candidates) {
    try {
      const stat = await fs.stat(c);
      if (stat.isFile()) {
        const content = await fs.readFile(c, "utf-8");
        return { found: true, content, resolved: c };
      }
    } catch {
      // ignore
    }
  }
  return { found: false, content: null, resolved: null };
}

function isRegistryItemLike(obj) {
  return (
    obj &&
    typeof obj === "object" &&
    Array.isArray(obj.files) &&
    typeof obj.name === "string"
  );
}

async function processRegistryJson(jsonPath) {
  const data = await readJSON(jsonPath);
  if (!isRegistryItemLike(data)) {
    console.warn(`⚠️ 跳过（不是 registry-item 结构）：${jsonPath}`);
    return { updated: false, details: [] };
  }

  const details = [];
  let changed = false;

  for (let i = 0; i < data.files.length; i++) {
    const f = data.files[i];
    if (!f || typeof f !== "object") continue;

    // 仅处理 registry:component（你也可以放开到其他 type）
    if (f.type !== "registry:component") {
      details.push(`- 跳过 files[${i}]（type=${f.type ?? "N/A"}）`);
      continue;
    }

    const rel = f.path;
    if (!rel || typeof rel !== "string") {
      details.push(`- 跳过 files[${i}]：缺少 path`);
      continue;
    }

    const attempt = await tryReadFileByCandidates(COMPONENT_BASE, rel);
    if (!attempt.found) {
      details.push(`- ❌ files[${i}] 未找到源码：${rel}`);
      continue;
    }

    if (f.content !== attempt.content) {
      changed = true;
      details.push(
        `- ✅ files[${i}] 更新 content：${rel}  ←  ${path.relative(process.cwd(), attempt.resolved)}`
      );
      if (!DRY_RUN) {
        data.files[i] = { ...f, content: attempt.content };
      }
    } else {
      details.push(`- ℹ️ files[${i}] 内容无变化：${rel}`);
    }
  }

  if (changed && !DRY_RUN) {
    // 保持漂亮的缩进
    await fs.writeFile(jsonPath, JSON.stringify(data, null, 2) + "\n", "utf-8");
  }

  return { updated: changed, details };
}

(async function main() {
  const absRegistryDir = path.resolve(process.cwd(), REGISTRY_DIR);
  const absBase = path.resolve(process.cwd(), COMPONENT_BASE);
  console.log(`🔎 扫描目录: ${absRegistryDir}`);
  console.log(`📦 组件根目录: ${absBase}`);
  if (DRY_RUN) console.log(`🧪 当前为 dry run，仅预览更改\n`);

  let total = 0;
  let changed = 0;

  try {
    for await (const p of walk(absRegistryDir)) {
      if (!p.endsWith(".json")) continue;
      total++;
      const rel = path.relative(process.cwd(), p);
      try {
        const { updated, details } = await processRegistryJson(p);
        if (updated) changed++;
        console.log(`\n📄 ${rel}`);
        details.forEach((d) => console.log(d));
      } catch (e) {
        console.error(`\n❌ 处理失败：${rel}\n${e.message}`);
      }
    }
  } catch (e) {
    console.error(`\n❌ 扫描失败：${e.message}`);
    process.exitCode = 1;
    return;
  }

  console.log(`\n—— 完成 ——`);
  console.log(`共发现 JSON：${total}，实际${DRY_RUN ? "将要" : "已"}更新：${changed}`);
})();
