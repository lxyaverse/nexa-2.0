import { notFound, redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { ChatRoom } from '@/components/chat/chat-room'
import type { MessageWithAuthor } from '@/lib/types'

export default async function ChannelPage({
  params,
}: {
  params: Promise<{ name: string }>
}) {
  const { name } = await params
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: channel } = await supabase
    .from('channels')
    .select('*')
    .eq('name', decodeURIComponent(name))
    .maybeSingle()

  if (!channel) notFound()

  // Auto-join public channels on first visit
  const { data: membership } = await supabase
    .from('channel_members')
    .select('channel_id')
    .eq('channel_id', channel.id)
    .eq('user_id', user.id)
    .maybeSingle()

  if (!membership) {
    if (channel.type !== 'public') notFound()
    await supabase
      .from('channel_members')
      .insert({ channel_id: channel.id, user_id: user.id })
  }

  const { data: messages, error: msgError } = await supabase
    .from('messages')
    .select('*, author:profiles!messages_user_id_fkey(*), reactions:message_reactions(*)')
    .eq('channel_id', channel.id)
    .order('created_at', { ascending: false })
    .limit(80)



  const initialMessages = ((messages as MessageWithAuthor[]) ?? []).reverse()

  return (
    <ChatRoom
      channel={channel}
      initialMessages={initialMessages}
      currentUserId={user.id}
      title={`#${channel.name}`}
      subtitle={channel.description || 'Public channel'}
    />
  )
}
