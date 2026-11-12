import { describe, it, expect } from "vitest";
import { isCrossSiteRequest, isUnsafeMethod } from "@/lib/security/csrf";

function headers(values: Record<string, string>): Headers {
  return new Headers(values);
}

describe("isUnsafeMethod", () => {
  it("treats state-changing methods as unsafe", () => {
    expect(isUnsafeMethod("POST")).toBe(true);
    expect(isUnsafeMethod("PUT")).toBe(true);
    expect(isUnsafeMethod("PATCH")).toBe(true);
    expect(isUnsafeMethod("DELETE")).toBe(true);
  });

  it("treats read-only methods as safe", () => {
    expect(isUnsafeMethod("GET")).toBe(false);
    expect(isUnsafeMethod("HEAD")).toBe(false);
    expect(isUnsafeMethod("OPTIONS")).toBe(false);
  });
});

describe("isCrossSiteRequest", () => {
  it("blocks Sec-Fetch-Site: cross-site", () => {
    expect(
      isCrossSiteRequest(
        headers({ "sec-fetch-site": "cross-site", origin: "https://evil.test", host: "slafurrystudios.com" })
      )
    ).toBe(true);
  });

  it("blocks a mismatched Origin even without Fetch-Metadata", () => {
    expect(
      isCrossSiteRequest(
        headers({ origin: "https://evil.test", host: "slafurrystudios.com" })
      )
    ).toBe(true);
  });

  it("allows same-origin requests", () => {
    expect(
      isCrossSiteRequest(
        headers({
          "sec-fetch-site": "same-origin",
          origin: "https://slafurrystudios.com",
          host: "slafurrystudios.com",
        })
      )
    ).toBe(false);
  });

  it("allows user-initiated requests with no origin", () => {
    expect(isCrossSiteRequest(headers({ "sec-fetch-site": "none" }))).toBe(false);
    expect(isCrossSiteRequest(headers({}))).toBe(false);
  });
});
