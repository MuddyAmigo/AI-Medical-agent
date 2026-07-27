[![CI](https://github.com/MuddyAmigo/AI-Medical-agent/actions/workflows/ci.yml/badge.svg)](https://github.com/MuddyAmigo/AI-Medical-agent/actions/workflows/ci.yml)
[![CD](https://github.com/MuddyAmigo/AI-Medical-agent/actions/workflows/cd.yml/badge.svg)](https://github.com/MuddyAmigo/AI-Medical-agent/actions/workflows/cd.yml)

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Architecture

```
PR opened ──▶ CI (typecheck, next build, docker build)
                     │  must pass before merge
                     ▼
main branch ──▶ CD ──▶ build image ──▶ push to GHCR ──▶ deploy to Fly.io ──▶ verify /api/health
```

The app builds with `output: 'standalone'` (see `next.config.ts`), so the production Docker image
(`Dockerfile`) only ships the traced `node_modules` subset, compiled `.next` output, and static
assets — no full `node_modules`, no source, no dev dependencies. It runs as a non-root user.

- **`NEXT_PUBLIC_*`** vars (Clerk publishable key/redirect URLs, Vapi keys) are Docker **build
  args** — Next.js inlines them into the client bundle at build time, so they must exist before
  `next build` runs.
- **Server secrets** (`CLERK_SECRET_KEY`, `DATABASE_URL`, `OPEN_ROUTER_API_KEY`, `GROQ_API_KEY`)
  are **runtime-only** — injected via `docker run -e` / Compose `env_file` locally, or `flyctl
  secrets set` in production. They are never baked into the image.
- Every PR against `main` runs CI: install, `tsc --noEmit`, `next build`, then a full `docker
  build` as a final integration check.
- Every push to `main` runs CD: builds and pushes the image to GHCR (tagged `latest` and the
  commit SHA), deploys that exact image to Fly.io, then polls `/api/health` and fails the
  workflow if it doesn't return `200`.

Local development: `docker compose up --build` (see `docker-compose.yml`). No local Postgres
container is needed — [Neon](https://neon.tech) is a remote, HTTPS-based serverless driver.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
