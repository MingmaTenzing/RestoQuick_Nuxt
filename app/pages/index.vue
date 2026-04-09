<script setup lang="ts">
import FeatureStorySection from '~/components/home_components/FeatureStorySection.vue';
import HomeFooter from '~/components/home_components/HomeFooter.vue';
import NavBar from '~/components/home_components/NavBar.vue';
import ScrollReveal from '~/components/home_components/ScrollReveal.vue';
import heroShot from '~/assets/images/usecase/Cafe.webp';
import rosterShot from '~/assets/images/app_screenshots/AI Roster Suggestion.png';
import kitchenShot from '~/assets/images/app_screenshots/Kitchen Display.webp';
import analyticsShot from '~/assets/images/app_screenshots/Dashboard.webp';
import inventoryShot from '~/assets/images/app_screenshots/Stock Management.webp';
import tableShot from '~/assets/images/app_screenshots/Table Managment.webp';
import bookingsOverviewShot from '~/assets/images/app_screenshots/Bookings.webp';
import orderShot from '~/assets/images/app_screenshots/Order Details.webp';
import Vapi_call_button from '~/components/vapi/vapi_call_button.vue';

const overviewCards = [
  {
    title: 'Built for owner-operators and managers',
    description: 'A single system for the day-to-day realities of small to mid-sized restaurants and cafes, from floor flow to team visibility.',
    image: heroShot,
    alt: 'Chef and manager using RestoQuick in service',
  },
  {
    title: 'One source of truth for the whole team',
    description: 'Front-of-house, kitchen, and management work from the same operational picture with fewer handoffs and less guesswork.',
    image: orderShot,
    alt: 'RestoQuick order management interface',
  },
  {
    title: 'Designed for the rush and the reset',
    description: 'From bookings and tickets to staffing and stock, RestoQuick keeps service moving and gives leadership a clearer read on the business.',
    image: bookingsOverviewShot,
    alt: 'RestoQuick booking management interface',
  },
];

const featureSections = [
  {
    id: 'features',
    index: '01',
    eyebrow: 'AI Staff Rostering',
    title: 'Build stronger schedules for lean teams in minutes, not hours.',
    description:
      'RestoQuick turns roster planning into a calmer workflow for growing cafes and restaurants with AI suggestions that account for demand, availability, and shift coverage.',
    bullets: [
      'Auto-generate staff schedules around expected demand',
      'Reduce labor costs without sacrificing coverage',
      'Balance shifts more fairly across the team',
    ],
    image: rosterShot,
    imageAlt: 'AI staff rostering screenshot',
    reverse: false,
  },
  {
    id: 'kitchen',
    index: '02',
    eyebrow: 'Real-Time Kitchen Display',
    title: 'Keep the kitchen aligned from first ticket to final pickup.',
    description:
      'Orders update instantly across the line so your team can work faster, avoid misfires, and keep service moving with less friction.',
    bullets: [
      'Orders update in real time as they are placed',
      'Reduce kitchen mistakes with clearer order flow',
      'Improve speed, coordination, and service efficiency',
    ],
    image: kitchenShot,
    imageAlt: 'Real-time kitchen display screenshot',
    reverse: true,
  },
  {
    id: 'analytics',
    index: '03',
    eyebrow: 'Smart Analytics Dashboard',
    title: 'See what is happening across the business at a glance.',
    description:
      'From revenue patterns to peak-hour behavior, the dashboard gives operators a sharper view of how the venue is performing every day.',
    bullets: [
      'Track revenue and order performance in one view',
      'Spot peak hours and service patterns quickly',
      'Monitor team and business performance over time',
    ],
    image: analyticsShot,
    imageAlt: 'Smart analytics dashboard screenshot',
    reverse: false,
  },
  {
    id: 'operations',
    index: '04',
    eyebrow: 'Staff & Inventory Management',
    title: 'Stay ahead of staffing issues and stock shortages before they hit service.',
    description:
      'Manage hours, team visibility, and inventory status with cleaner operational controls that reduce surprises during service across busy cafes and dining rooms.',
    bullets: [
      'Track staff hours and day-to-day team activity',
      'Monitor inventory in real time as stock moves',
      'Prevent shortages before they disrupt service',
    ],
    image: inventoryShot,
    imageAlt: 'Inventory management screenshot',
    reverse: true,
  },
  {
    id: 'tables',
    index: '05',
    eyebrow: 'Table Management',
    title: 'Run the floor with more confidence and less chaos.',
    description:
      'Give hosts and managers a clear view of reservations, walk-ins, and table status so they can seat guests faster and keep the room flowing.',
    bullets: [
      'Use a visual table layout to manage the floor',
      'Track reservations and table timing in one place',
      'Handle walk-ins without losing operational visibility',
    ],
    image: tableShot,
    imageAlt: 'Table management screenshot',
    reverse: false,
  },
];

