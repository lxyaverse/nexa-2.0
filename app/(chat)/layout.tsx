import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { AppSidebar } from '@/components/chat/app-sidebar'
import { PresenceProvider } from '@/components/chat/presence-context'
import type { Channel, DmChannel, Profile } from '@/lib/types'

export default async function ChatLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const [{ data: profile }, { data: channels }, { data: memberships }] = await Promise.all([
    supabase.from('profiles').select('*').eq('id', user.id).single(),
    supabase.from('channels').select('*').neq('type', 'dm').order('name'),
    supabase
      .from('channel_members')
      .select('channel_id, channels!inner(id, name, description, type, created_by, created_at)')
      .eq('user_id', user.id),
  ])

  if (!profile) redirect('/login')

  const memberChannelIds = new Set((memberships ?? []).map((m) => m.channel_id))
  const dmChannelIds = (memberships ?? [])
    .filter((m) => (m.channels as unknown as Channel).type === 'dm')
    .map((m) => m.channel_id)

  // resolve DM partners
  let dms: DmChannel[] = []
  if (dmChannelIds.length > 0) {
    const { data: dmMembers } = await supabase
      .from('channel_members')
      .select('channel_id, profiles!inner(*)')
      .in('channel_id', dmChannelIds)
      .neq('user_id', user.id)

    dms = (dmMembers ?? []).map((m) => {
      const channel = (memberships ?? []).find((x) => x.channel_id === m.channel_id)
        ?.channels as unknown as Channel
      return { ...channel, other: m.profiles as unknown as Profile }
    })
  }

  return (
    <PresenceProvider userId={user.id}>
      <div className="flex h-svh overflow-hidden bg-background">
        <AppSidebar
          profile={profile as Profile}
          channels={(channels ?? []) as Channel[]}
          memberChannelIds={[...memberChannelIds]}
          dms={dms}
        />
        <main className="flex min-w-0 flex-1 flex-col">{children}</main>
      </div>
    </PresenceProvider>
  )
}
