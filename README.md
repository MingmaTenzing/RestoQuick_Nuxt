# RestoQuick

> A full-stack restaurant operations platform built with Nuxt 4, Prisma, realtime kitchen updates, QR ordering, staff rostering, payments, and AI-assisted workflows.

[![Nuxt 4](https://img.shields.io/badge/Nuxt-4-00DC82?style=for-the-badge&logo=nuxt&logoColor=white)](https://nuxt.com)
[![Vue 3](https://img.shields.io/badge/Vue-3-42B883?style=for-the-badge&logo=vuedotjs&logoColor=white)](https://vuejs.org)
[![Prisma](https://img.shields.io/badge/Prisma-7-2D3748?style=for-the-badge&logo=prisma&logoColor=white)](https://www.prisma.io)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Database-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org)

RestoQuick brings the core restaurant floor into one Nuxt app: table ordering, POS, cashier settlement, kitchen display, bookings, staff management, rostering, stock control, QR labels, Stripe checkout, Clerk authentication, Vapi voice booking, and AI roster planning.

## Table of Contents

- [Highlights](#highlights)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Quick Start](#quick-start)
- [Environment Setup](#environment-setup)
- [Database Setup](#database-setup)
- [Development Workflow](#development-workflow)
- [Feature Map](#feature-map)
- [Data Model](#data-model)
- [Realtime Flow](#realtime-flow)
- [Authentication](#authentication)
- [Payments](#payments)
- [AI and Voice](#ai-and-voice)
- [Image Uploads](#image-uploads)
- [Production Checklist](#production-checklist)
- [Troubleshooting](#troubleshooting)

## Highlights

| Area      | What RestoQuick Handles                                               |
| --------- | --------------------------------------------------------------------- |
| Ordering  | Customer QR ordering, table orders, takeaway orders, POS dining flow  |
| Cashier   | Table session checkout, takeaway settlement, paid/unpaid tracking     |
| Kitchen   | Realtime kitchen display through Nitro websocket support              |
| Bookings  | Manual bookings plus Vapi voice booking tool endpoint                 |
| Staff     | Staff profiles, profile images, employment types, roles, availability |
| Rostering | Weekly roster, shifts, leave requests, AI roster planning             |
| Menu      | Categories, menu items, options, availability, menu item images       |
| Stock     | Stock records, reorder thresholds, QR labels, stock update pages      |
| Analytics | Dashboard stats, revenue trends, popular items, weekly KPIs           |
| Auth      | Clerk-powered dashboard access and optional organization restriction  |

## Tech Stack

| Layer         | Tools                                                               |
| ------------- | ------------------------------------------------------------------- |
| App framework | Nuxt 4, Vue 3, TypeScript                                           |
| Server        | Nitro server routes, `defineEventHandler`, Nitro websocket support  |
| Database      | PostgreSQL, Prisma 7, `@prisma/adapter-pg`                          |
| Styling       | Tailwind CSS v4 through `@tailwindcss/vite`                         |
| Auth          | `@clerk/nuxt`                                                       |
| Payments      | `@unlok-co/nuxt-stripe`, Stripe Checkout                            |
| Realtime      | `crossws`, Nitro websocket endpoint                                 |
| AI            | `@openai/agents`, OpenAI, Composio MCP session support              |
| Voice         | `@vapi-ai/web`, `@vapi-ai/server-sdk`                               |
| Media         | Cloudinary unsigned browser uploads                                 |
| PWA           | `@vite-pwa/nuxt`                                                    |
| UI utilities  | VueUse, Nuxt QRCode, Nuxt Charts, Nuxt Time, Nuxt Toast, PrimeIcons |

## Project Structure

```txt
RestoQuick_Nuxt/
|-- app/
|   |-- assets/                 # CSS, images, audio
|   |-- client_utils/           # Browser helpers such as Cloudinary uploads
|   |-- components/             # Feature-grouped Vue components
|   |-- composables/            # Shared Nuxt/Vue state and behavior
|   |-- generated/prisma/       # Generated Prisma client output
|   |-- layouts/                # Dashboard layout
|   |-- middleware/             # Client route guards
|   `-- pages/                  # File-based Nuxt pages
|-- prisma/
|   |-- migrations/             # Database migration history
|   `-- schema.prisma           # Prisma schema and generated client config
|-- server/
|   |-- api/                    # Nitro API routes
|   |-- middleware/             # Server middleware
|   `-- utils/                  # Prisma, websockets, AI agents, tools
|-- types/                      # Shared TypeScript types
|-- zod_schema/                 # Structured output schemas
|-- nuxt.config.ts              # Nuxt modules, runtime config, PWA, websocket config
|-- prisma.config.ts            # Prisma CLI datasource and migration config
`-- package.json                # Scripts, Node engine, dependencies
```

## Prerequisites

| Requirement        | Version / Notes                                     |
| ------------------ | --------------------------------------------------- |
| Node.js            | `22` required by `package.json` engines             |
| npm                | Used by the lockfile and scripts                    |
| PostgreSQL         | Required for Prisma-backed features                 |
| Clerk app          | Required for dashboard sign-in and protected routes |
| Stripe account     | Optional, required for QR checkout                  |
| Vapi account       | Optional, required for voice booking                |
| OpenAI key         | Optional, required for AI agent flows               |
| Cloudinary account | Optional, required for staff and menu image uploads |

## Quick Start

```bash
npm install
cp .env.example .env
npx prisma migrate dev
npm run dev
```

Open the app at:

```txt
http://localhost:3000
```

The dev websocket endpoint is:

```txt
ws://localhost:3000/api/websocket
```

Set `WEBSOCKET_HOST` to only the origin (`ws://localhost:3000`). The app appends `/api/websocket` in the kitchen websocket clients.

## Environment Setup

Create a `.env` file in the project root by copying `.env.example`, then replace the placeholder values with your own local credentials.

```env
# Core application
DATABASE_URL="postgresql://postgres:password@localhost:5432/restoquick?schema=public"
BASE_URL="http://localhost:3000"
WEBSOCKET_HOST="ws://localhost:3000"

# Clerk authentication
NUXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_test_xxxxx"
NUXT_CLERK_SECRET_KEY="sk_test_xxxxx"
NUXT_CLERK_ORG_ID="org_xxxxx"
NUXT_PUBLIC_CLERK_SIGN_IN_FORCE_REDIRECT_URL="/dashboard"
NUXT_PUBLIC_DEMO_CLERK_EMAIL="demo@example.com"
NUXT_PUBLIC_DEMO_CLERK_PASSWORD="demo-password"

# Stripe checkout
STRIPE_SECRET_KEY="sk_test_xxxxx"
STRIPE_PUBLIC_KEY="pk_test_xxxxx"

# Vapi voice booking
NUXT_VAPI_PUBLIC_KEY="public_key_xxxxx"
NUXT_VAPI_ASSISTANT_KEY="assistant_xxxxx"

# AI agents
OPENAI_API_KEY="sk-xxxxx"
COMPOSIO_API_KEY="composio_xxxxx"

# Optional AI provider placeholders exposed in runtime config
OLLAMA_BASE_URL="http://localhost:11434"
OLLAMA_MODEL="llama3.1"
OLLAMA_API_KEY=""

# Cloudinary image uploads
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_UPLOAD_PRESET_MENU_ITEMS="menu-items-preset"
CLOUDINARY_UPLOAD_PRESET_STAFF="staff-preset"

# Present in runtime config; only needed if you add signed/server-side upload flows
CLOUDINARY_UPLOAD_PRESET="generic-preset"
CLOUDINARY_API_KEY=""
CLOUDINARY_API_SECRET_KEY=""
```

### Environment Variable Reference

| Variable                                       | Required For                              | Notes                                                                                      |
| ---------------------------------------------- | ----------------------------------------- | ------------------------------------------------------------------------------------------ |
| `DATABASE_URL`                                 | Database, Prisma, all data-backed routes  | Read by `prisma.config.ts` and server Prisma utility.                                      |
| `BASE_URL`                                     | QR codes, stock labels, Stripe return URL | Use the public app origin in production.                                                   |
| `WEBSOCKET_HOST`                               | Kitchen display realtime updates          | Use only the websocket origin, not `/api/websocket`.                                       |
| `NUXT_PUBLIC_CLERK_PUBLISHABLE_KEY`            | Clerk client auth                         | Required by `@clerk/nuxt`.                                                                 |
| `NUXT_CLERK_SECRET_KEY`                        | Clerk server auth                         | Required by protected server/auth flows.                                                   |
| `NUXT_CLERK_ORG_ID`                            | Dashboard organization restriction        | Used by global auth middleware; optional if org restriction is not needed.                 |
| `NUXT_PUBLIC_CLERK_SIGN_IN_FORCE_REDIRECT_URL` | Landing/sign-in redirect                  | Usually `/dashboard`.                                                                      |
| `NUXT_PUBLIC_DEMO_CLERK_EMAIL`                 | Demo landing copy                         | Optional. Do not use a real private account here.                                          |
| `NUXT_PUBLIC_DEMO_CLERK_PASSWORD`              | Demo landing copy                         | Optional. Treat as public if displayed in the app.                                         |
| `STRIPE_SECRET_KEY`                            | Server checkout creation                  | Used by `server/api/stripe-checkout/index.post.ts`.                                        |
| `STRIPE_PUBLIC_KEY`                            | Client Stripe integration                 | Exposed through public runtime config.                                                     |
| `NUXT_VAPI_PUBLIC_KEY`                         | Vapi web call button                      | Required to start voice booking calls.                                                     |
| `NUXT_VAPI_ASSISTANT_KEY`                      | Vapi assistant calls                      | Required to connect the configured assistant.                                              |
| `OPENAI_API_KEY`                               | Roster agent and main assistant           | Used by `@openai/agents` and OpenAI client setup.                                          |
| `COMPOSIO_API_KEY`                             | Main assistant MCP tooling                | Used by the Composio SDK environment when creating hosted MCP sessions.                    |
| `OLLAMA_BASE_URL`                              | Reserved AI runtime config                | Exposed in private runtime config; not currently used by the visible call sites inspected. |
| `OLLAMA_MODEL`                                 | Reserved AI runtime config                | Exposed in private runtime config; not currently used by the visible call sites inspected. |
| `OLLAMA_API_KEY`                               | Reserved AI runtime config                | Exposed in private runtime config; not currently used by the visible call sites inspected. |
| `CLOUDINARY_CLOUD_NAME`                        | Staff/menu image uploads                  | Used by browser upload helper consumers.                                                   |
| `CLOUDINARY_UPLOAD_PRESET_MENU_ITEMS`          | Menu item images                          | Must allow unsigned uploads for the current browser flow.                                  |
| `CLOUDINARY_UPLOAD_PRESET_STAFF`               | Staff profile images                      | Must allow unsigned uploads for the current browser flow.                                  |
| `CLOUDINARY_UPLOAD_PRESET`                     | Generic Cloudinary config                 | Present in runtime config; not required by current staff/menu flows.                       |
| `CLOUDINARY_API_KEY`                           | Future signed uploads                     | Present in runtime config; avoid exposing secrets publicly in production changes.          |
| `CLOUDINARY_API_SECRET_KEY`                    | Future signed uploads                     | Present in runtime config; should stay server-side only if used.                           |

### Minimal Local Feature Sets

| Goal                         | Variables Needed                                                                                                    |
| ---------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| Boot core app with database  | `DATABASE_URL`, `BASE_URL`, `WEBSOCKET_HOST`, Clerk keys                                                            |
| Use dashboard auth           | Clerk publishable key, Clerk secret key, optional org ID                                                            |
| Use kitchen realtime display | `WEBSOCKET_HOST` plus the Nuxt dev server running                                                                   |
| Use QR table checkout        | `BASE_URL`, Stripe keys, menu/table/order data                                                                      |
| Use Vapi voice booking       | Vapi public key and assistant key                                                                                   |
| Use AI roster/main assistant | `OPENAI_API_KEY`; `COMPOSIO_API_KEY` may also be needed for hosted MCP tools depending on your local Composio setup |
| Upload staff/menu images     | Cloudinary cloud name and matching unsigned upload presets                                                          |

## Database Setup

Prisma is configured with PostgreSQL and generates the client into `app/generated/prisma`.

```prisma
generator client {
  provider = "prisma-client"
  output   = "../app/generated/prisma"
}

datasource db {
  provider = "postgresql"
}
```

### Start PostgreSQL

Use any local or hosted PostgreSQL instance. For a local database, a typical connection string looks like this:

```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/restoquick?schema=public"
```

### Apply Migrations

For local development, create/apply migrations with:

```bash
npx prisma migrate dev
```

To apply existing migrations in deployment or CI-like environments:

```bash
npx prisma migrate deploy
```

Regenerate the Prisma client manually when needed:

```bash
npx prisma generate
```

Open Prisma Studio:

```bash
npx prisma studio
```

There is currently no seed script in `package.json`.

## Development Workflow

### Install

```bash
npm install
```

The `postinstall` script runs:

```bash
nuxt prepare && prisma generate
```

### Run Locally

```bash
npm run dev
```

### Build and Start Production Output

```bash
npm run build
npm run start
```

### Available Scripts

| Script                | Purpose                                                                    |
| --------------------- | -------------------------------------------------------------------------- |
| `npm run dev`         | Start the Nuxt development server.                                         |
| `npm run build`       | Build the Nuxt/Nitro production output.                                    |
| `npm run start`       | Run `.output/server/index.mjs` after a production build.                   |
| `npm run preview`     | Preview the production build locally through Nuxt.                         |
| `npm run generate`    | Run static generation.                                                     |
| `npm run postinstall` | Prepare Nuxt and generate Prisma client. Usually run automatically by npm. |

## Feature Map

| Feature           | Frontend                                                | Backend / Utilities                                                        |
| ----------------- | ------------------------------------------------------- | -------------------------------------------------------------------------- |
| Dashboard home    | `app/pages/Dashboard/index.vue`                         | `server/api/dashboard/stats/*`                                             |
| Orders            | `app/pages/Dashboard/orders`                            | `server/api/orders`                                                        |
| POS               | `app/pages/Dashboard/pos`                               | `server/api/orders/pos`                                                    |
| Cashier           | `app/pages/Dashboard/cashier`                           | `server/api/orders/checkout`, `server/api/table-sessions`                  |
| Table QR ordering | `app/pages/order-table`                                 | `server/api/stripe-checkout`, `server/api/orders`                          |
| Kitchen display   | `app/pages/Dashboard/kitchen/index.vue`                 | `server/api/websocket.ts`, `server/utils/kitchenSocket.ts`                 |
| Bookings          | `app/pages/Dashboard/bookings`                          | `server/api/bookings`, `server/api/vapi-booking-tool`                      |
| Staff             | `app/pages/Dashboard/staff`                             | `server/api/staff`                                                         |
| Roster            | `app/pages/Dashboard/roster`                            | `server/api/shift`, `server/api/leave-requests`, `server/api/roster-agent` |
| Menu              | `app/pages/Dashboard/menu`                              | `server/api/menu`                                                          |
| Tables            | `app/pages/Dashboard/tables`                            | `server/api/tables`, `server/api/table-sessions`                           |
| Stock             | `app/pages/Dashboard/stock`                             | `server/api/stock`                                                         |
| QR code pages     | `app/pages/Dashboard/qr-codes`, table/stock print pages | `BASE_URL` from runtime config                                             |
| Main assistant    | `app/pages/Dashboard/agent/index.vue`                   | `server/api/restoquick-agent`, `server/utils/agents`                       |

## Data Model

The core Prisma models are:

| Domain              | Models / Enums                                                                                        |
| ------------------- | ----------------------------------------------------------------------------------------------------- |
| Staff and roster    | `Staff`, `Shift`, `LeaveRequest`, `Role`, `EmploymentType`, `WeekDay`, `LeaveStatus`                  |
| Bookings and tables | `Booking`, `Table`, `TableSession`, `BookingStatus`, `TableSessionStatus`                             |
| Menu                | `MenuCategory`, `MenuItem`, `MenuOption`                                                              |
| Orders              | `Order`, `OrderItem`, `OrderItemOption`, `OrderStatus`, `OrderType`, `PaymentStatus`, `PaymentMethod` |
| Stock               | `StockItem`, `StockCategory`                                                                          |

Important conventions:

- Money is stored in cents, not dollars.
- Menu prices use `priceCents`.
- Order item snapshot prices use `unitPriceCents`.
- Order totals use `totalAmountCents`.
- `Order.orderNo` is database-generated with autoincrement.
- `Order.checkoutSessionId` is unique and prevents duplicate checkout-derived orders.
- `Booking.tableId` and `Order.tableId` are nullable to support flexible restaurant workflows.
- Timestamps use Prisma `DateTime`, `@default(now())`, and `@updatedAt` where appropriate.

## Realtime Flow

Kitchen updates use Nitro websocket support.

```txt
Order API mutation
  -> server/utils/kitchenSocket.ts
  -> KITCHEN room broadcast
  -> /api/websocket
  -> kitchen display clients
```

Relevant files:

- `server/api/websocket.ts`
- `server/utils/kitchenSocket.ts`
- `types/websocket_payload.ts`
- `app/pages/Dashboard/kitchen/index.vue`
- `app/components/kitchenDisplay_components/Completed_Orders/Complete_Order_Popup.vue`

Local websocket env:

```env
WEBSOCKET_HOST="ws://localhost:3000"
```

Production websocket env should point to the public websocket origin, for example:

```env
WEBSOCKET_HOST="wss://your-domain.com"
```

## Authentication

Dashboard access is Clerk-based.

- The Clerk module is registered in `nuxt.config.ts`.
- Client route protection lives in `app/middleware/auth.global.ts`.
- Admin-only checks use Clerk organization roles.
- Sign-in and sign-up pages live under `app/pages/sign-in` and `app/pages/sign-up`.

For local development, configure these first:

```env
NUXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_test_xxxxx"
NUXT_CLERK_SECRET_KEY="sk_test_xxxxx"
```

If `NUXT_CLERK_ORG_ID` is set, dashboard access is restricted to that organization.

## Payments

Stripe checkout powers QR ordering and redirects back into the table checkout flow.

Key files:

- `server/api/stripe-checkout/index.post.ts`
- `server/api/stripe-checkout/session-status/index.get.ts`
- `app/pages/order-table/checkout/index.vue`
- `app/pages/order-table/checkout/return.vue`

Required variables:

```env
STRIPE_SECRET_KEY="sk_test_xxxxx"
STRIPE_PUBLIC_KEY="pk_test_xxxxx"
BASE_URL="http://localhost:3000"
```

The Stripe return URL is built from `BASE_URL`:

```txt
{BASE_URL}/order-table/checkout/return?session_id={CHECKOUT_SESSION_ID}
```

## AI and Voice

### AI Roster and Main Assistant

AI workflows use `@openai/agents`.

Key files:

- `server/api/roster-agent/index.post.ts`
- `server/api/restoquick-agent/index.post.ts`
- `server/utils/agents/roster-agent.ts`
- `server/utils/agents/main-agent.ts`
- `server/utils/roster-agent-tools`
- `server/utils/main-agent-tools`
- `zod_schema/roster_agent_schema.ts`

Required for OpenAI-backed flows:

```env
OPENAI_API_KEY="sk-xxxxx"
```

The main assistant also creates a Composio session for hosted MCP tooling. Set `COMPOSIO_API_KEY` when your Composio SDK setup needs authenticated hosted MCP access.

### Vapi Voice Booking

Vapi provides the voice booking button and booking tool endpoint.

Key files:

- `app/components/vapi/vapi_call_button.vue`
- `server/api/vapi-booking-tool/index.post.ts`
- `server/api/vapi-booking-tool/index.get.ts`

Required variables:

```env
NUXT_VAPI_PUBLIC_KEY="public_key_xxxxx"
NUXT_VAPI_ASSISTANT_KEY="assistant_xxxxx"
```

## Image Uploads

Staff and menu images use Cloudinary unsigned browser uploads.

Key files:

- `app/client_utils/cloudinary_upload_image.ts`
- `app/components/staff_components/Add_Staff_Modal.vue`
- `app/components/staff_components/Edit_Staff_Modal.vue`
- `app/components/menu_components/AddMenuItemModal.vue`
- `app/components/menu_components/EditMenuItemModal.vue`

Required variables for current upload flows:

```env
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_UPLOAD_PRESET_MENU_ITEMS="menu-items-preset"
CLOUDINARY_UPLOAD_PRESET_STAFF="staff-preset"
```

Make sure the upload presets allow unsigned uploads if you keep the current browser-side upload approach.

## Production Checklist

Before deploying:

- Use Node.js `22`.
- Set production `DATABASE_URL`.
- Set Clerk production keys and allowed redirect URLs.
- Set `BASE_URL` to the public app origin.
- Set `WEBSOCKET_HOST` to the public websocket origin, usually `wss://your-domain.com`.
- Set Stripe production keys if checkout is enabled.
- Set Cloudinary production presets if image uploads are enabled.
- Set Vapi keys if voice booking is enabled.
- Set `OPENAI_API_KEY` if AI agents are enabled.
- Run `npx prisma migrate deploy` against the production database.
- Run `npm run build`.
- Start with `npm run start`.

Production commands:

```bash
npm ci
npx prisma migrate deploy
npm run build
npm run start
```

## Troubleshooting

### Database connection fails

- Confirm PostgreSQL is running.
- Verify `DATABASE_URL`.
- Run `npx prisma migrate dev` locally.
- Run `npx prisma generate` if generated client files are missing.

### Prisma client is missing or stale

- Run `npx prisma generate`.
- Re-run `npm install` if Nuxt prepare output is missing.
- Confirm the generator output is `app/generated/prisma`.

### Clerk auth redirects unexpectedly

- Verify `NUXT_PUBLIC_CLERK_PUBLISHABLE_KEY`.
- Verify `NUXT_CLERK_SECRET_KEY`.
- Check `NUXT_CLERK_ORG_ID` if dashboard access is denied for signed-in users.
- Confirm Clerk redirect URLs include the local or production app URL.

### Kitchen realtime updates do not arrive

- Verify `WEBSOCKET_HOST`.
- Do not include `/api/websocket` in `WEBSOCKET_HOST`.
- Confirm the websocket endpoint is reachable at `/api/websocket`.
- Check the kitchen display browser console for websocket connection errors.

### Stripe checkout fails or does not return

- Verify `STRIPE_SECRET_KEY` and `STRIPE_PUBLIC_KEY`.
- Verify `BASE_URL`.
- Confirm the return page exists at `/order-table/checkout/return`.
- Confirm cart items have prices in cents.

### QR codes point to the wrong location

- Verify `BASE_URL`.
- Regenerate or reprint table/stock QR codes after changing the app origin.

### Image uploads fail

- Verify `CLOUDINARY_CLOUD_NAME`.
- Verify the correct upload preset for staff or menu items.
- Confirm the preset allows unsigned uploads.

### AI roster or assistant fails

- Verify `OPENAI_API_KEY`.
- Check whether your Composio SDK setup requires additional local authentication.
- Confirm staff, availability, leave requests, and shifts exist in the database for useful roster planning.

### Vapi voice booking cannot start

- Verify `NUXT_VAPI_PUBLIC_KEY`.
- Verify `NUXT_VAPI_ASSISTANT_KEY`.
- Confirm the assistant is configured in Vapi.

## Contributor Notes

- Keep real secrets out of git.
- Do not commit a real `.env` file.
- Keep money values in cents.
- Add Prisma migrations for schema changes.
- Prefer small feature-focused changes.
- Keep API routes aligned with Nitro file-based routing.
- Keep reusable client state in composables and server-only logic in `server/utils` or `server/api`.
