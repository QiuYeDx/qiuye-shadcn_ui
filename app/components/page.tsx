"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, Package, Copy, CheckCircle } from "lucide-react";
import { motion, stagger, AnimatePresence } from "motion/react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ResponsiveTabs,
  type TabItem,
} from "@/components/qiuye-ui/responsive-tabs";
import {
  getAllComponents,
  getCategories,
  getComponentsByCategory,
  searchComponents,
  type ComponentInfo,
} from "@/lib/registry";
import { useClipboard } from "use-clipboard-copy";
import { toast } from "sonner";

export default function ComponentsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [packageManager, setPackageManager] = useState<"npm" | "pnpm">("pnpm");
  const clipboard = useClipboard();

  const allComponents = getAllComponents();
  const categories = getCategories();

  // 将分类数据转换为 ResponsiveTabs 需要的格式
  const categoryItems: TabItem[] = [
    { value: "all", label: "全部" },
    ...categories.map((category) => ({
      value: category,
      label: category,
    })),
  ];

  // 根据搜索和分类过滤组件
  const filteredComponents = searchQuery
    ? searchComponents(searchQuery)
    : selectedCategory === "all"
      ? allComponents
      : getComponentsByCategory(selectedCategory);

  const getCommandPrefix = () => {
    return packageManager === "npm" ? "npx" : "pnpm dlx";
  };

  const generateCommand = (componentId: string) => {
    return `${getCommandPrefix()} shadcn@latest add @qiuye-ui/${componentId}`;
  };

  const handleCopyCommand = (componentId: string) => {
    const command = generateCommand(componentId);
    clipboard.copy(command);
    toast.success("复制成功！", {
      description: `已复制命令: ${command}`,
    });
  };

  // 父级网格：先进场，再播放子项；离场时等子项先退场
  const gridVariants = {
    hidden: { opacity: 0, y: 20 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        when: "beforeChildren",
        delayChildren: stagger(0.18),
        type: "spring",
        visualDuration: 0.25,
        bounce: 0.12,
      },
    },
    // 只有在整个网格卸载时才会触发（例如外层条件渲染切换）
    exit: {
      opacity: 0,
      y: 12,
      transition: {
        when: "afterChildren", // 先等子项完成 exit
        duration: 0.2, // 这里用 tween，让离场更可控
      },
    },
  } as const;

  // 子卡片：进入 / 离开动画
  const cardVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.98 },
    show: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        visualDuration: 0.45,
        bounce: 0.48,
      },
    },
    exit: {
      opacity: 0,
      y: -8,
      scale: 0.98,
      transition: { duration: 0.2 },
    },
  } as const;

  return (
    <div className="@container container mx-auto px-6 py-8">
      {/* Header */}
      <div className="mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            type: "spring",
            stiffness: 120,
            damping: 40,
            duration: 0.25,
          }}
        >
          <h1 className="text-4xl font-bold tracking-tight mb-4">QiuYe UI</h1>
          <p className="text-xl text-muted-foreground mb-6">
            精心设计的自定义UI组件，让您的应用更加出色
          </p>

          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              <span>{allComponents.length} 个组件</span>
            </div>
            <div className="flex items-center gap-2">
              <span>•</span>
              <span>{categories.length} 个分类</span>
            </div>
            <div className="flex items-center gap-2">
              <span>•</span>
              <span>一键复制CLI命令</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Search and Filter */}
      <motion.div
        className="mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          type: "spring",
          stiffness: 120,
          damping: 40,
          duration: 0.45,
          delay: 0.25,
        }}
      >
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="搜索组件..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground shrink-0">包管理器:</span>
            <ResponsiveTabs
              value={packageManager}
              onValueChange={(value) =>
                setPackageManager(value as "npm" | "pnpm")
              }
              items={[
                { value: "npm", label: "npm" },
                { value: "pnpm", label: "pnpm" },
              ]}
              layout="grid"
              gridColsClass="grid-cols-2"
              listClassName="w-[140px] h-9"
              triggerClassName="text-xs"
              scrollButtons={false}
              fadeMasks={false}
            />
          </div>
        </div>

        <div className="-mx-6 px-6">
          <ResponsiveTabs
            value={selectedCategory}
            onValueChange={setSelectedCategory}
            items={categoryItems}
            gridColsClass="sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6"
            triggerClassName="text-xs"
          >
          </ResponsiveTabs>
        </div>
      </motion.div>

      {/* Components Grid / Empty State 切换：带离场 */}
      <AnimatePresence mode="wait">
        {filteredComponents.length === 0 ? (
          // 空态：等网格离场完再出现
          <motion.div
            key="empty"
            className="text-center py-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ type: "tween", duration: 0.25 }}
          >
            <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">没有找到匹配的组件</h3>
            <p className="text-muted-foreground">
              尝试修改搜索关键词或选择其他分类
            </p>
          </motion.div>
        ) : (
          // 网格：父先、子后；移除子项时播放 exit
          <motion.div
            key="grid"
            className="grid grid-cols-1 @xl:grid-cols-2 @4xl:grid-cols-3 gap-6"
            variants={gridVariants}
            initial="hidden"
            animate="show"
            exit="exit"
          >
            <AnimatePresence mode="popLayout">
              {filteredComponents.map((component) => (
                <motion.div
                  key={component.cliName} // 使用稳定 key，确保正确的出场动画
                  variants={cardVariants}
                  layout // 位置变化时做流畅过渡
                  // exit="exit" // 设置 exit 后, 父先子后的 stagger 入场动画就失效了
                  whileHover={{ y: -4, transition: { duration: 0.2 } }}
                >
                  <ComponentCard
                    component={component}
                    onCopyCommand={handleCopyCommand}
                    packageManager={packageManager}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

interface ComponentCardProps {
  component: ComponentInfo;
  onCopyCommand: (componentId: string) => void;
  packageManager: "npm" | "pnpm";
}

// 精简后的子组件：不再包一个 motion.div，动画交给父级
function ComponentCard({
  component,
  onCopyCommand,
  packageManager,
}: ComponentCardProps) {
  const [copied, setCopied] = useState(false);

  const generateCommand = (componentId: string) => {
    const prefix = packageManager === "npm" ? "npx" : "pnpm dlx";
    return `${prefix} shadcn@latest add @qiuye-ui/${componentId}`;
  };

  const handleCopy = () => {
    onCopyCommand(component.cliName);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card className="h-full hover:shadow-lg transition-all duration-300">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg mb-2">{component.name}</CardTitle>
            <CardDescription className="text-sm line-clamp-2 h-[40px]">
              {component.description}
            </CardDescription>
          </div>
          <Badge variant="secondary" className="ml-2">
            {component.category}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Tags */}
        <div className="flex flex-wrap gap-1">
          {component.tags.slice(0, 3).map((tag) => (
            <Badge key={tag} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
          {component.tags.length > 3 && (
            <Badge variant="outline" className="text-xs">
              +{component.tags.length - 3}
            </Badge>
          )}
        </div>

        {/* CLI Command */}
        <div className="bg-muted/50 rounded-md p-3">
          <div className="flex items-center justify-between">
            <code className="text-sm font-mono">
              {generateCommand(component.cliName)}
            </code>
            <Button
              size="sm"
              variant="ghost"
              onClick={handleCopy}
              className="h-6 w-6 p-0"
            >
              {copied ? (
                <CheckCircle className="h-3 w-3 text-green-500" />
              ) : (
                <Copy className="h-3 w-3" />
              )}
            </Button>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Button asChild variant="outline" size="sm" className="flex-1">
            <Link href={`/components/${component.cliName}`}>查看详情</Link>
          </Button>
          <Button onClick={handleCopy} size="sm" className="flex-1">
            {copied ? "已复制" : "复制命令"}
          </Button>
        </div>

        {/* Metadata */}
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>v{component.version}</span>
          <span>by {component.author}</span>
        </div>
      </CardContent>
    </Card>
  );
}
