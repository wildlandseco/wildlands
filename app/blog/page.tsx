// app/blog/[slug]/page.tsx
import { allPosts } from "contentlayer/generated";
import { notFound } from "next/navigation";
import Link from "next/link";

import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";

export const dynamic = "error";
export const revalidate = false;

type Params = { slug: string };

function getPostBySlug(slug: string) {
  return allPosts.find((p) => p.slug === slug && !p.draft);
}

export function generateStaticParams() {
  return allPosts.filter((p) => !p.draft).map((p) => ({ slug: p.slug }));
}

export function generateMetadata({ params }: { params: Params }) {
  const post = getPostBySlug(params.slug);
  if (!post) return {};

  const title = post.title;
  const description = post.description || post.summary;
  const images = post.thumbnail ? [post.thumbnail] : post.image ? [post.image] : [];

  return {
    title,
    description,
    openGraph: { title, description, type: "article", url: post.url, images },
    twitter: {
      card: images.length ? "summary_large_image" : "summary",
      title,
      description,
      images,
    },
  };
}

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
    <blockquote {...props} className="border-l-4 border-emerald-600/40 pl-4 italic text-gray-700" />
  ),
};

function fmtDate(d: string | Date) {
  try {
    return new Date(d).toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" });
  } catch {
    return String(d);
  }
}

export default function BlogPostPage({ params }: { params: Params }) {
  const post = getPostBySlug(params.slug);
  if (!post) return notFound();

  // prefer frontmatter readingTime if provided, else computed
  const minutes =
    typeof post.readingTime === "number" && post.readingTime > 0
      ? Math.ceil(post.readingTime)
      : Math.max(1, post.readingTimeMinutes || 0);

  const categoryLabel = post.category === "policy" ? "Policy & Landscape" : "For Landowners";
  const author = post.author || "Wildlands Eco";

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

        <p className="text-xs uppercase tracking-wide text-emerald-700 mb-2">{categoryLabel}</p>
        <h1 className="text-3xl font-bold leading-tight">{post.title}</h1>

        <div className="mt-3 text-sm text-gray-600 flex flex-wrap items-center gap-x-3 gap-y-1">
          <span>{fmtDate(post.date)}</span>
          <span className="text-gray-300">•</span>
          <span>{author}</span>
          {minutes > 0 && (
            <>
              <span className="text-gray-300">•</span>
              <span>{minutes} min read</span>
            </>
          )}
        </div>

        {(post.thumbnail || post.image) && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={post.thumbnail || post.image!}
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
          <Link href="/blog" className="inline-flex items-center gap-2 text-emerald-700 hover:underline">
            ← Back to all posts
          </Link>
        </div>
      </div>
    </article>
  );
}
