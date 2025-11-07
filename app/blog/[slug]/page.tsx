// app/blog/[slug]/page.tsx
import { allPosts } from "contentlayer/generated";
import { notFound } from "next/navigation";
import Link from "next/link";

import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";

export const dynamic = "force-static";   // SSG
export const dynamicParams = true;       // allow request-time match as a fallback
export const revalidate = 60;            // small ISR window

type Params = { slug: string };

// non-drafts only
const POSTS = allPosts.filter((p) => !p.draft);

// ---- helpers ----
function cleanSlug(s: string | undefined | null): string {
  // tolerate undefined during certain Next prerender phases
  return (s ?? "").toString().trim().replace(/\s+/g, "-");
}

// ---- SSG params ----
export function generateStaticParams() {
  const slugs = POSTS.map((p) => ({ slug: p.slug }));
  console.log("[blog] Static slugs:", slugs.map((s) => s.slug));
  return slugs;
}

// ---- metadata ----
export function generateMetadata({ params }: { params?: Partial<Params> }) {
  const wanted = cleanSlug(params?.slug);
  if (!wanted) return {};

  const post = POSTS.find((p) => p.slug === wanted);
  if (!post) return {};

  const images = post.thumbnail ? [post.thumbnail] : post.image ? [post.image] : [];
  const description = post.description || post.summary || "";

  return {
    title: post.title,
    description,
    openGraph: {
      title: post.title,
      description,
      type: "article",
      url: `/blog/${post.slug}`,
      images,
    },
    twitter: {
      card: images.length ? "summary_large_image" : "summary",
      title: post.title,
      description,
      images,
    },
  };
}

// ---- MDX components ----
const MDXComponents: Record<string, React.ComponentType<any>> = {
  a: (props) => (
    <a
      {...props}
      className="text-emerald-700 underline underline-offset-2 hover:text-emerald-800"
      target={props.href?.startsWith("http") ? "_blank" : undefined}
      rel={props.href?.startsWith("http") ? "noopener noreferrer" : undefined}
    />
  ),
  pre: (props) => (
    <pre {...props} className="overflow-x-auto rounded-xl border bg-gray-50 p-4 text-sm" />
  ),
  code: (props) => <code {...props} className="rounded bg-gray-100 px-1 py-0.5" />,
  h2: (props) => <h2 {...props} className="mt-10 scroll-mt-24 text-2xl font-semibold" />,
  h3: (props) => <h3 {...props} className="mt-8 scroll-mt-24 text-xl font-semibold" />,
  ul: (props) => <ul {...props} className="list-disc pl-6" />,
  ol: (props) => <ol {...props} className="list-decimal pl-6" />,
  blockquote: (props) => (
    <blockquote
      {...props}
      className="border-l-4 border-emerald-600/40 pl-4 italic text-gray-700"
    />
  ),
};

// ---- page ----
export default function PostPage({ params }: { params?: Partial<Params> }) {
  const wanted = cleanSlug(params?.slug);
  if (!wanted) return notFound();

  const post = POSTS.find((p) => p.slug === wanted);
  if (!post) return notFound();

  return (
    <article className="bg-white">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-10">
        <nav className="mb-6 text-sm">
          <Link href="/blog" className="text-emerald-700 hover:underline">
            Blog
          </Link>
          <span className="mx-2 text-gray-400">/</span>
          <span className="text-gray-700">{post.title}</span>
        </nav>

        <p className="text-xs uppercase tracking-wide text-emerald-700 mb-2">
          {post.category === "policy" ? "Policy & Landscape" : "For Landowners"}
        </p>
        <h1 className="text-3xl md:text-5xl font-bold tracking-tight">{post.title}</h1>

        <div className="mt-3 text-sm text-gray-600 flex flex-wrap items-center gap-x-3 gap-y-1">
          <span>{new Date(post.date).toLocaleDateString()}</span>
          {post.author && (
            <>
              <span className="text-gray-300">•</span>
              <span>{post.author}</span>
            </>
          )}
          {(typeof post.readingTime === "number" || post.readingTimeMinutes) && (
            <>
              <span className="text-gray-300">•</span>
              <span>
                {Math.max(
                  1,
                  Math.ceil((post.readingTime as number) || post.readingTimeMinutes || 0)
                )}{" "}
                min read
              </span>
            </>
          )}
        </div>

        {(post.thumbnail || post.image) && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={post.thumbnail || (post.image as string)}
            alt={post.title}
            className="mt-6 aspect-[16/9] w-full rounded-2xl object-cover border"
          />
        )}

        {(post.description || post.summary) && (
          <p className="mt-6 text-lg text-gray-800">{post.description || post.summary}</p>
        )}

        <div className="prose prose-emerald max-w-none prose-headings:scroll-mt-24 mt-8">
          <MDXRemote
            source={post.body.raw}
            components={MDXComponents}
            options={{
              mdxOptions: {
                remarkPlugins: [remarkGfm],
                rehypePlugins: [rehypeSlug, [rehypeAutolinkHeadings, { behavior: "wrap" }]],
              },
            }}
          />
        </div>

        <div className="mt-12 border-t pt-6">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-emerald-700 hover:underline"
          >
            ← Back to all posts
          </Link>
        </div>
      </div>
    </article>
  );
}
