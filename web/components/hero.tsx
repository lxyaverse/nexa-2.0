import { ArrowRight, Sparkles } from 'lucide-react'
import { siteConfig } from '@/lib/config'

export function Hero() {
  const hasChat = Boolean(siteConfig.chatUrl)

  return (
    <section className="relative overflow-hidden">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-96 bg-primary/10 blur-3xl"
        aria-hidden="true"
      />
      <div className="relative mx-auto flex max-w-6xl flex-col items-center gap-6 px-4 py-20 text-center md:px-6 md:py-28">
        <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs text-muted-foreground">
          <Sparkles className="size-3 text-accent" aria-hidden="true" />
          Next-generation team communication
        </span>
        <h1 className="max-w-3xl text-balance text-4xl font-semibold leading-tight tracking-tight md:text-6xl">
          Where your team&apos;s conversations come together
        </h1>
        <p className="max-w-xl text-pretty leading-relaxed text-muted-foreground md:text-lg">
          Real-time messaging, channels, threads, and social features — built on a
          battle-tested open-source core, rebranded and reimagined as Nexa Chat.
        </p>
        <div className="flex flex-col items-center gap-3 sm:flex-row">
          <a
            href={siteConfig.chatUrl || '#deploy'}
            target={hasChat ? '_blank' : undefined}
            rel={hasChat ? 'noopener noreferrer' : undefined}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
          >
            {hasChat ? 'Open your workspace' : 'Set up your workspace'}
            <ArrowRight className="size-4" aria-hidden="true" />
          </a>
          <a
            href="#features"
            className="inline-flex items-center rounded-lg border border-border bg-card px-6 py-3 text-sm font-medium text-foreground transition-colors hover:bg-muted"
          >
            Explore features
          </a>
        </div>
        {!hasChat && (
          <p className="text-xs text-muted-foreground">
            {'Chat server not configured yet — set NEXT_PUBLIC_CHAT_URL to link your hosted Nexa Chat server.'}
          </p>
        )}
      </div>
    </section>
  )
}