const testimonials = [
  {
    quote:
      'RestoQuick gave us the first operating view that actually feels calm during service. Maya alone changed how we handle bookings and front desk pressure.',
    name: 'Amelia Hart',
    title: 'Owner, Hart House Cafe',
  },
  {
    quote:
      'The kitchen display and analytics changed the pace of the business. We make faster calls, and the team trusts the system.',
    name: 'Noah Patel',
    title: 'Operations Lead, Ember Table Group',
  },
  {
    quote:
      'Scheduling used to be a weekly drain. Now our managers spend less time building rosters and more time improving service and sales.',
    name: 'Sofia Nguyen',
    title: 'General Manager, Juniper & Co. Cafe',
  },
];

const pricingPlans = [
  {
    name: 'Starter',
    price: '$39',
    note: 'For smaller venues that want better day-to-day control.',
    features: [
      'Bookings and table management',
      'Core dashboard insights',
      'Daily operations tracking',
    ],
    featured: false,
  },
  {
    name: 'All Features',
    oldPrice: '$79',
    price: '$25',
    note: 'One simple monthly plan with every RestoQuick feature included.',
    features: [
      'AI voice booking assistant (Maya)',
      'Real-time kitchen display',
      'Bookings and table management',
      'Staff rostering and team visibility',
      'Inventory and stock management',
      'Analytics and performance dashboard',
    ],
    featured: true,
  },
  {
    name: 'Scale',
    price: '$59',
    note: 'For multi-shift teams that want extra rollout support.',
    features: [
      'Multi-team setup support',
      'Priority onboarding guidance',
      'Advanced operations oversight',
    ],
    featured: false,
  },
];

const operatorNotes = [
  'Fewer missed calls and fewer booking bottlenecks',
  'Faster kitchen coordination and clearer service flow',
  'Better visibility across staffing, tables, stock, and revenue',
];

const signatureNotes = [
  {
    label: 'Signal',
    value: 'A clearer read on what matters right now across service and operations.',
  },
  {
    label: 'Flow',
    value: 'One connected system from phone call to completed order and close.',
  },
  {
    label: 'Control',
    value: 'Sharper business decisions without adding visual noise to the team.',
  },
];
</script>

