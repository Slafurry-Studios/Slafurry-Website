// Default import on purpose: `xss` is CommonJS, and named ESM imports of it
// fail under plain Node (they only work through bundler/test-runner interop).
// At runtime the default export is the module object carrying these helpers;
// its typings only describe the bare function, hence the cast.
import xss from "xss";

const { FilterXSS, safeAttrValue: defaultSafeAttrValue, friendlyAttrValue } = xss as unknown as typeof import("xss");

// Markup the TipTap editor produces that is safe to render on public pages.
// Authors can't set target/rel themselves; every link gets them below.
const WHITE_LIST: Record<string, string[]> = {
  p: [],
  br: [],
  strong: [],
  em: [],
  a: ["href", "title"],
  ul: [],
  ol: [],
  li: [],
  code: [],
  pre: [],
  blockquote: [],
  h1: [],
  h2: [],
  h3: [],
  h4: [],
  h5: [],
  h6: [],
  img: ["src", "alt", "title"],
};

// http(s), mailto, tel, fragment and relative URLs only (no javascript:, data:,
// vbscript:). Tested against the entity-decoded, whitespace-stripped value, so
// tricks like `java&#x09;script:` or `javascript&colon;` can't slip past.
const ALLOWED_URI = /^(?:(?:https?|mailto|tel):|#|\/(?!\/)|[^:/?#]*(?:[/?#]|$))/i;

const filter = new FilterXSS({
  whiteList: WHITE_LIST,
  // Drop tags that aren't allowed (keeping their text), and drop the contents
  // of script/style entirely.
  stripIgnoreTag: true,
  stripIgnoreTagBody: ["script", "style"],
  allowCommentTag: false,
  safeAttrValue(tag, name, value, cssFilter) {
    const safe = defaultSafeAttrValue(tag, name, value, cssFilter);
    if (name === "href" || name === "src") {
      const decoded = friendlyAttrValue(value).replace(/[\s\u0000-\u001f]+/g, "");
      if (!ALLOWED_URI.test(decoded)) return "";
    }
    return safe;
  },
});

/**
 * Sanitize admin-authored rich text (posts, game descriptions) before it is
 * rendered with `dangerouslySetInnerHTML`.
 *
 * Uses `xss` (js-xss): plain CommonJS with its own parser. Don't switch back to
 * DOMPurify on the server: it needs jsdom, which broke every page using this
 * function on Vercel (HTTP 500). And don't hand-roll a tokenizer either: those
 * are bypassable. `tests/unit/sanitize.test.ts` holds the regressions.
 */
export function sanitizeRichText(html: string | null | undefined): string {
  if (!html) return "";
  // Every <a> in the output was produced by the filter (literal "<a" text is
  // escaped to "&lt;a"), so this only touches real links.
  return filter.process(html).replace(/<a(?=[\s>])/g, '<a target="_blank" rel="noopener noreferrer"');
}
