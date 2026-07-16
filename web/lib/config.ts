export const CHAT_URL = process.env.NEXT_PUBLIC_CHAT_URL ?? ''

export const siteConfig = {
  name: 'Nexa Chat',
  chatUrl: CHAT_URL,
  registerUrl: CHAT_URL ? `${CHAT_URL.replace(/\/$/, '')}/register` : '',
}
