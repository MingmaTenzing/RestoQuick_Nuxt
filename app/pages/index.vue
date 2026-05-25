<script setup lang="ts">
import HomeHeroSection from '~/components/home_components/HomeHeroSection.vue';
import NavBar from '~/components/home_components/NavBar.vue';
</script>

<template>
  <div class="bg-background text-foreground">
    <main>
      <NavBar />
      <HomeHeroSection />

      <div class="px-6">
        <div class="mx-auto max-w-7xl border-t border-border"></div>
      </div>

      <ClientOnly fallback-tag="section">
        <LazyHomeComponentsHomeOverviewSection />
      </ClientOnly>

      <div class="px-6">
        <div class="mx-auto max-w-7xl border-t border-border"></div>
      </div>

      <ClientOnly fallback-tag="section">
        <LazyHomeComponentsHomeMayaSection />
      </ClientOnly>

      <div class="px-6">
        <div class="mx-auto max-w-7xl border-t border-border"></div>
      </div>

      <ClientOnly fallback-tag="section">
        <LazyHomeComponentsHomeFeaturesSection />
      </ClientOnly>

      <div class="px-6">
        <div class="mx-auto max-w-7xl border-t border-border"></div>
      </div>

      <ClientOnly fallback-tag="section">
        <LazyHomeComponentsHomeBenefitsSection />
      </ClientOnly>

      <ClientOnly fallback-tag="section">
        <LazyHomeComponentsHomeTestimonialsSection />
      </ClientOnly>

      <div class="px-6">
        <div class="mx-auto max-w-7xl border-t border-border"></div>
      </div>

      <ClientOnly fallback-tag="section">
        <LazyHomeComponentsHomePricingSection />
      </ClientOnly>

      <div class="px-6">
        <div class="mx-auto max-w-7xl border-t border-border"></div>
      </div>

      <ClientOnly fallback-tag="section">
        <LazyHomeComponentsHomeCtaSection />
      </ClientOnly>
    </main>

    <ClientOnly fallback-tag="footer">
      <LazyHomeComponentsHomeFooter />
    </ClientOnly>
  </div>
</template>