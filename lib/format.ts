// Format dates consistently like the design ("Mar 1, 2022"). Locale-aware
// a bit (en vs id) but still short, suitable for metadata cards.
export function formatDate(date: Date | string, locale: string = "en") {
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat(locale === "id" ? "id-ID" : "en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(d);
}
