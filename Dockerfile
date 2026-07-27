# syntax=docker/dockerfile:1

##### 1. deps — install dependencies only (cached separately from source changes) #####
FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

##### 2. builder — compile the Next.js app #####
FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# NEXT_PUBLIC_* values must be present as real env vars during `next build`
# because Next.js inlines them into the client JS bundle at build time —
# passing them only as ARGs (without promoting to ENV) would leave the
# client bundle with `undefined` for every one of these.
ARG NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
ARG NEXT_PUBLIC_CLERK_SIGN_IN_URL
ARG NEXT_PUBLIC_CLERK_SIGN_UP_URL
ARG NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL
ARG NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL
ARG NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL
ARG NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL
ARG NEXT_PUBLIC_VAPI_API_KEY
ARG NEXT_PUBLIC_VAPI_MALE_VOICE_ID
ARG NEXT_PUBLIC_VAPI_FEMALE_VOICE_ID

ENV NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=$NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY \
    NEXT_PUBLIC_CLERK_SIGN_IN_URL=$NEXT_PUBLIC_CLERK_SIGN_IN_URL \
    NEXT_PUBLIC_CLERK_SIGN_UP_URL=$NEXT_PUBLIC_CLERK_SIGN_UP_URL \
    NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=$NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL \
    NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=$NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL \
    NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL=$NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL \
    NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL=$NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL \
    NEXT_PUBLIC_VAPI_API_KEY=$NEXT_PUBLIC_VAPI_API_KEY \
    NEXT_PUBLIC_VAPI_MALE_VOICE_ID=$NEXT_PUBLIC_VAPI_MALE_VOICE_ID \
    NEXT_PUBLIC_VAPI_FEMALE_VOICE_ID=$NEXT_PUBLIC_VAPI_FEMALE_VOICE_ID

# drizzle.config.ts imports dotenv/config at the top level, so a DATABASE_URL
# must exist at build time even though the build never touches the database —
# it's only used for schema generation via drizzle-kit, not `next build`.
# A placeholder is enough to satisfy the `!` non-null assertion.
ENV DATABASE_URL="postgresql://placeholder:placeholder@placeholder/placeholder"

# config/OpenAiModel.tsx constructs `new OpenAI(...)` at module scope for both
# the OpenRouter and Groq clients, and Next's "Collecting page data" build
# step statically evaluates every route module (including ones that only
# import the Groq client) — so the OpenAI SDK constructor runs during `next
# build` and throws if it can't resolve an apiKey. These are placeholders
# only, scoped to this build stage: the real secrets are injected at
# container runtime and this ENV never carries into the runner stage.
ENV OPEN_ROUTER_API_KEY="build-placeholder" \
    GROQ_API_KEY="build-placeholder"

ENV NEXT_TELEMETRY_DISABLED=1

RUN npm run build

##### 3. runner — minimal production image #####
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    PORT=3000 \
    HOSTNAME=0.0.0.0

RUN addgroup --system --gid 1001 nodejs \
 && adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

CMD ["node", "server.js"]
