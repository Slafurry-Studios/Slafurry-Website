// Sample video buat testing logic shuffle/playlist HeroMontage secara lokal.
// URL di bawah ini video sample publik yang umum dipakai buat demo/testing
// (bukan konten final) — Google hosting file test <5MB masing-masing, aman
// buat dev/staging. GANTI ke video asli (udah dikompres 360-480p sesuai
// rencana kita) begitu asetnya siap, taruh di Supabase Storage bucket
// "montage-videos".
//
// Shape-nya ngikutin MontageVideo di Prisma schema, biar gampang di-swap ke
// query database beneran pas step 4.

export type MockMontageVideo = {
  id: string;
  label: string;
  videoUrl: string;
};

export const mockMontageVideos: MockMontageVideo[] = [
  {
    id: "sample-1",
    label: "sample clip 1 (placeholder)",
    videoUrl:
      "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
  },
  {
    id: "sample-2",
    label: "sample clip 2 (placeholder)",
    videoUrl:
      "https://www.w3schools.com/html/mov_bbb.mp4",
  },
];