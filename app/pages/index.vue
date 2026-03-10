<script setup lang="ts">
import FeatureStorySection from '~/components/home_components/FeatureStorySection.vue';
import HomeFooter from '~/components/home_components/HomeFooter.vue';
import NavBar from '~/components/home_components/NavBar.vue';
import ScrollReveal from '~/components/home_components/ScrollReveal.vue';
import logoUrl from '~/assets/images/RestoQuick.png';
import heroShot from '~/assets/images/app_screenshots/Dashboard.webp';
import mayaShot from '~/assets/images/app_screenshots/Bookings.webp';
import rosterShot from '~/assets/images/app_screenshots/AI Roster Suggestion.png';
import kitchenShot from '~/assets/images/app_screenshots/Kitchen Display.webp';
import analyticsShot from '~/assets/images/app_screenshots/Dashboard.webp';
import inventoryShot from '~/assets/images/app_screenshots/Stock Management.webp';
import tableShot from '~/assets/images/app_screenshots/Table Managment.webp';
import bookingsOverviewShot from '~/assets/images/app_screenshots/Bookings.webp';
import orderShot from '~/assets/images/app_screenshots/Order Details.webp';

const overviewCards = [
  {
    title: 'Operations in one place',
    description: 'Bookings, kitchen flow, staffing, and reporting stay connected instead of living across separate tools.',
    image: analyticsShot,
    alt: 'RestoQuick dashboard overview',
  },
  {
    title: 'Built for service teams',
    description: 'Front-of-house and back-of-house teams work from the same source of truth with less noise and fewer handoffs.',
    image: orderShot,
    alt: 'RestoQuick order management interface',
  },
  {
    title: 'Ready during peak hours',
    description: 'From calls and reservations to tickets and turn times, the system is designed for high-pressure service windows.',
    image: bookingsOverviewShot,
    alt: 'RestoQuick booking management interface',
  },
];

const featureSections = [
  {
    id: 'features',
    index: '01',
    eyebrow: 'AI Staff Rostering',
    title: 'Build stronger schedules in minutes, not hours.',
    description:
      'RestoQuick turns roster planning into a calmer, more deliberate workflow with AI suggestions that account for staffing demand and shift coverage.',
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
      'From revenue patterns to peak-hour behavior, the dashboard gives operators a sharper view of how the restaurant is performing every day.',
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
    title: 'Stay ahead of staffing issues and stock shortages.',
    description:
      'Manage hours, team visibility, and inventory status with cleaner operational controls that reduce surprises during service.',
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
      'RestoQuick gave us the first operating view that actually feels calm during service. Maya alone changed how we handle bookings.',
    name: 'Amelia Hart',
    title: 'Owner, Hart House Dining',
  },
  {
    quote:
      'The kitchen display and analytics changed the pace of the restaurant. We make faster calls, and the team trusts the system.',
    name: 'Noah Patel',
    title: 'Operations Lead, Ember Table',
  },
  {
    quote:
      'Scheduling used to be a weekly drain. Now our managers spend less time building rosters and more time improving service.',
    name: 'Sofia Nguyen',
    title: 'General Manager, Juniper & Co.',
  },
];

const pricingPlans = [
  {
    name: 'Starter',
    price: '$79',
    note: 'For smaller venues getting organized.',
    features: ['Core operations', 'Bookings', 'Table management'],
    featured: false,
  },
  {
    name: 'Growth',
    price: '$149',
    note: 'For busy restaurants that need better flow.',
    features: ['Maya AI assistant', 'Kitchen display', 'Analytics'],
    featured: true,
  },
  {
    name: 'Scale',
    price: 'Custom',
    note: 'For groups and multi-location operations.',
    features: ['Advanced controls', 'Team support', 'Custom rollout'],
    featured: false,
  },
];

const operatorNotes = [
  'Fewer missed calls and fewer booking bottlenecks',
  'Faster kitchen coordination and clearer service flow',
  'Better visibility across staffing, tables, and revenue',
];

