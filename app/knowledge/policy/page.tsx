// app/knowledge/policy/page.tsx
import { redirect } from "next/navigation";

// Optional: enforce static behavior
export const dynamic = "error";

export default function PolicyKnowledgePage() {
  // Redirect to your Ghost "Policy Desk" tag page
  redirect("https://knowledge.wildlandseco.com/tag/policy/");
}
