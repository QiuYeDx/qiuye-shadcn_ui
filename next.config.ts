import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  // 确保构建时包含 registry 文件  
  experimental: {
    // 移除了已废弃的 outputFileTracingIncludes 配置
    // 静态文件会自动包含在 public 目录中
  },
};

export default nextConfig;
