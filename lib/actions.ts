'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

async function requireUser() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')
  return { supabase, user }
}

export async function sendMessage(channelId: string, content: string) {
  const { supabase, user } = await requireUser()
  const trimmed = content.trim()
  if (!trimmed) return { error: 'Message is empty' }
  if (trimmed.length > 4000) return { error: 'Message too long' }

  const { data, error } = await supabase
    .from('messages')
    .insert({
      channel_id: channelId,
      user_id: user.id,
      content: trimmed,
    })
    .select('id')
    .single()
  if (error) return { error: error.message, id: null }
  return { error: null, id: data.id as string }
}

export async function editMessage(messageId: string, content: string) {
  const { supabase, user } = await requireUser()
  const trimmed = content.trim()
  if (!trimmed) return { error: 'Message is empty' }

  const { error } = await supabase
    .from('messages')
    .update({ content: trimmed, edited_at: new Date().toISOString() })
    .eq('id', messageId)
    .eq('user_id', user.id)
  if (error) return { error: error.message }
  return { error: null }
}

export async function deleteMessage(messageId: string) {
  const { supabase, user } = await requireUser()
  const { error } = await supabase
    .from('messages')
    .delete()
    .eq('id', messageId)
    .eq('user_id', user.id)
  if (error) return { error: error.message }
  return { error: null }
}

export async function toggleReaction(messageId: string, emoji: string) {
  const { supabase, user } = await requireUser()

  const { data: existing } = await supabase
    .from('message_reactions')
    .select('emoji')
    .eq('message_id', messageId)
    .eq('user_id', user.id)
    .eq('emoji', emoji)
    .maybeSingle()

  if (existing) {
    const { error } = await supabase
      .from('message_reactions')
      .delete()
      .eq('message_id', messageId)
      .eq('user_id', user.id)
      .eq('emoji', emoji)
    if (error) return { error: error.message }
  } else {
    const { error } = await supabase.from('message_reactions').insert({
      message_id: messageId,
      user_id: user.id,
      emoji,
    })
    if (error) return { error: error.message }
  }
  return { error: null }
}

export async function createChannel(formData: FormData) {
  const { supabase, user } = await requireUser()
  const rawName = String(formData.get('name') ?? '')
  const description = String(formData.get('description') ?? '').trim()
  const isPrivate = formData.get('private') === 'on'

  const name = rawName
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9\-_.]/g, '')
  if (name.length < 2) return { error: 'Channel name must be at least 2 characters' }

  const { data: channel, error } = await supabase
    .from('channels')
    .insert({
      name,
      description,
      type: isPrivate ? 'private' : 'public',
      created_by: user.id,
    })
    .select('id, name')
    .single()
  if (error) {
    return { error: error.code === '23505' ? 'A channel with that name already exists' : error.message }
  }

  await supabase.from('channel_members').insert({ channel_id: channel.id, user_id: user.id })
  revalidatePath('/', 'layout')
  redirect(`/channel/${channel.name}`)
}

export async function joinChannel(channelId: string) {
  const { supabase, user } = await requireUser()
  const { error } = await supabase
    .from('channel_members')
    .upsert({ channel_id: channelId, user_id: user.id })
  if (error) return { error: error.message }
  revalidatePath('/', 'layout')
  return { error: null }
}

export async function leaveChannel(channelId: string) {
  const { supabase, user } = await requireUser()
  const { error } = await supabase
    .from('channel_members')
    .delete()
    .eq('channel_id', channelId)
    .eq('user_id', user.id)
  if (error) return { error: error.message }
  revalidatePath('/', 'layout')
  redirect('/')
}

export async function startDm(otherUserId: string) {
  const { supabase, user } = await requireUser()
  if (otherUserId === user.id) return { error: 'You cannot message yourself' }

  // find an existing DM containing both users
  const { data: myDms } = await supabase
    .from('channel_members')
    .select('channel_id, channels!inner(type)')
    .eq('user_id', user.id)
    .eq('channels.type', 'dm')

  if (myDms && myDms.length > 0) {
    const ids = myDms.map((m) => m.channel_id)
    const { data: shared } = await supabase
      .from('channel_members')
      .select('channel_id')
      .eq('user_id', otherUserId)
      .in('channel_id', ids)
      .limit(1)
    if (shared && shared.length > 0) {
      redirect(`/dm/${shared[0].channel_id}`)
    }
  }

  const { data: channel, error } = await supabase
    .from('channels')
    .insert({ type: 'dm', created_by: user.id })
    .select('id')
    .single()
  if (error) return { error: error.message }

  const { error: memberError } = await supabase.from('channel_members').insert([
    { channel_id: channel.id, user_id: user.id },
    { channel_id: channel.id, user_id: otherUserId },
  ])
  if (memberError) return { error: memberError.message }

  revalidatePath('/', 'layout')
  redirect(`/dm/${channel.id}`)
}

export async function updateProfile(formData: FormData) {
  const { supabase, user } = await requireUser()
  const displayName = String(formData.get('display_name') ?? '').trim()
  const statusText = String(formData.get('status_text') ?? '').trim()
  if (!displayName) return { error: 'Display name is required' }

  const { error } = await supabase
    .from('profiles')
    .update({ display_name: displayName, status_text: statusText })
    .eq('id', user.id)
  if (error) return { error: error.message }
  revalidatePath('/', 'layout')
  return { error: null }
}

export async function signOut() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/login')
}
