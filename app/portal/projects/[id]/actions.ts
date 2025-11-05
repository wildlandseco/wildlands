// app/portal/projects/[id]/actions.ts
"use server";

import { redirect } from "next/navigation";
import { supabaseServer } from "@/lib/supabaseServer";

// Seeds a baseline task/practice set for a project.
// Adjust table/column names to your schema as needed.
export async function applyPlaybook(formData: FormData) {
  const projectId = (formData.get("project_id") as string) || "";
  if (!projectId) redirect(`/portal/projects?seed=err`);

  const supabase = supabaseServer();

  try {
    const tasksSeed = [
      { project_id: projectId, title: "Kickoff: site walk & baseline inventory", status: "todo" },
      { project_id: projectId, title: "Soils & hydrology review", status: "todo" },
      { project_id: projectId, title: "Set success metrics (veg strata/species/water)", status: "todo" },
      { project_id: projectId, title: "Draft plan & budget", status: "todo" },
      { project_id: projectId, title: "Contractor sourcing & schedule", status: "todo" },
    ];

    const practicesSeed = [
      { project_id: projectId, name: "Prescribed Fire (seasonal)", frequency: "seasonal" },
      { project_id: projectId, name: "Selective thinning / disking", frequency: "as-needed" },
      { project_id: projectId, name: "Hydrologic reconnection", frequency: "one-time" },
      { project_id: projectId, name: "Monitoring & reporting", frequency: "quarterly" },
    ];

    const { error: tErr } = await supabase.from("tasks").insert(tasksSeed);
    if (tErr) throw tErr;

    const { error: pErr } = await supabase.from("practices").insert(practicesSeed);
    if (pErr) throw pErr;

    redirect(`/portal/projects/${projectId}?seed=ok`);
  } catch (e) {
    console.error("applyPlaybook error:", e);
    redirect(`/portal/projects/${projectId}?seed=err`);
  }
}
