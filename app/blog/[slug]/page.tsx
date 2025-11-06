// app/blog/[slug]/page.tsx
import { allPosts } from "contentlayer/generated";
import { notFound } from "next/navigation";

import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";

import { mdxComponents } from "@/components/mdx-components";

export const dynamicParams = false;
export const dynamic = "error";   // ensure static on Vercel
export const revalidate = false;  // fully static

type Params = { slug: string };

export async function generateStaticParams() {
  // don't prebuild drafts
  return allPosts.filter((p) => !p.draft).map((p) => ({ slug: p.slug }));
}

export default function PostPage({ params }: { params: Params }) {
  const post = allPosts.find((p) => p.slug === params.slug && !p.draft);
  if (!post) return notFound();

  const components = mdxComponents();

  return (
    <article className="bg-white">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-10">
        <p className="text-xs uppercase tracking-wide text-emerald-700 mb-2">
          {post.category === "policy" ? "Policy & Landscape" : "For Landowners"}
        </p>

        <h1 className="text-3xl md:text-5xl font-bold tracking-tight">{post.title}</h1>
        <p className="text-sm text-gray-600 mt-2">
          {new Date(post.date).toLocaleDateString()}
        </p>

        {post.summary && <p className="text-gray-700 mt-4">{post.summary}</p>}

        {(post.thumbnail || post.image) && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={post.thumbnail || post.image!}
            alt={post.title}
            className="rounded-xl border my-6"
          />
        )}

        <div className="mt-6 prose prose-emerald max-w-none">
          <MDXRemote
            source={post.body.raw}
            components={components as any}
            options={{
              mdxOptions: {
                remarkPlugins: [remarkGfm],
                rehypePlugins: [rehypeSlug, [rehypeAutolinkHeadings, { behavior: "wrap" }]],
              },
            }}
          />
        </div>
      </div>
    </article>
  );
}
