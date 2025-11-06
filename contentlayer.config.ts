import { defineDocumentType, makeSource } from "contentlayer/source-files";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import remarkGfm from "remark-gfm";
import readingTime from "reading-time";

/**
 * Post
 * - Preserves your existing front matter (title, date, summary, category, image, draft, tags)
 * - Adds optional: description, author, readingTime (front-matter override), thumbnail
 * - Computes: slug, url, cover, readingTimeMinutes (fallback if front-matter readingTime not provided)
 */
export const Post = defineDocumentType(() => ({
  name: "Post",
  filePathPattern: `blog/**/*.mdx`,
  contentType: "mdx",
  fields: {
    title: { type: "string", required: true },
    date: { type: "date", required: true },
    summary: { type: "string", required: true },

    // Taxonomy (preserved)
    category: {
      type: "enum",
      options: ["landowners", "policy"],
      required: true,
    },

    // Back-compat
    image: { type: "string", required: false },

    // New optional metadata
    description: { type: "string", required: false },
    author: { type: "string", required: false },
    // If you include readingTime in front matter (e.g., 6), we'll use it.
    readingTime: { type: "number", required: false },
    thumbnail: { type: "string", required: false },

    draft: { type: "boolean", default: false },
    tags: { type: "list", of: { type: "string" } },
  },
  computedFields: {
    slug: {
      type: "string",
      // file name without directories: blog/landowners/my-post.mdx -> my-post
      resolve: (doc) => doc._raw.flattenedPath.split("/").slice(-1)[0],
    },
    url: {
      type: "string",
      resolve: (doc) => `/blog/${doc._raw.flattenedPath.split("/").slice(-1)[0]}`,
    },
    // Prefer thumbnail, fall back to image
    cover: {
      type: "string",
      resolve: (doc) => doc.thumbnail || doc.image || "",
    },
    // Auto-computed reading time (minutes, rounded up)
    readingTimeMinutes: {
      type: "number",
      resolve: (doc) => {
        try {
          const rt = readingTime((doc as any).body?.raw || "");
          return Math.ceil(rt.minutes || 0);
        } catch {
          return 0;
        }
      },
    },
  },
}));

export default makeSource({
  contentDirPath: "content",
  documentTypes: [Post],
  mdx: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [
      rehypeSlug,
      [rehypeAutolinkHeadings, { behavior: "wrap" }],
    ],
  },
});
