# Copilot instructions (RestoQuick_Nuxt)

A restaurant order & staff management system with real-time kitchen updates, Stripe checkout, and Vapi AI integration.

## Architecture & data flow

**Core layers:**

- **Nuxt 4 frontend** (app/): pages, components, layouts, composables, styles. Client-side order management via `useOrderCart` composable with `useState`. Composables follow naming: `use*Modal.ts` (state) and `use*Management.ts` (logic).
- **Nitro backend** (server/api/): RESTful routes with `defineEventHandler()`. File-based routing: `server/api/resource/[id].get.ts`, `index.post.ts`, etc. (e.g., `/api/orders`, `/api/staff/[id]`).
- **Real-time kitchen broadcasts**: Websocket handler at server/api/websocket.ts + peer management in server/utils/kitchenSocket.ts. Broadcasts on "KITCHEN" room via `broadCast()` with websocket_payload type.
- **Data layer**: Prisma with PostgreSQL. Schema at prisma/schema.prisma; client auto-generated to app/generated/prisma on postinstall. Key models: Staff, Shift, LeaveRequest, Table, Booking, Order, OrderItem, MenuItem, StockItem.

**Communication patterns:**

- Client ↔ API: `useFetch<Type>()` with inline typing (e.g., `useFetch<Staff>("/api/staff/[id]")`), watch triggers for refetch (see roster_calendar.vue example).
- API ↔ Client: JSON payloads; prices in **cents** (not dollars) per schema.
- API → Kitchen: Websocket broadcasts of order updates (PREPARING, READY states).

## Developer workflows

**Required:** Node 22 (package.json engines).

**Common commands:**

- `npm run dev` — Nuxt dev server (http://localhost:3000)
- `npm run build && npm run start` — Production mode (outputs to .output/)
- `npm run preview` — Preview production build locally
- `npm run generate` — Static generation (for specific pages)

**Prisma workflow:**

- `prisma migrate dev --name <name>` — Create & apply migration in dev
- Prisma client auto-generated on `npm install` via postinstall script (`nuxt prepare && prisma generate`)
- Schema changes require explicit migration; Nuxt doesn't auto-run migrations

**Environment variables:** DATABASE*URL, STRIPE_SECRET_KEY, STRIPE_PUBLIC_KEY, VAPI*_, CLOUDINARY\__, WEBSOCKET_HOST via runtimeConfig (nuxt.config.ts).

## Project conventions & patterns

**File structure conventions:**

- Routes follow Nitro pattern: GET/POST/PUT logic in `[entity]/index.get.ts`, `index.post.ts`, or `[id].get.ts` files
- Composables: State (useState) in hooks named `use*Modal.ts` (e.g., useOrderCart with cart_items, table_id states)
- API responses: Use Prisma include() patterns (see orderwithInclude.ts) for eager loading related data
- Types: Reusable interfaces in types/ (order-cart.ts, websocket_payload.ts, cloudinary.ts); Prisma-generated types in app/generated/prisma/
- Enums exported from app/client_utils/enum.ts (SortOption: "asc"/"dsc") and Prisma schema (Role, OrderStatus, BookingStatus, etc.)

**Client-side specifics:**

- SSR disabled for `/dashboard` and `/vapi` via routeRules; assume client-only state there (localStorage, IndexedDB, or useState OK)
- Dynamic routes: `[table_id].vue` accesses via `const route = useRoute()` (e.g., order-table/[table_id].vue)
- definePageMeta() used for route guards and metadata (see dashboard pages)

**Styling & config:**

- Tailwind CSS v4 via @tailwindcss/vite plugin; global imports in nuxt.config.ts + app/assets/css/main.css
- PWA enabled (@vite-pwa/nuxt); icons in public/icons/; manifest in nuxt.config.ts (name: "RestoQuick")
- Color mode support (@nuxtjs/color-mode)

**Integration points:**

- **Stripe**: Secret key in runtimeConfig (private), public key exposed for client checkout
- **Cloudinary**: For image uploads; credentials in runtimeConfig + CLOUDINARY_UPLOAD_PRESET for unsigned uploads
- **Vapi AI**: Voice booking assistant; keys in runtimeConfig.public; handler at server/api/vapi-booking-tool/
- **Path alias**: Use `~~/ ` for root imports (e.g., `import { broadCast } from "~~/server/utils/kitchenSocket"`)

**Data conventions:**

- Prices stored as integers (cents) in Order.totalAmountCents, OrderItem.unitPriceCents, MenuItem.priceCents
- Enums (Role, OrderStatus, etc.) in Prisma schema; use Prisma-generated enums in components
- Timestamps: created/updated via Prisma @default(now()) and @updatedAt
- Nullable fields: tableId (Booking, Order) allows operations without table assignment upfront
