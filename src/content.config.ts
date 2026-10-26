import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

// 文章：舊站「叉傑克不跑步聊數據」搬來的文章，之後新寫的也放這裡。
// 舊文章用原站編號當網址（/blog/1310/），舊網址 /w/bd/1310 會轉址過來。
const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      date: z.coerce.date(),
      slug: z.string().optional(),
      legacyId: z.number().optional(),
      legacyUrl: z.string().optional(),
      cover: image().optional(),
      excerpt: z.string().optional(),
      tags: z.array(z.string()).default([]),
      // 原文發表的地方（舊站、Medium…），新寫的留空
      origin: z.string().optional(),
    }),
});

export const collections = { blog };
