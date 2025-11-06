import { allPosts } from "contentlayer/generated";
import { notFound } from "next/navigation";
import { useMDXComponent } from "@contentlayer/react";;
import { mdxComponents } from "@/components/mdx-components";

export const dynamicParams = false;

export async function generateStaticParams() {
  return allPosts.map((p) => ({ slug: p.slug }));
}

export default function PostPage({ params }: { params: { slug: string } }) {
  const post = allPosts.find((p) => p.slug === params.slug);
  if (!post || post.draft) return notFound();

  const MDXContent = useMDXComponent(post.body.code);
  const components = mdxComponents();

  return (
    <article className="bg-white">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-10">
        <p className="text-xs uppercase tracking-wide text-emerald-700 mb-2">
          {post.category === "policy" ? "Policy & Landscape" : "For Landowners"}
        </p>
        <h1 className="text-3xl md:text-5xl font-bold tracking-tight">{post.title}</h1>
        <p className="text-sm text-gray-600 mt-2">{new Date(post.date).toLocaleDateString()}</p>
        {post.summary && <p className="text-gray-700 mt-4">{post.summary}</p>}
        {post.image && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={post.image} alt={post.title} className="rounded-xl border my-6" />
        )}

        <div className="mt-6">
          <MDXContent components={components as any} />
        </div>
      </div>
    </article>
  );
}
