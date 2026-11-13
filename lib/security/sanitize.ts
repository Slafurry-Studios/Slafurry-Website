const ALLOWED_TAGS = new Set([
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
]);

const ALLOWED_ATTR = new Set(["href", "title", "src", "alt", "target", "rel"]);

// http(s), mailto, tel, fragment and relative URLs only. Blocks javascript:,
// data: and vbscript: for both href and src.
const SAFE_URI = /^(?:(?:https?|mailto|tel):|#|\/(?!\/)|[^a-z]|[a-z+.-]+(?:[^a-z+.-:]|$))/i;
const EVENT_ATTR = /^on[A-Z]/i;

/** Parse the opening tag of a raw `<...>` token into {tag, attrs, selfClosing, isClose}. */
function parseTag(raw: string) {
  const inner = raw.slice(1, -1).trim();
  const isClose = inner.startsWith("/");
  const body = isClose ? inner.slice(1).trim() : inner.replace(/\/$/, "").trim();
  const ws = body.search(/\s/);
  const tag = ws === -1 ? body : body.slice(0, ws);
  const rest = ws === -1 ? "" : body.slice(ws + 1);
  const attrs: [string, string][] = [];
  let m;
  const attrRe = /([\w:-]+)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/g;
  while ((m = attrRe.exec(rest))) {
    const value = m[2] !== undefined ? m[2] : m[3] !== undefined ? m[3] : m[4];
    attrs.push([m[1].toLowerCase(), value ?? ""]);
  }
  return { tag: tag.toLowerCase(), attrs, isClose, selfClosing: raw.trimEnd().endsWith("/>") };
}

/** Render attributes back to HTML, allowlisting names and sanitizing URI values. */
function renderAttrs(attrs: [string, string][]): string {
  let out = "";
  for (const [name, value] of attrs) {
    if (!ALLOWED_ATTR.has(name)) continue;
    if (EVENT_ATTR.test(name)) continue;
    let val = value;
    if ((name === "href" || name === "src") && !SAFE_URI.test(val.trim())) {
      val = "";
    }
    out += ` ${name}="${val.replace(/"/g, "&quot;")}"`;
  }
  return out;
}

export function sanitizeRichText(html: string | null | undefined): string {
  if (!html) return "";
  let out = "";
  let i = 0;
  while (i < html.length) {
    const lt = html.indexOf("<", i);
    if (lt === -1) {
      out += html.slice(i);
      break;
    }
    out += html.slice(i, lt);
    const gt = html.indexOf(">", lt + 1);
    if (gt === -1) {
      out += html.slice(lt);
      break;
    }
    const raw = html.slice(lt, gt + 1);
    const { tag, attrs, isClose, selfClosing } = parseTag(raw);

    if (isClose) {
      // Close tag: only emit if its opening tag was allowed (tracked implicitly by allowing all close tags of allowed tags)
      if (ALLOWED_TAGS.has(tag)) out += raw;
      i = gt + 1;
      continue;
    }

    if (!ALLOWED_TAGS.has(tag)) {
      // Forbidden tag: drop the tag but keep its inner content (already in out as text).
      i = gt + 1;
      continue;
    }

    // Allowed tag: rebuild with allowlisted attributes only.
    let rebuilt = `<${tag}`;
    rebuilt += renderAttrs(attrs);

    // Force safe target/rel on anchors.
    if (tag === "a") {
      let hasTarget = false;
      let hasRel = false;
      for (const [name] of attrs) {
        if (name === "target") hasTarget = true;
        if (name === "rel") hasRel = true;
      }
      if (!hasTarget) rebuilt += ' target="_blank"';
      if (!hasRel) rebuilt += ' rel="noopener noreferrer"';
    }

    rebuilt += selfClosing ? " />" : ">";
    out += rebuilt;
    i = gt + 1;
  }
  return out;
}
