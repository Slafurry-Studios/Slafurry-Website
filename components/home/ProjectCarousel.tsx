"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react";
import type { Game } from "@prisma/client";
import Link from "next/link";
import Image from "next/image";
import { PlaceholderImage } from "@/components/ui/PlaceholderMedia";

const AUTO_PLAY_INTERVAL = 5000;

export function ProjectCarousel({ projects }: { projects: Game[] }) {
  const [index, setIndex] = useState(0);
  const [isTouching, setIsTouching] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const count = projects.length;

  const go = useCallback(
    (delta: number) => {
      setIndex((i) => (i + delta + count) % count);
    },
    [count]
  );

  const startTimer = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => go(1), AUTO_PLAY_INTERVAL);
  }, [go]);

  const stopTimer = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = null;
  }, []);

  useEffect(() => {
    if (count > 1 && !isTouching) {
      startTimer();
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [index, count, startTimer, isTouching]);

  if (count === 0) return null;

  function onTouchStart(e: React.TouchEvent) {
    setIsTouching(true);
    stopTimer();
    touchStartX.current = e.touches[0].clientX;
  }

  function onTouchEnd(e: React.TouchEvent) {
    setIsTouching(false);
    const dx = e.changedTouches[0].clientX - (touchStartX.current ?? 0);
    touchStartX.current = null;
    if (Math.abs(dx) > 50) {
      go(dx < 0 ? 1 : -1);
    } else {
      startTimer();
    }
  }

  return (
    <section className="flex flex-col justify-center px-6 py-16 md:px-10">
      <h2 className="text-center font-display text-4xl tracking-wide sm:text-5xl lg:text-6xl">
        Projects
      </h2>

      <div
        className="mx-auto mt-12 grid w-full max-w-7xl"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        {projects.map((project, i) => (
          <ProjectCard
            key={project.id ?? project.slug}
            project={project}
            isActive={i === index}
          />
        ))}
      </div>

      {count > 1 && (
        <div className="mt-6 flex justify-center gap-3">
          <button
            type="button"
            onClick={() => go(-1)}
            aria-label="Previous project"
            className="flex h-10 w-10 items-center justify-center pixel-border-sm text-neutral-600 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800"
          >
            <IconChevronLeft size={20} />
          </button>
          <button
            type="button"
            onClick={() => go(1)}
            aria-label="Next project"
            className="flex h-10 w-10 items-center justify-center pixel-border-sm text-neutral-600 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800"
          >
            <IconChevronRight size={20} />
          </button>
        </div>
      )}
    </section>
  );
}

function ProjectCard({
  project,
  isActive,
}: {
  project: Game;
  isActive: boolean;
}) {
  return (
    <Link
      href={`/games/${project.slug}`}
      aria-hidden={!isActive}
      tabIndex={isActive ? 0 : -1}
      style={{
        opacity: isActive ? 1 : 0,
        pointerEvents: isActive ? "auto" : "none",
      }}
      className="col-start-1 row-start-1 flex flex-col overflow-hidden pixel-border bg-white transition-all duration-300 hover:scale-[1.02] hover:shadow-md dark:bg-neutral-900"
    >
      <div className="-mx-6 -mt-6 overflow-hidden">
        {project.coverImage ? (
          <div className="relative aspect-video w-full">
            <Image
              src={project.coverImage}
              alt={project.coverImageAlt || project.title}
              fill
              sizes="(max-width: 1280px) 100vw, 1280px"
              className="object-cover object-center"
            />
          </div>
        ) : (
          <PlaceholderImage
            label={project.title}
            className="aspect-video w-full"
          />
        )}
      </div>

      <div className="flex flex-1 flex-col p-4">
        <h3 className="font-display text-xl font-semibold leading-snug">
          {project.title}
        </h3>
        <p className="mt-2 line-clamp-3 font-display text-xl text-neutral-600 dark:text-neutral-400">
          {project.shortDesc}
        </p>
      </div>
    </Link>
  );
}