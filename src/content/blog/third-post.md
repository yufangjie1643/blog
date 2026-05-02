---
title: '暗色模式与响应式设计'
description: '使用 CSS 变量和媒体查询实现现代化的主题切换。'
pubDate: '2025-05-03'
---

这个博客使用了 CSS 变量和 `prefers-color-scheme` 媒体查询，自动适配系统的暗色/亮色模式。

## 实现原理

```css
:root {
  --bg: #ffffff;
  --text: #0f172a;
}

@media (prefers-color-scheme: dark) {
  :root {
    --bg: #0f172a;
    --text: #f8fafc;
  }
}
```

无需 JavaScript，纯 CSS 实现，性能最好。
