// Mock data buat Games page. Shape-nya ngikutin field Game di Prisma schema
// biar gampang di-swap ke query database beneran (step 4).

export type MockGame = {
  slug: string;
  title: string;
  shortDesc: string;
  status: "RELEASED" | "UPCOMING" | "IN_DEVELOPMENT";
  featured?: boolean;
};

export const mockGames: MockGame[] = [
  {
    slug: "pandoras-snake",
    title: "Pandora's Snake",
    shortDesc:
      "A snake cursed by a crazy witch grows infinitely, destroy entire planets, livestream apocalypse across the multiverse.",
    status: "RELEASED",
    featured: true,
  },
  {
    slug: "an-unfinished-game",
    title: "An Unfinished Game",
    shortDesc:
      "A 2D narrative horror platformer about a game developer trapped in his own unfinished game.",
    status: "UPCOMING",
  },
  {
    slug: "project-clawmark",
    title: "Project Clawmark",
    shortDesc: "Something's cooking. Details coming soon, probably.",
    status: "IN_DEVELOPMENT",
  },
  {
    slug: "backlog-simulator",
    title: "Backlog Simulator",
    shortDesc: "A meta game about never finishing the games you buy.",
    status: "IN_DEVELOPMENT",
  },
  {
    slug: "haunted-hotbar",
    title: "Haunted Hotbar",
    shortDesc: "Your inventory is cursed and it's slowly taking over.",
    status: "RELEASED",
  },
  {
    slug: "the-last-refactor",
    title: "The Last Refactor",
    shortDesc: "Survive the codebase. Ship before the deadline eats you.",
    status: "RELEASED",
  },
];
