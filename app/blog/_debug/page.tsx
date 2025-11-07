// app/blog/_debug/page.tsx
import { allPosts } from "contentlayer/generated";
import Link from "next/link";

export const dynamic = "force-static";
export const revalidate = 0;

export default function BlogDebug() {
  const posts = allPosts.filter((p) => !p.draft);
  return (
    <main style={{ padding: 24, fontFamily: "ui-sans-serif, system-ui" }}>
      <h1>Blog Debug</h1>
      <p>Posts length: {posts.length}</p>
      <ul style={{ marginTop: 12 }}>
        {posts.map((p) => (
          <li key={p.slug}>
            <code>{p.slug}</code>{" "}
            <Link href={`/blog/${p.slug}`} style={{ color: "#047857" }}>
              open
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
