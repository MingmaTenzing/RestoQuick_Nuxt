# RestoQuick (Nuxt 4)

RestoQuick is a restaurant operations platform built with Nuxt 4.

It includes:

- order management
- booking management
- kitchen display with real-time updates
- roster/staff management
- stock tracking
- Stripe checkout flow
- Vapi voice-assistant booking integration

## Tech Stack

- Nuxt 4 + Vue 3 + TypeScript
- Nitro server API (`server/api`)
- Prisma ORM + PostgreSQL
- Tailwind CSS v4
- PWA (`@vite-pwa/nuxt`)
- Stripe (`@unlok-co/nuxt-stripe`)
- Vapi (`@vapi-ai/web`, `@vapi-ai/server-sdk`)
- WebSockets (`crossws` via Nitro websocket support)

## Prerequisites

- Node.js 22 (required by `package.json` engines)
- npm (or another package manager, but this repo is set up for npm scripts)
- PostgreSQL database

Optional for local DB:

- Docker + Docker Compose

## Quick Start

### 1) Clone and install

```bash
git clone <your-repo-url>
cd RestoQuick_Nuxt
npm install
```

> `postinstall` runs `nuxt prepare && prisma generate` automatically.

### 2) Configure environment variables

Create `.env` in project root.

```env
# Database
DATABASE_URL="postgresql://postgres:password@localhost:5432/mydb?schema=public"

# App
BASE_URL="http://localhost:3000"
WEBSOCKET_HOST="ws://localhost:3000/api/websocket"

# Stripe
STRIPE_SECRET_KEY=""
STRIPE_PUBLIC_KEY=""

# Vapi / OpenAI
NUXT_VAPI_PUBLIC_KEY=""
NUXT_VAPI_ASSISTANT_KEY=""
OPENAI_API_KEY=""

# Cloudinary
CLOUDINARY_API_SECRET_KEY=""
CLOUDINARY_API_KEY=""
CLOUDINARY_CLOUD_NAME=""
CLOUDINARY_UPLOAD_PRESET=""
CLOUDINARY_UPLOAD_PRESET_STAFF=""
CLOUDINARY_UPLOAD_PRESET_MENU_ITEMS=""
```

### 3) Start PostgreSQL

Option A: local postgres service

Option B: docker compose from this repo:

```bash
docker compose up -d
```

This starts postgres at:

- host: `localhost`
- port: `5432`
- user: `postgres`
- password: `password`
- db: `mydb`

### 4) Apply Prisma migrations

```bash
npx prisma migrate dev
```

### 5) Run app

```bash
npm run dev
```

App runs at `http://localhost:3000`.

## Available Scripts

- `npm run dev` - start Nuxt dev server
- `npm run build` - production build
- `npm run start` - run production server from `.output`
- `npm run preview` - preview production build
- `npm run generate` - static generation

## Project Structure

```text
app/                  # Nuxt app (pages, components, composables, layouts)
server/api/           # Nitro backend API routes
server/utils/         # backend helpers (e.g., websocket broadcast)
prisma/               # schema + migrations
types/                # shared TS types
public/               # static assets
```

## Architecture Overview

### Frontend (Nuxt)

- UI pages and dashboard live in `app/pages`.
- Components are grouped by domain under `app/components/*`.
- Composables in `app/composables` manage app state and logic.
- Route rules disable SSR for:
  - `/dashboard`
  - `/vapi`

### Backend (Nitro API)

- REST-style handlers in `server/api`.
- File-based routing examples:
  - `server/api/orders/index.get.ts` -> `GET /api/orders`
  - `server/api/orders/[order_id].get.ts` -> `GET /api/orders/:order_id`

### Real-Time Kitchen Updates

- WebSocket endpoint at `server/api/websocket.ts`.
- Kitchen events are broadcast through backend utils (`server/utils/kitchenSocket.ts`) to subscribers.

### Data Layer (Prisma)

- Schema: `prisma/schema.prisma`
- Generated client: `app/generated/prisma`
- Core models:
  - `Staff`, `Shift`, `LeaveRequest`
  - `Table`, `Booking`
  - `Order`, `OrderItem`, `MenuItem`
  - `StockItem`

## Domain Conventions

- Money is stored in **cents**:
  - `Order.totalAmountCents`
  - `OrderItem.unitPriceCents`
  - `MenuItem.priceCents`
- Use Prisma enums for statuses and roles.
- Booking/order timestamps are stored as `DateTime`.

## API Overview

Main route groups under `server/api`:

- `/api/orders`
- `/api/bookings`
- `/api/menu`
- `/api/staff`
- `/api/shift`
- `/api/stock`
- `/api/tables`
- `/api/leave-requests`
- `/api/stripe-checkout`
- `/api/vapi-booking-tool`

### Orders filtering

`GET /api/orders` supports:

- `range=all|day|week|month`
- `customer=<name>` (or `customerName=<name>`) for customer-name filtering

Example:

```http
GET /api/orders?range=week&customer=James
```

## Prisma Workflow

When schema changes:

```bash
npx prisma migrate dev --name <migration_name>
npx prisma generate
```

Useful commands:

```bash
npx prisma studio
npx prisma format
```

## Integrations

### Stripe

- Secret key is server-only (`runtimeConfig.stripe.key`).
- Public key is exposed in `runtimeConfig.public.stripe.key`.

### Cloudinary

- Used for image upload flows.
- Requires API credentials and upload presets.

### Vapi

- Voice booking assistant endpoint: `/api/vapi-booking-tool`.
- Ensure request date/time payloads are timezone-safe (prefer ISO with offset or `Z`).

## Production Run

```bash
npm run build
npm run start
```

Or preview locally:

```bash
npm run preview
```

## Troubleshooting

### Prisma connection errors

- Check `DATABASE_URL`.
- Verify postgres is running on expected host/port.
- Re-run `npx prisma migrate dev`.

### Missing generated Prisma client

```bash
npx prisma generate
```

### Realtime updates not arriving

- Verify `WEBSOCKET_HOST` in env/runtime config.
- Confirm websocket endpoint is reachable at `/api/websocket`.

### Booking time shifts

- Usually caused by timezone-less timestamps.
- Send ISO timestamps with explicit offset (e.g. `2026-03-08T17:00:00+11:00`) or UTC `Z`.

## Notes for Contributors

- Keep changes domain-focused (`orders`, `booking`, `kitchen`, etc.).
- Avoid changing money fields away from cents.
- Add migrations for all Prisma schema updates.
- Do not commit secrets or real API keys.
