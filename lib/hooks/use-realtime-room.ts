'use client'

import { useEffect, useRef, useState } from 'react'
import type { RealtimeChannel } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase/client'

type PresenceMeta = { user_id: string; display_name: string }

export function useRealtimeRoom({
  channelId,
  currentUserId,
  onInsert,
  onUpdate,
  onDelete,
  onReactionChange,
}: {
  channelId: string
  currentUserId: string
  onInsert: (messageId: string) => void
  onUpdate: (messageId: string, patch: { content?: string; edited_at?: string | null }) => void
  onDelete: (messageId: string) => void
  onReactionChange: (messageId: string) => void
}) {
  const [onlineUserIds, setOnlineUserIds] = useState<string[]>([])
  const [typingUsers, setTypingUsers] = useState<string[]>([])
  const roomRef = useRef<RealtimeChannel | null>(null)
  const typingTimeouts = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map())
  const lastTypingSent = useRef(0)
  const displayNameRef = useRef<string>('')

  // Stable refs so the subscription effect doesn't churn
  const handlers = useRef({ onInsert, onUpdate, onDelete, onReactionChange })
  handlers.current = { onInsert, onUpdate, onDelete, onReactionChange }

  useEffect(() => {
    const supabase = createClient()
    let cancelled = false

    async function join() {
      // Fetch own display name once for presence/typing payloads
      if (!displayNameRef.current) {
        const { data } = await supabase
          .from('profiles')
          .select('display_name')
          .eq('id', currentUserId)
          .maybeSingle()
        displayNameRef.current = data?.display_name ?? 'Someone'
      }
      if (cancelled) return

      const room = supabase.channel(`room:${channelId}`, {
        config: { presence: { key: currentUserId }, broadcast: { self: false } },
      })

      room
        .on(
          'postgres_changes',
          { event: 'INSERT', schema: 'public', table: 'messages', filter: `channel_id=eq.${channelId}` },
          (payload) => handlers.current.onInsert(payload.new.id as string),
        )
        .on(
          'postgres_changes',
          { event: 'UPDATE', schema: 'public', table: 'messages', filter: `channel_id=eq.${channelId}` },
          (payload) =>
            handlers.current.onUpdate(payload.new.id as string, {
              content: payload.new.content as string,
              edited_at: payload.new.edited_at as string | null,
            }),
        )
        .on(
          'postgres_changes',
          { event: 'DELETE', schema: 'public', table: 'messages' },
          (payload) => handlers.current.onDelete(payload.old.id as string),
        )
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'message_reactions' },
          (payload) => {
            const messageId =
              ((payload.new as Record<string, unknown>)?.message_id as string) ??
              ((payload.old as Record<string, unknown>)?.message_id as string)
            if (messageId) handlers.current.onReactionChange(messageId)
          },
        )
        .on('presence', { event: 'sync' }, () => {
          const state = room.presenceState<PresenceMeta>()
          setOnlineUserIds(Object.keys(state))
        })
        .on('broadcast', { event: 'typing' }, ({ payload }) => {
          const { user_id, display_name } = payload as PresenceMeta
          if (user_id === currentUserId) return
          setTypingUsers((prev) =>
            prev.includes(display_name) ? prev : [...prev, display_name],
          )
          const timeouts = typingTimeouts.current
          const existing = timeouts.get(user_id)
          if (existing) clearTimeout(existing)
          timeouts.set(
            user_id,
            setTimeout(() => {
              setTypingUsers((prev) => prev.filter((n) => n !== display_name))
              timeouts.delete(user_id)
            }, 3000),
          )
        })
        .subscribe(async (status) => {
          if (status === 'SUBSCRIBED') {
            await room.track({
              user_id: currentUserId,
              display_name: displayNameRef.current,
            })
          }
        })

      roomRef.current = room
    }

    join()

    const timeouts = typingTimeouts.current
    return () => {
      cancelled = true
      timeouts.forEach((t) => clearTimeout(t))
      timeouts.clear()
      setTypingUsers([])
      setOnlineUserIds([])
      if (roomRef.current) {
        supabase.removeChannel(roomRef.current)
        roomRef.current = null
      }
    }
  }, [channelId, currentUserId])

  function broadcastTyping() {
    const now = Date.now()
    if (now - lastTypingSent.current < 1500) return
    lastTypingSent.current = now
    roomRef.current?.send({
      type: 'broadcast',
      event: 'typing',
      payload: { user_id: currentUserId, display_name: displayNameRef.current },
    })
  }

  return { onlineUserIds, typingUsers, broadcastTyping }
}
