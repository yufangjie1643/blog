import type { CollectionEntry } from 'astro:content';
import { dailyPaperTag } from '../data/tags';

export type BlogPost = CollectionEntry<'blog'>;

export const getBlogSlug = (post: BlogPost) => post.data.slug ?? post.id;

export const getBlogHref = (post: BlogPost) => `/blog/${getBlogSlug(post)}/`;

export const getBlogRouteSlugs = (post: BlogPost) => [
  getBlogSlug(post),
  ...(post.data.aliases ?? []),
];

export const getTagHref = (tag: string) =>
  tag === dailyPaperTag ? '/daily-paper/' : `/tags/${encodeURIComponent(tag)}/`;

export const getTimestamp = (date: Date) => Math.floor(date.valueOf() / 1000);

export const getFallbackTime = (date: Date) => date.toISOString().replace('T', ' ').slice(0, 19) + ' UTC';

export const getPostTags = (post: BlogPost) => post.data.tags ?? [];

export const isPublished = (post: BlogPost) => !post.data.draft;

export const sortPosts = <T extends BlogPost>(posts: T[]) =>
  [...posts].sort((a, b) => {
    if (a.data.pinned !== b.data.pinned) {
      return a.data.pinned ? -1 : 1;
    }

    if (a.data.featured !== b.data.featured) {
      return a.data.featured ? -1 : 1;
    }

    return b.data.pubDate.valueOf() - a.data.pubDate.valueOf();
  });

export const getBlogStaticPaths = (posts: BlogPost[]) => {
  const seen = new Map<string, string>();

  return posts.flatMap((post) =>
    getBlogRouteSlugs(post).map((slug) => {
      const owner = seen.get(slug);
      if (owner) {
        throw new Error(`Duplicate blog slug or alias "${slug}" in ${owner} and ${post.id}.`);
      }

      seen.set(slug, post.id);
      return {
        params: { slug },
        props: post,
      };
    }),
  );
};
