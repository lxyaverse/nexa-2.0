'use client'

import { useEffect, useState, useTransition } from 'react'
import { createClient } from '@/lib/supabase/client'
import { startDm } from '@/lib/actions'
import { DialogShell } from '@/components/chat/dialog-shell'
import { UserAvatar } from '@/components/chat/user-avatar'
import { usePresence } from '@/components/chat/presence-context'
import type { Profile } from '@/lib/types'

export function NewDmDialog({
  onClose,
  currentUserId,
}: {
  onClose: () => void
  currentUserId: string
}) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<Profile[]>([])
  const [error, setError] = useState<string | null>(null)
  const [pending, startTransition] = useTransition()
  const { onlineUserIds } = usePresence()

  useEffect(() => {
    const supabase = createClient()
    const controller = { cancelled: false }
    const q = query.trim()

    async function search() {
      let builder = supabase
        .from('profiles')
        .select('*')
        .neq('id', currentUserId)
        .order('display_name')
        .limit(12)
      if (q) {
        builder = builder.or(`display_name.ilike.%${q}%,username.ilike.%${q}%`)
      }
      const { data } = await builder
      if (!controller.cancelled) setResults((data as Profile[]) ?? [])
    }

    const t = setTimeout(search, 200)
    return () => {
      controller.cancelled = true
      clearTimeout(t)
    }
  }, [query, currentUserId])

  function handleStart(userId: string) {
    setError(null)
    startTransition(async () => {
      const res = await startDm(userId)
      // startDm redirects on success
      if (res?.error) setError(res.error)
    })
  }

  return (
    <DialogShell title="New direct message" onClose={onClose}>
      <div className="flex flex-col gap-3">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search people by name or username"
          aria-label="Search people"
          className="h-10 rounded-lg border border-border bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-primary"
          autoFocus
        />

        {error && (
          <p role="alert" className="text-sm text-destructive">
            {error}
          </p>
        )}

        <ul className="flex max-h-72 flex-col gap-0.5 overflow-y-auto" aria-label="People">
          {results.length === 0 && (
            <li className="px-2 py-6 text-center text-sm text-muted-foreground">
              No people found
            </li>
          )}
          {results.map((person) => (
            <li key={person.id}>
              <button
                type="button"
                disabled={pending}
                onClick={() => handleStart(person.id)}
                className="flex w-full items-center gap-3 rounded-lg px-2 py-2 text-left hover:bg-secondary disabled:opacity-50"
              >
                <UserAvatar
                  name={person.display_name}
                  online={onlineUserIds.has(person.id)}
                />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-medium text-foreground">
                    {person.display_name}
                  </span>
                  <span className="block truncate text-xs text-muted-foreground">
                    @{person.username}
                  </span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </DialogShell>
  )
}
