import { notFound, redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { ChatRoom } from '@/components/chat/chat-room'
import type { MessageWithAuthor, Profile } from '@/lib/types'

export default async function DmPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: channel } = await supabase
    .from('channels')
    .select('*')
    .eq('id', id)
    .eq('type', 'dm')
    .maybeSingle()

  if (!channel) notFound()

  // Must be a member of the DM
  const { data: members } = await supabase
    .from('channel_members')
    .select('user_id, profile:profiles(*)')
    .eq('channel_id', channel.id)

  const isMember = members?.some((m) => m.user_id === user.id)
  if (!isMember) notFound()

  const other = members?.find((m) => m.user_id !== user.id)
  const otherProfile = (other?.profile as unknown as Profile) ?? null

  const { data: messages } = await supabase
    .from('messages')
    .select('*, author:profiles(*), reactions:message_reactions(*)')
    .eq('channel_id', channel.id)
    .order('created_at', { ascending: false })
    .limit(80)

  const initialMessages = ((messages as MessageWithAuthor[]) ?? []).reverse()

  return (
    <ChatRoom
      channel={channel}
      initialMessages={initialMessages}
      currentUserId={user.id}
      title={otherProfile?.display_name ?? 'Direct message'}
      subtitle={otherProfile ? `@${otherProfile.username}` : 'Private conversation'}
      dmPartner={otherProfile}
    />
  )
}
