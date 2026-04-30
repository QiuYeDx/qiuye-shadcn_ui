/**
 * 从代码块的 meta 字符串中解析 title、highlightLines 等属性
 *
 * 支持的语法:
 * - title:  ```tsx title="filename.tsx"  /  title='...'  /  title=...
 * - 行高亮: ```tsx {1,3,5-10}  （花括号内为逗号分隔的行号或范围）
 *
 * 两者可任意组合、顺序不限:
 *   ```tsx title="App.tsx" {3,7-9}
 *   ```tsx {1,4-6} title="utils.ts"
 */
export function parseCodeBlockMeta(meta: string | undefined | null): {
  title?: string;
  highlightLines?: string;
} {
  if (!meta) return {};
  const result: { title?: string; highlightLines?: string } = {};

  const titleMatch = meta.match(/title\s*=\s*(?:"([^"]*)"|'([^']*)'|(\S+))/);
  if (titleMatch) {
    result.title = titleMatch[1] ?? titleMatch[2] ?? titleMatch[3];
  }

  const highlightMatch = meta.match(/\{([\d,\s-]+)\}/);
  if (highlightMatch) {
    result.highlightLines = highlightMatch[1].trim();
  }

  return result;
}
