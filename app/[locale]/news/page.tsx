"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { IconChevronDown } from "@tabler/icons-react";
import { PillButton } from "@/components/ui/PillButton";
import { PostCard } from "@/components/posts/PostCard";
import { mockPosts, getFilteredPosts, getUniqueTags } from "@/lib/mock/posts";

export default function NewsPage() {
  const t = useTranslations("news");
  const tPost = useTranslations("post");
  const [tagFilter, setTagFilter] = useState<string | undefined>(undefined);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const newsPosts = mockPosts.filter((p) => p.category === "NEWS");
  const uniqueNewsTags = getUniqueTags(newsPosts);
  const filteredPosts = getFilteredPosts(newsPosts, tagFilter, searchQuery);
  const [featured, ...rest] = filteredPosts;

  const tagButtonClass = (tag: string, isActive: boolean) =>
    `inline-flex items-center rounded-full border px-3 py-1.5 font-body text-sm font-medium transition-colors ${isActive
      ? "border-neutral-900 text-neutral-900 bg-neutral-100"
      : "border-neutral-300 text-neutral-700 hover:bg-neutral-200 hover:text-neutral-900"}`;

  const allTagsClass = tagFilter === undefined
    ? "border-neutral-600 text-neutral-600"
    : "border-neutral-900 text-neutral-900 hover:bg-neutral-900 hover:text-white";

  return (
    <div className="px-6 py-16 md:px-10">
      <div className="mx-auto grid max-w-4xl gap-8 md:grid-cols-[1fr_280px] md:items-start">
        <div>
          <h1 className="font-heading text-5xl tracking-wide">{t("heading")}</h1>
          <p className="mt-4 font-body text-sm text-neutral-600 dark:text-neutral-400">
            {t("intro")}
          </p>
          <p className="mt-3 font-body text-sm text-neutral-500 dark:text-neutral-500">
            {t("readAtOwnRisk")}
          </p>
        </div>

        {featured && (
          <div className="sm:col-span-2">
            <PostCard post={featured} compact />
          </div>
        )}

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {rest.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>

        <div className="mx-auto mb-10 max-w-2xl">
          <div className="flex flex-wrap gap-2 justify-center">
            <button
              onClick={() => setTagFilter(undefined)}
              className={
                `inline-flex items-center rounded-full border px-3 py-1.5 font-body text-sm font-medium transition-colors ${allTagsClass}`
              }
            >
              All tags
            </button>
            {uniqueNewsTags.map((tag) => (
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
              placeholder={t("searchPlaceholder")}
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