import { prisma } from "@/lib/prisma";
import { IconVideo, IconPlayerPlay, IconGripVertical } from "@tabler/icons-react";
import { MontageForm } from "@/components/admin/MontageForm";
import { DeleteButton } from "@/components/admin/DeleteButton";

export default async function AdminMontagePage() {
  const [videos, games] = await Promise.all([
    prisma.montageVideo.findMany({
      orderBy: { order: "asc" },
      include: { game: { select: { id: true, title: true } } },
    }),
    prisma.game.findMany({
      orderBy: { title: "asc" },
      select: { id: true, title: true },
    }),
  ]);

  return (
    <div className="mx-auto max-w-5xl space-y-6 px-4 py-10">
      <div className="flex items-center justify-between">
        <h1 className="font-heading text-3xl tracking-tight">Montage Videos</h1>
        <span className="text-sm text-neutral-500 dark:text-neutral-400">
          {videos.length} video{videos.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Add form */}
      <div className="rounded-xl border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900">
        <h2 className="mb-3 text-sm font-medium">Add Video</h2>
        <MontageForm games={games} />
      </div>

      {videos.length === 0 && (
        <div className="rounded-xl border border-dashed border-neutral-300 p-10 text-center dark:border-neutral-700">
          <IconVideo
            size={32}
            className="mx-auto mb-3 text-neutral-300 dark:text-neutral-600"
          />
          <p className="text-sm text-neutral-500">No montage videos yet.</p>
        </div>
      )}

      {videos.length > 0 && (
        <div className="space-y-2">
          {videos.map((v) => (
            <div
              key={v.id}
              className={`flex items-center gap-4 rounded-xl border bg-white p-4 transition-shadow hover:shadow-sm dark:bg-neutral-900 ${
                v.isActive
                  ? "border-neutral-200 dark:border-neutral-800"
                  : "border-neutral-200 opacity-60 dark:border-neutral-800"
              }`}
            >
              <IconGripVertical
                size={16}
                className="shrink-0 text-neutral-300 dark:text-neutral-600"
              />

              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-neutral-100 dark:bg-neutral-800">
                <IconPlayerPlay size={16} className="text-neutral-400" />
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">{v.label}</span>
                  {!v.isActive && (
                    <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-[10px] font-medium text-neutral-500 dark:bg-neutral-800">
                      INACTIVE
                    </span>
                  )}
                </div>
                <div className="mt-0.5 flex items-center gap-3 text-xs text-neutral-500 dark:text-neutral-400">
                  {v.game && <span>{v.game.title}</span>}
                  <span className="truncate">{v.videoUrl}</span>
                </div>
              </div>

              <span className="text-xs text-neutral-400">#{v.order}</span>

              <a
                href={v.videoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-lg p-2 text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-700 dark:hover:bg-neutral-800 dark:hover:text-neutral-300"
              >
                <IconPlayerPlay size={16} />
              </a>

              <DeleteButton
                endpoint={`/api/admin/montage/${v.id}`}
                label="video"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
