# 湾区极客博客

这是一个使用Hugo搭建的个人博客项目，部署在Cloudflare Pages上。

## 项目说明

该博客使用 [Hugo](https://gohugo.io/) 作为静态网站生成器，采用 [PaperMod](https://github.com/adityatelange/hugo-PaperMod) 主题。

## 功能特点

- 响应式设计，适配各种设备
- 暗黑/明亮模式切换
- 文章目录自动生成
- 文章分类与标签系统
- 阅读时间估计
- 代码高亮显示

## 本地运行

1. 确保已安装 [Hugo](https://gohugo.io/installation/)
2. 克隆本仓库
   ```bash
   git clone --recurse-submodules https://github.com/username/bayhax-blog.git
   cd bayhax-blog
   ```
3. 启动本地服务器
   ```bash
   hugo server -D
   ```
4. 浏览器访问 http://localhost:1313

## 创建新文章

```bash
hugo new posts/文章名.md
```

## 部署说明

本博客通过Cloudflare Pages自动部署：

1. 将更改推送到GitHub仓库
2. Cloudflare Pages自动构建并部署网站
3. 访问 https://bayhax-blog.pages.dev 查看更新后的网站

## 目录结构

- `content/`: 博客内容
  - `posts/`: 博客文章
- `themes/`: 博客主题
- `static/`: 静态资源文件
- `layouts/`: 自定义布局文件
- `assets/`: 需要处理的资源文件
- `public/`: 生成的静态网站（不需要提交到版本控制）

## 配置文件说明

- `hugo.toml`: 网站的主要配置文件，包含网站标题、URL、主题、菜单等设置

## 联系方式

如有问题或建议，请通过以下方式联系：

- Email: example@email.com
- GitHub Issues: [提交问题](https://github.com/username/bayhax-blog/issues) 