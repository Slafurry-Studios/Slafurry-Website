import { AchievementForm } from "@/components/admin/AchievementForm";

export default function NewAchievementPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-6 px-4 py-10">
      <h1 className="font-heading text-3xl tracking-tight">New Achievement</h1>
      <AchievementForm />
    </div>
  );
}
