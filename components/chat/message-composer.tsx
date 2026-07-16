'use client'

import { useRef, useState } from 'react'
import { SendHorizontal } from 'lucide-react'
import { sendMessage } from '@/lib/actions'

export function MessageComposer({
  channelId,
  placeholder,
  onTyping,
  onSent,
}: {
  channelId: string
  placeholder: string
  onTyping: () => void
  onSent: (messageId: string) => void
}) {
  const [value, setValue] = useState('')
  const [sending, setSending] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  async function submit() {
    const content = value.trim()
    if (!content || sending) return
    setSending(true)
    setValue('')
    const res = await sendMessage(channelId, content)
    setSending(false)
    if (res?.error) {
      setValue(content) // restore on failure
    } else if (res?.id) {
      onSent(res.id)
    }
    textareaRef.current?.focus()
  }

  return (
    <div className="shrink-0 border-t border-border bg-card px-4 py-3">
      <form
        onSubmit={(e) => {
          e.preventDefault()
          submit()
        }}
        className="flex items-end gap-2"
      >
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => {
            setValue(e.target.value)
            onTyping()
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              if (e.nativeEvent.isComposing || e.keyCode === 229) return
              e.preventDefault()
              submit()
            }
          }}
          placeholder={placeholder}
          rows={1}
          className="max-h-40 min-h-10 w-full flex-1 resize-none rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-primary"
          aria-label={placeholder}
        />
        <button
          type="submit"
          disabled={!value.trim() || sending}
          className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground transition-opacity hover:bg-primary/90 disabled:opacity-40"
          aria-label="Send message"
        >
          <SendHorizontal className="size-4" aria-hidden="true" />
        </button>
      </form>
    </div>
  )
}
