"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { IconChevronDown } from "@tabler/icons-react";
import { PillButton } from "@/components/ui/PillButton";
import { PostCard } from "@/components/posts/PostCard";
import { mockPosts, getFilteredPosts, getUniqueTags } from "@/lib/mock/posts";

export default function DevlogPage() {
  const t = useTranslations("devlog");
  const tPost = useTranslations("post");
  const [tagFilter, setTagFilter] = useState<string | undefined>(undefined);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const devlogPosts = mockPosts.filter((p) => p.category === "DEVLOG");
  const uniqueTags = getUniqueTags(devlogPosts);
  const filteredPosts = getFilteredPosts(devlogPosts, tagFilter, searchQuery);

  const tagButtonClass = (tag: string, isActive: boolean) =>
    `inline-flex items-center rounded-full border px-3 py-1.5 font-body text-sm font-medium transition-colors ${isActive
      ? "border-neutral-900 text-neutral-900 bg-neutral-100"
      : "border-neutral-300 text-neutral-700 hover:bg-neutral-200 hover:text-neutral-900"}`;

  const allTagsClass = tagFilter === undefined
    ? "border-neutral-600 text-neutral-600"
    : "border-neutral-900 text-neutral-900 hover:bg-neutral-900 hover:text-white";

  return (
    <div className="px-6 py-16 md:px-10">
      <h1 className="text-center font-heading text-5xl tracking-wide">{t("heading")}</h1>
      <p className="mx-auto mt-4 max-w-xl text-center font-body text-sm text-neutral-600 dark:text-neutral-400">
        {t("intro")}
      </p>
      <p className="mx-auto mt-3 max-w-xl text-center font-body text-sm text-neutral-500 dark:text-neutral-500">
        {t("subIntro")}
      </p>

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
          {uniqueTags.map((tag) => (
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

      <div className="mx-auto mt-10 flex max-w-2xl flex-col gap-8">
        {filteredPosts.map((post) => (
          <PostCard key={post.slug} post={post} />
        ))}
      </div>

      <div className="mt-10 flex justify-center">
        <PillButton icon={<IconChevronDown size={16} />} iconPosition="right">
          {tPost("more")}
        </PillButton>
      </div>
    </div>
  );
}