import { describe, it, expect } from "vitest";
import { extractIdFromUrl } from "@/lib/audit";

describe("extractIdFromUrl", () => {
  it("extracts the last path segment", () => {
    const request = new Request("http://localhost/api/admin/games/abc-123");
    expect(extractIdFromUrl(request)).toBe("abc-123");
  });

  it("returns null for the root route", () => {
    const request = new Request("http://localhost/");
    expect(extractIdFromUrl(request)).toBeNull();
  });

  it("returns null when last segment is 'route'", () => {
    const request = new Request("http://localhost/api/admin/posts/route");
    expect(extractIdFromUrl(request)).toBeNull();
  });
});
