import { prisma } from "@/lib/prisma";
import {
  IconExternalLink,
  IconCalendar,
  IconFileTypePdf,
  IconPhoto,
  IconStar,
} from "@tabler/icons-react";
import { ReleaseForm } from "@/components/admin/ReleaseForm";
import { AssetForm } from "@/components/admin/AssetForm";
import { DeleteButton } from "@/components/admin/DeleteButton";

const ASSET_TYPE_STYLE: Record<string, string> = {
  LOGO: "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300",
  BANNER:
    "bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300",
  CHARACTER:
    "bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-300",
};

export default async function AdminPressPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const { tab } = await searchParams;
  const activeTab = tab === "assets" ? "assets" : "releases";

  const [releases, assets, games] = await Promise.all([
    prisma.pressRelease.findMany({ orderBy: { publishedAt: "desc" } }),
    prisma.pressKitAsset.findMany({
      orderBy: { label: "asc" },
      include: { game: { select: { id: true, title: true } } },
    }),
    prisma.game.findMany({
      orderBy: { title: "asc" },
      select: { id: true, title: true },
    }),
  ]);

  return (
    <div className="mx-auto max-w-5xl space-y-6 px-4 py-10">
      <h1 className="font-heading text-3xl tracking-tight">Press</h1>

      {/* Tabs */}
      <div className="flex gap-1 rounded-lg border border-neutral-200 bg-neutral-100 p-1 dark:border-neutral-800 dark:bg-neutral-900">
        <a
          href="/admin/press?tab=releases"
          className={`flex-1 rounded-md px-4 py-2 text-center text-sm font-medium transition-colors ${
            activeTab === "releases"
              ? "bg-white text-neutral-900 shadow-sm dark:bg-neutral-800 dark:text-white"
              : "text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200"
          }`}
        >
          Press Releases ({releases.length})
        </a>
        <a
          href="/admin/press?tab=assets"
          className={`flex-1 rounded-md px-4 py-2 text-center text-sm font-medium transition-colors ${
            activeTab === "assets"
              ? "bg-white text-neutral-900 shadow-sm dark:bg-neutral-800 dark:text-white"
              : "text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200"
          }`}
        >
          Press Kit Assets ({assets.length})
        </a>
      </div>

      {/* === Press Releases Tab === */}
      {activeTab === "releases" && (
        <div className="space-y-6">
          {/* Add form */}
          <div className="rounded-xl border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900">
            <h2 className="mb-3 text-sm font-medium">Add Press Release</h2>
            <ReleaseForm />
          </div>

          {releases.length === 0 && (
            <div className="rounded-xl border border-dashed border-neutral-300 p-10 text-center dark:border-neutral-700">
              <p className="text-sm text-neutral-500">No press releases yet.</p>
            </div>
          )}

          {releases.length > 0 && (
            <div className="space-y-3">
              {releases.map((r) => (
                <div
                  key={r.id}
                  className="flex items-center gap-4 rounded-xl border border-neutral-200 bg-white p-4 transition-shadow hover:shadow-sm dark:border-neutral-800 dark:bg-neutral-900"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{r.title}</span>
                    </div>
                    <div className="mt-1 flex items-center gap-3 text-xs text-neutral-500 dark:text-neutral-400">
                      <span className="font-medium">{r.outlet}</span>
                      <span className="flex items-center gap-1">
                        <IconCalendar size={12} />
                        {new Date(r.publishedAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <a
                      href={r.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-lg p-2 text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-700 dark:hover:bg-neutral-800 dark:hover:text-neutral-300"
                    >
                      <IconExternalLink size={16} />
                    </a>
                    <DeleteButton
                      endpoint={`/api/admin/press/releases/${r.id}`}
                      label="release"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* === Press Kit Assets Tab === */}
      {activeTab === "assets" && (
        <div className="space-y-6">
          {/* Add form */}
          <div className="rounded-xl border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900">
            <h2 className="mb-3 text-sm font-medium">Add Press Kit Asset</h2>
            <AssetForm games={games} />
          </div>

          {assets.length === 0 && (
            <div className="rounded-xl border border-dashed border-neutral-300 p-10 text-center dark:border-neutral-700">
              <p className="text-sm text-neutral-500">No press kit assets yet.</p>
            </div>
          )}

          {assets.length > 0 && (
            <div className="space-y-3">
              {assets.map((a) => (
                <div
                  key={a.id}
                  className="flex items-center gap-4 rounded-xl border border-neutral-200 bg-white p-4 transition-shadow hover:shadow-sm dark:border-neutral-800 dark:bg-neutral-900"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-neutral-100 dark:bg-neutral-800">
                    {a.type === "LOGO" ? (
                      <IconStar size={18} className="text-neutral-400" />
                    ) : a.type === "BANNER" ? (
                      <IconPhoto size={18} className="text-neutral-400" />
                    ) : (
                      <IconFileTypePdf size={18} className="text-neutral-400" />
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{a.label}</span>
                      <span
                        className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-medium uppercase ${ASSET_TYPE_STYLE[a.type]}`}
                      >
                        {a.type}
                      </span>
                    </div>
                    <div className="mt-0.5 flex items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400">
                      {a.game && (
                        <span className="flex items-center gap-1">
                          <IconStar size={10} />
                          {a.game.title}
                        </span>
                      )}
                      <span className="truncate">{a.fileUrl}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <a
                      href={a.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-lg p-2 text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-700 dark:hover:bg-neutral-800 dark:hover:text-neutral-300"
                    >
                      <IconExternalLink size={16} />
                    </a>
                    <DeleteButton
                      endpoint={`/api/admin/press/assets/${a.id}`}
                      label="asset"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
