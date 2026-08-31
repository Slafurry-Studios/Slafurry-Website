import { prisma } from "@/lib/prisma";
import { AchievementsList } from "@/components/admin/AchievementsList";

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

  return (
    <AchievementsList
      achievements={achievements.map((a) => ({
        id: a.id,
        key: a.key,
        title: a.title,
        description: a.description,
        triggerType: a.triggerType,
        isSecret: a.isSecret,
        category: a.category || "Uncategorized",
        order: a.order,
        isActive: a.isActive,
        hasFlag: !!a.flagHash,
      }))}
    />
  );
}
