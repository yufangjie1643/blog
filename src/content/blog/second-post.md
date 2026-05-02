---
title: 'Astro 内容集合详解'
description: '深入了解 Astro 的内容集合功能，实现类型安全的内容管理。'
pubDate: '2025-05-02'
---

Astro v2.0 引入的**内容集合（Content Collections）**是一个强大的功能，让你可以用 TypeScript 类型安全的方式管理内容。

## 核心概念

内容集合位于 `src/content/` 目录下，每个子目录就是一个集合。比如 `src/content/blog/` 存放所有博客文章。

## Schema 定义

通过 `src/content/config.ts` 可以定义集合的数据结构：

```typescript
import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
  }),
});
```

这样每一篇 Markdown 的 frontmatter 都会被自动校验类型！
