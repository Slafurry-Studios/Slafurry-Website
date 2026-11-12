import { describe, it, expect } from "vitest";
import { sanitizeRichText } from "@/lib/security/sanitize";

describe("sanitizeRichText", () => {
  it("keeps allowlisted TipTap markup", () => {
    const clean = sanitizeRichText(
      "<h2>Title</h2><p>Hello <strong>world</strong></p><ul><li>one</li></ul>"
    );
    expect(clean).toContain("<h2>Title</h2>");
    expect(clean).toContain("<strong>world</strong>");
    expect(clean).toContain("<li>one</li>");
  });

  it("strips event handlers from images", () => {
    const clean = sanitizeRichText('<img src="https://example.com/x.png" onerror="alert(1)">');
    expect(clean).not.toContain("onerror");
    expect(clean).not.toContain("alert(1)");
  });

  it("removes the img when src is a javascript or data URI", () => {
    expect(sanitizeRichText('<img src="javascript:alert(1)">')).not.toContain("javascript:");
    expect(sanitizeRichText('<img src="data:text/html;base64,PHN2Zz4=">')).not.toContain("data:");
  });

  it("strips svg and inline script payloads", () => {
    expect(sanitizeRichText('<svg onload="alert(1)"></svg>')).not.toContain("<svg");
    expect(
      sanitizeRichText('</script><script>alert(1)</script>')
    ).not.toContain("<script");
  });

  it("removes javascript: links", () => {
    expect(sanitizeRichText('<a href="javascript:alert(1)">x</a>')).not.toContain("javascript:");
  });

  it("hardens external links with rel and target", () => {
    const clean = sanitizeRichText('<a href="https://example.com">x</a>');
    expect(clean).toContain('rel="noopener noreferrer"');
    expect(clean).toContain('target="_blank"');
  });
});
