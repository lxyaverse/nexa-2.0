const COLORS = [
  'bg-primary text-primary-foreground',
  'bg-accent text-accent-foreground',
  'bg-secondary text-secondary-foreground',
]

export function UserAvatar({
  name,
  size = 'md',
  online,
}: {
  name: string
  size?: 'sm' | 'md' | 'lg'
  online?: boolean
}) {
  const initials = name
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? '')
    .join('')
  const color = COLORS[(name.charCodeAt(0) || 0) % COLORS.length]
  const sizeClass =
    size === 'sm' ? 'size-6 text-[10px]' : size === 'lg' ? 'size-10 text-sm' : 'size-8 text-xs'

  return (
    <span className={`relative inline-flex shrink-0 items-center justify-center rounded-md font-semibold ${color} ${sizeClass}`}>
      {initials}
      {online !== undefined && (
        <span
          aria-label={online ? 'Online' : 'Offline'}
          className={`absolute -bottom-0.5 -right-0.5 size-2.5 rounded-full border-2 border-background ${
            online ? 'bg-online' : 'bg-muted-foreground/50'
          }`}
        />
      )}
    </span>
  )
}
