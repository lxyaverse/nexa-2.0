'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { Hash, Lock, MessageCircle } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { UserAvatar } from '@/components/chat/user-avatar'
import { MessageItem } from '@/components/chat/message-item'
import { MessageComposer } from '@/components/chat/message-composer'
import { useRealtimeRoom } from '@/lib/hooks/use-realtime-room'
import type { Channel, MessageWithAuthor, Profile } from '@/lib/types'

export function ChatRoom({
  channel,
  initialMessages,
  currentUserId,
  title,
  subtitle,
  dmPartner,
}: {
  channel: Channel
  initialMessages: MessageWithAuthor[]
  currentUserId: string
  title: string
  subtitle: string
  dmPartner?: Profile | null
}) {
  const [messages, setMessages] = useState<MessageWithAuthor[]>(initialMessages)
  const scrollRef = useRef<HTMLDivElement>(null)
  const supabase = createClient()

  // Keep state in sync when navigating between rooms
  useEffect(() => {
    setMessages(initialMessages)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [channel.id])

  const handleInsert = useCallback(
    async (messageId: string) => {
      const { data } = await supabase
        .from('messages')
        .select('*, author:profiles(*), reactions:message_reactions(*)')
        .eq('id', messageId)
        .maybeSingle()
      if (data) {
        setMessages((prev) =>
          prev.some((m) => m.id === data.id) ? prev : [...prev, data as MessageWithAuthor],
        )
      }
    },
    [supabase],
  )

  const handleUpdate = useCallback(
    (messageId: string, patch: { content?: string; edited_at?: string | null }) => {
      setMessages((prev) =>
        prev.map((m) => (m.id === messageId ? { ...m, ...patch } : m)),
      )
    },
    [],
  )

  const handleDelete = useCallback((messageId: string) => {
    setMessages((prev) => prev.filter((m) => m.id !== messageId))
  }, [])

  const handleReactionChange = useCallback(
    async (messageId: string) => {
      const { data } = await supabase
        .from('message_reactions')
        .select('*')
        .eq('message_id', messageId)
      setMessages((prev) =>
        prev.map((m) =>
          m.id === messageId ? { ...m, reactions: data ?? [] } : m,
        ),
      )
    },
    [supabase],
  )

  const { onlineUserIds, typingUsers, broadcastTyping } = useRealtimeRoom({
    channelId: channel.id,
    currentUserId,
    onInsert: handleInsert,
    onUpdate: handleUpdate,
    onDelete: handleDelete,
    onReactionChange: handleReactionChange,
  })

  // Auto-scroll to the latest message
  useEffect(() => {
    const el = scrollRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [messages.length, typingUsers.length])

  const Icon =
    channel.type === 'dm' ? MessageCircle : channel.type === 'private' ? Lock : Hash

  return (
    <div className="flex h-full min-w-0 flex-1 flex-col">
      {/* Room header */}
      <header className="flex h-14 shrink-0 items-center gap-3 border-b border-border bg-card px-4">
        {dmPartner ? (
          <UserAvatar
            name={dmPartner.display_name}
            size="md"
            online={onlineUserIds.includes(dmPartner.id)}
          />
        ) : (
          <span className="flex size-8 items-center justify-center rounded-md bg-primary/10 text-primary">
            <Icon className="size-4" aria-hidden="true" />
          </span>
        )}
        <div className="min-w-0">
          <h1 className="truncate text-sm font-semibold text-foreground">{title}</h1>
          <p className="truncate text-xs text-muted-foreground">{subtitle}</p>
        </div>
      </header>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4">
        {messages.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center gap-2 text-center">
            <span className="flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Icon className="size-6" aria-hidden="true" />
            </span>
            <p className="text-sm font-medium text-foreground">No messages yet</p>
            <p className="max-w-xs text-xs leading-relaxed text-muted-foreground">
              {channel.type === 'dm'
                ? 'Say hello and start the conversation.'
                : `Be the first to post in ${title}.`}
            </p>
          </div>
        ) : (
          <ol className="flex flex-col gap-1" aria-label="Messages">
            {messages.map((message, i) => (
              <MessageItem
                key={message.id}
                message={message}
                isOwn={message.user_id === currentUserId}
                currentUserId={currentUserId}
                showAuthor={
                  i === 0 ||
                  messages[i - 1].user_id !== message.user_id ||
                  new Date(message.created_at).getTime() -
                    new Date(messages[i - 1].created_at).getTime() >
                    5 * 60 * 1000
                }
                onEdited={handleUpdate}
                onDeleted={handleDelete}
                onReactionChange={handleReactionChange}
              />
            ))}
          </ol>
        )}
      </div>

      {/* Typing indicator */}
      <div className="h-5 shrink-0 px-4 text-xs text-muted-foreground" aria-live="polite">
        {typingUsers.length > 0 && (
          <span>
            {typingUsers.join(', ')} {typingUsers.length === 1 ? 'is' : 'are'} typing…
          </span>
        )}
      </div>

      {/* Composer */}
      <MessageComposer
        channelId={channel.id}
        placeholder={`Message ${title}`}
        onTyping={broadcastTyping}
        onSent={handleInsert}
      />
    </div>
  )
}
