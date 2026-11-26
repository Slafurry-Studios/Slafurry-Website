import { SlafurryMark } from "@/components/icons/SlafurryMark";
import { PillButton } from "@/components/ui/PillButton";

// Achievement flag-hunting hook DISABLED sementara — jangan render hint
// flag ke user (kode bocor lewat page source). Balikin span-nya di bawah
// kalau feature nyalain lagi.
// Jangan tulis kode flag asli di repo (repo-nya publik). Ganti <FLAG_CODE>
// waktu re-enable; hash-nya dicek di /api/achievements/redeem (EXPECTED_HASH).
// const FLAG_HINT_COMMENT = {
//   __html:
//     "<p><strong>Flag code:</strong> <code><FLAG_CODE></code></p>" +
//     "<p><strong>How to redeem:</strong> Masukkan kode di panel Achievement (AchievementCTA → tab Redeem) " +
//     "atau melalui <code>/api/achievements/redeem</code> POST dengan body <code>{ code: \"<FLAG_CODE>\" }</code>." +
//     "<p>Jika berhasil, akan mendapatkan achievement <em>Flag Hunter</em> dan notifikasi toast.</p>",
// };

export default async function NotFound() {
  
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-6 py-16 text-center">
      {/* <span aria-hidden="true" dangerouslySetInnerHTML={FLAG_HINT_COMMENT} /> */}
      <SlafurryMark className="h-16 w-16 text-neutral-300 dark:text-neutral-700" />

      <p className="mt-6 font-display text-7xl tracking-wide text-neutral-300 dark:text-neutral-700">
        404
      </p>
      <h1 className="mt-1 font-display text-3xl tracking-wide">Page not found</h1>

      <p className="joke-only mt-3 max-w-sm font-display text-xl text-neutral-500 dark:text-neutral-400">
        &ldquo;Looks like you&apos;re lost. Maybe this page got caught in a joke that went too far.&rdquo;
      </p>

      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <PillButton href="/" variant="solid">
          &ldquo;Back to Home&rdquo;
        </PillButton>
        <PillButton href="/games">&ldquo;View Our Games&rdquo;</PillButton>
      </div>
    </div>
  );
}
