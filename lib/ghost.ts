import { XMLParser } from "fast-xml-parser";

export type GhostPost = {
  id: string;
  title: string;
  link: string;
  publishedAt: string;
  author?: string;
  excerpt?: string;
  image?: string;
  tags?: string[];
};

function stripHtml(html: string) {
  return html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

function firstImageFromHtml(html: string): string | undefined {
  const match = html.match(/<img[^>]+src=["']([^"']+)["']/i);
  return match?.[1];
}

// Builds an RSS URL; if tag provided, uses /tag/<slug>/rss/
function rssUrlFor(tag?: string) {
  const base = process.env.GHOST_BASE_URL?.replace(/\/+$/, "");
  if (!base) throw new Error("Missing GHOST_BASE_URL");
  return tag ? `${base}/tag/${encodeURIComponent(tag)}/rss/` : `${base}/rss/`;
}

export async function getGhostPosts(
  limit = 12,
  opts?: { tag?: string; revalidate?: number }
): Promise<GhostPost[]> {
  const url = rssUrlFor(opts?.tag);
  const res = await fetch(url, { next: { revalidate: opts?.revalidate ?? 600 } });
  if (!res.ok) throw new Error(`RSS fetch failed: ${res.status} for ${url}`);

  const xml = await res.text();
  const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: "",
    removeNSPrefix: true,
  });
  const data = parser.parse(xml);

  const items = Array.isArray(data?.rss?.channel?.item)
    ? data.rss.channel.item
    : data?.rss?.channel?.item
    ? [data.rss.channel.item]
    : [];

  const posts: GhostPost[] = items.slice(0, limit).map((item: any) => {
    const contentEncoded: string = item["content:encoded"] ?? "";
    const description: string = item.description ?? "";
    const rawExcerpt = stripHtml(contentEncoded || description);
    const excerpt = rawExcerpt.length > 280 ? rawExcerpt.slice(0, 277) + "…" : rawExcerpt;

    const mediaContent = item?.media?.content?.url || item?.enclosure?.url;
    const image = mediaContent || firstImageFromHtml(contentEncoded || description);

    const tags = Array.isArray(item.category)
      ? item.category
      : item.category
      ? [item.category]
      : [];

    return {
      id: item.guid?._ || item.guid || item.link,
      title: item.title,
      link: item.link,
      publishedAt: item.pubDate,
      author: item["dc:creator"] || undefined,
      excerpt,
      image,
      tags,
    };
  });

  return posts;
}
