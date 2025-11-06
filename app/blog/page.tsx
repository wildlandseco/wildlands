// app/blog/page.tsx
import { allPosts } from "contentlayer/generated";
import Link from "next/link";

function byDateDesc(a: any, b: any) {
  return new Date(b.date).getTime() - new Date(a.date).getTime();
}

export default function BlogIndex() {
  const posts = allPosts.filter((p) => !p.draft).sort(byDateDesc);

  return (
    <section className="bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((p) => (
            <Link
              key={p.slug}
              href={p.url}
              className="rounded-2xl overflow-hidden border bg-white shadow-sm hover:border-emerald-300"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              {p.thumbnail || p.image ? (
                <img
                  src={p.thumbnail || (p.image as string)}
                  alt={p.title}
                  className="aspect-[4/3] object-cover w-full"
                />
              ) : (
                <div className="aspect-[4/3] bg-emerald-50" />
              )}
              <div className="p-5">
                <p className="text-xs uppercase tracking-wide text-emerald-700 mb-1">
                  {p.category === "policy" ? "Policy & Landscape" : "For Landowners"}
                </p>
                <h2 className="font-semibold text-base">{p.title}</h2>
                <p className="text-xs text-gray-600 mt-1">
                  {new Date(p.date).toLocaleDateString()}
                </p>
                {p.summary && (
                  <p className="text-sm text-gray-700 mt-2 line-clamp-3">{p.summary}</p>
                )}
              </div>
            </Link>
          ))}
          {posts.length === 0 && (
            <p className="text-sm text-gray-600">No posts yet.</p>
          )}
        </div>
      </div>
    </section>
  );
}
