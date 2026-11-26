import { AchievementForm } from "@/components/admin/AchievementForm";
import { requireAdminPage } from "@/lib/auth/admin-guard";

export default async function NewAchievementPage() {
  await requireAdminPage();

  return (
    <div className="mx-auto max-w-3xl space-y-6 px-4 py-10">
      <h1 className="font-display text-3xl tracking-tight">New Achievement</h1>
      <AchievementForm />
    </div>
  );
}
