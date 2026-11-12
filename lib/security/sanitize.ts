import DOMPurify from "isomorphic-dompurify";

/**
 * Allowlist tuned for TipTap rich text. Anything outside this list is dropped
 * at render time so stored content can never inject scripts or event handlers.
 */
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

// http(s), mailto, tel, fragment and relative URLs only. Blocks javascript:,
// data: and vbscript: for both href and src.
const SAFE_URI = /^(?:(?:https?|mailto|tel):|#|\/(?!\/)|[^a-z]|[a-z+.-]+(?:[^a-z+.-:]|$))/i;

let hookRegistered = false;

function registerHook(): void {
  if (hookRegistered) return;
  hookRegistered = true;

  DOMPurify.addHook("afterSanitizeAttributes", (node) => {
    if (node.nodeType !== 1) return;

    for (const attr of ["href", "src"]) {
      const value = node.getAttribute(attr);
      if (value && !SAFE_URI.test(value.trim())) {
        node.removeAttribute(attr);
      }
    }

    if (node.nodeName === "A") {
      if (node.getAttribute("href")) {
        node.setAttribute("rel", "noopener noreferrer");
        node.setAttribute("target", "_blank");
      }
      node.removeAttribute("onclick");
      node.removeAttribute("onerror");
    }

    if (node.nodeName === "IMG") {
      node.removeAttribute("onerror");
      node.removeAttribute("onload");
      if (!node.getAttribute("src")) {
        node.parentNode?.removeChild(node);
      }
    }
  });
}

export function sanitizeRichText(html: string | null | undefined): string {
  if (!html) return "";
  registerHook();
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS,
    ALLOWED_ATTR,
    ALLOWED_URI_REGEXP: SAFE_URI,
    ALLOW_DATA_ATTR: false,
    FORBID_TAGS: ["script", "style", "iframe", "object", "embed", "svg"],
    FORBID_ATTR: ["style", "onerror", "onload", "onclick"],
  });
}
