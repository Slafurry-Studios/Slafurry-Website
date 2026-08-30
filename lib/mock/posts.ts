// Mock data buat Devlog & News page — dua-duanya satu model (Post) yang
// dibedain field `category`. Ganti ke query Prisma beneran di step 4
// (filter by category & status PUBLISHED, ordered by publishedAt).

export type MockPost = {
  slug: string;
  title: string;
  excerpt: string;
  imageCaption: string;
  content: string[];
  category: "DEVLOG" | "NEWS";
  tags: string[];
  authorName: string;
  publishedAt: string;
  commentCount: number;
  status: "DRAFT" | "PUBLISHED";
};

export const mockPosts: MockPost[] = [
  {
    slug: "devlog-1",
    title: "Rebuilding the snake physics from scratch (again)",
    excerpt:
      "We rewrote the collision system for the third time this month. This time it's actually fine. Probably. Here's what changed and why the old one kept eating planets it shouldn't.",
    imageCaption: "The old collision system, moments before we deleted it.",
    content: [
      "We rewrote the collision system for the third time this month. This time it's actually fine. Probably.",
      "The old system worked by checking every segment of the snake against every planet in the scene, every frame. That was fine when the snake was short. It stopped being fine around segment four hundred, which is exactly when the snake is supposed to start eating entire solar systems.",
      "The new approach uses a spatial grid so we only check collisions against nearby objects. Performance is way up, and as a bonus, the snake no longer occasionally eats itself, which was a bug nobody asked for but everybody enjoyed watching.",
      "Next up: figuring out why the livestream overlay renders upside down exactly 12% of the time. We have theories. None of them are good.",
    ],
    category: "DEVLOG",
    tags: ["update"],
    authorName: "Slafurry Studios",
    publishedAt: "2026-03-01",
    commentCount: 0,
    status: "PUBLISHED",
  },
  {
    slug: "devlog-2",
    title: "Why the horror platformer took a detour into comedy",
    excerpt:
      "An unfinished game about being trapped in an unfinished game got a little too real during development. Some notes on tone, scope, and knowing when a joke is load-bearing.",
    imageCaption: "Early concept art. We are not artists. It shows.",
    content: [
      "An unfinished game about being trapped in an unfinished game got a little too real during development.",
      "We started this project wanting to make something genuinely unsettling. Somewhere around month three, the game-within-the-game concept started bleeding into how we actually felt about the project, and the writing followed that honestly instead of fighting it.",
      "The result is still horror, but it's horror with a sense of humor about its own circumstances — which, honestly, tracks with everything else we make.",
    ],
    category: "DEVLOG",
    tags: ["feature"],
    authorName: "Slafurry Studios",
    publishedAt: "2026-02-18",
    commentCount: 3,
    status: "PUBLISHED",
  },
  {
    slug: "devlog-3",
    title: "Postmortem: what broke during the last playtest",
    excerpt:
      "Short version: everything. Long version: a list of every bug we found during the closed playtest, sorted by how much it made us question our life choices.",
    imageCaption: "A screenshot from the playtest. We promise it's not supposed to look like that.",
    content: [
      "Short version: everything. Long version: a list of every bug we found during the closed playtest, sorted by how much it made us question our life choices.",
      "The build crashed on launch for about a third of testers, which in hindsight tracks with us testing exclusively on one developer's five-year-old laptop.",
      "We've fixed the crash, the audio desync, and the bug where the save file silently renamed itself. We have not yet fixed why the cat NPC occasionally becomes sentient and starts pathing toward the exit. That one might just stay.",
    ],
    category: "DEVLOG",
    tags: ["update"],
    authorName: "Slafurry Studios",
    publishedAt: "2026-01-30",
    commentCount: 1,
    status: "DRAFT",
  },
  {
    slug: "news-1",
    title: "Pandora's Snake is officially out",
    excerpt:
      "After way too long in development, Pandora's Snake is live. Thanks to everyone who wishlisted, playtested, and put up with our devlogs about collision physics.",
    imageCaption: "Launch day. Somehow nothing caught on fire.",
    content: [
      "After way too long in development, Pandora's Snake is live.",
      "Thanks to everyone who wishlisted, playtested, and put up with roughly forty devlogs about collision physics. We mean that. This game exists because people kept showing up for it.",
      "Grab it on Steam or itch.io. If you find a bug, tell us — if you find the bug where the snake eats itself, we already know, we just think it's funny now.",
    ],
    category: "NEWS",
    tags: ["announcement"],
    authorName: "Slafurry Studios",
    publishedAt: "2026-03-01",
    commentCount: 12,
    status: "PUBLISHED",
  },
  {
    slug: "news-2",
    title: "We're going to a small local game expo next month",
    excerpt:
      "Come say hi if you're around. We'll have a playable demo, some stickers, and probably a lot of opinions about game jams.",
    imageCaption: "Last year's booth. This year we're getting a bigger table.",
    content: [
      "Come say hi if you're around. We'll have a playable demo, some stickers, and probably a lot of opinions about game jams.",
      "This is our first time exhibiting outside of a jam, so if the booth looks slightly held together with tape, that's because it is.",
    ],
    category: "NEWS",
    tags: ["announcement"],
    authorName: "Slafurry Studios",
    publishedAt: "2026-02-10",
    commentCount: 2,
    status: "PUBLISHED",
  },
  {
    slug: "news-3",
    title: "A quick note on the achievement system on this site",
    excerpt:
      "Yes, some of them are hidden. Yes, one of them is unfair on purpose. No, we're not telling you which one.",
    imageCaption: "A very accurate diagram of how the achievement system works.",
    content: [
      "Yes, some of them are hidden. Yes, one of them is unfair on purpose. No, we're not telling you which one.",
      "A few of the achievements on this site don't have normal unlock conditions. We're not going to explain how, because that would defeat the point. Good luck.",
    ],
    category: "NEWS",
    tags: ["feature"],
    authorName: "Slafurry Studios",
    publishedAt: "2026-01-05",
    commentCount: 7,
    status: "PUBLISHED",
  },
];

