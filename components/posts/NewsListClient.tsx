"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { IconChevronDown } from "@tabler/icons-react";
import { PillButton } from "@/components/ui/PillButton";
import { PostCard } from "@/components/posts/PostCard";
import type { PostCardData } from "@/lib/queries/posts";

export function NewsListClient({
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
  const tPost = useTranslations("post");
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

  const [featured, ...rest] = filtered;

  const tagButtonClass = (tag: string, isActive: boolean) =>
    `inline-flex items-center rounded-full border px-3 py-1.5 font-body text-sm font-medium transition-colors ${
      isActive
        ? "border-neutral-900 text-neutral-900 bg-neutral-100 dark:border-white dark:text-white dark:bg-neutral-800"
        : "border-neutral-300 text-neutral-700 hover:bg-neutral-200 hover:text-neutral-900 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800"
    }`;

  const allTagsClass =
    tagFilter === undefined
      ? "border-neutral-600 text-neutral-600 dark:border-neutral-400 dark:text-neutral-400"
      : "border-neutral-900 text-neutral-900 hover:bg-neutral-900 hover:text-white dark:border-white dark:text-white dark:hover:bg-white dark:hover:text-neutral-900";

  return (
    <div className="px-6 py-16 md:px-10">
      <div className="mx-auto grid max-w-4xl gap-8 md:grid-cols-[1fr_280px] md:items-start">
        <div>
          <h1 className="font-heading text-5xl tracking-wide">{heading}</h1>
          <p className="mt-4 font-body text-sm text-neutral-600 dark:text-neutral-400">
            {intro}
          </p>
          {subIntro && (
            <p className="mt-3 font-body text-sm text-neutral-500 dark:text-neutral-500">
              {subIntro}
            </p>
          )}
        </div>

        {featured && (
          <div className="sm:col-span-2">
            <PostCard post={featured} compact />
          </div>
        )}

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {rest.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>

        <div className="mx-auto mb-10 max-w-2xl">
          <div className="flex flex-wrap gap-2 justify-center">
            <button
              onClick={() => setTagFilter(undefined)}
              className={`inline-flex items-center rounded-full border px-3 py-1.5 font-body text-sm font-medium transition-colors ${allTagsClass}`}
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
              className="flex-1 rounded border px-3 py-2 font-body text-sm dark:border-neutral-600 dark:bg-neutral-800 dark:text-white focus-outline"
            />
          </div>
        </div>

        <div className="mt-10 flex justify-center">
          <PillButton icon={<IconChevronDown size={16} />} iconPosition="right">
            {tPost("more")}
          </PillButton>
        </div>
      </div>
    </div>
  );
}
