import Image from 'next/image'
import type { ReactNode } from 'react'

export function AuthShell({
  title,
  subtitle,
  children,
}: {
  title: string
  subtitle: string
  children: ReactNode
}) {
  return (
    <main className="flex min-h-svh items-center justify-center bg-background px-4 py-10">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center gap-4 text-center">
          <Image
            src="/images/logo.svg"
            alt="Nexa Chat"
            width={160}
            height={46}
            priority
            className="h-11 w-auto"
          />
          <div>
            <h1 className="text-xl font-semibold text-foreground text-balance">{title}</h1>
            <p className="mt-1 text-sm text-muted-foreground text-pretty">{subtitle}</p>
          </div>
        </div>
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">{children}</div>
      </div>
    </main>
  )
}
