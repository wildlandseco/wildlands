import { getGhostPosts } from "@/lib/ghost";
import KnowledgeList from "@/components/KnowledgeList";

export const dynamic = "force-static";
export const revalidate = 600;

export const metadata = {
  title: "Field — Wild Lands Knowledge",
  description: "Practical field notes, methods, and stewardship techniques.",
};

export default async function FieldPage() {
  const posts = await getGhostPosts(18, { tag: "field", revalidate: 600 });
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Field</h1>
        <p className="text-gray-600 mt-2">Hands-on stewardship and methods.</p>
        <KnowledgeList posts={posts} />
      </div>
    </section>
  );
}
