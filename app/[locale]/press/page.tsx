import { useTranslations } from "next-intl";
import { IconExternalLink, IconDownload } from "@tabler/icons-react";
import { formatDate } from "@/lib/format";
import { mockPressReleases, mockPressKitAssets } from "@/lib/mock/press";

// TODO: contactEmail dari SiteSettings pas step 4 (hook database).
const PRESS_CONTACT_EMAIL = "press@slafurrystudios.com";

const ASSET_TYPE_LABEL: Record<string, string> = {
  LOGO: "Logo",
  BANNER: "Banner",
  CHARACTER: "Character",
};

export default function PressPage() {
  const t = useTranslations("press");

  const releasesByOutlet = groupBy(mockPressReleases, (r) => r.outlet);
  const assetsByTarget = groupBy(mockPressKitAssets, (a) => a.target);

  return (
    <div className="px-6 py-16 md:px-10">
      <div className="mx-auto grid max-w-5xl gap-12 md:grid-cols-2">
        <div>
          <h1 className="font-heading text-4xl tracking-wide">{t("releasesHeading")}</h1>
          <div className="mt-6 space-y-8">
            {Object.entries(releasesByOutlet).map(([outlet, releases]) => (
              <div key={outlet}>
                <h2 className="font-body text-lg font-bold">{outlet}</h2>
                <ul className="mt-2 space-y-2">
                  {releases.map((release) => (
                    <li key={release.url + release.title}>
                      <a
                        href={release.url}
                        target="_blank"
                        rel="noreferrer"
                        className="group flex items-start gap-1.5 font-body text-sm text-neutral-700 hover:text-neutral-950 dark:text-neutral-300 dark:hover:text-white"
                      >
                        <IconExternalLink
                          size={14}
                          className="mt-0.5 shrink-0 text-neutral-400 group-hover:text-neutral-700 dark:group-hover:text-neutral-200"
                        />
                        <span>
                          {release.title}
                          <span className="ml-1.5 text-xs text-neutral-400">
                            — {formatDate(release.publishedAt)}
                          </span>
                        </span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h1 className="font-heading text-4xl tracking-wide">{t("kitHeading")}</h1>
          <div className="mt-6 space-y-8">
            {Object.entries(assetsByTarget).map(([target, assets]) => (
              <div key={target}>
                <h2 className="font-body text-lg font-bold">{target}</h2>
                <ul className="mt-2 space-y-1.5">
                  {assets.map((asset) => (
                    <li key={target + asset.type}>
                      <a
                        href={asset.fileUrl}
                        className="inline-flex items-center gap-1.5 font-body text-sm text-neutral-700 hover:text-neutral-950 dark:text-neutral-300 dark:hover:text-white"
                      >
                        <IconDownload size={14} className="text-neutral-400" />
                        <span className="font-medium">{ASSET_TYPE_LABEL[asset.type]}:</span>
                        <span className="text-neutral-500 dark:text-neutral-400">
                          {t("download")}
                        </span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      <p className="mx-auto mt-16 max-w-5xl border-t border-neutral-200 pt-8 text-center font-body text-sm text-neutral-600 dark:border-neutral-800 dark:text-neutral-400">
        {t("inquiries")}{" "}
        <a
          href={`mailto:${PRESS_CONTACT_EMAIL}`}
          className="font-semibold text-neutral-900 underline underline-offset-2 dark:text-white"
        >
          {PRESS_CONTACT_EMAIL}
        </a>
      </p>
    </div>
  );
}

function groupBy<T, K extends string>(items: T[], keyFn: (item: T) => K): Record<K, T[]> {
  return items.reduce(
    (acc, item) => {
      const key = keyFn(item);
      (acc[key] ??= []).push(item);
      return acc;
    },
    {} as Record<K, T[]>
  );
}
