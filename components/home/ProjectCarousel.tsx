"use client";

import { useRef, useState } from "react";
import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react";
import type { Game } from "@prisma/client";
import Link from "next/link";
import { PlaceholderImage } from "@/components/ui/PlaceholderMedia";

export function ProjectCarousel({ projects }: { projects: Game[] }) {
  const [index, setIndex] = useState(0);
  const touchStartX = useRef<number | null>(null);
  const count = projects.length;

  function go(delta: number) {
    setIndex((i) => (i + delta + count) % count);
  }

  if (count === 0) return null;

  // offset circular, di-clamp -2..2 supaya card jauh tidak melintasi layar saat loop
  function getOffset(i: number) {
    let offset = (((i - index) % count) + count) % count;
    if (offset > count / 2) offset -= count;
    return Math.max(-2, Math.min(2, offset));
  }

  function onTouchEnd(e: React.TouchEvent) {
    if (touchStartX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    touchStartX.current = null;
    if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1);
  }

  return (
    <section className="flex flex-col justify-center px-6 py-16 md:px-10">
      <h2 className="text-center font-heading text-7xl tracking-wide">
        Projects
      </h2>

      <div className="mx-auto mt-12 flex w-full max-w-7xl items-center justify-center gap-4">
        {count > 1 && (
          <button
            type="button"
            onClick={() => go(-1)}
            aria-label="Previous project"
            className="hidden h-10 w-10 shrink-0 items-center justify-center rounded-full border border-neutral-300 text-neutral-600 hover:bg-neutral-100 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800 sm:flex"
          >
            <IconChevronLeft size={20} />
          </button>
        )}

        <div
          className="relative h-[30rem] w-full max-w-[1000px] overflow-hidden"
          onTouchStart={(e) => (touchStartX.current = e.touches[0].clientX)}
          onTouchEnd={onTouchEnd}
        >
          {projects.map((project, i) => (
            <ProjectCard
              key={project.id ?? project.slug}
              project={project}
              offset={getOffset(i)}
              onSelect={() => go(getOffset(i))}
            />
          ))}
        </div>

        {count > 1 && (
          <button
            type="button"
            onClick={() => go(1)}
            aria-label="Next project"
            className="hidden h-10 w-10 shrink-0 items-center justify-center rounded-full border border-neutral-300 text-neutral-600 hover:bg-neutral-100 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800 sm:flex"
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
            className="flex h-10 w-10 items-center justify-center rounded-full border border-neutral-300 text-neutral-600 dark:border-neutral-700 dark:text-neutral-300"
          >
            <IconChevronLeft size={20} />
          </button>
          <button
            onClick={() => go(1)}
            aria-label="Next project"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-neutral-300 text-neutral-600 dark:border-neutral-700 dark:text-neutral-300"
          >
            <IconChevronRight size={20} />
          </button>
        </div>
      )}
    </section>
  );
}

// Lebar card utama = min(680px, 80% container). Setengahnya dipakai untuk
// menghitung posisi card samping.
const HALF_MAIN = "min(340px, 40%)";
const PEEK_W = "6rem"; // harus sama dengan w-24 di bawah
const GAP = "1rem";

function leftFor(offset: number) {
  if (offset === 0) return "50%";
  const sign = offset < 0 ? "-" : "+";
  // offset ±1: tepat di samping card utama; ±2: lebih jauh lagi (tersembunyi)
  const extra = Math.abs(offset) === 2 ? ` ${sign} 7rem` : "";
  return `calc(50% ${sign} ${HALF_MAIN} ${sign} ${GAP} ${sign} ${PEEK_W} / 2${extra})`;
}

function ProjectCard({
  project,
  offset,
  onSelect,
}: {
  project: Game;
  offset: number;
  onSelect: () => void;
}) {
  const isCurrent = offset === 0;
  const isPeek = Math.abs(offset) === 1;

  return (
    <Link
      href={`/games/${project.slug}`}
      aria-hidden={!isCurrent}
      tabIndex={isCurrent ? 0 : -1}
      onClick={(e) => {
        if (!isCurrent) {
          e.preventDefault();
          if (isPeek) onSelect();
        }
      }}
      style={{
        left: leftFor(offset),
        opacity: isCurrent ? 1 : isPeek ? 0.5 : 0,
        zIndex: isCurrent ? 10 : 0,
      }}
      className={
        "absolute top-1/2 block -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-xl border border-neutral-300 bg-white dark:border-neutral-700 dark:bg-neutral-900 " +
        "transition-[left,width,height,opacity] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] " +
        (isCurrent
          ? "h-[28rem] w-[min(680px,80%)] hover:shadow-md"
          : "h-[8.75rem] w-24 " +
            (isPeek ? "cursor-pointer" : "pointer-events-none"))
      }
    >
      <div
        className={
          "transition-[height] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] " +
          (isCurrent ? "h-80" : "h-[8.75rem]")
        }
      >
        <PlaceholderImage label={project.title} className="h-full w-full" />
      </div>

      <div
        className={
          "p-4 transition-opacity duration-300 " +
          (isCurrent ? "opacity-100" : "opacity-0")
        }
      >
        <h3 className="line-clamp-1 min-h-[2rem] font-heading text-2xl tracking-wide">
          {project.title}
        </h3>
        <p className="mt-1 line-clamp-2 min-h-[3.5rem] font-body text-xl text-neutral-600 dark:text-neutral-400">
          {project.shortDesc}
        </p>
      </div>
    </Link>
  );
}