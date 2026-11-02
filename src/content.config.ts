import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

// 文章：以前各個部落格搬來的文章，之後新寫的也放這裡。
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
      // 原文發表的地方（舊站、Medium、Blogger、運動筆記），新寫的留空
      origin: z.string().optional(),
      // 原文網址；里程碑裡連到這個網址的，會自動改連站內這篇
      originalUrl: z.string().optional(),
      // 同一篇也發在其他地方（例如舊站文章的 Medium 版）
      alsoAt: z.array(z.string()).default([]),
    }),
});

// 桐爸日記漫畫：雲端漫畫典藏的定稿，配臉書貼文的文字（scripts/import-tongdad.mjs 匯入）。
// 一張一頁，網址用發表日期（/tongdad/261026/），同一天第二張加 -2。
const tongdad = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/tongdad' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      date: z.coerce.date(),
      image: image(),
      alt: z.string(),
      originalUrl: z.string(),
      // 臉書貼文的文字，去掉標題行和 hashtag；空行分段
      text: z.string().default(''),
      // 英文版（之後做雙語時填）：英文標題、圖下的英文對白、英文版漫畫圖
      titleEn: z.string().optional(),
      textEn: z.string().optional(),
      imageEn: image().optional(),
    }),
});

export const collections = { blog, tongdad };
