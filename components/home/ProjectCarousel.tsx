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

  if (count === 0) return null;

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
    <section className="flex flex-col justify-center px-6 py-12 md:py-16 md:px-10">
      <h2 className="text-center font-display text-4xl tracking-wide sm:text-5xl lg:text-6xl">
        Projects
      </h2>

      <div
        className="mx-auto mt-12 flex w-full max-w-[90rem] items-center justify-center gap-4"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        {count > 1 && (
          <button
            type="button"
            onClick={() => go(-1)}
            aria-label="Previous project"
            className="hidden h-10 w-10 shrink-0 items-center justify-center pixel-border-sm text-neutral-600 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800 sm:flex"
          >
            <IconChevronLeft size={20} />
          </button>
        )}

        <div className="relative h-[24rem] sm:h-[28rem] w-full max-w-[900px] overflow-hidden">
          {projects.map((project, i) => (
            <ProjectCard
              key={project.id ?? project.slug}
              project={project}
              isActive={i === index}
              onSelect={() => go(i - index)}
            />
          ))}
        </div>

        {count > 1 && (
          <button
            type="button"
            onClick={() => go(1)}
            aria-label="Next project"
            className="hidden h-10 w-10 shrink-0 items-center justify-center pixel-border-sm text-neutral-600 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800 sm:flex"
          >
            <IconChevronRight size={20} />
          </button>
        )}
      </div>

      {count > 1 && (
        <div className="mt-6 flex justify-center gap-3 sm:hidden">
          <button
            onClick={() => go(-1)}
            aria-label="Previous project"
            className="flex h-10 w-10 items-center justify-center pixel-border-sm text-neutral-600 dark:text-neutral-300"
          >
            <IconChevronLeft size={20} />
          </button>
          <button
            onClick={() => go(1)}
            aria-label="Next project"
            className="flex h-10 w-10 items-center justify-center pixel-border-sm text-neutral-600 dark:text-neutral-300"
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
  onSelect,
}: {
  project: Game;
  isActive: boolean;
  onSelect: () => void;
}) {
  return (
    <Link
      href={`/games/${project.slug}`}
      aria-hidden={!isActive}
      tabIndex={isActive ? 0 : -1}
      onClick={(e) => {
        if (!isActive) {
          e.preventDefault();
          onSelect();
        }
      }}
      style={{
        opacity: isActive ? 1 : 0,
        pointerEvents: isActive ? "auto" : "none",
      }}
      className={
        "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 overflow-hidden pixel-border bg-white dark:bg-neutral-900 " +
        "transition-opacity duration-300 h-[24rem] sm:h-[28rem] w-full sm:w-[min(680px,90%)] hover:scale-[1.02] hover:shadow-md"
      }
    >
      <div className="relative -mx-6 -mt-6 overflow-hidden h-80">
        {project.coverImage ? (
          <Image
            src={project.coverImage}
            alt={project.coverImageAlt}
            fill
            sizes="(max-width: 768px) 80vw, 680px"
            className="object-cover"
          />
        ) : (
          <PlaceholderImage label={project.title} className="h-full w-full" />
        )}
      </div>
      <div className="p-4 transition-opacity duration-300 opacity-100">
        <h3 className="line-clamp-1 min-h-[2rem] font-display text-2xl tracking-wide">
          {project.title}
        </h3>
        <p className="mt-1 line-clamp-2 min-h-[3.5rem] font-display text-xl text-neutral-600 dark:text-neutral-400">
          {project.shortDesc}
        </p>
      </div>
    </Link>
  );
}
