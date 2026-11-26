export type TurnstileVerifyResult =
  | { success: true }
  | { success: false; error: string };

/**
 * Verify a Cloudflare Turnstile token server-side.
 * Skips verification (allows) when TURNSTILE_SECRET_KEY is not set so local
 * development keeps working without captcha credentials. In production a
 * missing key fails closed, so a misconfigured deploy can't silently drop the
 * captcha from the comment and contact forms.
 *
 * Plain server-only helper, deliberately not a "use server" module: that would
 * expose it as a callable server action.
 */
export async function verifyTurnstile(
  token: string
): Promise<TurnstileVerifyResult> {
  const secretKey = process.env.TURNSTILE_SECRET_KEY;

  if (!secretKey) {
    if (process.env.NODE_ENV === "production" || process.env.VERCEL) {
      console.error("[turnstile] TURNSTILE_SECRET_KEY not set in production — rejecting.");
      return { success: false, error: "captcha-not-configured" };
    }
    console.warn(
      "[turnstile] TURNSTILE_SECRET_KEY not set — skipping captcha verification."
    );
    return { success: true };
  }

  if (!token) {
    return { success: false, error: "missing-token" };
  }

  const formData = new FormData();
  formData.append("secret", secretKey);
  formData.append("response", token);

  try {
    const res = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      { method: "POST", body: formData, cache: "no-store" }
    );
    const json = await res.json();
    if (json.success === true) {
      return { success: true };
    }
    return {
      success: false,
      error: Array.isArray(json["error-codes"])
        ? json["error-codes"].join(", ")
        : String(json["error-codes"] ?? "unknown"),
    };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "service-unavailable",
    };
  }
}
