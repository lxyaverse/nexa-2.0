export type Profile = {
  id: string
  username: string
  display_name: string
  avatar_url: string | null
  status_text: string | null
  created_at: string
}

export type Channel = {
  id: string
  name: string | null
  description: string | null
  type: 'public' | 'private' | 'dm'
  created_by: string | null
  created_at: string
}

export type Message = {
  id: string
  channel_id: string
  user_id: string
  content: string
  edited_at: string | null
  created_at: string
  profile?: Profile
  reactions?: Reaction[]
}

export type Reaction = {
  message_id: string
  user_id: string
  emoji: string
}

export type DmChannel = Channel & {
  other: Profile
}
