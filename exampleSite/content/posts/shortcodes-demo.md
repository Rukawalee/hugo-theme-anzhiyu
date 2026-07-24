---
title: "短代码演示"
top_group_index: 4
date: 2024-06-01T10:00:00+08:00
lastmod: 2026-07-18T10:00:00+08:00
categories: ["教程"]
tags: ["shortcodes", "AnZhiYu"]
cover: "/img/default_cover.jpg"
toc: true
description: "演示主题 Content Tag 对应 shortcodes 全量覆盖"
ai: true
math: true
katex: true
---

## Note / Tip / Folding

{{% note info %}}
这是一条 **info** 提示。
{{% /note %}}

{{% note warning %}}
警告样式 note。
{{% /note %}}

{{% tip %}}
这是 tip 短代码。
{{% /tip %}}

{{% tip warning %}}
警告 tip。
{{% /tip %}}

{{% folding 点击展开 %}}
折叠内容在这里。
{{% /folding %}}

{{% folding open "默认展开" %}}
默认 open 的折叠块。
{{% /folding %}}

## Tabs

{{% tabs demo %}}
{{% tab 第一页 %}}
第一页内容
{{% /tab %}}
{{% tab 第二页 %}}
第二页内容
{{% /tab %}}
{{% /tabs %}}

## Buttons / Labels / 行内样式

{{< btn url="/" text="回首页" icon="anzhiyu-icon-house-chimney" >}}

{{% btns "grid center" %}}
{{< cell "文档" "https://gohugo.io/" "anzhiyufont anzhiyu-icon-book" >}}
{{< cell "仓库" "https://github.com/Rukawalee/hugo-theme-anzhiyu" "anzhiyufont anzhiyu-icon-github" >}}
{{% /btns %}}

{{< label text="primary" color="primary" >}}
{{< label text="blue" color="blue" >}}
{{< label text="green" color="green" >}}

{{< u 下划线 >}} {{< emp 着重 >}} {{< del 删除线 >}} {{< wavy 波浪线 >}} {{< kbd Ctrl >}}+{{< kbd K >}}

{{< psw 密码内容 >}}

{{< span "blue" "彩色 span" >}}

{{< p "p-blue" "段落强调" >}}

## Checkbox / Radio / Hide

{{< checkbox "待办事项" >}}
{{< checkbox "checked" "已完成事项" >}}
{{< radio "checked" "选项 A" >}}
{{< radio "选项 B" >}}

{{% hideBlock "点我展开隐藏块" %}}
隐藏块内容：**已显示**。
{{% /hideBlock %}}

{{% hideToggle "Toggle 标题" %}}
Toggle 内部内容。
{{% /hideToggle %}}

行内隐藏：{{< hideInline content="秘密内容" display="点击查看" >}}

## Link / Site / Flink / Introduction

{{< link url="https://gohugo.io" title="Hugo" description="世界上最快的网站构建框架" >}}

{{% sitegroup "站点卡片组" %}}
{{< site title="Hugo" url="https://gohugo.io/" screenshot="/img/default_cover.jpg" avatar="/img/default.png" description="静态站点生成器" >}}
{{< site title="Go" url="https://go.dev/" screenshot="/img/default.png" avatar="/img/default_cover.jpg" description="编程语言" >}}
{{% /sitegroup %}}

{{% flink %}}
- class_name: 文内友链
  class_desc: shortcode flink 演示
  flink_style: anzhiyu
  link_list:
    - name: AnZhiYu
      link: https://blog.anheyu.com/
      avatar: /img/default_cover.jpg
      descr: 生活明朗，万物可爱
      recommend: true
    - name: Example
      link: https://example.org/
      avatar: /img/default.png
      descr: 本地演示
{{% /flink %}}

{{< intCard link="/about/" img="/img/default_cover.jpg" tip="推荐" cardTitle="关于本站" logo="/img/default.png" title="AnZhiYu" subTitle="主题示例" >}}

## Media / Image / Gallery

{{< image url="/img/default_cover.jpg" alt="示例图" width="60%" >}}

行内图：{{< inlineImg src="/img/default.png" height="24px" >}}

{{< galleryGroup name="相册分组" descr="跳转到相册" url="/album/" img="/img/default_cover.jpg" >}}

{{< gallery false 180 8 >}}
![一](/img/default.png "图一")
![二](/img/default_cover.jpg "图二")
![三](/img/default.png "图三")
{{< /gallery >}}

{{< audio src="/img/default.png" >}}

说明：上方 audio 使用占位路径仅验证标签输出；真实 mp3 可换成外链。

## Mermaid / Timeline

{{% mermaid %}}
graph LR
  A[Hexo] --> B[Theme Port]
  B --> C[Hugo]
  C --> D[exampleSite]
{{% /mermaid %}}

{{% timeline %}}
{{% timelineItem 2024-01 %}}
主题移植启动
{{% /timelineItem %}}
{{% timelineItem 2024-06 %}}
Shortcode 演示
{{% /timelineItem %}}
{{% timelineItem 2026-07 %}}
完整验收数据
{{% /timelineItem %}}
{{% /timeline %}}

## 媒体卡片说明

`bilibili` / `dogeplayer` 短代码依赖第三方 API；演示站不强制在线加载。
真实站点配置后即可使用：

```markdown
{{</* bilibili id="BVxxxxxx" */>}}
```

## Math（KaTeX）

行内：$E = mc^2$

块级：

$$
\int_{-\infty}^{\infty} e^{-x^2}\,dx = \sqrt{\pi}
$$
