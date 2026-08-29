"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react";
import { Link } from "@/i18n/navigation";
import { PlaceholderImage } from "@/components/ui/PlaceholderMedia";
import { mockProjects } from "@/lib/mock/home";

export function ProjectCarousel() {
  const t = useTranslations("home");
  const [index, setIndex] = useState(0);
  const count = mockProjects.length;

  function go(delta: number) {
    setIndex((i) => (i + delta + count) % count);
  }

  const prev = mockProjects[(index - 1 + count) % count];
  const current = mockProjects[index];
  const next = mockProjects[(index + 1) % count];

  return (
    <section className="flex min-h-screen flex-col justify-center px-6 py-16 md:px-10">
      <h2 className="text-center font-heading text-4xl tracking-wide">
        {t("projects")}
      </h2>

      <div className="mx-auto mt-10 flex max-w-5xl items-center justify-center gap-3 md:gap-6">
        <button
          type="button"
          onClick={() => go(-1)}
          aria-label="Previous project"
          className="hidden h-10 w-10 shrink-0 items-center justify-center rounded-full border border-neutral-300 text-neutral-600 hover:bg-neutral-100 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800 sm:flex"
        >
          <IconChevronLeft size={20} />
        </button>

        {/* Peek card kiri — dipotong sebagian, cuma keliatan di desktop */}
        <ProjectCard project={prev} peek="left" />

        <ProjectCard project={current} />

        <ProjectCard project={next} peek="right" />

        <button
          type="button"
          onClick={() => go(1)}
          aria-label="Next project"
          className="hidden h-10 w-10 shrink-0 items-center justify-center rounded-full border border-neutral-300 text-neutral-600 hover:bg-neutral-100 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800 sm:flex"
        >
          <IconChevronRight size={20} />
        </button>
      </div>

      {/* Mobile controls (peek card disembunyikan di layar kecil lewat hidden sm:block) */}
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
    </section>
  );
}

function ProjectCard({
  project,
  peek,
}: {
  project: (typeof mockProjects)[number];
  peek?: "left" | "right";
}) {
  if (peek) {
    return (
      <div
        className={`hidden w-16 shrink-0 overflow-hidden rounded-xl border border-neutral-300 opacity-50 dark:border-neutral-700 sm:block md:w-24`}
      >
        <PlaceholderImage label={project.title} className="aspect-[4/5] w-full" />
      </div>
    );
  }

  return (
    <Link
      href={`/games/${project.slug}`}
      className="w-full max-w-sm shrink-0 overflow-hidden rounded-xl border border-neutral-300 transition-shadow hover:shadow-md dark:border-neutral-700"
    >
      <PlaceholderImage label={project.title} className="aspect-[16/9] w-full" />
      <div className="p-4">
        <h3 className="font-heading text-2xl tracking-wide">{project.title}</h3>
        <p className="mt-1 font-body text-sm text-neutral-600 dark:text-neutral-400">
          {project.shortDesc}
        </p>
      </div>
    </Link>
  );
}
