'use client'

import { useState, useTransition } from 'react'
import { createChannel } from '@/lib/actions'
import { DialogShell } from '@/components/chat/dialog-shell'

export function CreateChannelDialog({ onClose }: { onClose: () => void }) {
  const [error, setError] = useState<string | null>(null)
  const [pending, startTransition] = useTransition()

  function handleSubmit(formData: FormData) {
    setError(null)
    startTransition(async () => {
      const res = await createChannel(formData)
      // createChannel redirects on success; a return value means failure
      if (res?.error) setError(res.error)
    })
  }

  return (
    <DialogShell title="Create a channel" onClose={onClose}>
      <form action={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="channel-name" className="text-sm font-medium text-foreground">
            Name
          </label>
          <input
            id="channel-name"
            name="name"
            required
            minLength={2}
            maxLength={40}
            placeholder="e.g. design-team"
            className="h-10 rounded-lg border border-border bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-primary"
            autoFocus
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="channel-description" className="text-sm font-medium text-foreground">
            Description <span className="font-normal text-muted-foreground">(optional)</span>
          </label>
          <input
            id="channel-description"
            name="description"
            maxLength={120}
            placeholder="What is this channel about?"
            className="h-10 rounded-lg border border-border bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-primary"
          />
        </div>
        <label className="flex items-center gap-2 text-sm text-foreground">
          <input type="checkbox" name="private" className="size-4 accent-[#6C63FF]" />
          Make private (only invited members can view)
        </label>

        {error && (
          <p role="alert" className="text-sm text-destructive">
            {error}
          </p>
        )}

        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={pending}
            className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
          >
            {pending ? 'Creating…' : 'Create channel'}
          </button>
        </div>
      </form>
    </DialogShell>
  )
}
