import { MessageCircle, Hash, Users, Shield, Zap, Crown } from 'lucide-react'

const features = [
  {
    icon: MessageCircle,
    title: 'Real-time messaging',
    description:
      'Instant delivery over persistent WebSocket connections with typing indicators, read receipts, and reactions.',
  },
  {
    icon: Hash,
    title: 'Channels & threads',
    description:
      'Organize conversations into public channels, private groups, and threaded discussions that keep context intact.',
  },
  {
    icon: Users,
    title: 'Friends & social',
    description:
      'Friend requests, user profiles with bios, @mentions, and verified badges bring a social layer to your workspace.',
  },
  {
    icon: Shield,
    title: 'Private & secure',
    description:
      'Self-hosted on your own infrastructure with end-to-end encryption support and full data ownership.',
  },
  {
    icon: Zap,
    title: 'Fast & reliable',
    description:
      'Built on a proven open-source core trusted by thousands of organizations for mission-critical communication.',
  },
  {
    icon: Crown,
    title: 'Premium tiers',
    description:
      'Unlock advanced features, larger uploads, and priority support with Nexa premium subscription plans.',
  },
]

export function Features() {
  return (
    <section id="features" className="border-t border-border">
      <div className="mx-auto max-w-6xl px-4 py-20 md:px-6">
        <div className="mb-12 flex flex-col items-center gap-3 text-center">
          <h2 className="text-balance text-3xl font-semibold tracking-tight md:text-4xl">
            Everything your team needs
          </h2>
          <p className="max-w-lg text-pretty leading-relaxed text-muted-foreground">
            A complete communication platform, from quick DMs to organization-wide announcements.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="flex flex-col gap-3 rounded-xl border border-border bg-card p-6 transition-colors hover:border-primary/40"
            >
              <span className="flex size-10 items-center justify-center rounded-lg bg-primary/15">
                <feature.icon className="size-5 text-accent" aria-hidden="true" />
              </span>
              <h3 className="font-semibold">{feature.title}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
