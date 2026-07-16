import { Globe, Server, Database } from 'lucide-react'

const steps = [
  {
    icon: Globe,
    title: 'This site on Vercel',
    description:
      'The Nexa front door is a lightweight Next.js app deployed on Vercel — fast, global, and zero-maintenance.',
  },
  {
    icon: Server,
    title: 'Chat server on a container host',
    description:
      'The Nexa Chat (Rocket.Chat-based) server runs as a persistent Node.js process on Railway, Fly.io, Render, or any VPS with Docker.',
  },
  {
    icon: Database,
    title: 'MongoDB with replica set',
    description:
      'The chat server connects to MongoDB (Atlas or self-hosted) with a replica set enabled for real-time change streams.',
  },
]

export function Deployment() {
  return (
    <section id="deploy" className="border-t border-border bg-card/50">
      <div className="mx-auto max-w-6xl px-4 py-20 md:px-6">
        <div className="mb-12 flex flex-col items-center gap-3 text-center">
          <h2 className="text-balance text-3xl font-semibold tracking-tight md:text-4xl">
            How Nexa Chat is deployed
          </h2>
          <p className="max-w-xl text-pretty leading-relaxed text-muted-foreground">
            Nexa uses a split architecture: a static-fast front door on Vercel, and the
            full-featured chat server on infrastructure built for persistent connections.
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {steps.map((step, index) => (
            <div key={step.title} className="flex flex-col gap-3 rounded-xl border border-border bg-background p-6">
              <div className="flex items-center gap-3">
                <span className="flex size-10 items-center justify-center rounded-lg bg-primary/15">
                  <step.icon className="size-5 text-accent" aria-hidden="true" />
                </span>
                <span className="font-mono text-xs text-muted-foreground">{`0${index + 1}`}</span>
              </div>
              <h3 className="font-semibold">{step.title}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">{step.description}</p>
            </div>
          ))}
        </div>
        <p className="mt-8 text-center text-sm text-muted-foreground">
          {'See '}
          <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">DEPLOYMENT.md</code>
          {' in the repository for full setup instructions.'}
        </p>
      </div>
    </section>
  )
}