const signatureNotes = [
  {
    label: 'Signal',
    value: 'A cleaner operational read on what matters right now.',
  },
  {
    label: 'Flow',
    value: 'One connected system from phone call to completed service.',
  },
  {
    label: 'Control',
    value: 'Sharper decisions without adding visual noise to the team.',
  },
];
</script>

<template>
  <div class="bg-background text-foreground transition-colors duration-300">
    <main class="bg-background">
      <NavBar />
      <section id="main" class="relative overflow-hidden px-6 pb-20 pt-10 sm:pb-24 sm:pt-16">
        <div
          aria-hidden="true"
          class="pointer-events-none absolute left-1/2 top-[42%] hidden -translate-x-1/2 -translate-y-1/2 rounded-full dark:block"
          style="
            width: 54rem;
            height: 54rem;
            background: radial-gradient(circle at center, color-mix(in oklab, var(--color-green-700, #15803d) 28%, transparent) 0%, color-mix(in oklab, var(--color-green-600, #16a34a) 16%, transparent) 34%, transparent 72%);
            opacity: 0.95;
            -webkit-mask-image: radial-gradient(circle at center, black 0%, black 40%, transparent 76%);
            mask-image: radial-gradient(circle at center, black 0%, black 40%, transparent 76%);
          "
        />
        <div
          aria-hidden="true"
          class="pointer-events-none absolute left-1/2 top-[42%] hidden -translate-x-1/2 -translate-y-1/2 rounded-full dark:block"
          style="
            width: 48rem;
            height: 48rem;
            background-image: radial-gradient(circle, color-mix(in oklab, var(--color-green-500, #22c55e) 52%, transparent) 0.75px, transparent 1.4px);
            background-size: 14px 14px;
            opacity: 0.7;
            -webkit-mask-image: radial-gradient(circle at center, black 0%, black 32%, transparent 72%);
            mask-image: radial-gradient(circle at center, black 0%, black 32%, transparent 72%);
          "
        />

        <div class="relative z-10 mx-auto grid max-w-7xl items-start gap-16 lg:grid-cols-[minmax(0,0.88fr)_minmax(0,1.12fr)] lg:gap-24">
          <div>
            <p class="text-xs font-semibold uppercase tracking-[0.26em] text-green-700 dark:text-green-400">
              AI-powered restaurant management system
            </p>
            <h1 class="mt-5 max-w-3xl text-5xl font-semibold tracking-[-0.07em] text-foreground sm:text-6xl lg:text-[5.7rem] lg:leading-[0.92]">
              Run your restaurant smarter.
            </h1>
            <p class="mt-7 max-w-2xl text-lg leading-8 text-muted-foreground sm:text-xl">
              RestoQuick brings bookings, service, staffing, and performance into one refined
              platform so your team can move faster without feeling rushed.
            </p>

            <div class="mt-8 flex flex-wrap gap-3">
              <span class="rounded-2xl border border-border bg-muted px-4 py-2 text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">Bookings</span>
              <span class="rounded-2xl border border-border bg-muted px-4 py-2 text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">Kitchen</span>
              <span class="rounded-2xl border border-border bg-muted px-4 py-2 text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">Staffing</span>
              <span class="rounded-2xl border border-border bg-muted px-4 py-2 text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">Analytics</span>
            </div>

            <div class="mt-10 flex flex-col gap-4 sm:flex-row">
              <NuxtLink
                to="/dashboard"
                class="inline-flex items-center justify-center rounded-full bg-green-600 px-7 py-3.5 text-sm font-semibold text-white transition hover:bg-green-700"
              >
                Get Started
              </NuxtLink>
              <a
                href="#demo"
                class="inline-flex items-center justify-center rounded-full border border-border bg-secondary px-7 py-3.5 text-sm font-semibold text-secondary-foreground transition hover:bg-accent hover:text-accent-foreground"
              >
                Watch Demo
              </a>
            </div>

            <div class="mt-14 grid gap-5 border-t border-border pt-8 sm:grid-cols-3">
              <div v-for="item in signatureNotes" :key="item.label" class="space-y-3">
                <p class="text-[11px] font-semibold uppercase tracking-[0.28em] text-muted-foreground">{{ item.label }}</p>
                <p class="text-sm leading-7 text-muted-foreground">{{ item.value }}</p>
              </div>
            </div>
          </div>

          <div id="demo" class="lg:pt-6">
            <img :src="heroShot" alt="RestoQuick product preview" class="w-full object-cover">

            <div class="mt-5 grid gap-4 sm:grid-cols-[1.1fr_0.9fr]">
              <div class="rounded-[28px] border border-border bg-muted px-5 py-5">
                <p class="text-[11px] font-semibold uppercase tracking-[0.28em] text-muted-foreground">Why it feels different</p>
                <p class="mt-3 text-sm leading-7 text-muted-foreground">
                  Designed more like a control surface than a dashboard, so every screen feels quiet,
                  fast, and deliberate during service.
                </p>
              </div>
              <div class="rounded-[28px] border border-border bg-muted px-5 py-5">
                <p class="text-3xl font-semibold tracking-[-0.05em] text-foreground">24/7</p>
                <p class="mt-2 text-sm leading-7 text-muted-foreground">Maya covers calls and reservations around the clock.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="overview" class="border-y border-border px-6 py-20 sm:py-28">
        <ScrollReveal>
          <div class="mx-auto max-w-7xl">
          <div class="max-w-3xl">
            <p class="text-xs font-semibold uppercase tracking-[0.24em] text-green-700 dark:text-green-400">Product overview</p>
            <h2 class="mt-4 text-3xl font-semibold tracking-[-0.04em] text-foreground sm:text-5xl sm:leading-[1.02]">
              A restaurant platform that tells one coherent story.
            </h2>
            <p class="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
              Most tools solve one part of the restaurant. RestoQuick connects the entire operation
              so bookings, service, staffing, and decision-making feel like one system.
            </p>
          </div>

          <div class="mt-14 grid gap-6 lg:grid-cols-3">
            <article
              v-for="card in overviewCards"
              :key="card.title"
              class="rounded-[30px] border border-border bg-card p-5 transition hover:-translate-y-1"
            >
              <div class="overflow-hidden rounded-[22px] border border-border">
                <img :src="card.image" :alt="card.alt" class="h-56 w-full object-cover">
              </div>
              <h3 class="mt-6 text-xl font-semibold tracking-[-0.03em] text-card-foreground">{{ card.title }}</h3>
              <p class="mt-3 text-sm leading-7 text-muted-foreground sm:text-base">{{ card.description }}</p>
            </article>
          </div>
          </div>
        </ScrollReveal>
      </section>

      <section id="maya" class="px-6 py-20 sm:py-28">
        <ScrollReveal>
          <div class="mx-auto max-w-7xl rounded-[40px] border border-border bg-card px-7 py-8 shadow-lg sm:px-10 sm:py-12 lg:px-14">
          <div class="grid items-center gap-12 lg:grid-cols-[minmax(0,0.88fr)_minmax(0,1.12fr)] lg:gap-20">
            <div>
              <p class="text-xs font-semibold uppercase tracking-[0.26em] text-green-700 dark:text-green-400">AI assistant</p>
              <h2 class="mt-4 max-w-xl text-4xl font-semibold tracking-[-0.05em] text-card-foreground sm:text-5xl lg:text-[3.6rem] lg:leading-[1.02]">
                Meet Maya. Your AI voice host.
              </h2>
              <p class="mt-6 max-w-xl text-lg leading-8 text-muted-foreground">
                Maya answers customer calls, books tables, and handles reservations automatically so
                your team can stay focused on hospitality instead of chasing the phone.
              </p>

              <ul class="mt-8 space-y-4">
                <li class="flex items-start gap-3 text-sm leading-7 text-muted-foreground sm:text-base">
                  <span class="mt-2 h-2 w-2 shrink-0 rounded-full bg-green-600 dark:bg-green-400"></span>
                  Answers incoming restaurant calls automatically
                </li>
                <li class="flex items-start gap-3 text-sm leading-7 text-muted-foreground sm:text-base">
                  <span class="mt-2 h-2 w-2 shrink-0 rounded-full bg-green-600 dark:bg-green-400"></span>
                  Books tables through natural AI voice conversation
                </li>
                <li class="flex items-start gap-3 text-sm leading-7 text-muted-foreground sm:text-base">
                  <span class="mt-2 h-2 w-2 shrink-0 rounded-full bg-green-600 dark:bg-green-400"></span>
                  Handles peak-hour booking volume without missing a call
                </li>
                <li class="flex items-start gap-3 text-sm leading-7 text-muted-foreground sm:text-base">
                  <span class="mt-2 h-2 w-2 shrink-0 rounded-full bg-green-600 dark:bg-green-400"></span>
                  Works 24/7 and syncs directly with table management
                </li>
              </ul>

              <div class="mt-9 inline-flex items-center gap-3 rounded-full border border-border bg-muted px-4 py-3 text-sm font-medium text-foreground">
                <i class="pi pi-microphone text-green-600 dark:text-green-400"></i>
                Always on. Always consistent. Always ready to answer.
              </div>
            </div>

            <div>
              <div class="overflow-hidden rounded-[34px] border border-border bg-card shadow-md">
                <div class="flex items-center justify-between border-b border-border px-5 py-4">
                  <div class="flex items-center gap-3">
                    <img :src="logoUrl" alt="RestoQuick logo" class="h-7 w-auto dark:invert dark:brightness-0">
                    <div>
                      <p class="text-sm font-semibold text-card-foreground">Maya AI assistant</p>
                      <p class="text-xs text-muted-foreground">Voice bookings with live reservation sync</p>
                    </div>
                  </div>
                  <div class="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700 dark:bg-green-500/10 dark:text-green-300">
                    Live
                  </div>
                </div>
                <img :src="mayaShot" alt="Maya AI booking interface screenshot" class="w-full object-cover">
              </div>
            </div>
          </div>
          </div>
        </ScrollReveal>
      </section>

      <section class="px-6 pb-8 pt-4">
        <ScrollReveal>
          <div class="mx-auto max-w-7xl">
            <div class="max-w-2xl">
              <p class="text-xs font-semibold uppercase tracking-[0.24em] text-green-700 dark:text-green-400">Features</p>
              <h2 class="mt-4 text-3xl font-semibold tracking-[-0.04em] text-foreground sm:text-5xl sm:leading-[1.02]">
                Each part of the operation, designed to work together.
              </h2>
            </div>
          </div>
        </ScrollReveal>
      </section>

      <div class="px-6">
        <div class="mx-auto max-w-7xl border-t border-border"></div>
      </div>

      <FeatureStorySection
        v-for="section in featureSections"
        :id="section.id"
        :key="section.title"
        :index="section.index"
        :eyebrow="section.eyebrow"
        :title="section.title"
        :description="section.description"
        :bullets="section.bullets"
        :image="section.image"
        :image-alt="section.imageAlt"
        :reverse="section.reverse"
      />

      <section class="border-y border-border px-6 py-20 sm:py-28">
        <ScrollReveal>
          <div class="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:items-start">
          <div>
            <p class="text-xs font-semibold uppercase tracking-[0.24em] text-green-700 dark:text-green-400">Benefits</p>
            <h2 class="mt-4 text-3xl font-semibold tracking-[-0.04em] text-foreground sm:text-5xl sm:leading-[1.02]">
              The result is a restaurant that runs with more clarity.
            </h2>
          </div>

          <div class="grid gap-4 sm:grid-cols-3">
            <article
              v-for="note in operatorNotes"
              :key="note"
              class="rounded-[28px] border border-border bg-card p-6"
            >
              <p class="text-[11px] font-semibold uppercase tracking-[0.28em] text-muted-foreground">Outcome</p>
              <p class="mt-5 text-base leading-7 text-muted-foreground">{{ note }}</p>
            </article>
          </div>
          </div>
        </ScrollReveal>
      </section>

      <section id="testimonials" class="px-6 py-20 sm:py-24">
        <ScrollReveal>
          <div class="mx-auto max-w-7xl">
          <div class="max-w-2xl">
            <p class="text-xs font-semibold uppercase tracking-[0.24em] text-green-700 dark:text-green-400">Testimonials</p>
            <h2 class="mt-4 text-3xl font-semibold tracking-[-0.04em] text-foreground sm:text-5xl sm:leading-[1.02]">
              Operators switch because the product feels lighter in practice.
            </h2>
          </div>

          <div class="mt-14 grid gap-6 lg:grid-cols-3">
            <article
              v-for="item in testimonials"
              :key="item.name"
              class="rounded-[30px] border border-border bg-card p-8"
            >
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

      <section id="pricing" class="border-t border-border px-6 py-20 sm:py-28">
        <ScrollReveal>
          <div class="mx-auto max-w-7xl">
          <div class="max-w-2xl">
            <p class="text-xs font-semibold uppercase tracking-[0.24em] text-green-700 dark:text-green-400">Pricing</p>
            <h2 class="mt-4 text-3xl font-semibold tracking-[-0.04em] text-foreground sm:text-5xl sm:leading-[1.02]">
              Start simple, then scale with the operation.
            </h2>
          </div>

          <div class="mt-14 grid gap-6 lg:grid-cols-3">
            <article
              v-for="plan in pricingPlans"
              :key="plan.name"
              class="rounded-[30px] border p-8 transition duration-300"
              :class="plan.featured ? 'border-green-600 bg-card shadow-lg' : 'border-border bg-card'"
            >
              <p class="text-sm font-semibold uppercase tracking-[0.22em] text-muted-foreground">{{ plan.name }}</p>
              <div class="mt-6 flex items-end gap-2">
                <p class="text-4xl font-semibold tracking-[-0.05em] text-card-foreground">{{ plan.price }}</p>
                <p v-if="plan.price !== 'Custom'" class="pb-1 text-sm text-muted-foreground">/ month</p>
              </div>
              <p class="mt-4 text-sm leading-7 text-muted-foreground">{{ plan.note }}</p>

              <ul class="mt-8 space-y-3">
                <li v-for="feature in plan.features" :key="feature" class="flex items-start gap-3 text-sm leading-7 text-muted-foreground">
                  <span class="mt-2 h-2 w-2 shrink-0 rounded-full bg-green-600 dark:bg-green-400"></span>
                  <span>{{ feature }}</span>
                </li>
              </ul>

              <NuxtLink
                to="/dashboard"
                class="mt-8 inline-flex items-center rounded-full px-5 py-2.5 text-sm font-semibold transition"
                :class="plan.featured ? 'bg-green-600 text-white hover:bg-green-700' : 'border border-border bg-secondary text-secondary-foreground hover:bg-accent hover:text-accent-foreground'"
              >
                Get Started
              </NuxtLink>
            </article>
          </div>
          </div>
        </ScrollReveal>
      </section>

      <section class="px-6 pb-24 pt-8">
        <ScrollReveal>
          <div class="mx-auto max-w-7xl rounded-[40px] border border-border bg-card px-8 py-12 text-card-foreground shadow-lg sm:px-12 sm:py-16">
          <div class="max-w-3xl">
            <p class="text-xs font-semibold uppercase tracking-[0.24em] text-green-700 dark:text-green-400">Get started</p>
            <h2 class="mt-4 text-4xl font-semibold tracking-[-0.05em] text-card-foreground sm:text-5xl sm:leading-[1.02]">
              Replace operational noise with a system your team actually wants to use.
            </h2>
            <p class="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
              Launch RestoQuick with real bookings, smarter scheduling, faster kitchen flow, and clearer decision-making from day one.
            </p>
          </div>

          <div class="mt-10 flex flex-col gap-4 sm:flex-row">
            <NuxtLink
              to="/dashboard"
              class="inline-flex items-center justify-center rounded-full bg-green-600 px-7 py-3.5 text-sm font-semibold text-white transition hover:bg-green-500"
            >
              Get Started
            </NuxtLink>
            <a
              href="#maya"
              class="inline-flex items-center justify-center rounded-full border border-border bg-secondary px-7 py-3.5 text-sm font-semibold text-secondary-foreground transition hover:bg-accent hover:text-accent-foreground"
            >
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