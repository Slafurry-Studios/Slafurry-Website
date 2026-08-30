// Data dummy buat Home page. Struktur field sengaja dibikin mirip shape
// Prisma model (Game, Post) biar swap ke query database beneran (step 4)
// tinggal ganti sumber data, bukan ubah komponen.

export const mockUpcomingGame = {
  slug: "an-unfinished-game",
  title: "An Unfinished Game",
  shortDesc:
    "2D Narrative Horror Platformer about a Game Developer trapped in his unfinished game.",
};

export const mockProjects = [
  {
    slug: "pandoras-snake",
    title: "Pandora's Snake",
    shortDesc:
      "A snake cursed by a crazy witch grows infinitely, destroy entire planets, livestream apocalypse across the multiverse.",
  },
  {
    slug: "an-unfinished-game",
    title: "An Unfinished Game",
    shortDesc:
      "A 2D narrative horror platformer about a game developer trapped in his own unfinished game.",
  },
  {
    slug: "placeholder-project",
    title: "Untitled Project",
    shortDesc: "Something's cooking. Details coming soon, probably.",
  },
];

export const mockCommunityLinks = [
  { platform: "itch", label: "Itch.io", url: "https://itch.io" },
  { platform: "discord", label: "Discord Server", url: "https://discord.gg" },
  { platform: "steam", label: "Steam Community", url: "https://steamcommunity.com" },
];

export const mockNewsPosts = [
  {
    slug: "post-1",
    title: "Lorem ipsum dolor sit amet, consectetur adipiscing",
    excerpt:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ...",
    author: "Slafurry Studios",
    date: "2026-03-01",
  },
  {
    slug: "post-2",
    title: "Lorem ipsum dolor sit amet, consectetur adipiscing",
    excerpt:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    author: "Slafurry Studios",
    date: "2026-03-01",
  },
  {
    slug: "post-3",
    title: "Lorem ipsum dolor sit amet, consectetur adipiscing",
    excerpt:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    author: "Slafurry Studios",
    date: "2026-03-01",
  },
];
