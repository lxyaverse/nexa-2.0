'use client'

import { useState } from 'react'
import { Pencil, SmilePlus, Trash2 } from 'lucide-react'
import { deleteMessage, editMessage, toggleReaction } from '@/lib/actions'
import { UserAvatar } from '@/components/chat/user-avatar'
import type { MessageWithAuthor } from '@/lib/types'

const QUICK_EMOJIS = ['\u{1F44D}', '\u{2764}\u{FE0F}', '\u{1F602}', '\u{1F389}', '\u{1F440}']

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
}

export function MessageItem({
  message,
  isOwn,
  currentUserId,
  showAuthor,
  onEdited,
  onDeleted,
  onReactionChange,
}: {
  message: MessageWithAuthor
  isOwn: boolean
  currentUserId: string
  showAuthor: boolean
  onEdited: (id: string, patch: { content: string; edited_at: string }) => void
  onDeleted: (id: string) => void
  onReactionChange: (id: string) => void
}) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(message.content)
  const [emojiOpen, setEmojiOpen] = useState(false)
  const [pending, setPending] = useState(false)

  // Group reactions by emoji
  const grouped = new Map<string, { count: number; mine: boolean }>()
  for (const r of message.reactions ?? []) {
    const entry = grouped.get(r.emoji) ?? { count: 0, mine: false }
    entry.count += 1
    if (r.user_id === currentUserId) entry.mine = true
    grouped.set(r.emoji, entry)
  }

  async function submitEdit() {
    const content = draft.trim()
    if (!content || content === message.content) {
      setEditing(false)
      setDraft(message.content)
      return
    }
    setPending(true)
    const res = await editMessage(message.id, content)
    setPending(false)
    setEditing(false)
    if (!res?.error) {
      onEdited(message.id, { content, edited_at: new Date().toISOString() })
    }
  }

  async function handleDelete() {
    setPending(true)
    const res = await deleteMessage(message.id)
    setPending(false)
    if (!res?.error) onDeleted(message.id)
  }

  async function react(emoji: string) {
    setEmojiOpen(false)
    await toggleReaction(message.id, emoji)
    onReactionChange(message.id)
  }

  return (
    <li className={`group relative flex gap-3 rounded-md px-2 py-1 hover:bg-secondary/60 ${showAuthor ? 'mt-3' : ''}`}>
      <div className="w-9 shrink-0">
        {showAuthor && (
          <UserAvatar name={message.author?.display_name ?? 'Unknown user'} size="lg" />
        )}
      </div>

      <div className="min-w-0 flex-1">
        {showAuthor && (
          <p className="flex items-baseline gap-2">
            <span className="text-sm font-semibold text-foreground">
              {message.author?.display_name ?? 'Unknown user'}
            </span>
            <time className="text-xs text-muted-foreground" dateTime={message.created_at}>
              {formatTime(message.created_at)}
            </time>
          </p>
        )}

        {editing ? (
          <div className="mt-1 flex flex-col gap-2">
            <textarea
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  if (e.nativeEvent.isComposing || e.keyCode === 229) return
                  e.preventDefault()
                  submitEdit()
                }
                if (e.key === 'Escape') {
                  setEditing(false)
                  setDraft(message.content)
                }
              }}
              rows={2}
              className="w-full resize-none rounded-md border border-border bg-card px-3 py-2 text-sm text-foreground outline-none focus:border-primary"
              aria-label="Edit message"
              autoFocus
            />
            <div className="flex gap-2 text-xs">
              <button
                type="button"
                onClick={submitEdit}
                disabled={pending}
                className="rounded-md bg-primary px-2.5 py-1 font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
              >
                Save
              </button>
              <button
                type="button"
                onClick={() => {
                  setEditing(false)
                  setDraft(message.content)
                }}
                className="rounded-md px-2.5 py-1 font-medium text-muted-foreground hover:text-foreground"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <p className="whitespace-pre-wrap break-words text-sm leading-relaxed text-foreground">
            {message.content}
            {message.edited_at && (
              <span className="ml-1.5 text-[10px] text-muted-foreground">(edited)</span>
            )}
          </p>
        )}

        {/* Reactions */}
        {grouped.size > 0 && (
          <div className="mt-1 flex flex-wrap gap-1">
            {Array.from(grouped.entries()).map(([emoji, { count, mine }]) => (
              <button
                key={emoji}
                type="button"
                onClick={() => react(emoji)}
                className={`flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs transition-colors ${
                  mine
                    ? 'border-primary/40 bg-primary/10 text-primary'
                    : 'border-border bg-card text-muted-foreground hover:border-primary/40'
                }`}
                aria-label={`${emoji} reaction, ${count}`}
              >
                <span aria-hidden="true">{emoji}</span>
                <span>{count}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Hover actions */}
      {!editing && (
        <div className="absolute -top-3 right-2 hidden items-center gap-0.5 rounded-md border border-border bg-card p-0.5 shadow-sm group-hover:flex">
          <div className="relative">
            <button
              type="button"
              onClick={() => setEmojiOpen((o) => !o)}
              className="flex size-7 items-center justify-center rounded text-muted-foreground hover:bg-secondary hover:text-foreground"
              aria-label="Add reaction"
            >
              <SmilePlus className="size-4" aria-hidden="true" />
            </button>
            {emojiOpen && (
              <div className="absolute right-0 top-8 z-10 flex gap-1 rounded-md border border-border bg-card p-1.5 shadow-md">
                {QUICK_EMOJIS.map((emoji) => (
                  <button
                    key={emoji}
                    type="button"
                    onClick={() => react(emoji)}
                    className="flex size-8 items-center justify-center rounded text-lg hover:bg-secondary"
                    aria-label={`React with ${emoji}`}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            )}
          </div>
          {isOwn && (
            <>
              <button
                type="button"
                onClick={() => setEditing(true)}
                className="flex size-7 items-center justify-center rounded text-muted-foreground hover:bg-secondary hover:text-foreground"
                aria-label="Edit message"
              >
                <Pencil className="size-4" aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={pending}
                className="flex size-7 items-center justify-center rounded text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                aria-label="Delete message"
              >
                <Trash2 className="size-4" aria-hidden="true" />
              </button>
            </>
          )}
        </div>
      )}
    </li>
  )
}
