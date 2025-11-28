<script setup lang="ts">
import About_Section from '~/components/home_components/About_Section.vue';
import Features from '~/components/home_components/Features.vue';
import NavBar from '~/components/home_components/NavBar.vue';
import TitleSection from '~/components/home_components/TitleSection.vue';
import Trusted_By from '~/components/home_components/Trusted_By.vue';
import BackgroundGrid from '~/components/ui/BackgroundGrid.vue';

</script>

<template>
<main class="">
    <section class="lg:w-[1200px] m-auto p-4">
      <NavBar />
    </section>
    <section>
      <!-- the hero section  with gradient background-->
      <BackgroundGrid class="">
        <div class="lg:w-[1200px] m-auto p-4">
        

            <TitleSection></TitleSection>
          
        </div>
      </BackgroundGrid>
    </section>

    <section class="lg:w-[1200px] m-auto p-4">
      <!-- start of features section aftert the main image -->
      <Features />
    </section>

    <section class="">
      <div class="lg:w-[1200px] m-auto p-4">
        <About_Section />
      </div>
    </section>

    <section class="">
      <div class="lg:w-[1200px] m-auto p-4">
        <Trusted_By></Trusted_By>
      </div>
    </section>
  </main>
    </template>

    

    