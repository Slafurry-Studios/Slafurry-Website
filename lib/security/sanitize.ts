import DOMPurify from "isomorphic-dompurify";

// Markup the TipTap editor produces that is safe to render on public pages.
const ALLOWED_TAGS = [
  "p",
  "br",
  "strong",
  "em",
  "a",
  "ul",
  "ol",
  "li",
  "code",
  "pre",
  "blockquote",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "img",
];

const ALLOWED_ATTR = ["href", "title", "src", "alt", "target", "rel"];

// http(s), mailto, tel, fragment and relative URLs only. DOMPurify tests this
// against the *decoded* attribute value, so entity tricks such as
// `java&#x09;script:` or `javascript&colon;` cannot slip past.
const ALLOWED_URI_REGEXP = /^(?:(?:https?|mailto|tel):|#|\/(?!\/)|[^:/?#]*(?:[/?#]|$))/i;

let hooked = false;
function ensureHooks() {
  if (hooked) return;
  hooked = true;
  DOMPurify.addHook("afterSanitizeAttributes", (node) => {
    // DOMPurify exempts <img src="data:..."> from ALLOWED_URI_REGEXP; we don't.
    const src = node.getAttribute("src");
    if (src !== null && !ALLOWED_URI_REGEXP.test(src.trim())) node.removeAttribute("src");
    // Force links to open in a new tab without leaking window.opener.
    if (node.tagName === "A") {
      node.setAttribute("target", "_blank");
      node.setAttribute("rel", "noopener noreferrer");
    }
  });
}

/**
 * Sanitize admin-authored rich text (posts, game descriptions) before it is
 * rendered with `dangerouslySetInnerHTML`. Don't swap this for a hand-rolled
 * tokenizer: those are bypassable (entity-encoded schemes, unclosed tags that
 * swallow the surrounding markup).
 */
export function sanitizeRichText(html: string | null | undefined): string {
  if (!html) return "";
  ensureHooks();
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS,
    ALLOWED_ATTR,
    ALLOWED_URI_REGEXP,
    ALLOW_DATA_ATTR: false,
  });
}
