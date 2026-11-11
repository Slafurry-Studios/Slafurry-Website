// Format tanggal konsisten kayak di desain ("Mar 1, 2022"). Locale-aware
// dikit (en vs id) tapi tetep singkat, cocok buat metadata card.
export function formatDate(date: Date | string, locale: string = "en") {
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat(locale === "id" ? "id-ID" : "en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(d);
}
