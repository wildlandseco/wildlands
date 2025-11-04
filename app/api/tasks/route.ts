import { NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabaseServer'

export async function POST(req: Request) {
  const url = new URL(req.url)
  const project = url.searchParams.get('project')
  if (!project) return NextResponse.json({ ok:false, error:'Missing project' }, { status:400 })

  const form = await req.formData()
  const title = String(form.get('title') || '').slice(0,200)
  const details = String(form.get('details') || '').slice(0,5000)

  const supabase = supabaseServer()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ ok:false, error:'Unauthorized' }, { status:401 })

  const { error } = await supabase.from('tasks').insert({
    project_id: project, title, details, created_by: user.id
  })
  if (error) return NextResponse.json({ ok:false, error:error.message }, { status:400 })

  return NextResponse.redirect(new URL(`/portal/projects/${project}`, req.url))
}
