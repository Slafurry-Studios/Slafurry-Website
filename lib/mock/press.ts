// Mock data buat Press page. Shape ngikutin PressRelease & PressKitAsset
// di Prisma schema, dikelompokkan per outlet / per target di komponen,
// bukan di data-nya sendiri (biar query Prisma-nya nanti tetep flat).

export type MockPressRelease = {
  outlet: string;
  title: string;
  url: string;
  publishedAt: string;
};

export type MockPressKitAsset = {
  target: string; // "Slafurry Studios" (brand) atau nama game
  type: "LOGO" | "BANNER" | "CHARACTER";
  fileUrl: string;
};

export const mockPressReleases: MockPressRelease[] = [
  {
    outlet: "IGN",
    title: "Pandora's Snake is a cosmic horror comedy about a cursed snake",
    url: "https://ign.com",
    publishedAt: "2026-03-02",
  },
  {
    outlet: "IGN",
    title: "5 indie games to watch this quarter",
    url: "https://ign.com",
    publishedAt: "2026-02-14",
  },
  {
    outlet: "Gamejolt",
    title: "Slafurry Studios announces An Unfinished Game",
    url: "https://gamejolt.com",
    publishedAt: "2026-01-20",
  },
  {
    outlet: "Gamejolt",
    title: "Interview: the team behind Pandora's Snake",
    url: "https://gamejolt.com",
    publishedAt: "2025-12-05",
  },
];

export const mockPressKitAssets: MockPressKitAsset[] = [
  { target: "Slafurry Studios", type: "LOGO", fileUrl: "#" },
  { target: "Slafurry Studios", type: "BANNER", fileUrl: "#" },
  { target: "An Unfinished Game", type: "LOGO", fileUrl: "#" },
  { target: "An Unfinished Game", type: "BANNER", fileUrl: "#" },
  { target: "An Unfinished Game", type: "CHARACTER", fileUrl: "#" },
  { target: "Pandora's Snake", type: "LOGO", fileUrl: "#" },
  { target: "Pandora's Snake", type: "BANNER", fileUrl: "#" },
  { target: "Pandora's Snake", type: "CHARACTER", fileUrl: "#" },
];
