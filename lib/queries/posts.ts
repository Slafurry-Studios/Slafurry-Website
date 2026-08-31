import { prisma } from "@/lib/prisma";
import { PostCategory, PostStatus } from "@prisma/client";

// ─── Public type for list cards ────────────────────────────────
export type PostCardData = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  coverImage: string;
  coverImageAlt: string;
  category: "DEVLOG" | "NEWS";
  tags: string[];
  authorName: string;
  publishedAt: string | null;
  commentCount: number;
};

// ─── Public type for article reader ────────────────────────────
export type PostArticleData = PostCardData & {
  content: string; // HTML from Tiptap
  metaTitle: string | null;
  metaDescription: string | null;
  ogImage: string | null;
};

// ─── Query helpers ─────────────────────────────────────────────

type CardRow = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  coverImage: string;
  coverImageAlt: string;
  category: PostCategory;
  tags: string[];
  authorName: string;
  publishedAt: Date | null;
  _count: { comments: number };
};

function toCardData(row: CardRow): PostCardData {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt,
    coverImage: row.coverImage,
    coverImageAlt: row.coverImageAlt,
    category: row.category,
    tags: row.tags,
    authorName: row.authorName,
    publishedAt: row.publishedAt?.toISOString() ?? null,
    commentCount: row._count.comments,
  };
}

/** Fetch published posts for a category (list view). */
export async function getPublishedPosts(
  category: PostCategory,
  limit?: number
): Promise<PostCardData[]> {
  const rows = await prisma.post.findMany({
    where: { category, status: PostStatus.PUBLISHED },
    orderBy: { publishedAt: "desc" },
    select: {
      id: true,
      slug: true,
      title: true,
      excerpt: true,
      coverImage: true,
      coverImageAlt: true,
      category: true,
      tags: true,
      authorName: true,
      publishedAt: true,
      _count: { select: { comments: true } },
    },
    ...(limit ? { take: limit } : {}),
  });
  return rows.map(toCardData);
}

/** Fetch a single published post by slug (article view). */
export async function getPostBySlug(
  slug: string,
  category: PostCategory
): Promise<PostArticleData | null> {
  const row = await prisma.post.findUnique({
    where: { slug, category, status: PostStatus.PUBLISHED },
    select: {
      id: true,
      slug: true,
      title: true,
      excerpt: true,
      coverImage: true,
      coverImageAlt: true,
      category: true,
      tags: true,
      authorName: true,
      publishedAt: true,
      _count: { select: { comments: true } },
      content: true,
      metaTitle: true,
      metaDescription: true,
      ogImage: true,
    },
  });
  if (!row) return null;
  return {
    ...toCardData(row),
    content: row.content,
    metaTitle: row.metaTitle,
    metaDescription: row.metaDescription,
    ogImage: row.ogImage,
  };
}

/** Fetch adjacent (prev/next) published posts for navigation. */
export async function getAdjacentPosts(
  currentSlug: string,
  category: PostCategory
): Promise<{ prev: PostCardData | null; next: PostCardData | null }> {
  const current = await prisma.post.findUnique({
    where: { slug: currentSlug },
    select: { publishedAt: true, prevPostId: true, nextPostId: true },
  });
  if (!current) return { prev: null, next: null };

  let prev: PostCardData | null = null;
  let next: PostCardData | null = null;

  const cardFields = {
    id: true,
    slug: true,
    title: true,
    excerpt: true,
    coverImage: true,
    coverImageAlt: true,
    category: true,
    tags: true,
    authorName: true,
    publishedAt: true,
    _count: { select: { comments: true } },
  } as const;

  // Prev: manual override → fallback to publishedAt order
  if (current.prevPostId) {
    const row = await prisma.post.findUnique({
      where: { id: current.prevPostId, status: PostStatus.PUBLISHED },
      select: cardFields,
    });
    if (row) prev = toCardData(row);
  }
  if (!prev && current.publishedAt) {
    const row = await prisma.post.findFirst({
      where: {
        category,
        status: PostStatus.PUBLISHED,
        publishedAt: { gt: current.publishedAt },
      },
      orderBy: { publishedAt: "asc" },
      select: cardFields,
    });
    if (row) prev = toCardData(row);
  }

  // Next: manual override → fallback to publishedAt order
  if (current.nextPostId) {
    const row = await prisma.post.findUnique({
      where: { id: current.nextPostId, status: PostStatus.PUBLISHED },
      select: cardFields,
    });
    if (row) next = toCardData(row);
  }
  if (!next && current.publishedAt) {
    const row = await prisma.post.findFirst({
      where: {
        category,
        status: PostStatus.PUBLISHED,
        publishedAt: { lt: current.publishedAt },
      },
      orderBy: { publishedAt: "desc" },
      select: cardFields,
    });
    if (row) next = toCardData(row);
  }

  return { prev, next };
}

/** Get all unique tags for published posts in a category. */
export async function getPostTags(
  category: PostCategory
): Promise<string[]> {
  const rows = await prisma.post.findMany({
    where: { category, status: PostStatus.PUBLISHED },
    select: { tags: true },
  });
  const allTags = rows.flatMap((r) => r.tags);
  return [...new Set(allTags)].sort();
}
