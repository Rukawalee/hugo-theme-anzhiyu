---
title: "代码高亮与复制"
date: 2026-04-12T15:00:00+08:00
lastmod: 2026-07-01T10:00:00+08:00
draft: false
tags: ["Hugo", "代码"]
categories: ["教程"]
cover: "/img/default_cover.jpg"
toc: true
description: "验证 Chroma 高亮、语言标签与复制按钮"
---

## JavaScript

```js
function greet(name) {
  return `Hello, ${name}!`;
}

console.log(greet("AnZhiYu"));
```

## Python

```python
from pathlib import Path

def lines(path: str) -> int:
    return len(Path(path).read_text(encoding="utf-8").splitlines())

print(lines("hugo.toml"))
```

## Diff

```diff
- old multipage only
+ pjax refreshFn parity
```

## Shell

```bash
cd exampleSite
hugo server --bind 127.0.0.1 --port 1313
```
