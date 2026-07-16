'use client'

import { useState, useTransition } from 'react'
import { updateProfile } from '@/lib/actions'
import { UserAvatar } from '@/components/chat/user-avatar'
import type { Profile } from '@/lib/types'

export function ProfileForm({ profile, email }: { profile: Profile; email: string }) {
  const [error, setError] = useState<string | null>(null)
  const [saved, setSaved] = useState(false)
  const [pending, startTransition] = useTransition()

  function handleSubmit(formData: FormData) {
    setError(null)
    setSaved(false)
    startTransition(async () => {
      const res = await updateProfile(formData)
      if (res?.error) setError(res.error)
      else setSaved(true)
    })
  }

  return (
    <form action={handleSubmit} className="flex flex-col gap-5">
      <div className="flex items-center gap-4">
        <UserAvatar name={profile.display_name} size="lg" online />
        <div>
          <p className="text-sm font-semibold text-foreground">@{profile.username}</p>
          <p className="text-xs text-muted-foreground">{email}</p>
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="display_name" className="text-sm font-medium text-foreground">
          Display name
        </label>
        <input
          id="display_name"
          name="display_name"
          defaultValue={profile.display_name}
          required
          maxLength={60}
          className="h-10 rounded-lg border border-border bg-card px-3 text-sm text-foreground outline-none focus:border-primary"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="status_text" className="text-sm font-medium text-foreground">
          Status <span className="font-normal text-muted-foreground">(optional)</span>
        </label>
        <input
          id="status_text"
          name="status_text"
          defaultValue={profile.status_text ?? ''}
          maxLength={100}
          placeholder="What are you up to?"
          className="h-10 rounded-lg border border-border bg-card px-3 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-primary"
        />
      </div>

      {error && (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      )}
      {saved && (
        <p role="status" className="text-sm text-online">
          Profile saved
        </p>
      )}

      <div>
        <button
          type="submit"
          disabled={pending}
          className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
        >
          {pending ? 'Saving…' : 'Save changes'}
        </button>
      </div>
    </form>
  )
}
