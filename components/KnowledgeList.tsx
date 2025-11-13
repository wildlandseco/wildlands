/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import type { GhostPost } from "@/lib/ghost";

export default function KnowledgeList({ posts }: { posts: GhostPost[] }) {
  function fmtDate(d: string) {
    const date = new Date(d);
    return isNaN(date.getTime())
      ? ""
      : date.toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" });
  }

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
      {posts.map((p) => (
        <a
          key={p.id}
          href={p.link}
          className="rounded-2xl overflow-hidden border bg-white shadow-sm hover:border-emerald-300"
          target="_blank"
          rel="noopener noreferrer"
        >
          {p.image ? (
            <img src={p.image} alt={p.title} className="aspect-[4/3] object-cover w-full" />
          ) : (
            <div className="aspect-[4/3] bg-emerald-50" />
          )}
          <div className="p-5">
            <p className="text-xs uppercase tracking-wide text-emerald-700 mb-1">
              {p.tags?.[0] || "Article"}
            </p>
            <h2 className="font-semibold text-base">{p.title}</h2>
            <p className="text-xs text-gray-600 mt-1">{fmtDate(p.publishedAt)}</p>
            {p.excerpt && (
              <p className="text-sm text-gray-700 mt-2 line-clamp-3">{p.excerpt}</p>
            )}
          </div>
        </a>
      ))}
      {posts.length === 0 && (
        <div className="rounded-xl border p-6">
          <p className="text-sm text-gray-700">
            No posts yet. Once you publish on Ghost, they’ll appear here automatically.
          </p>
          <p className="text-xs text-gray-500 mt-2">(We refresh every 10 minutes.)</p>
        </div>
      )}
    </div>
  );
}
