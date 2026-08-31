import { PostForm } from "@/components/admin/PostForm";

export default function NewPostPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-6 px-4 py-10">
      <h1 className="font-heading text-3xl tracking-tight">New Post</h1>
      <PostForm />
    </div>
  );
}
