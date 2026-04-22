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

**Environment variables:** DATABASE*URL, STRIPE_SECRET_KEY, STRIPE_PUBLIC_KEY, VAPI*\_, CLOUDINARY\_\_, WEBSOCKET_HOST via runtimeConfig (nuxt.config.ts).

## Code quality principles

**Write simple, readable code first:**

- Choose the simplest solution that correctly solves the problem — complexity must be justified, not defaulted to
- If a computed value, helper, or abstraction is only used once, inline it instead
- Prefer flat logic over deeply nested conditions; early returns over wrapping everything in if-blocks
- Name variables after what they are at the time they are used, not what they were before a mutation (e.g. `settledOrderIds` not `unpaidOrderIds` after an update)
- Remove code that is not consumed — unused returns, unused type fields, and dead computations are noise, not safety nets
- Do not add try/catch around operations that cannot fail in practice; only catch errors at real failure boundaries
- Do not compute values on the server that the client already has, and vice versa — think about where the data lives before adding a round-trip or an extra reduce
- When the backend can return exactly what the frontend needs, do it there; avoid pushing filtering, totalling, or sorting work onto the client unnecessarily

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

## Frontend design skill

When working on any frontend UI in this project, act like an elite product UI engineer and prioritize polished, production-quality design.

**Design standards:**

- Build interfaces that feel intentional, refined, and premium — not generic scaffolds
- Prefer strong visual hierarchy, excellent spacing, balanced typography, and clear grouping of content
- Use modern dashboard/page patterns: large rounded surfaces, subtle borders, soft shadows, layered backgrounds, and clean card composition
- Keep layouts responsive by default across mobile, tablet, laptop, and wide desktop screens
- Design for both light and dark mode when touching dashboard or shared UI

**Execution rules:**

- Reuse the existing Tailwind utility style and project tokens instead of inventing a separate styling system
- Always follow the existing theme tokens first: prefer classes such as `bg-card`, `bg-background`, `bg-accent`, `text-foreground`, `text-muted-foreground`, `border-border`, and `text-primary`
- Do not introduce custom CSS looks through arbitrary color values, custom gradients, or one-off visual treatments unless the file already uses them or the user explicitly asks for them
- Favor consistent spacing scales, predictable grid behavior, and deliberate empty space over crowded UIs
- Add tasteful interaction states: hover, active, focus, disabled, loading, and empty states
- Prefer concise, elegant copy in headings, labels, and helper text
- When introducing tables, forms, dashboards, or cards, make them visually polished enough to look like they were crafted by a highly skilled UI engineer
- Avoid plain default-looking sections if a clearer, more premium composition can be achieved with the existing stack

**Component mindset:**

- Create reusable visual patterns when repeating sections or cards
- Keep components simple to read in code, but sophisticated in presentation
- Preserve accessibility: sufficient contrast, keyboard focus visibility, semantic markup, and readable font sizing
- If a screen can be made significantly better with layout refinement alone, improve the composition before adding more complexity

**Integration points:**

- **Stripe**: Secret key in runtimeConfig (private), public key exposed for client checkout
- **Cloudinary**: For image uploads; credentials in runtimeConfig + CLOUDINARY_UPLOAD_PRESET for unsigned uploads
- **Vapi AI**: Voice booking assistant; keys in runtimeConfig.public; handler at server/api/vapi-booking-tool/
- **Path alias**: Use `~~/ ` for root imports (e.g., `import { broadCast } from "~~/server/utils/kitchenSocket"`)

**Data conventions:**

- Prices stored as integers (cents) in Order.totalAmountCents, OrderItem.unitPriceCents, MenuItem.priceCents
- Do not introduce currency formatting helpers such as `formatCurrency` unless explicitly requested; keep monetary values as-is and let the user add the currency symbol manually if they want it displayed
- Enums (Role, OrderStatus, etc.) in Prisma schema; use Prisma-generated enums in components
- Timestamps: created/updated via Prisma @default(now()) and @updatedAt
- Nullable fields: tableId (Booking, Order) allows operations without table assignment upfront
