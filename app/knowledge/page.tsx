import { getGhostPosts } from "@/lib/ghost";
import KnowledgeList from "@/components/KnowledgeList";

export const dynamic = "force-static";
export const revalidate = 600;

export const metadata = {
  title: "Knowledge — Wild Lands",
  description: "Field notes, policy analysis, and podcasts from Wild Lands.",
};

export default async function KnowledgeIndex() {
  const posts = await getGhostPosts(18, { revalidate: 600 });
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Knowledge</h1>
        <p className="text-gray-600 mt-2">All posts from our publication.</p>

        <div className="mt-6 flex gap-2 text-sm">
          <a href="/knowledge/field" className="rounded-full border px-3 py-1 hover:border-emerald-300">
            Field
          </a>
          <a href="/knowledge/policy" className="rounded-full border px-3 py-1 hover:border-emerald-300">
            Policy
          </a>
          <a href="/knowledge/podcasts" className="rounded-full border px-3 py-1 hover:border-emerald-300">
            Podcasts
          </a>
        </div>

        <KnowledgeList posts={posts} />
      </div>
    </section>
  );
}
