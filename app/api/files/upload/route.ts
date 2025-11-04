import { NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabaseServer'
import { randomUUID } from 'crypto'

export async function POST(req: Request) {
  const url = new URL(req.url)
  const project = url.searchParams.get('project')
  if (!project) return NextResponse.json({ ok:false, error:'Missing project' }, { status:400 })

  const supabase = supabaseServer()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ ok:false, error:'Unauthorized' }, { status:401 })

  const form = await req.formData()
  const file = form.get('file') as File | null
  const label = String(form.get('label') || '').slice(0,200)
  if (!file) return NextResponse.json({ ok:false, error:'No file' }, { status:400 })

  const ext = file.name.split('.').pop() || 'bin'
  const key = `projects/${project}/${randomUUID()}.${ext}`

  // upload to storage
  const { data: up, error: upErr } = await supabase.storage
    .from('project-files')
    .upload(key, file, { upsert: false, cacheControl: '3600' })
  if (upErr) return NextResponse.json({ ok:false, error:upErr.message }, { status:400 })

  // insert meta
  const { error: metaErr } = await supabase.from('files').insert({
    project_id: project, path: key, label, uploaded_by: user.id
  })
  if (metaErr) return NextResponse.json({ ok:false, error:metaErr.message }, { status:400 })

  return NextResponse.redirect(new URL(`/portal/projects/${project}`, req.url))
}
