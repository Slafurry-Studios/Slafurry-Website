import { describe, it, expect } from "vitest";
import { classifyDevice, isBot, isTrackedPath, normalizePath, referrerHost } from "@/lib/analytics/track";

describe("isTrackedPath", () => {
  it("accepts current public pages", () => {
    for (const p of ["/", "/games", "/games/an-unfinished-game", "/news/x-y", "/devlog", "/press", "/contact", "/privacy"]) {
      expect(isTrackedPath(normalizePath(p))).toBe(true);
    }
    expect(isTrackedPath(normalizePath("/games/"))).toBe(true);
  });

  it("rejects legacy, admin and odd paths", () => {
    for (const p of ["/en/games", "/admin", "/admin/contacts", "/games/a/b", "//", "/games/../admin", "/api/analytics"]) {
      expect(isTrackedPath(normalizePath(p))).toBe(false);
    }
  });
});

describe("referrerHost", () => {
  it("keeps only the external hostname", () => {
    expect(referrerHost("https://www.google.com/search?q=secret", "slafurrystudios.com")).toBe("google.com");
    expect(referrerHost("https://itch.io/games/x?token=abc", "slafurrystudios.com")).toBe("itch.io");
  });

  it("drops internal, empty and non-web referrers", () => {
    expect(referrerHost("https://www.slafurrystudios.com/games", "slafurrystudios.com")).toBeNull();
    expect(referrerHost("http://localhost:3000/", "localhost:3000")).toBeNull();
    expect(referrerHost("", "slafurrystudios.com")).toBeNull();
    expect(referrerHost("javascript:alert(1)", "slafurrystudios.com")).toBeNull();
    expect(referrerHost("not a url", "slafurrystudios.com")).toBeNull();
  });
});

describe("classifyDevice / isBot", () => {
  it("classifies common user agents", () => {
    expect(classifyDevice("Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) Mobile/15E148")).toBe("mobile");
    expect(classifyDevice("Mozilla/5.0 (Linux; Android 14; Pixel 8) Chrome/120 Mobile Safari/537.36")).toBe("mobile");
    expect(classifyDevice("Mozilla/5.0 (iPad; CPU OS 17_0 like Mac OS X)")).toBe("tablet");
    expect(classifyDevice("Mozilla/5.0 (Linux; Android 13; SM-X700) Chrome/120 Safari/537.36")).toBe("tablet");
    expect(classifyDevice("Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120")).toBe("desktop");
  });

  it("treats crawlers and missing user agents as bots", () => {
    expect(isBot("Mozilla/5.0 (compatible; Googlebot/2.1)")).toBe(true);
    expect(isBot("curl/8.5.0")).toBe(true);
    expect(isBot(null)).toBe(true);
    expect(isBot("Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120")).toBe(false);
  });
});
