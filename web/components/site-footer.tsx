import { MessageSquare } from 'lucide-react'

export function SiteFooter() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 py-8 md:flex-row md:px-6">
        <div className="flex items-center gap-2">
          <span className="flex size-6 items-center justify-center rounded-md bg-primary">
            <MessageSquare className="size-3 text-primary-foreground" aria-hidden="true" />
          </span>
          <span className="text-sm font-medium">Nexa Chat</span>
        </div>
        <p className="text-xs text-muted-foreground">
          {`© ${new Date().getFullYear()} Nexa Chat. Built on open-source foundations.`}
        </p>
      </div>
    </footer>
  )
}
