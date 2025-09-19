"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, Package, Copy, CheckCircle } from "lucide-react";
import { motion } from "motion/react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  getAllComponents, 
  getCategories, 
  getComponentsByCategory, 
  searchComponents,
  type ComponentInfo 
} from "@/lib/registry";
import { useClipboard } from "use-clipboard-copy";
import { toast } from "sonner";

export default function ComponentsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const clipboard = useClipboard();

  const allComponents = getAllComponents();
  const categories = getCategories();

  // 根据搜索和分类过滤组件
  const filteredComponents = searchQuery
    ? searchComponents(searchQuery)
    : selectedCategory === "all"
    ? allComponents
    : getComponentsByCategory(selectedCategory);

  const handleCopyCommand = (componentId: string) => {
    const command = `npx shadcn-ui@latest add qiuye-ui/${componentId}`;
    clipboard.copy(command);
    toast.success("复制成功！", {
      description: `已复制命令: ${command}`,
    });
  };

  return (
    <div className="container mx-auto px-6 py-8">
      {/* Header */}
      <div className="mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl font-bold tracking-tight mb-4">
            秋夜组件库
          </h1>
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
        transition={{ duration: 0.6, delay: 0.2 }}
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
        </div>

        <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-1">
            <TabsTrigger value="all" className="text-xs">全部</TabsTrigger>
            {categories.map((category) => (
              <TabsTrigger key={category} value={category} className="text-xs">
                {category}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </motion.div>

      {/* Components Grid */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        {filteredComponents.length === 0 ? (
          <div className="text-center py-12">
            <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">没有找到匹配的组件</h3>
            <p className="text-muted-foreground">
              尝试修改搜索关键词或选择其他分类
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredComponents.map((component, index) => (
              <ComponentCard
                key={component.cliName}
                component={component}
                index={index}
                onCopyCommand={handleCopyCommand}
              />
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}

interface ComponentCardProps {
  component: ComponentInfo;
  index: number;
  onCopyCommand: (componentId: string) => void;
}

function ComponentCard({ component, index, onCopyCommand }: ComponentCardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    onCopyCommand(component.cliName);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
    >
      <Card className="h-full hover:shadow-lg transition-all duration-300">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-lg mb-2">{component.name}</CardTitle>
              <CardDescription className="text-sm line-clamp-2">
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
                npx shadcn-ui@latest add qiuye-ui/{component.cliName}
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
              <Link href={`/components/${component.cliName}`}>
                查看详情
              </Link>
            </Button>
            <Button 
              onClick={handleCopy}
              size="sm" 
              className="flex-1"
            >
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
    </motion.div>
  );
}
