# RestoQuick

RestoQuick is a Nuxt 4 restaurant operations platform for running front-of-house, kitchen, staff, and stock workflows from a single app.

It includes:

- dine-in and takeaway order flows
- cashier settlement for table sessions
- kitchen display with realtime websocket updates
- booking management
- roster and leave management
- stock tracking with QR label generation
- Stripe embedded checkout for table ordering
- Clerk-based dashboard authentication
- Vapi voice booking widget
- AI-assisted roster planning

## Stack

- Nuxt 4 + Vue 3 + TypeScript
- Nitro server routes in `server/api`
- Prisma ORM with PostgreSQL
- Tailwind CSS v4
- Clerk for authentication and organization access control
- Stripe for checkout
- Vapi for voice booking
- `@openai/agents` for roster generation
- `crossws` and Nitro websocket support for kitchen updates

## Prerequisites

- Node.js `22`
- npm
- PostgreSQL

Optional for local setup:

- Docker and Docker Compose for running Postgres locally

## What Runs Where

Core directories:

- `app/pages`: customer-facing pages and dashboard screens
- `app/components`: domain components grouped by feature
- `app/composables`: shared UI and state logic
- `server/api`: backend API handlers
- `server/utils`: server utilities such as Prisma and websocket broadcast helpers
- `prisma/schema.prisma`: database schema
- `prisma/migrations`: migration history
- `types`: shared app types

Important runtime behavior:

- kitchen realtime updates connect to `/api/websocket`
- Stripe checkout returns to `/order-table/checkout/return`
- dashboard access is protected through Clerk middleware
- admin-only behavior is checked from Clerk org roles

## Local Setup

### 1. Install dependencies

```bash
npm install
```

`postinstall` runs `nuxt prepare && prisma generate` automatically.

### 2. Create your environment file

Create a `.env` file in the project root.

Start from this template:

```env
# Required for app boot
DATABASE_URL="postgresql://postgres:password@localhost:5432/mydb?schema=public"
BASE_URL="http://localhost:3000"
WEBSOCKET_HOST="ws://localhost:3000"

# Required for Clerk auth
NUXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_test_xxxxx"
NUXT_CLERK_SECRET_KEY="sk_test_xxxxx"

# Recommended Clerk app settings
NUXT_CLERK_ORG_ID="org_xxxxx"
NUXT_PUBLIC_CLERK_SIGN_IN_FORCE_REDIRECT_URL="/dashboard"
NUXT_PUBLIC_DEMO_CLERK_EMAIL="demo@example.com"
NUXT_PUBLIC_DEMO_CLERK_PASSWORD="demo-password"

# Optional: Stripe checkout
STRIPE_SECRET_KEY="sk_test_xxxxx"
STRIPE_PUBLIC_KEY="pk_test_xxxxx"

# Optional: Vapi voice booking
NUXT_VAPI_PUBLIC_KEY="public_key_xxxxx"
NUXT_VAPI_ASSISTANT_KEY="assistant_xxxxx"

# Optional: AI roster planner
OPENAI_API_KEY="sk-xxxx"

# Optional: Cloudinary unsigned uploads
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_UPLOAD_PRESET_MENU_ITEMS="menu-items-preset"
CLOUDINARY_UPLOAD_PRESET_STAFF="staff-preset"

# Present in runtime config but not required for current unsigned upload flows
CLOUDINARY_UPLOAD_PRESET="generic-preset"
CLOUDINARY_API_KEY=""
CLOUDINARY_API_SECRET_KEY=""
```

### 3. Start PostgreSQL

You can use your own Postgres instance, or use the included Docker Compose file.

```bash
docker compose up -d
```

That Compose file starts:

- host: `localhost`
- port: `5432`
- database: `mydb`
- username: `postgres`
- password: `password`

### 4. Apply database migrations

For local development:

```bash
npx prisma migrate dev
```

If you only want to apply existing migrations without creating a new one:

```bash
npx prisma migrate deploy
```

### 5. Run the app

```bash
npm run dev
```

The dev server runs at `http://localhost:3000`.

## Environment Variables

This section describes what each variable is for and whether the project actually needs it.

### Required for basic local development

`DATABASE_URL`

- Used by Prisma and the server Prisma adapter.
- Required for all data-backed features.

`BASE_URL`

- Used when generating absolute links for stock QR labels, table QR codes, and Stripe return URLs.
- For local development use `http://localhost:3000`.

`WEBSOCKET_HOST`

- Used by dashboard websocket clients such as the kitchen display.
- Set this to the websocket host only, for example `ws://localhost:3000`.
- Do not include `/api/websocket`, because the app appends that path itself.

`NUXT_PUBLIC_CLERK_PUBLISHABLE_KEY`

- Required by the `@clerk/nuxt` module on the client.
- Needed for sign-in, sign-up, `useAuth`, `UserButton`, and protected dashboard access.

`NUXT_CLERK_SECRET_KEY`

- Required by Clerk on the server.
- Needed for authenticated dashboard flows.

### Recommended Clerk variables

`NUXT_CLERK_ORG_ID`

- Used by `app/middleware/auth.global.ts`.
- If set, only users in that organization can access `/dashboard` routes.
- If omitted, the org restriction is effectively disabled.

`NUXT_PUBLIC_CLERK_SIGN_IN_FORCE_REDIRECT_URL`

- Used by the landing page sign-in button.
- Typical value: `/dashboard`.

`NUXT_PUBLIC_DEMO_CLERK_EMAIL`

- Used for demo credentials shown on the landing page.
- Optional.

