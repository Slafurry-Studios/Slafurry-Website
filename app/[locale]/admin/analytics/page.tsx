import { IconLayoutGrid } from "@tabler/icons-react";
import { PillButton } from "@/components/ui/PillButton";

function formatBytes(n: number) {
  return `${n} views`;
}

async function fetchAnalytics(period: string) {
  const baseUrl =
    process.env.NEXT_PUBLIC_APP_URL ||
    process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : "http://localhost:3000";

  const url = `${baseUrl}/api/analytics?period=${encodeURIComponent(period)}`;

  const res = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Analytics fetch failed");
  }

  return res.json();
}

export default async function AdminAnalyticsPage() {
  const period = "30d";

  const analytics = await fetchAnalytics(period);

  const topPages = analytics.topPages ?? [];
  const topReferrers = analytics.topReferrers ?? [];
  const deviceBreakdown = analytics.deviceBreakdown ?? [];

  return (
    <div className="mx-auto max-w-7xl space-y-8 px-4 py-10">
      <h1 className="font-heading text-3xl tracking-tight">Analytics</h1>

      {/* Period selector */}
      <div className="grid gap-2 sm:grid-cols-4 md:grid-cols-5">
        <PillButton
          variant="outline"
          className={period === "30d" ? "bg-neutral-900 text-white" : ""}
        >
          30d
        </PillButton>

        <PillButton
          variant="outline"
          className={period === "7d" ? "bg-neutral-900 text-white" : ""}
        >
          7d
        </PillButton>

        <PillButton
          variant="outline"
          className={period === "90d" ? "bg-neutral-900 text-white" : ""}
        >
          90d
        </PillButton>
      </div>

      {/* Top 10 pages */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-xl border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-900">
          <h2 className="mb-4 font-heading text-lg font-medium">
            Top 10 Pages
          </h2>

          <ul className="space-y-2 text-sm">
            {topPages.map((page: any, i: number) => {
              const path = page.path === "/" ? "Home" : page.path;
              const label =
                path.length > 30 ? `${path.slice(0, 27)}…` : path;

              return (
                <li key={i} className="flex items-center gap-2">
                  <span className="text-xs font-medium text-neutral-500 dark:text-neutral-400">
                    #{i + 1}
                  </span>

                  <a
                    href={`/${page.path === "/" ? "" : page.path}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-primary-600 hover:underline dark:text-primary-400"
                  >
                    {label}
                  </a>

                  <span className="ml-auto text-right font-mono text-sm dark:text-neutral-400">
                    {formatBytes(page.views)}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Top Referrers */}
        <div className="rounded-xl border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-900">
          <h2 className="mb-4 font-heading text-lg font-medium">
            Top Referrers
          </h2>

          <ul className="space-y-2 text-sm">
            {topReferrers.map((ref: any, i: number) => {
              let label = "Direct";

              if (ref.referrer) {
                try {
                  label = new URL(ref.referrer).hostname;
                } catch {
                  label = ref.referrer;
                }
              }

              return (
                <li key={i} className="flex items-center gap-2">
                  <span className="text-xs font-medium text-neutral-500 dark:text-neutral-400">
                    #{i + 1}
                  </span>

                  <span className="max-w-xs truncate text-primary-600 dark:text-primary-400">
                    {label}
                  </span>

                  <span className="ml-auto text-right font-mono text-sm dark:text-neutral-400">
                    {formatBytes(ref.views)}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Device Breakdown */}
        <div className="rounded-xl border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-900">
          <h2 className="mb-4 font-heading text-lg font-medium">
            Device Breakdown
          </h2>

          <div className="grid grid-cols-2 gap-2">
            {deviceBreakdown.map((d: any) => {
              const label =
                d.device === "desktop"
                  ? "Desktop"
                  : d.device === "mobile"
                  ? "Mobile"
                  : d.device === "tablet"
                  ? "Tablet"
                  : "Other";

              return (
                <div
                  key={d.device}
                  className="flex items-center justify-between rounded-md px-3 py-1"
                >
                  <span className="text-xs font-medium text-neutral-700 dark:text-neutral-300">
                    {label}
                  </span>

                  <span className="text-right font-mono text-xs dark:text-neutral-400">
                    {formatBytes(d.count)}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
