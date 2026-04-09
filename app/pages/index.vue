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

const heroMetrics = [
  {
    label: 'Calls covered',
    value: '24/7',
    detail: 'Maya keeps reservation demand moving without pulling staff off the floor.',
  },
  {
    label: 'Core workflows',
    value: '5',
    detail: 'Bookings, kitchen, staffing, stock, and reporting stay connected.',
  },
  {
    label: 'Setup feel',
    value: 'Calm',
    detail: 'A cleaner operating layer that feels clear even during peak service.',
  },
];

const heroTimeline = [
  {
    title: 'Booking request captured',
    meta: 'Maya confirms time, party size, and notes instantly.',
  },
  {
    title: 'Kitchen and floor stay aligned',
    meta: 'Orders and tables update from the same operational view.',
  },
  {
    title: 'Managers see what needs attention',
    meta: 'Live visibility across staffing, stock, and service pressure.',
  },
];
</script>

<template>
  <div class="bg-background text-foreground">
    <header>

      <Show when="signed-out">
        <SignInButton />
        <SignUpButton />
      </Show>
      <Show when="signed-in">
        <UserButton />
      </Show>
    </header>

    <main>
      <NavBar />
      <section id="main" class="relative isolate overflow-hidden px-6 pb-24 pt-12 sm:pb-32 sm:pt-20">
        <div class="absolute inset-0 -z-30 bg-background"></div>
        <div
          class="absolute inset-x-0 top-0 -z-20 h-136 bg-[radial-gradient(circle_at_top,rgba(34,197,94,0.12),transparent_42%)]">
        </div>
        <div
          class="absolute left-1/2 top-24 -z-10 h-72 w-[min(72rem,92vw)] -translate-x-1/2 rounded-full bg-accent/70 blur-3xl">
        </div>
        <div class="absolute inset-x-6 top-28 -z-10 mx-auto h-px max-w-7xl bg-border/80"></div>

        <div class="mx-auto grid max-w-7xl items-center gap-16 lg:grid-cols-2 lg:gap-20">
          <div class="relative z-10 max-w-3xl">
            <div
              class="inline-flex items-center gap-3 rounded-full border border-border bg-background/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground backdrop-blur">
              <span class="inline-block h-2 w-2 rounded-full bg-green-600 dark:bg-green-400"></span>
              AI-powered operations platform
            </div>

            <h1
              class="mt-8 max-w-4xl text-5xl font-semibold tracking-[-0.07em] text-foreground sm:text-6xl lg:text-[5.4rem] lg:leading-[0.92]">
              Hospitality software that feels as calm as it looks.
            </h1>

            <p class="mt-7 max-w-2xl text-lg leading-8 text-muted-foreground sm:text-xl">
              RestoQuick replaces fragmented tools with one sleek operating layer for bookings, kitchen flow, staffing,
              inventory, and reporting.
            </p>

            <p class="mt-8 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              BOOKINGS / KITCHEN / TEAM / INVENTORY / REPORTING
            </p>

            <div class="mt-10 flex flex-wrap items-center gap-4 sm:gap-6">
              <NuxtLink to="/dashboard"
                class="inline-flex items-center justify-center rounded-full bg-green-600 px-7 py-3.5 text-sm font-semibold text-white transition hover:bg-green-700">
                Get Started
              </NuxtLink>
              <a href="#demo"
                class="inline-flex items-center text-sm font-medium text-foreground underline underline-offset-4 transition hover:text-green-700 dark:hover:text-green-400">
                Watch Demo
              </a>
            </div>

            <div class="mt-14 grid gap-8 border-t border-border pt-8 sm:grid-cols-3">
              <div v-for="item in signatureNotes" :key="item.label">
                <p class="text-[11px] font-semibold uppercase tracking-[0.28em] text-muted-foreground">{{ item.label }}
                </p>
                <p class="mt-2 text-sm leading-7 text-foreground/80 dark:text-foreground/75">{{ item.value }}</p>
              </div>
            </div>
          </div>

          <div id="demo" class="relative z-10">
            <div
              class="relative overflow-hidden rounded-4xl border border-border bg-card/85 p-4 shadow-2xl backdrop-blur-xl sm:p-6">
              <div class="absolute inset-x-8 top-0 h-px bg-border/70"></div>
              <div
                class="absolute right-10 top-10 h-28 w-28 rounded-full bg-green-600/12 blur-2xl dark:bg-green-400/10">
              </div>

              <div class="rounded-3xl border border-border bg-background/85 p-5 sm:p-6">
                <div class="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p class="text-[11px] font-semibold uppercase tracking-[0.28em] text-muted-foreground">Live operator
                      view</p>
                    <p class="mt-2 text-lg font-semibold tracking-[-0.03em] text-foreground">One control layer for the
                      whole venue</p>
                  </div>
                  <div
                    class="rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground">
                    Updated in real time
                  </div>
                </div>

                <div class="mt-6 grid gap-4 sm:grid-cols-3">
                  <div v-for="metric in heroMetrics" :key="metric.label"
                    class="rounded-3xl border border-border bg-card p-4">
                    <p class="text-[11px] font-semibold uppercase tracking-[0.24em] text-muted-foreground">{{
                      metric.label }}</p>
                    <p class="mt-3 text-3xl font-semibold tracking-[-0.05em] text-foreground">{{ metric.value }}</p>
                    <p class="mt-2 text-sm leading-6 text-muted-foreground">{{ metric.detail }}</p>
                  </div>
                </div>

                <div class="mt-6 grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
                  <div class="rounded-3xl border border-border bg-card p-5">
                    <div class="flex items-center justify-between gap-3">
                      <p class="text-sm font-semibold text-foreground">Service timeline</p>
                      <span class="text-xs font-medium text-muted-foreground">Always connected</span>
                    </div>

                    <div class="mt-5 space-y-4">
                      <div v-for="(step, index) in heroTimeline" :key="step.title" class="flex gap-4">
                        <div class="flex flex-col items-center">
                          <div
                            class="flex h-8 w-8 items-center justify-center rounded-full bg-accent text-xs font-semibold text-foreground">
                            {{ index + 1 }}</div>
                          <div v-if="index < heroTimeline.length - 1" class="mt-2 h-full w-px bg-border"></div>
                        </div>
                        <div class="pb-4">
                          <p class="text-sm font-semibold text-foreground">{{ step.title }}</p>
                          <p class="mt-1 text-sm leading-6 text-muted-foreground">{{ step.meta }}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div class="rounded-3xl border border-border bg-card p-5">
                    <p class="text-[11px] font-semibold uppercase tracking-[0.24em] text-muted-foreground">Why it fits
                      growing venues</p>
                    <p class="mt-3 text-sm leading-7 text-foreground/85 dark:text-foreground/80">
                      Designed for operators who need one calm system across bookings, service, staffing, stock, and the
                      day-to-day decisions that keep service moving.
                    </p>

                    <div class="mt-6 space-y-3">
                      <div
                        class="flex items-center justify-between rounded-2xl border border-border bg-background/80 px-4 py-3">
                        <span class="text-sm text-muted-foreground">Reservations captured</span>
                        <span class="text-sm font-semibold text-foreground">Without missed calls</span>
                      </div>
                      <div
                        class="flex items-center justify-between rounded-2xl border border-border bg-background/80 px-4 py-3">
                        <span class="text-sm text-muted-foreground">Team coordination</span>
                        <span class="text-sm font-semibold text-foreground">One shared view</span>
                      </div>
                      <div
                        class="flex items-center justify-between rounded-2xl border border-border bg-background/80 px-4 py-3">
                        <span class="text-sm text-muted-foreground">Manager decisions</span>
                        <span class="text-sm font-semibold text-foreground">Live visibility</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
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

            <div class="mt-16 grid gap-14 lg:grid-cols-3">
              <article v-for="card in overviewCards" :key="card.title">
                <div class="overflow-hidden">
                  <img :src="card.image" :alt="card.alt"
                    class="h-56 w-full object-cover transition duration-500 hover:scale-[1.03]">
                </div>
                <h3 class="mt-6 text-xl font-semibold tracking-[-0.03em] text-foreground">{{ card.title }}</h3>
                <p class="mt-3 text-sm leading-7 text-muted-foreground sm:text-base">{{ card.description }}</p>
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

            <div class="mt-14 grid gap-6 lg:grid-cols-3">
              <article v-for="item in testimonials" :key="item.name"
                class="rounded-[30px] border border-border bg-card p-8">
                <p class="text-lg leading-8 tracking-[-0.02em] text-card-foreground">“{{ item.quote }}”</p>
                <div class="mt-8 border-t border-border pt-6">
                  <p class="text-sm font-semibold text-card-foreground">{{ item.name }}</p>
                  <p class="mt-1 text-sm text-muted-foreground">{{ item.title }}</p>
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

            <div class="mt-16 grid lg:grid-cols-3">
              <article v-for="plan in pricingPlans" :key="plan.name"
                class="relative py-8 lg:px-8 lg:first:pl-0 lg:last:pr-0"
                :class="{ 'lg:border-x lg:border-border': plan.featured }">
                <div v-if="plan.featured"
                  class="mb-4 text-[10px] font-bold uppercase tracking-[0.3em] text-green-600 dark:text-green-400">
                  Recommended
                </div>
                <p class="text-sm font-semibold uppercase tracking-[0.22em] text-muted-foreground">{{ plan.name }}</p>
                <div class="mt-6 flex items-end gap-2">
                  <p v-if="plan.oldPrice" class="pb-1 text-sm text-muted-foreground line-through">{{ plan.oldPrice }}
                  </p>
                  <p class="text-4xl font-semibold tracking-[-0.05em]"
                    :class="plan.featured ? 'text-foreground' : 'text-muted-foreground line-through'">{{ plan.price }}
                  </p>
                  <p v-if="plan.price !== 'Custom'" class="pb-1 text-sm text-muted-foreground">/ month</p>
                </div>
                <p class="mt-4 text-sm leading-7 text-muted-foreground">{{ plan.note }}</p>

                <ul class="mt-8 space-y-3">
                  <li v-for="feature in plan.features" :key="feature"
                    class="flex items-start gap-3 text-sm leading-7 text-muted-foreground">
                    <span class="mt-2 h-2 w-2 shrink-0 rounded-full bg-green-600 dark:bg-green-400"></span>
                    <span>{{ feature }}</span>
                  </li>
                </ul>

                <NuxtLink to="/dashboard" class="mt-8 inline-flex items-center text-sm font-semibold transition"
                  :class="plan.featured ? 'bg-green-600 px-5 py-2.5 text-white hover:bg-green-700' : 'text-muted-foreground underline underline-offset-4 hover:text-foreground'">
                  Get Started
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