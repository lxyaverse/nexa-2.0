import { MessageSquare, ArrowUpRight } from 'lucide-react'
import { siteConfig } from '@/lib/config'

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 md:px-6">
        <a href="#" className="flex items-center gap-2" aria-label="Nexa Chat home">
          <span className="flex size-8 items-center justify-center rounded-lg bg-primary">
            <MessageSquare className="size-4 text-primary-foreground" aria-hidden="true" />
          </span>
          <span className="text-lg font-semibold tracking-tight">Nexa Chat</span>
        </a>
        <nav className="flex items-center gap-4 md:gap-6" aria-label="Main navigation">
          <a
            href="#features"
            className="hidden text-sm text-muted-foreground transition-colors hover:text-foreground md:block"
          >
            Features
          </a>
          <a
            href="#deploy"
            className="hidden text-sm text-muted-foreground transition-colors hover:text-foreground md:block"
          >
            Deployment
          </a>
          <a
            href={siteConfig.chatUrl || '#deploy'}
            target={siteConfig.chatUrl ? '_blank' : undefined}
            rel={siteConfig.chatUrl ? 'noopener noreferrer' : undefined}
            className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
          >
            Open Chat
            <ArrowUpRight className="size-3.5" aria-hidden="true" />
          </a>
        </nav>
      </div>
    </header>
  )
}
