# Nexa Chat Deployment Guide

Nexa Chat is a Rocket.Chat-based Meteor application. The Meteor server **cannot run on Vercel** because it requires a persistent Node.js process, always-open WebSocket (DDP) connections, and MongoDB change-stream observers — all incompatible with serverless functions.

Instead, Nexa uses a **split architecture**:

| Component | Where it runs | Why |
|---|---|---|
| `web/` — Front door (Next.js) | **Vercel** | Fast, global, static-friendly landing/entry app |
| `apps/meteor` — Chat server | **Railway / Fly.io / Render / VPS (Docker)** | Needs a long-running process + WebSockets |
| MongoDB | **MongoDB Atlas** (or self-hosted) | Must run with a replica set for change streams |

---

## 1. Deploy the front door to Vercel

The `web/` directory is a standalone Next.js app (independent of the Yarn monorepo).

1. In your Vercel project settings, set **Root Directory** to `web`.
2. Framework preset: **Next.js** (auto-detected). No custom build settings needed.
3. Add the environment variable:
   - `NEXT_PUBLIC_CHAT_URL` — the public URL of your hosted chat server (e.g. `https://chat.yourdomain.com`).
4. Deploy. The "Open Chat" buttons will link users into your chat server.

Local development:

```bash
cd web
npm install
npm run dev
```

## 2. Deploy the chat server (Meteor)

Use any host that supports long-running Docker containers. Recommended options:

### Railway (existing config)

This repo already contains `.github/workflows/deploy-railway.yml`. Set the `RAILWAY_TOKEN` secret in GitHub and configure a Railway service pointed at this repo.

### Docker (any host: Fly.io, Render, VPS)

Rocket.Chat publishes production images; since this is a fork, build your own:

```bash
# From the repo root (requires ~8GB RAM and 30-60 min)
yarn install
yarn build
cd apps/meteor
meteor build --directory /tmp/nexa-build --server-only
```

Then run the bundle with Node 22 against your MongoDB instance, or use the Dockerfiles under `apps/meteor/.docker/`.

Required environment variables for the chat server:

```bash
MONGO_URL=mongodb+srv://user:pass@cluster/nexa?replicaSet=rs0
MONGO_OPLOG_URL=<same cluster, local db>   # optional with change streams
ROOT_URL=https://chat.yourdomain.com      # public URL of the chat server
PORT=3000
```

## 3. MongoDB

- **MongoDB Atlas** free tier works for testing (replica sets are enabled by default on Atlas).
- Self-hosted MongoDB must run as a replica set (`--replSet rs0`) — standalone mode will not work.

## 4. Connect the pieces

1. Deploy MongoDB → get the connection string.
2. Deploy the chat server with `MONGO_URL` and `ROOT_URL` set.
3. Deploy `web/` to Vercel with `NEXT_PUBLIC_CHAT_URL` pointing at the chat server's `ROOT_URL`.

## Why not run everything on Vercel?

- Vercel functions are stateless and time-bounded; Meteor needs a persistent process.
- Real-time messaging (DDP) requires always-open WebSockets, unsupported in serverless functions.
- Rocket.Chat keeps in-memory presence/session state and permanent DB observers.
- A production Meteor build of this codebase exceeds Vercel's build time and output size limits.
