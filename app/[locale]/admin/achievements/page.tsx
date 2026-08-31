import { prisma } from "@/lib/prisma";
import { Link } from "@/i18n/navigation";
import { IconPlus, IconPencil, IconEyeOff, IconLock, IconStar } from "@tabler/icons-react";
import { DeleteAchievementButton } from "@/components/admin/DeleteAchievementButton";

const TRIGGER_STYLE: Record<string, string> = {
  PAGE_VISIT: "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300",
  EVENT: "bg-violet-100 text-violet-800 dark:bg-violet-900/40 dark:text-violet-300",
  VISIT_COUNT: "bg-cyan-100 text-cyan-800 dark:bg-cyan-900/40 dark:text-cyan-300",
  SCROLL_DEPTH: "bg-teal-100 text-teal-800 dark:bg-teal-900/40 dark:text-teal-300",
  TIME_ON_SITE: "bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-300",
  META_ALL: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300",
  FLAG_CODE: "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300",
  CHEAT_DETECTED: "bg-pink-100 text-pink-800 dark:bg-pink-900/40 dark:text-pink-300",
};

export default async function AdminAchievementsPage() {
  const achievements = await prisma.achievement.findMany({
    orderBy: [{ category: "asc" }, { order: "asc" }, { title: "asc" }],
    select: {
      id: true,
      key: true,
      title: true,
      description: true,
      triggerType: true,
      isSecret: true,
      category: true,
      order: true,
      isActive: true,
      flagHash: true,
    },
  });

  // Group by category
  const grouped: Record<string, typeof achievements> = {};
  for (const a of achievements) {
    const cat = a.category || "Uncategorized";
    if (!grouped[cat]) grouped[cat] = [];
    grouped[cat].push(a);
  }

  const categoryOrder = ["Exploration", "Story", "Secret", "Meta", "Uncategorized"];

  return (
    <div className="mx-auto max-w-5xl space-y-6 px-4 py-10">
      <div className="flex items-center justify-between">
        <h1 className="font-heading text-3xl tracking-tight">Achievements</h1>
        <Link
          href="/admin/achievements/new"
          className="inline-flex items-center gap-2 rounded-full border border-neutral-900 bg-neutral-900 px-5 py-2 font-body text-sm font-medium text-white transition-colors hover:bg-neutral-700 dark:border-white dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200"
        >
          <IconPlus size={16} />
          New Achievement
        </Link>
      </div>

      {achievements.length === 0 && (
        <div className="rounded-xl border border-dashed border-neutral-300 p-10 text-center dark:border-neutral-700">
          <p className="text-sm text-neutral-500">
            No achievements yet. Create your first one!
          </p>
        </div>
      )}

      {categoryOrder.map((cat) => {
        const items = grouped[cat];
        if (!items || items.length === 0) return null;
        return (
          <section key={cat}>
            <h2 className="mb-3 font-heading text-lg tracking-tight text-neutral-500 dark:text-neutral-400">
              {cat}
              <span className="ml-2 text-sm font-normal">({items.length})</span>
            </h2>
            <div className="space-y-2">
              {items.map((a) => (
                <div
                  key={a.id}
                  className="flex items-center gap-4 rounded-xl border border-neutral-200 bg-white p-4 transition-shadow hover:shadow-sm dark:border-neutral-800 dark:bg-neutral-900"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{a.title}</span>
                      <span className="text-xs text-neutral-400">({a.key})</span>
                      <span
                        className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-medium uppercase ${TRIGGER_STYLE[a.triggerType]}`}
                      >
                        {a.triggerType.replace(/_/g, " ")}
                      </span>
                      {a.isSecret && (
                        <IconEyeOff
                          size={14}
                          className="text-neutral-400"
                          title="Secret"
                        />
                      )}
                      {a.flagHash && (
                        <IconLock
                          size={14}
                          className="text-red-400"
                          title="Flag code set"
                        />
                      )}
                      {!a.isActive && (
                        <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-[10px] font-medium text-neutral-500 dark:bg-neutral-800">
                          INACTIVE
                        </span>
                      )}
                    </div>
                    <p className="mt-0.5 line-clamp-1 text-xs text-neutral-500 dark:text-neutral-400">
                      {a.description}
                    </p>
                  </div>

                  <div className="flex items-center gap-1">
                    <span className="mr-2 text-xs text-neutral-400">#{a.order}</span>
                    <Link
                      href={`/admin/achievements/${a.id}/edit`}
                      className="rounded-lg p-2 text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-700 dark:hover:bg-neutral-800 dark:hover:text-neutral-300"
                    >
                      <IconPencil size={16} />
                    </Link>
                    <DeleteAchievementButton id={a.id} />
                  </div>
                </div>
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
