import Image from "next/image";
import type { MDXComponents } from "mdx/types";

export function mdxComponents(): MDXComponents {
  return {
    img: (props: any) => (
      <span className="block my-6">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img {...props} alt={props.alt ?? ""} className="rounded-xl border" />
      </span>
    ),
    a: (props: any) => (
      <a {...props} className="text-emerald-700 underline underline-offset-2" />
    ),
    h2: (props) => <h2 {...props} className="mt-10 text-2xl font-semibold" />,
    h3: (props) => <h3 {...props} className="mt-8 text-xl font-semibold" />,
    ul: (props) => <ul {...props} className="list-disc pl-6 my-4 space-y-1" />,
    ol: (props) => <ol {...props} className="list-decimal pl-6 my-4 space-y-1" />,
    p: (props) => <p {...props} className="my-4 leading-relaxed text-gray-800" />,
    blockquote: (props) => (
      <blockquote {...props} className="border-l-4 pl-4 italic text-gray-700 my-6" />
    ),
    Image,
  };
}
