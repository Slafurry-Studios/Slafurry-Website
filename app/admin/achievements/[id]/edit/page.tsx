import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { AchievementForm } from "@/components/admin/AchievementForm";

export default async function EditAchievementPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const achievement = await prisma.achievement.findUnique({ where: { id } });

  if (!achievement) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6 px-4 py-10">
      <h1 className="font-heading text-3xl tracking-tight">Edit Achievement</h1>
      <AchievementForm
        initial={{
          id: achievement.id,
          key: achievement.key,
          title: achievement.title,
          description: achievement.description,
          hint: achievement.hint ?? "",
          icon: achievement.icon,
          triggerType: achievement.triggerType,
          triggerConfig: (achievement.triggerConfig as Record<string, unknown>) ?? {},
          isSecret: achievement.isSecret,
          category: achievement.category ?? "",
          order: achievement.order,
          isActive: achievement.isActive,
        }}
      />
    </div>
  );
}
