// Mock data buat Press page. Shape ngikutin PressRelease & PressKitAsset
// di Prisma schema, dikelompokkan per outlet / per target di komponen,
// bukan di data-nya sendiri (biar query Prisma-nya nanti tetep flat).

export type MockPressRelease = {
  id: string;
  outlet: string;
  title: string;
  url: string;
  publishedAt: string;
};

export type MockPressKitAsset = {
  id: string;
  label: string; // "Slafurry Studios" (brand) atau nama game
  target: string; // used for grouping — same values as label
  type: "LOGO" | "BANNER" | "CHARACTER";
  fileUrl: string;
  gameId?: string;
};

export const mockPressReleases: MockPressRelease[] = [
  {
    id: "1",
    outlet: "IGN",
    title: "Pandora's Snake is a cosmic horror comedy about a cursed snake",
    url: "https://ign.com",
    publishedAt: "2026-03-02",
  },
  {
    id: "2",
    outlet: "IGN",
    title: "5 indie games to watch this quarter",
    url: "https://ign.com",
    publishedAt: "2026-02-14",
  },
  {
    id: "3",
    outlet: "Gamejolt",
    title: "Slafurry Studios announces An Unfinished Game",
    url: "https://gamejolt.com",
    publishedAt: "2026-01-20",
  },
  {
    id: "4",
    outlet: "Gamejolt",
    title: "Interview: the team behind Pandora's Snake",
    url: "https://gamejolt.com",
    publishedAt: "2025-12-05",
  },
];

export const mockPressKitAssets: MockPressKitAsset[] = [
  { id: "1", label: "Slafurry Studios", target: "Slafurry Studios", type: "LOGO", fileUrl: "#" },
  { id: "2", label: "Slafurry Studios", target: "Slafurry Studios", type: "BANNER", fileUrl: "#" },
  { id: "3", label: "An Unfinished Game", target: "An Unfinished Game", type: "LOGO", fileUrl: "#" },
  { id: "4", label: "An Unfinished Game", target: "An Unfinished Game", type: "BANNER", fileUrl: "#" },
  { id: "5", label: "An Unfinished Game", target: "An Unfinished Game", type: "CHARACTER", fileUrl: "#" },
  { id: "6", label: "Pandora's Snake", target: "Pandora's Snake", type: "LOGO", fileUrl: "#" },
  { id: "7", label: "Pandora's Snake", target: "Pandora's Snake", type: "BANNER", fileUrl: "#" },
  { id: "8", label: "Pandora's Snake", target: "Pandora's Snake", type: "CHARACTER", fileUrl: "#" },
];