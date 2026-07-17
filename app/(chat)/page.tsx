import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export default async function HomePage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  // Send the user to #general (or the first public channel available)
  const { data: general } = await supabase
    .from('channels')
    .select('name')
    .eq('type', 'public')
    .order('created_at', { ascending: true })
    .limit(1)
    .maybeSingle()

  if (general?.name) redirect(`/channel/${general.name}`)

  redirect('/channel/general')
}
