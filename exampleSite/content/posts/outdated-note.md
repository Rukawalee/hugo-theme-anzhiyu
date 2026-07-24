---
title: "过期提示演示"
date: 2023-01-10T09:00:00+08:00
lastmod: 2023-01-10T09:00:00+08:00
draft: false
tags: ["演示", "维护"]
categories: ["随笔"]
cover: "/img/default.png"
toc: true
description: "用于触发 noticeOutdate 的老文章"
---

## 这是一篇故意写得很旧的文章

`lastmod` 设置在 2023 年，超过 `params.noticeOutdate.limit_day` 后应显示过期提示条。

### 验收点

1. 文章顶部或约定位置出现过期提示
2. 其余阅读环 chrome 正常（封面、侧栏、版权）

```text
noticeOutdate.enable = true
noticeOutdate.limit_day = 30
```
