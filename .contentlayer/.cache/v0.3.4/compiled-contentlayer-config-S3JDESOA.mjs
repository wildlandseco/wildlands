// contentlayer.config.ts
import { defineDocumentType, makeSource } from "contentlayer/source-files";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import remarkGfm from "remark-gfm";
import readingTime from "reading-time";
var Post = defineDocumentType(() => ({
  name: "Post",
  filePathPattern: `blog/**/*.{md,mdx}`,
  // supports mdx (and md if you add any)
  contentType: "mdx",
  fields: {
    title: { type: "string", required: true },
    date: { type: "date", required: true },
    summary: { type: "string", required: true },
    // taxonomy
    category: { type: "enum", options: ["landowners", "policy"], required: true },
    // legacy
    image: { type: "string", required: false },
    // optional metadata
    description: { type: "string", required: false },
    author: { type: "string", required: false },
    readingTime: { type: "number", required: false },
    thumbnail: { type: "string", required: false },
    draft: { type: "boolean", default: false },
    tags: { type: "list", of: { type: "string" } }
  },
  computedFields: {
    slug: {
      type: "string",
      resolve: (doc) => {
        const p = doc._raw.flattenedPath.replace(/^blog\//, "");
        const parts = p.split("/").filter(Boolean);
        const last = parts[parts.length - 1];
        return last === "index" ? parts[parts.length - 2] : last;
      }
    },
    url: {
      type: "string",
      resolve: (doc) => `/blog/${doc.slug}`
    },
    // Prefer thumbnail, fall back to image
    cover: {
      type: "string",
      resolve: (doc) => doc.thumbnail || doc.image || ""
    },
    // Auto-computed reading time fallback (minutes, rounded up)
    readingTimeMinutes: {
      type: "number",
      resolve: (doc) => {
        try {
          const rt = readingTime(doc.body?.raw || "");
          return Math.ceil(rt.minutes || 0);
        } catch {
          return 0;
        }
      }
    }
  }
}));
var contentlayer_config_default = makeSource({
  contentDirPath: "content",
  documentTypes: [Post],
  mdx: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [rehypeSlug, [rehypeAutolinkHeadings, { behavior: "wrap" }]]
  }
});
export {
  Post,
  contentlayer_config_default as default
};
//# sourceMappingURL=compiled-contentlayer-config-S3JDESOA.mjs.map
