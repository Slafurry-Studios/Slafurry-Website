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
    id: "1",
    label: "Directive",
    videoUrl:
      "https://mcaqgxrqzwsjyrwgrnmq.supabase.co/storage/v1/object/public/montage-videos/Directive.mp4",
  },
  {
    id: "3",
    label: "Omni Gear Protocol",
    videoUrl: "https://mcaqgxrqzwsjyrwgrnmq.supabase.co/storage/v1/object/public/montage-videos/OmniGearProtocol.mp4"
  },
  {
    id: "4",
    label: "Pandora's Snake",
    videoUrl: "https://mcaqgxrqzwsjyrwgrnmq.supabase.co/storage/v1/object/public/montage-videos/PandorasSnake.mp4"
  },
  {
    id: "5",
    label: "Solar Siege",
    videoUrl: "https://mcaqgxrqzwsjyrwgrnmq.supabase.co/storage/v1/object/public/montage-videos/SolarSiege.mp4"
  },
  {
    id: "6",
    label: "The Puppet Pioneer",
    videoUrl: "https://mcaqgxrqzwsjyrwgrnmq.supabase.co/storage/v1/object/public/montage-videos/ThePuppetPioneer.mp4"
  },
];