<template>
  <div class="bg-background text-foreground">
    <main>
      <NavBar />
      <section id="main" class="relative isolate overflow-hidden px-6 pt-24 pb-24 sm:pt-40 sm:pb-32">
        <div class="absolute inset-0 -z-30 bg-background"></div>

        <!-- Professional subtle dot pattern that fades out -->
        <div
          class="absolute inset-0 -z-20 h-[800px] bg-[radial-gradient(circle_at_center,rgba(156,163,175,0.3)_1px,transparent_1px)] dark:bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.1)_1px,transparent_1px)] [background-size:24px_24px] [mask-image:radial-gradient(ellipse_80%_70%_at_50%_0%,#000_20%,transparent_100%)]">
        </div>
        <!-- Top atmospheric dark green glow -->
        <div
          class="absolute inset-x-0 top-0 -z-20 h-[800px] bg-[radial-gradient(circle_at_top,rgba(34,197,94,0.06),transparent_50%)]">
        </div>

        <div class="mx-auto max-w-5xl text-center">
          <h1
            class="mt-10 text-5xl font-semibold tracking-[-0.05em] text-foreground sm:text-7xl lg:text-[5.5rem] lg:leading-[0.95]">
            Run your venue with absolute precision.
          </h1>

          <p class="mx-auto mt-8 max-w-2xl text-lg leading-relaxed text-muted-foreground sm:text-xl">
            Replace scattered tools with one cohesive operating layer. Handle bookings, kitchen flow, staffing, and
            inventory management in a system actually designed for the rush.
          </p>

          <div class="mt-12 flex flex-wrap items-center justify-center gap-4 sm:gap-6">
            <NuxtLink to="/dashboard"
              class="inline-flex h-12 items-center justify-center rounded-full bg-foreground px-8 text-sm font-semibold tracking-[0.02em] text-background transition-transform hover:scale-[1.02] active:scale-[0.98] shadow-xl shadow-foreground/5">
              Start Operating
            </NuxtLink>
            <a href="#overview"
              class="inline-flex h-12 items-center justify-center rounded-full border border-border bg-card/50 px-8 text-sm font-semibold tracking-[0.02em] text-foreground backdrop-blur-md transition-colors hover:bg-accent/50">
              Explore the system
            </a>
          </div>
        </div>

        <div class="mx-auto max-w-6xl mt-24">
          <div
            class="grid grid-cols-1 divide-y divide-border border border-border sm:grid-cols-3 sm:divide-x sm:divide-y-0 rounded-4xl bg-card/40 backdrop-blur-sm shadow-2xl shadow-green-900/5 overflow-hidden">
            <div v-for="item in signatureNotes" :key="item.label"
              class="p-10 sm:p-12 transition-colors hover:bg-accent/40">
              <p class="text-[10px] font-bold uppercase tracking-[0.3em] text-green-600 dark:text-green-500">{{
                item.label }}</p>
              <p class="mt-4 text-base font-medium leading-relaxed text-foreground/90">{{ item.value }}</p>
            </div>
          </div>
        </div>
      </section>

      <div class="px-6">
        <div class="mx-auto max-w-7xl border-t border-border"></div>
      </div>

      <section id="overview" class="px-6 py-20 sm:py-28">
        <ScrollReveal>
          <div class="mx-auto max-w-7xl">
            <div class="max-w-3xl">
              <p class="text-xs font-semibold uppercase tracking-[0.24em] text-green-700 dark:text-green-400">Product
                overview</p>
              <h2 class="mt-4 text-3xl font-semibold tracking-[-0.04em] text-foreground sm:text-5xl sm:leading-[1.02]">
                A business operations platform for hospitality teams that have outgrown basic tools.
              </h2>
              <p class="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
                Most tools solve one slice of the venue. RestoQuick connects bookings, service, staffing,
                stock, and decision-making so the business runs like one system.
              </p>
            </div>

            <div class="mt-20 grid gap-16 lg:grid-cols-3">
              <article v-for="card in overviewCards" :key="card.title" class="flex flex-col">
                <div class="overflow-hidden rounded-2xl ring-1 ring-border/50">
                  <img :src="card.image" :alt="card.alt"
                    class="h-64 w-full object-cover object-top transition duration-700 hover:scale-[1.03]">
                </div>
                <div class="mt-8">
                  <h3 class="text-2xl font-semibold tracking-[-0.04em] text-foreground">{{ card.title }}</h3>
                  <p class="mt-4 text-base font-medium leading-relaxed text-muted-foreground">{{ card.description }}</p>
                </div>
              </article>
            </div>
          </div>
        </ScrollReveal>
      </section>

      <div class="px-6">
        <div class="mx-auto max-w-7xl border-t border-border"></div>
      </div>

      <section id="maya" class="px-6 py-20 sm:py-28">
        <ScrollReveal>
          <div class="mx-auto max-w-7xl">
            <div class="grid items-center gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-20">
              <div>
                <p class="text-xs font-semibold uppercase tracking-[0.26em] text-green-700 dark:text-green-400">AI voice
                  agent for booking</p>
                <h2
                  class="mt-4 max-w-xl text-4xl font-semibold tracking-[-0.05em] text-foreground sm:text-5xl lg:text-[3.6rem] lg:leading-[1.02]">
                  Let Maya handle booking calls without slowing the team down.
                </h2>
                <p class="mt-6 max-w-xl text-lg leading-8 text-muted-foreground">
                  Maya answers incoming calls, guides guests through the reservation flow, and confirms
                  bookings without pulling your team away from service or the counter.
                </p>

                <ul class="mt-8 space-y-4">
                  <li class="flex items-start gap-3 text-sm leading-7 text-muted-foreground sm:text-base">
                    <span class="mt-2 h-2 w-2 shrink-0 rounded-full bg-green-600 dark:bg-green-400"></span>
                    Picks up booking calls automatically during busy service windows
                  </li>
                  <li class="flex items-start gap-3 text-sm leading-7 text-muted-foreground sm:text-base">
                    <span class="mt-2 h-2 w-2 shrink-0 rounded-full bg-green-600 dark:bg-green-400"></span>
                    Collects date, time, party size, and guest details by voice
                  </li>
                  <li class="flex items-start gap-3 text-sm leading-7 text-muted-foreground sm:text-base">
                    <span class="mt-2 h-2 w-2 shrink-0 rounded-full bg-green-600 dark:bg-green-400"></span>
                    Handles multiple reservation requests without missed calls or rushed staff handoffs
                  </li>
                  <li class="flex items-start gap-3 text-sm leading-7 text-muted-foreground sm:text-base">
                    <span class="mt-2 h-2 w-2 shrink-0 rounded-full bg-green-600 dark:bg-green-400"></span>
                    Syncs directly with your booking workflow so confirmed details stay organized
                  </li>
                </ul>


              </div>

              <div>
                <ClientOnly>
                  <Vapi_call_button />
                </ClientOnly>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </section>

      <div class="px-6">
        <div class="mx-auto max-w-7xl border-t border-border"></div>
      </div>

      <section class="px-6 pb-8 pt-20 sm:pt-28">
        <ScrollReveal>
          <div class="mx-auto max-w-7xl">
            <div class="max-w-2xl">
              <p class="text-xs font-semibold uppercase tracking-[0.24em] text-green-700 dark:text-green-400">Features
              </p>
              <h2 class="mt-4 text-3xl font-semibold tracking-[-0.04em] text-foreground sm:text-5xl sm:leading-[1.02]">
                Every core part of the venue, designed to work together.
              </h2>
            </div>
          </div>
        </ScrollReveal>
      </section>

      <FeatureStorySection v-for="section in featureSections" :id="section.id" :key="section.title"
        :index="section.index" :eyebrow="section.eyebrow" :title="section.title" :description="section.description"
        :bullets="section.bullets" :image="section.image" :image-alt="section.imageAlt" :reverse="section.reverse" />

      <div class="px-6">
        <div class="mx-auto max-w-7xl border-t border-border"></div>
      </div>

      <section class="px-6 py-20 sm:py-28">
        <ScrollReveal>
          <div class="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:items-start">
            <div>
              <p class="text-xs font-semibold uppercase tracking-[0.24em] text-green-700 dark:text-green-400">Benefits
              </p>
              <h2 class="mt-4 text-3xl font-semibold tracking-[-0.04em] text-foreground sm:text-5xl sm:leading-[1.02]">
                The result is a business that runs with more clarity.
              </h2>
            </div>

            <div class="space-y-10">
              <div v-for="(note, i) in operatorNotes" :key="note" class="flex items-start gap-6">
                <span class="text-4xl font-semibold tracking-tight text-muted-foreground/40">{{ String(i +
                  1).padStart(2, '0') }}</span>
                <div class="pt-2">
                  <p class="text-[11px] font-semibold uppercase tracking-[0.28em] text-muted-foreground">Outcome</p>
                  <p class="mt-2 text-base leading-7 text-foreground">{{ note }}</p>
                </div>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </section>

      <section id="testimonials" class="px-6 py-20 sm:py-24">
        <ScrollReveal>
          <div class="mx-auto max-w-7xl">
            <div class="max-w-2xl">
              <p class="text-xs font-semibold uppercase tracking-[0.24em] text-green-700 dark:text-green-400">
                Testimonials</p>
              <h2 class="mt-4 text-3xl font-semibold tracking-[-0.04em] text-foreground sm:text-5xl sm:leading-[1.02]">
                Operators switch because the whole business feels lighter in practice.
              </h2>
            </div>

            <div class="mt-20 grid gap-12 lg:grid-cols-3 lg:gap-8">
              <article v-for="item in testimonials" :key="item.name" class="flex flex-col justify-between">
                <p class="text-xl leading-relaxed tracking-[-0.02em] text-foreground">“{{ item.quote }}”</p>
                <div class="mt-8 pt-6">
                  <p class="text-sm font-bold text-foreground uppercase tracking-[0.05em]">{{ item.name }}</p>
                  <p class="mt-1.5 text-sm text-muted-foreground">{{ item.title }}</p>
                </div>
              </article>
            </div>
          </div>
        </ScrollReveal>
      </section>

      <div class="px-6">
        <div class="mx-auto max-w-7xl border-t border-border"></div>
      </div>

      <section id="pricing" class="px-6 py-20 sm:py-28">
        <ScrollReveal>
          <div class="mx-auto max-w-7xl">
            <div class="max-w-2xl">
              <p class="text-xs font-semibold uppercase tracking-[0.24em] text-green-700 dark:text-green-400">Pricing
              </p>
              <h2 class="mt-4 text-3xl font-semibold tracking-[-0.04em] text-foreground sm:text-5xl sm:leading-[1.02]">
                Every feature. One fixed price: $25 per month.
              </h2>
            </div>

            <div class="mt-20 grid gap-12 lg:grid-cols-3 lg:gap-8">
              <article v-for="plan in pricingPlans" :key="plan.name"
                class="flex flex-col border-t border-border pt-8 pl-0">
                <div class="flex items-center gap-3">
                  <p class="text-xs font-bold uppercase tracking-[0.25em] text-foreground">{{ plan.name }}</p>
                  <span v-if="plan.featured"
                    class="rounded-full bg-green-500/10 px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-[0.2em] text-green-600 dark:text-green-500">
                    Recommended
                  </span>
                </div>
                <div class="mt-6 flex items-baseline gap-2">
                  <p v-if="plan.oldPrice" class="pb-1 text-sm font-medium text-muted-foreground line-through">{{
                    plan.oldPrice }}</p>
                  <p class="text-5xl font-semibold tracking-[-0.05em] text-foreground">{{ plan.price }}</p>
                  <p v-if="plan.price !== 'Custom'" class="pb-1.5 text-sm font-medium text-muted-foreground">/ month</p>
                </div>
                <p class="mt-6 text-sm font-medium leading-relaxed text-muted-foreground">{{ plan.note }}</p>

                <ul class="mt-8 space-y-4 flex-grow">
                  <li v-for="feature in plan.features" :key="feature"
                    class="flex items-center gap-3 text-sm font-medium text-foreground/80">
                    <span class="h-[3px] w-[3px] shrink-0 rounded-full bg-green-600 dark:bg-green-500"></span>
                    <span>{{ feature }}</span>
                  </li>
                </ul>

                <NuxtLink to="/dashboard"
                  class="mt-12 inline-flex h-12 w-full items-center justify-center rounded-full text-sm font-semibold tracking-[0.02em] transition-transform"
                  :class="plan.featured ? 'bg-foreground text-background shadow-xl shadow-foreground/5 hover:scale-[1.02] active:scale-[1] ' : 'border border-border bg-transparent text-foreground hover:bg-accent/50'">
                  Start Operating
                </NuxtLink>
              </article>
            </div>
          </div>
        </ScrollReveal>
      </section>

      <div class="px-6">
        <div class="mx-auto max-w-7xl border-t border-border"></div>
      </div>

      <section class="px-6 py-20 sm:py-28">
        <ScrollReveal>
          <div class="mx-auto max-w-7xl">
            <div class="max-w-3xl">
              <p class="text-xs font-semibold uppercase tracking-[0.24em] text-green-700 dark:text-green-400">Get
                started</p>
              <h2 class="mt-4 text-4xl font-semibold tracking-[-0.05em] text-foreground sm:text-5xl sm:leading-[1.02]">
                Replace scattered tools with one system your team can actually run the business on.
              </h2>
              <p class="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
                Launch RestoQuick with real bookings, smarter scheduling, faster kitchen flow, and clearer business
                visibility from day one.
              </p>
            </div>

            <div class="mt-10 flex items-center gap-8">
              <NuxtLink to="/dashboard"
                class="inline-flex items-center justify-center bg-green-600 px-7 py-3.5 text-sm font-semibold text-white transition hover:bg-green-700">
                Get Started
              </NuxtLink>
              <a href="#maya"
                class="text-sm font-medium text-muted-foreground underline underline-offset-4 transition hover:text-foreground">
                Explore Maya
              </a>
            </div>
          </div>
        </ScrollReveal>
      </section>
    </main>

    <HomeFooter />
  </div>
</template>