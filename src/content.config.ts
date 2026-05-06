import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const dailyPaperTag = '每日论文精读';
const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const localOrRemoteImage = z.string().min(1);

const timestampDate = z
  .union([z.number().finite(), z.string(), z.date()])
  .transform((value, ctx) => {
    let parsed: Date;

    if (value instanceof Date) {
      parsed = value;
    } else if (typeof value === 'number') {
      const milliseconds = value < 1_000_000_000_000 ? value * 1000 : value;
      parsed = new Date(milliseconds);
    } else {
      const trimmed = value.trim();
      if (/^\d+$/.test(trimmed)) {
        const numeric = Number(trimmed);
        const milliseconds = numeric < 1_000_000_000_000 ? numeric * 1000 : numeric;
        parsed = new Date(milliseconds);
      } else {
        parsed = new Date(trimmed);
      }
    }

    if (Number.isNaN(parsed.valueOf())) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Expected a Unix timestamp in seconds/milliseconds or a valid date string.',
      });
      return z.NEVER;
    }

    return parsed;
  });

const paperSchema = z.object({
  title: z.string(),
  authors: z.array(z.string()).min(1),
  venue: z.string().optional(),
  year: z.number().int().min(1900).max(2200).optional(),
  doi: z.string().optional(),
  arxiv: z.string().optional(),
  url: z.string().url().optional(),
  pdfUrl: z.string().min(1).optional(),
  pdfFile: z.string().min(1).optional(),
  codeUrl: z.string().url().optional(),
  datasetUrl: z.string().url().optional(),
});

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z
    .object({
      title: z.string(),
      seoTitle: z.string().optional(),
      description: z.string(),
      excerpt: z.string().optional(),
      pubDate: timestampDate,
      updatedDate: timestampDate.optional(),
      createdAt: timestampDate.optional(),
      reviewedAt: timestampDate.optional(),
      sourceCheckedAt: timestampDate.optional(),
      slug: z.string().regex(slugPattern, 'Use lowercase kebab-case, e.g. lesnets-wall-bounded-turbulence.').optional(),
      aliases: z.array(z.string().regex(slugPattern)).default([]),
      heroImage: localOrRemoteImage.optional(),
      heroImageAlt: z.string().optional(),
      heroImageCaption: z.string().optional(),
      imageCredit: z.string().optional(),
      ogImage: localOrRemoteImage.optional(),
      canonicalUrl: z.string().url().optional(),
      lang: z.string().default('zh-CN'),
      tags: z.array(z.string()).default([]),
      category: z.string().optional(),
      series: z.string().optional(),
      featured: z.boolean().default(false),
      pinned: z.boolean().default(false),
      draft: z.boolean().default(false),
      paper: paperSchema.optional(),
    })
    .superRefine((data, ctx) => {
      if (data.heroImage && !data.heroImageAlt) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['heroImageAlt'],
          message: 'heroImageAlt is required when heroImage is set.',
        });
      }

      if ((data.tags ?? []).includes(dailyPaperTag)) {
        if (!data.paper) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ['paper'],
            message: `Posts tagged ${dailyPaperTag} must include paper metadata.`,
          });
          return;
        }

        if (!data.paper.doi && !data.paper.arxiv && !data.paper.url) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ['paper'],
            message: 'Daily paper posts need at least one source identifier: doi, arxiv, or url.',
          });
        }

        if (!data.paper.pdfUrl) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ['paper', 'pdfUrl'],
            message: `Posts tagged ${dailyPaperTag} must include an archived PDF URL after reading the full text.`,
          });
        }

        if (!data.sourceCheckedAt) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ['sourceCheckedAt'],
            message: `Posts tagged ${dailyPaperTag} must include sourceCheckedAt.`,
          });
        }
      }
    }),
});

const projects = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
  schema: z.object({
    name: z.string(),
    description: z.string(),
    url: z.string().url(),
    lang: z.string(),
    tags: z.array(z.string()).default([]),
    area: z.string(),
    status: z.string().default('Active'),
    order: z.number().int().default(100),
    featured: z.boolean().default(false),
  }),
});

export const collections = { blog, projects };
