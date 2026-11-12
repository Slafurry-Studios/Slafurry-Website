import { describe, it, expect } from "vitest";
import { checkRateLimit } from "@/lib/actions/form-guards";

function uniqueKey(): string {
  return `test-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

describe("checkRateLimit", () => {
  it("allows attempts up to the limit then blocks in the window", async () => {
    const key = uniqueKey();
    const ip = "203.0.113.10";

    for (let i = 0; i < 5; i += 1) {
      const result = await checkRateLimit(key, 5, 15 * 60 * 1000, ip);
      expect(result.allowed).toBe(true);
    }

    const blocked = await checkRateLimit(key, 5, 15 * 60 * 1000, ip);
    expect(blocked.allowed).toBe(false);
    expect(blocked.reason).toContain("Rate limited");
  });

  it("keeps separate buckets per IP", async () => {
    const key = uniqueKey();
    await checkRateLimit(key, 1, 60_000, "203.0.113.11");
    const second = await checkRateLimit(key, 1, 60_000, "203.0.113.12");
    expect(second.allowed).toBe(true);
  });
});
