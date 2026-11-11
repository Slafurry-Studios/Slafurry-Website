import { getPublishedPosts } from "@/lib/queries/posts";
import { NextResponse } from "next/server";

const SITE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://slafurystudios.com";

export async function GET() {
  const posts = await getPublishedPosts("DEVLOG", 20);

  const items = posts
    .map(
      (post) => `
    <item>
      <title>${post.title}</title>
      <description>${post.excerpt}</description>
      <link>${SITE_URL}/en/devlog/${post.slug}</link>
      <guid>${SITE_URL}/en/devlog/${post.slug}</guid>
      <pubDate>${post.publishedAt ? new Date(post.publishedAt).toUTCString() : new Date().toUTCString()}</pubDate>
    </item>`
    )
    .join("");

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
    <rss version="2.0">
      <channel>
        <title>Slafurry Studios - Devlog</title>
        <description>Development blog for Slafurry Studios games</description>
        <link>${SITE_URL}/en/devlog</link>
        <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
        ${items}
      </channel>
    </rss>`;

  return new NextResponse(rss, {
    headers: {
      "Content-Type": "application/rss+xml",
    },
  });
}