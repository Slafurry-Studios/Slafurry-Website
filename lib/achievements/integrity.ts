import type { AchievementStorageData } from "./storage";

// ---------------------------------------------------------------------------
// Integrity signature — prevents casual localStorage tampering.
//
// The "secret" is embedded here; it is NOT a security boundary, just an
// obfuscation layer that makes naive `localStorage.setItem` edits detectable.
// A determined attacker can always read the source, but that's fine — the
// Cheating! achievement is a fun easter egg, not DRM.
// ---------------------------------------------------------------------------

const SIGNATURE_SECRET = "sLaFuRrY_4ch!3v3M3nt$_2024";

// Data fields included in the signature (everything except the signature itself)
type SignableData = Omit<AchievementStorageData, "signature">;

// ---------------------------------------------------------------------------
// FNV-1a hash (32-bit) — fast, good distribution, synchronous
// ---------------------------------------------------------------------------

function fnv1a(str: string): string {
  let hash = 0x811c9dc5; // FNV offset basis
  for (let i = 0; i < str.length; i++) {
    hash ^= str.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193); // FNV prime
  }
  return (hash >>> 0).toString(16).padStart(8, "0");
}

// ---------------------------------------------------------------------------
// Deterministic serialization — key order matters for hashing
// ---------------------------------------------------------------------------

function canonicalize(data: SignableData): string {
  return JSON.stringify(data, Object.keys(data).sort());
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Compute a signature for the given achievement storage data.
 * Returns a hex string derived from a double-hash of the canonicalized
 * payload mixed with the secret salt.
 */
export function computeSignature(data: SignableData): string {
  const canonical = canonicalize(data);
  const first = fnv1a(canonical + SIGNATURE_SECRET);
  const second = fnv1a(SIGNATURE_SECRET + canonical + first);
  return `${first}-${second}`;
}

/**
 * Verify that the signature in `data` matches the expected signature
 * computed from the remaining fields. Returns `true` if valid, `false`
 * if the data has been tampered with or is corrupted.
 */
export function verifySignature(data: AchievementStorageData): boolean {
  const { signature, ...rest } = data;
  if (!signature) return false;

  const expected = computeSignature(rest);
  return signature === expected;
}
