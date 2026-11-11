"use client";

import type { Game } from "@prisma/client";
import Link from "next/link";
import { PlaceholderImage } from "@/components/ui/PlaceholderMedia";

const CARD_WIDTH_BY_COUNT: Record<number, string> = {
  1: "w-full",
  2: "w-full sm:w-1/2",
  3: "w-full sm:w-1/2 md:w-1/3",
};

export function ProjectCarousel({ projects }: { projects: Game[] }) {
  const count = projects.length;

  if (count === 0) return null;

  const cards = projects.slice(0, 3);
  const cardWidth = CARD_WIDTH_BY_COUNT[count] ?? "w-full";

  return (
    <section className="flex flex-col justify-center px-6 py-12 md:py-16 md:px-10">
      <h2 className="text-center font-display text-4xl tracking-wide sm:text-5xl lg:text-6xl">
        Projects
      </h2>

      <div className="mx-auto mt-12 flex flex-row gap-6 max-w-[90rem] overflow-x-auto">
        {cards.map((project) => (
          <ProjectCard key={project.id ?? project.slug} project={project} cardWidth={cardWidth} />
        ))}
      </div>
    </section>
  );
}

function ProjectCard({
  project,
  cardWidth,
}: {
  project: Game;
  cardWidth: string;
}) {
  return (
    <Link
      href={`/games/${project.slug}`}
      className={`overflow-hidden pixel-border bg-white dark:bg-neutral-900 transition-all duration-200 hover:scale-[1.02] hover:shadow-md ${cardWidth}`}
    >
      <div className="-mx-6 -mt-6 overflow-hidden">
        {project.coverImage ? (
          <img
            src={project.coverImage}
            alt={project.coverImageAlt}
            className="aspect-[16/9] w-full object-cover"
          />
        ) : (
          <PlaceholderImage
            label={project.title}
            className="aspect-[16/9] w-full"
          />
        )}
      </div>
      <div className="p-4 sm:p-6">
        <h3 className="font-display text-xl sm:text-2xl font-semibold leading-snug">{project.title}</h3>
        <p className="mt-2 line-clamp-2 font-display text-sm sm:text-xl text-neutral-600 dark:text-neutral-400">
          {project.shortDesc}
        </p>
      </div>
    </Link>
  );
}
