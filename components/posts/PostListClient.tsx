"use client";

import { useState } from "react";
import { IconChevronDown } from "@tabler/icons-react";
import { PillButton } from "@/components/ui/PillButton";
import { PostCard } from "@/components/posts/PostCard";
import type { PostCardData } from "@/lib/queries/posts";

export function PostListClient({
  posts,
  tags,
  heading,
  intro,
  subIntro,
  searchPlaceholder,
}: {
  posts: PostCardData[];
  tags: string[];
  heading: string;
  intro: string;
  subIntro?: string;
  searchPlaceholder: string;
}) {

  const [tagFilter, setTagFilter] = useState<string | undefined>(undefined);
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = posts.filter((p) => {
    if (tagFilter && !p.tags.includes(tagFilter)) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      if (
        !p.title.toLowerCase().includes(q) &&
        !p.excerpt.toLowerCase().includes(q)
      )
        return false;
    }
    return true;
  });

  const tagButtonClass = (tag: string, isActive: boolean) =>
    `inline-flex items-center pixel-border-sm px-3 py-1.5 font-display text-xl font-medium transition-colors ${
      isActive
        ? "text-neutral-900 bg-neutral-100 dark:text-white dark:bg-neutral-800"
        : "text-neutral-700 hover:bg-neutral-200 hover:text-neutral-900 dark:text-neutral-300 dark:hover:bg-neutral-800"
    }`;

  const allTagsClass =
    tagFilter === undefined
      ? "text-neutral-600 dark:text-neutral-400"
      : "text-neutral-900 hover:bg-neutral-900 hover:text-white dark:text-white dark:hover:bg-white dark:hover:text-neutral-900";

  return (
    <div className="px-6 py-16 md:px-10">
      <h1 className="text-center font-display text-5xl tracking-wide">
        {heading}
      </h1>
      <p className="mx-auto mt-4 max-w-xl text-center font-display text-xl text-neutral-600 dark:text-neutral-400">
        {intro}
      </p>
      {subIntro && (
        <p className="mx-auto mt-3 max-w-xl text-center font-display text-xl text-neutral-500 dark:text-neutral-500">
          {subIntro}
        </p>
      )}

      <div className="mx-auto mb-10 max-w-4xl">
        <div className="flex flex-wrap gap-2 justify-center">
          <button
            onClick={() => setTagFilter(undefined)}
            className={`inline-flex items-center pixel-border-sm px-3 py-1.5 font-display text-xl font-medium transition-colors ${allTagsClass}`}
          >
            All tags
          </button>
          {tags.map((tag) => (
            <button
              key={tag}
              onClick={() => setTagFilter(tag)}
              className={tagButtonClass(tag, tagFilter === tag)}
            >
              {tag}
            </button>
          ))}
        </div>

        <div className="mt-4 flex gap-2 w-full">
          <input
            type="text"
            placeholder={searchPlaceholder}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 min-w-0 pixel-border-sm px-3 py-2 font-display text-xl dark:bg-neutral-800 dark:text-white focus-outline"
          />
        </div>
      </div>

      <div className="mx-auto mt-10 flex max-w-4xl flex-col gap-8">
        {filtered.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
        {filtered.length === 0 && (
          <p className="text-center text-xl text-neutral-500 dark:text-neutral-400">
            No posts found.
          </p>
        )}
      </div>

      <div className="mt-10 flex justify-center">
        <PillButton size="sm" icon={<IconChevronDown size={16} />} iconPosition="right">
          More
        </PillButton>
      </div>
    </div>
  );
}