// Helpers — nanti diganti Prisma query

// find post by slug from mock data
export function getPostBySlug(slug: string): MockPost | undefined {
  return mockPosts.find((p) => p.slug === slug);
}

// find posts by category and status, ordered by publishedAt descending
export function getPostsByCategory(
  category: "DEVLOG" | "NEWS",
  status: "DRAFT" | "PUBLISHED"
): MockPost[] {
  return mockPosts
    .filter((p) => p.category === category && p.status === status)
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
}

// Helper — ambil post terbitan terbaru (hanya PUBLISHED) per kategori
export function getLatestPosts(category: "DEVLOG" | "NEWS", limit = 3): MockPost[] {
  return getPostsByCategory(category, "PUBLISHED").slice(0, limit);
}

// find post index by slug within category and status
function getPostIndexBySlug(
  slug: string,
  category: "DEVLOG" | "NEWS",
  status: "DRAFT" | "PUBLISHED"
): number {
  const sameCategoryStatus = mockPosts.filter(
    (p) => p.category === category && p.status === status,
  );
  return sameCategoryStatus.findIndex((p) => p.slug === slug);
}

// Helper — dapatkan post prev/next dalam kategori (hanya status yang sama)
export function getAdjacentPosts(
  slug: string,
  category?: "DEVLOG" | "NEWS",
  status?: "DRAFT" | "PUBLISHED"
): {
  prev: MockPost | null;
  next: MockPost | null;
} {
  const cat = category || "DEVLOG";
  const stat = status || "PUBLISHED";

  const post = getPostBySlug(slug);
  if (!post) return { prev: null, next: null };

  const index = getPostIndexBySlug(slug, cat, stat);
  if (index === -1) return { prev: null, next: null };

  const sameCategoryStatus = mockPosts.filter(
    (p) => p.category === cat && p.status === stat,
  );

  return {
    prev:
      index > 0 ? sameCategoryStatus[index - 1] : null,
    next:
      index < sameCategoryStatus.length - 1 ? sameCategoryStatus[index + 1] : null,
  };
}