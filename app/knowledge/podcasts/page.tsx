// app/knowledge/podcast/page.tsx
import { redirect } from "next/navigation";
export const dynamic = "error";

export default function PodcastKnowledgePage() {
  redirect("https://knowledge.wildlandseco.com/tag/podcast/");
}
