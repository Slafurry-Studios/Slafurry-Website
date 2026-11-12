"use server";

export type TurnstileVerifyResult =
  | { success: true }
  | { success: false; error: string };

/**
 * Verify a Cloudflare Turnstile token server-side.
 * Skips verification (allows) when TURNSTILE_SECRET_KEY is not set so local
 * development keeps working without captcha credentials.
 */
export async function verifyTurnstile(
  token: string
): Promise<TurnstileVerifyResult> {
  const secretKey = process.env.TURNSTILE_SECRET_KEY;

  if (!secretKey) {
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
