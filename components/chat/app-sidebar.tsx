'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { Hash, Lock, Plus, Search, Settings, LogOut, MessageSquarePlus, Menu, X } from 'lucide-react'
import type { Channel, DmChannel, Profile } from '@/lib/types'
import { UserAvatar } from '@/components/chat/user-avatar'
import { CreateChannelDialog } from '@/components/chat/create-channel-dialog'
import { NewDmDialog } from '@/components/chat/new-dm-dialog'
import { signOut } from '@/lib/actions'
import { usePresence } from '@/components/chat/presence-context'

export function AppSidebar({
  profile,
  channels,
  memberChannelIds,
  dms,
}: {
  profile: Profile
  channels: Channel[]
  memberChannelIds: string[]
  dms: DmChannel[]
}) {
  const pathname = usePathname()
  const [query, setQuery] = useState('')
  const [showCreate, setShowCreate] = useState(false)
  const [showDm, setShowDm] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const { onlineUserIds } = usePresence()

  const memberSet = new Set(memberChannelIds)
  const q = query.trim().toLowerCase()
  const filteredChannels = q
    ? channels.filter((c) => c.name?.toLowerCase().includes(q))
    : channels
  const filteredDms = q
    ? dms.filter(
        (d) =>
          d.other.display_name.toLowerCase().includes(q) ||
          d.other.username.toLowerCase().includes(q),
      )
    : dms

  const sidebarContent = (
    <div className="flex h-full w-64 flex-col bg-sidebar text-sidebar-foreground">
      <div className="flex h-14 items-center justify-between border-b border-sidebar-border px-4">
        <Link href="/" className="flex items-center" onClick={() => setMobileOpen(false)}>
          <Image
            src="/images/logo_dark.svg"
            alt="Nexa Chat"
            width={120}
            height={34}
            className="h-8 w-auto"
            priority
          />
        </Link>
        <button
          type="button"
          onClick={() => setMobileOpen(false)}
          className="rounded p-1 hover:bg-sidebar-accent md:hidden"
          aria-label="Close sidebar"
        >
          <X className="size-4" />
        </button>
      </div>

      <div className="px-3 py-3">
        <div className="flex items-center gap-2 rounded-lg bg-sidebar-accent px-2.5">
          <Search className="size-4 shrink-0 text-sidebar-foreground/50" aria-hidden />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search"
            aria-label="Search channels and people"
            className="h-9 w-full bg-transparent text-sm outline-none placeholder:text-sidebar-foreground/50"
          />
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-2 pb-4" aria-label="Channels and direct messages">
        <div className="mb-1 flex items-center justify-between px-2 pt-2">
          <h2 className="text-xs font-semibold uppercase tracking-wide text-sidebar-foreground/60">
            Channels
          </h2>
          <button
            type="button"
            onClick={() => setShowCreate(true)}
            className="rounded p-1 text-sidebar-foreground/60 hover:bg-sidebar-accent hover:text-sidebar-foreground"
            aria-label="Create channel"
          >
            <Plus className="size-4" />
          </button>
        </div>
        <ul className="flex flex-col gap-0.5">
          {filteredChannels.map((channel) => {
            const href = `/channel/${channel.name}`
            const active = pathname === href
            const isMember = memberSet.has(channel.id)
            return (
              <li key={channel.id}>
                <Link
                  href={href}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors ${
                    active
                      ? 'bg-sidebar-accent font-semibold text-sidebar-accent-foreground'
                      : isMember
                        ? 'text-sidebar-foreground/90 hover:bg-sidebar-accent'
                        : 'text-sidebar-foreground/50 hover:bg-sidebar-accent'
                  }`}
                >
                  {channel.type === 'private' ? (
                    <Lock className="size-4 shrink-0" aria-hidden />
                  ) : (
                    <Hash className="size-4 shrink-0" aria-hidden />
                  )}
                  <span className="truncate">{channel.name}</span>
                </Link>
              </li>
            )
          })}
        </ul>

        <div className="mb-1 mt-4 flex items-center justify-between px-2">
          <h2 className="text-xs font-semibold uppercase tracking-wide text-sidebar-foreground/60">
            Direct messages
          </h2>
          <button
            type="button"
            onClick={() => setShowDm(true)}
            className="rounded p-1 text-sidebar-foreground/60 hover:bg-sidebar-accent hover:text-sidebar-foreground"
            aria-label="New direct message"
          >
            <MessageSquarePlus className="size-4" />
          </button>
        </div>
        <ul className="flex flex-col gap-0.5">
          {filteredDms.length === 0 && (
            <li className="px-2 py-1 text-xs text-sidebar-foreground/40">No conversations yet</li>
          )}
          {filteredDms.map((dm) => {
            const href = `/dm/${dm.id}`
            const active = pathname === href
            return (
              <li key={dm.id}>
                <Link
                  href={href}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors ${
                    active
                      ? 'bg-sidebar-accent font-semibold text-sidebar-accent-foreground'
                      : 'text-sidebar-foreground/90 hover:bg-sidebar-accent'
                  }`}
                >
                  <UserAvatar
                    name={dm.other.display_name}
                    size="sm"
                    online={onlineUserIds.has(dm.other.id)}
                  />
                  <span className="truncate">{dm.other.display_name}</span>
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      <div className="flex items-center gap-2 border-t border-sidebar-border p-3">
        <UserAvatar name={profile.display_name} online />
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium">{profile.display_name}</p>
          <p className="truncate text-xs text-sidebar-foreground/60">@{profile.username}</p>
        </div>
        <Link
          href="/settings"
          onClick={() => setMobileOpen(false)}
          className="rounded p-1.5 text-sidebar-foreground/60 hover:bg-sidebar-accent hover:text-sidebar-foreground"
          aria-label="Profile settings"
        >
          <Settings className="size-4" />
        </Link>
        <form action={signOut}>
          <button
            type="submit"
            className="rounded p-1.5 text-sidebar-foreground/60 hover:bg-sidebar-accent hover:text-sidebar-foreground"
            aria-label="Sign out"
          >
            <LogOut className="size-4" />
          </button>
        </form>
      </div>
    </div>
  )

  return (
    <>
      {/* Mobile toggle */}
      <button
        type="button"
        onClick={() => setMobileOpen(true)}
        className="fixed left-3 top-3 z-40 rounded-lg border border-border bg-card p-2 shadow-sm md:hidden"
        aria-label="Open sidebar"
      >
        <Menu className="size-4 text-foreground" />
      </button>

      {/* Mobile overlay sidebar */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <button
            type="button"
            aria-label="Close sidebar"
            onClick={() => setMobileOpen(false)}
            className="absolute inset-0 bg-foreground/40"
          />
          <div className="absolute inset-y-0 left-0">{sidebarContent}</div>
        </div>
      )}

      {/* Desktop sidebar */}
      <aside className="hidden shrink-0 md:block">{sidebarContent}</aside>

      {showCreate && <CreateChannelDialog onClose={() => setShowCreate(false)} />}
      {showDm && <NewDmDialog onClose={() => setShowDm(false)} currentUserId={profile.id} />}
    </>
  )
}
