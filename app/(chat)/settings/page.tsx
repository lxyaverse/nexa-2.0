import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { ProfileForm } from '@/components/chat/profile-form'
import type { Profile } from '@/lib/types'

export default async function SettingsPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()
  if (!profile) redirect('/login')

  return (
    <div className="flex h-full flex-col">
      <header className="flex h-14 shrink-0 items-center border-b border-border bg-card px-4">
        <h1 className="text-sm font-semibold text-foreground">Profile settings</h1>
      </header>
      <div className="flex-1 overflow-y-auto p-6">
        <div className="mx-auto w-full max-w-lg">
          <ProfileForm profile={profile as Profile} email={user.email ?? ''} />
        </div>
      </div>
    </div>
  )
}
