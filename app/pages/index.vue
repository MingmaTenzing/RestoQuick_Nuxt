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

      <LazyHomeComponentsHomeOverviewSection />

      <div class="px-6">
        <div class="mx-auto max-w-7xl border-t border-border"></div>
      </div>

      <LazyHomeComponentsHomeMayaSection />

      <div class="px-6">
        <div class="mx-auto max-w-7xl border-t border-border"></div>
      </div>

      <LazyHomeComponentsHomeFeaturesSection />

      <div class="px-6">
        <div class="mx-auto max-w-7xl border-t border-border"></div>
      </div>

      <LazyHomeComponentsHomeBenefitsSection />

      <LazyHomeComponentsHomeTestimonialsSection />

      <div class="px-6">
        <div class="mx-auto max-w-7xl border-t border-border"></div>
      </div>

      <LazyHomeComponentsHomePricingSection />

      <div class="px-6">
        <div class="mx-auto max-w-7xl border-t border-border"></div>
      </div>

      <LazyHomeComponentsHomeCtaSection />
    </main>

    <LazyHomeComponentsHomeFooter />
  </div>
</template>