# Nexa Chat

A fully Vercel-native team chat application built with Next.js 16 App Router and Supabase. Real-time messaging, channels, direct messages, reactions, and online presence — no self-hosted server required.

## Stack

| Concern | Technology |
|---|---|
| Framework | Next.js 16 App Router (Turbopack) |
| Styling | Tailwind CSS v4 |
| Database | Supabase Postgres |
| Auth | Supabase Auth (email/password) |
| Realtime | Supabase Realtime (postgres_changes + presence + broadcast) |
| Hosting | Vercel |

## Features

- Email/password registration and login
- Public and private channels (create, join, leave)
- Direct messages between users
- Real-time message delivery, typing indicators, and online presence
- Message edit and delete (own messages)
- Emoji reactions
- User profiles (display name, status text)
- Row Level Security on every table

## Local Development

```bash
git clone https://github.com/lxyaverse/nexa-2.0
cd nexa-2.0
npm install
cp .env.example .env.local
# Fill in NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY
npm run dev
```

## Deploy to Vercel

1. Import this repository in Vercel
2. Add environment variables: `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. Deploy — no root directory override needed

The Supabase schema is in `supabase/migrations/` and has already been applied. For a fresh Supabase project, run the migration SQL through the Supabase SQL editor.

## Environment Variables

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anon/public key |
| `NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL` | Optional: redirect URL override for email confirmation in dev |


