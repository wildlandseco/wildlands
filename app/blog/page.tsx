import { allPosts } from "contentlayer/generated";
import Link from "next/link";

function byDateDesc(a: any, b: any) {
  return new Date(b.date).getTime() - new Date(a.date).getTime();
}

export default function BlogIndex({
  searchParams,
}: { searchParams?: { cat?: string } }) {
  const cat = searchParams?.cat === "policy" ? "policy" : searchParams?.cat === "landowners" ? "landowners" : undefined;

  const posts = allPosts
    .filter((p) => !p.draft)
    .filter((p) => (cat ? p.category === cat : true))
    .sort(byDateDesc);

  return (
    <section className="bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        {/* Category filters */}
        <div className="flex items-center gap-2 mb-6">
          <Link
            href="/blog"
            className={`rounded-full border px-3 py-1 text-sm ${!cat ? "bg-emerald-700 text-white border-emerald-700" : "bg-white text-gray-800 hover:border-emerald-300"}`}
          >
            All
          </Link>
          <Link
            href="/blog?cat=landowners"
            className={`rounded-full border px-3 py-1 text-sm ${cat === "landowners" ? "bg-emerald-700 text-white border-emerald-700" : "bg-white text-gray-800 hover:border-emerald-300"}`}
          >
            For Landowners
          </Link>
          <Link
            href="/blog?cat=policy"
            className={`rounded-full border px-3 py-1 text-sm ${cat === "policy" ? "bg-emerald-700 text-white border-emerald-700" : "bg-white text-gray-800 hover:border-emerald-300"}`}
          >
            Policy & Landscape
          </Link>
        </div>

        {/* Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((p) => (
            <Link
              key={p.slug}
              href={p.url}
              className="rounded-2xl overflow-hidden border bg-white shadow-sm hover:border-emerald-300"
            >
              {p.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={p.image} alt={p.title} className="aspect-[4/3] object-cover w-full" />
              ) : (
                <div className="aspect-[4/3] bg-emerald-50" />
              )}
              <div className="p-5">
                <p className="text-xs uppercase tracking-wide text-emerald-700 mb-1">
                  {p.category === "policy" ? "Policy & Landscape" : "For Landowners"}
                </p>
                <h2 className="font-semibold text-base">{p.title}</h2>
                <p className="text-xs text-gray-600 mt-1">{new Date(p.date).toLocaleDateString()}</p>
                <p className="text-sm text-gray-700 mt-2 line-clamp-3">{p.summary}</p>
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