`NUXT_PUBLIC_DEMO_CLERK_PASSWORD`

- Used for demo credentials shown on the landing page.
- Optional.

### Optional Stripe variables

`STRIPE_SECRET_KEY`

- Required for `server/api/stripe-checkout/index.post.ts`.
- Needed if you want QR ordering and embedded checkout to work.

`STRIPE_PUBLIC_KEY`

- Exposed to the client through runtime config.
- Needed by the frontend Stripe integration.

If Stripe is not configured, the rest of the dashboard can still run, but checkout flows will not work.

### Optional Vapi variables

`NUXT_VAPI_PUBLIC_KEY`

- Used by the `Vapi` web client component.
- Required for the voice booking button.

`NUXT_VAPI_ASSISTANT_KEY`

- Used when starting calls with the configured assistant.
- Required for the voice booking button.

If these are missing, the Vapi button cannot start calls.

### Optional OpenAI variable

`OPENAI_API_KEY`

- Needed by the roster agent endpoint in `server/api/roster-agent/index.post.ts`.
- Only required if you want AI roster generation.

### Optional Cloudinary variables

`CLOUDINARY_CLOUD_NAME`

- Used by the current browser upload helper for staff and menu images.

`CLOUDINARY_UPLOAD_PRESET_MENU_ITEMS`

- Used when uploading menu item images.

`CLOUDINARY_UPLOAD_PRESET_STAFF`

- Used when uploading staff profile images.

`CLOUDINARY_UPLOAD_PRESET`

- Present in runtime config, but not used by the current upload flows.

`CLOUDINARY_API_KEY`

- Present in runtime config, but not required for the current unsigned browser uploads.

`CLOUDINARY_API_SECRET_KEY`

- Present in runtime config, but not required for the current unsigned browser uploads.
- Leave this unset unless you are changing the upload flow to a signed server-side implementation.

## Feature Setup Matrix

If you want only the core app running locally, you need:

- `DATABASE_URL`
- `BASE_URL`
- `WEBSOCKET_HOST`
- Clerk keys

If you also want payments:

- Stripe keys

If you also want voice booking:

- Vapi keys

If you also want AI roster generation:

- `OPENAI_API_KEY`

If you also want image uploads:

- Cloudinary cloud name and upload presets

## Available Scripts

```bash
npm run dev
npm run build
npm run start
npm run preview
npm run generate
```

What they do:

- `npm run dev`: start the Nuxt development server
- `npm run build`: create a production build
- `npm run start`: run the built Nitro server from `.output`
- `npm run preview`: preview the production build locally
- `npm run generate`: run static generation

## Common Development Commands

```bash
npx prisma migrate dev --name your_change
npx prisma migrate deploy
npx prisma generate
npx prisma studio
npx prisma format
```

Notes:

- there is no seed script in this repository
- `npm install` already runs `prisma generate`
- schema changes should be committed with a migration

## Project Features and Where They Live

### Orders and cashier

- order listing and detail views live under `app/pages/dashboard/orders`
- POS order entry lives under `app/pages/dashboard/pos`
- cashier settlement lives under `app/pages/dashboard/cashier`
- order APIs live under `server/api/orders`
- table session APIs live under `server/api/table-sessions`

### Kitchen realtime display

- kitchen screen: `app/pages/dashboard/kitchen.vue`
- websocket endpoint: `server/api/websocket.ts`
- broadcast helper: `server/utils/kitchenSocket.ts`

### Bookings

- booking APIs live under `server/api/bookings`
- Vapi booking tool endpoint lives under `server/api/vapi-booking-tool`

### Staff and roster

- staff APIs live under `server/api/staff`
- leave request APIs live under `server/api/leave-requests`
- shift APIs live under `server/api/shift`
- AI roster endpoint lives under `server/api/roster-agent`

### Stock and QR labels

- stock APIs live under `server/api/stock`
- stock QR pages live under `app/pages/dashboard/stock`

## Data Conventions

- monetary values are stored in cents
- order totals use `totalAmountCents`
- order item prices use `unitPriceCents`
- menu prices use `priceCents`
- order and booking timestamps are stored as Prisma `DateTime`
- Prisma enums are used for roles, booking states, order states, and payment states

## Production Notes

Before a production deployment:

- set all production environment variables
- run `npx prisma migrate deploy`
- run `npm run build`
- start with `npm run start`
- make sure `BASE_URL` points to the public app origin
- make sure `WEBSOCKET_HOST` points to the public websocket origin

## Troubleshooting

### Database connection fails

- verify `DATABASE_URL`
- verify Postgres is running
- run `npx prisma migrate dev`

### Clerk auth is broken

- verify `NUXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
- verify `NUXT_CLERK_SECRET_KEY`
- verify `NUXT_CLERK_ORG_ID` if dashboard access is unexpectedly denied

### Kitchen realtime updates do not arrive

- verify `WEBSOCKET_HOST`
- do not include `/api/websocket` in that env var
- confirm the websocket endpoint is reachable at `/api/websocket`

### Stripe checkout does not return correctly

- verify `BASE_URL`
- verify both Stripe keys are set

### Image uploads fail

- verify `CLOUDINARY_CLOUD_NAME`
- verify the relevant upload preset exists
- verify the preset allows unsigned uploads if you are using the current browser upload flow

### AI roster endpoint fails

- verify `OPENAI_API_KEY`

## Contributor Notes

- keep secrets out of git
- do not commit a real `.env`
- prefer small, domain-focused changes
- keep money values in cents
- add Prisma migrations for schema changes
