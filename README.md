# Bayhax博客

这是一个基于Hugo和PaperMod主题的个人博客网站。

## 项目架构

- 使用Hugo静态网站生成器
- 主题：PaperMod
- 部署平台：Cloudflare Pages

## 本地开发

### 安装Hugo

确保安装最新版本的Hugo (v0.125.7或更高):

```bash
# macOS
brew install hugo

# Windows
choco install hugo-extended

# Linux
snap install hugo
```

### 本地运行

```bash
# 启动开发服务器
hugo server -D
```

### 创建新文章

```bash
# 创建新文章
hugo new content/posts/my-new-post.md
```

## 部署说明

项目已配置为自动部署到Cloudflare Pages。

### 部署注意事项

1. 确保使用Hugo v0.125.7或更高版本 (PaperMod主题要求)
2. Cloudflare Pages部署配置:
   - 构建命令: `hugo --gc --minify`
   - 构建输出目录: `public`
   - 环境变量: `HUGO_VERSION=0.126.0`

## 文件结构

- `content/`: 博客文章和页面内容
- `static/`: 静态资源文件
- `themes/PaperMod/`: 博客主题
- `layouts/`: 自定义布局模板
- `assets/`: 需要处理的资源文件
- `hugo.toml`: Hugo配置文件

## 问题排查

如果在Cloudflare Pages部署时遇到Hugo版本问题，请确保`.cloudflare/config.json`和`wrangler.toml`文件中指定了正确的Hugo版本。