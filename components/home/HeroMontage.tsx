"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { PlaceholderVideoBg } from "@/components/ui/PlaceholderMedia";
import type { MontageVideo } from "@prisma/client";

function shuffle<T>(items: T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export function HeroMontage({ videos }: { videos: MontageVideo[] }) {
  const playlistRef = useRef<MontageVideo[]>([]);
  const indexRef = useRef(0);
  const [currentSrc, setCurrentSrc] = useState<string | null>(null);

  useEffect(() => {
    if (videos.length === 0) return;

    playlistRef.current = shuffle(videos);
    indexRef.current = 0;
    setCurrentSrc(playlistRef.current[0].videoUrl);
  }, [videos]);

  function handleEnded() {
    if (videos.length <= 1) return; // single video: `loop` attribute handles it

    indexRef.current += 1;

    if (indexRef.current >= playlistRef.current.length) {
      // Playlist habis — reshuffle. Kalau video pertama hasil shuffle baru
      // kebetulan sama kayak video terakhir yang baru diputer, tuker posisi
      // biar gak berasa "nge-loop" balik ke video yang sama dua kali beruntun.
      const reshuffled = shuffle(videos);
      const lastPlayed = playlistRef.current[playlistRef.current.length - 1];

      if (
        reshuffled.length > 1 &&
        reshuffled[0].id === lastPlayed.id
      ) {
        [reshuffled[0], reshuffled[1]] = [reshuffled[1], reshuffled[0]];
      }

      playlistRef.current = reshuffled;
      indexRef.current = 0;
    }

    setCurrentSrc(playlistRef.current[indexRef.current].videoUrl);
  }

  // Belum ada video aktif (list kosong / belum sempat di-shuffle) — fallback
  // ke gradient placeholder biar Hero tetep keliatan intentional, bukan blank.
  if (!currentSrc) {
    return <PlaceholderVideoBg label="hero video montage placeholder" />;
  }

  return (
    <div className="absolute inset-0 overflow-hidden">
      <AnimatePresence initial={false} mode="sync">
        <motion.video
          key={currentSrc}
          src={currentSrc}
          autoPlay
          muted
          loop={videos.length <= 1}
          playsInline
          onEnded={handleEnded}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.8 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="absolute inset-0 h-full w-full scale-110 object-cover"
          aria-hidden="true"
        />
      </AnimatePresence>
    </div>
  );
}