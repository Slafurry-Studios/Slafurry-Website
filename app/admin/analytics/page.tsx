import Link from "next/link";
import { requireAdminPage } from "@/lib/auth/admin-guard";
import {
  ANALYTICS_PERIODS,
  getAnalyticsSummary,
  normalizePeriod,
  type AnalyticsSummary,
} from "@/lib/queries/analytics";

export const dynamic = "force-dynamic";

const PERIOD_LABELS: Record<string, string> = { "7d": "7 days", "30d": "30 days", "90d": "90 days" };

const views = (n: number) => `${n.toLocaleString("en")} ${n === 1 ? "view" : "views"}`;

function Card({ title, empty, children }: { title: string; empty: boolean; children: React.ReactNode }) {
  return (
    <section className="rounded-xl border border-neutral-200 bg-white p-6">
      <h2 className="mb-4 font-display text-lg font-medium">{title}</h2>
      {empty ? <p className="text-sm text-neutral-500">No visits recorded in this period.</p> : children}
    </section>
  );
}

export default async function AdminAnalyticsPage({
  searchParams,
}: {
  searchParams: Promise<{ period?: string }>;
}) {
  await requireAdminPage();

  const period = normalizePeriod((await searchParams).period);

  let data: AnalyticsSummary | null = null;
  try {
    data = await getAnalyticsSummary(period);
  } catch (error) {
    console.error("Analytics query failed:", error);
  }

  return (
    <div className="mx-auto max-w-7xl space-y-8 px-4 py-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl tracking-tight">Analytics</h1>
          <p className="mt-1 text-sm text-neutral-500">
            Only visitors who accepted the analytics banner are counted, so these numbers undercount real traffic.
          </p>
        </div>

        <nav aria-label="Period" className="flex gap-2">
          {Object.keys(ANALYTICS_PERIODS).map((p) => (
            <Link
              key={p}
              href={`?period=${p}`}
              scroll={false}
              aria-current={period === p ? "page" : undefined}
              className={`rounded-md border px-4 py-2 font-display text-sm ${
                period === p
                  ? "border-neutral-900 bg-neutral-900 text-white"
                  : "border-neutral-300 hover:bg-neutral-100"
              }`}
            >
              {PERIOD_LABELS[p]}
            </Link>
          ))}
        </nav>
      </div>

      {!data ? (
        <p className="rounded-xl border border-red-200 bg-red-50 p-6 text-sm text-red-700">
          Couldn&apos;t load analytics right now. Try again in a moment.
        </p>
      ) : (
        <>
          <p className="font-display text-xl">
            {views(data.totalViews)} <span className="text-neutral-500">in the last {PERIOD_LABELS[period]}</span>
          </p>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <Card title="Top pages" empty={data.topPages.length === 0}>
              <ol className="space-y-2 text-sm">
                {data.topPages.map((page, i) => (
                  <li key={page.path} className="flex items-center gap-2">
                    <span className="w-6 text-xs text-neutral-500">#{i + 1}</span>
                    <a
                      href={page.path}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="min-w-0 truncate font-medium hover:underline"
                    >
                      {page.path === "/" ? "Home" : page.path}
                    </a>
                    <span className="ml-auto shrink-0 text-neutral-600">{views(page.views)}</span>
                  </li>
                ))}
              </ol>
            </Card>

            <Card title="Top referrers" empty={data.topReferrers.length === 0}>
              <ol className="space-y-2 text-sm">
                {data.topReferrers.map((ref, i) => (
                  <li key={ref.referrer ?? "direct"} className="flex items-center gap-2">
                    <span className="w-6 text-xs text-neutral-500">#{i + 1}</span>
                    <span className="min-w-0 truncate">{ref.referrer ?? "Direct / unknown"}</span>
                    <span className="ml-auto shrink-0 text-neutral-600">{views(ref.views)}</span>
                  </li>
                ))}
              </ol>
            </Card>

            <Card title="Devices" empty={data.deviceBreakdown.length === 0}>
              <ul className="space-y-2 text-sm">
                {data.deviceBreakdown.map((d, i) => (
                  <li key={`${d.device}-${i}`} className="flex items-center justify-between">
                    <span>{d.device}</span>
                    <span className="text-neutral-600">{views(d.count)}</span>
                  </li>
                ))}
              </ul>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}
