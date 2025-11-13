// app/knowledge/field/page.tsx
import { redirect } from "next/navigation";
export const dynamic = "error";

export default function FieldKnowledgePage() {
  redirect("https://knowledge.wildlandseco.com/tag/field/");
}
