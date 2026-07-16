'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

const PresenceContext = createContext<{ onlineUserIds: Set<string> }>({
  onlineUserIds: new Set(),
})

export function usePresence() {
  return useContext(PresenceContext)
}

/**
 * App-wide presence: every signed-in user joins a single "presence:global"
 * realtime channel so the sidebar can show who is online anywhere in the app.
 */
export function PresenceProvider({
  userId,
  children,
}: {
  userId: string
  children: React.ReactNode
}) {
  const [onlineUserIds, setOnlineUserIds] = useState<Set<string>>(new Set())

  useEffect(() => {
    const supabase = createClient()
    const channel = supabase.channel('presence:global', {
      config: { presence: { key: userId } },
    })

    channel
      .on('presence', { event: 'sync' }, () => {
        setOnlineUserIds(new Set(Object.keys(channel.presenceState())))
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          await channel.track({ user_id: userId })
        }
      })

    return () => {
      supabase.removeChannel(channel)
    }
  }, [userId])

  return (
    <PresenceContext.Provider value={{ onlineUserIds }}>{children}</PresenceContext.Provider>
  )
}
