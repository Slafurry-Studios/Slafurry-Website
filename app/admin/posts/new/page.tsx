import { PostForm } from "@/components/admin/PostForm";
import { requireAdminPage } from "@/lib/auth/admin-guard";

export default async function NewPostPage() {
  await requireAdminPage();

  return (
    <div className="mx-auto max-w-3xl space-y-6 px-4 py-10">
      <h1 className="font-display text-3xl tracking-tight">New Post</h1>
      <PostForm />
    </div>
  );
}
