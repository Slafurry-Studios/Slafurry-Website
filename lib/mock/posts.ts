// Mock data buat Devlog & News page — dua-duanya satu model (Post) yang
// dibedain field `category`, sesuai spec. Ganti ke query Prisma beneran
// di step 4 (filter by category, status PUBLISHED).

export type MockPost = {
  slug: string;
  title: string;
  excerpt: string;
  category: "DEVLOG" | "NEWS";
  tags: string[];
  authorName: string;
  publishedAt: string;
  commentCount: number;
};

export const mockPosts: MockPost[] = [
  {
    slug: "devlog-1",
    title: "Rebuilding the snake physics from scratch (again)",
    excerpt:
      "We rewrote the collision system for the third time this month. This time it's actually fine. Probably. Here's what changed and why the old one kept eating planets it shouldn't.",
    category: "DEVLOG",
    tags: ["update"],
    authorName: "Slafurry Studios",
    publishedAt: "2026-03-01",
    commentCount: 0,
  },
  {
    slug: "devlog-2",
    title: "Why the horror platformer took a detour into comedy",
    excerpt:
      "An unfinished game about being trapped in an unfinished game got a little too real during development. Some notes on tone, scope, and knowing when a joke is load-bearing.",
    category: "DEVLOG",
    tags: ["feature"],
    authorName: "Slafurry Studios",
    publishedAt: "2026-02-18",
    commentCount: 3,
  },
  {
    slug: "devlog-3",
    title: "Postmortem: what broke during the last playtest",
    excerpt:
      "Short version: everything. Long version: a list of every bug we found during the closed playtest, sorted by how much it made us question our life choices.",
    category: "DEVLOG",
    tags: ["update"],
    authorName: "Slafurry Studios",
    publishedAt: "2026-01-30",
    commentCount: 1,
  },
  {
    slug: "news-1",
    title: "Pandora's Snake is officially out",
    excerpt:
      "After way too long in development, Pandora's Snake is live. Thanks to everyone who wishlisted, playtested, and put up with our devlogs about collision physics.",
    category: "NEWS",
    tags: ["announcement"],
    authorName: "Slafurry Studios",
    publishedAt: "2026-03-01",
    commentCount: 12,
  },
  {
    slug: "news-2",
    title: "We're going to a small local game expo next month",
    excerpt:
      "Come say hi if you're around. We'll have a playable demo, some stickers, and probably a lot of opinions about game jams.",
    category: "NEWS",
    tags: ["announcement"],
    authorName: "Slafurry Studios",
    publishedAt: "2026-02-10",
    commentCount: 2,
  },
  {
    slug: "news-3",
    title: "A quick note on the achievement system on this site",
    excerpt:
      "Yes, some of them are hidden. Yes, one of them is unfair on purpose. No, we're not telling you which one.",
    category: "NEWS",
    tags: ["feature"],
    authorName: "Slafurry Studios",
    publishedAt: "2026-01-05",
    commentCount: 7,
  },
];
