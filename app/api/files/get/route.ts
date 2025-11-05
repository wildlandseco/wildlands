import { NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabaseServer'

export async function GET(req: Request) {
  const url = new URL(req.url)
  const path = url.searchParams.get('path')
  if (!path) return NextResponse.json({ ok:false, error:'Missing path' }, { status:400 })

  const supabase = await supabaseServer()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ ok:false, error:'Unauthorized' }, { status:401 })

  // Generate a signed URL so the file remains private
  const { data, error } = await supabase
    .storage.from('project-files')
    .createSignedUrl(path, 60) // 60s link
  if (error) return NextResponse.json({ ok:false, error:error.message }, { status:400 })

  return NextResponse.redirect(data.signedUrl)
}
