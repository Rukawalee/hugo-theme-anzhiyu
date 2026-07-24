---
title: "Markdown 写作指南"
top_group_index: 6
date: 2026-06-15T09:30:00+08:00
lastmod: 2026-06-16T09:30:00+08:00
draft: false
tags: ["Markdown", "写作"]
categories: ["教程"]
cover: "/img/default_cover.jpg"
toc: true
---

## 标题层级

使用 `##` 与 `###` 组织文章，侧栏 TOC 会自动生成。

### 强调

*斜体* 与 **粗体**，以及 `行内代码`。

### 链接与图片

- [Hugo 文档](https://gohugo.io/documentation/)
- 图片可使用 `cover` 字段作为封面

## 表格

| 语法 | 说明 |
|------|------|
| `---` | Front Matter |
| `{{</* shortcode */>}}` | Hugo 短代码 |

## 引用

> 写博客是与未来的自己对话。

## 代码块

```bash
hugo new content posts/my-post.md
hugo server -D
```
