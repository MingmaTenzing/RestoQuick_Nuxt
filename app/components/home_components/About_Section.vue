<script setup lang="ts">
import { ref } from 'vue'

const about_items = ref<accordionItems[]>([
  {
    value: 'item-1',
    title: 'Blazing Fast Performance',
    icon: 'pi pi-bolt',
    content:
      'Experience instant load times and smooth navigation—RestroMate is optimized for speed and reliability.',
  },
  {
    value: 'item-2',
    title: 'Install on Any Device',
    icon: 'pi pi-desktop',
    content:
      'Use RestroMate anywhere—desktop, tablet, or mobile. It works like a native app once installed.',
  },
  {
    value: 'item-3',
    title: 'Offline Support',
    icon: 'pi pi-cloud',
    content:
      'Continue managing your restaurant even without internet. All changes sync automatically when you’re back online.',
  },
  {
    value: 'item-4',
    title: 'Free Basic Version',
    icon: 'pi pi-wallet',
    content:
      'Access all essential features—roster, stock, and bookings—without any subscription fees.',
  },
  {
    value: 'item-5',
    title: 'All-in-One Dashboard',
    icon: 'pi pi-th-large',
    content:
      'Get everything you need in one place—staff schedules, inventory, bookings, and daily tasks.',
  },
  {
    value: 'item-6',
    title: 'Secure Data Handling',
    icon: 'pi pi-lock',
    content:
      'Your information is encrypted and safely stored locally and in the cloud for peace of mind.',
  },
  {
    value: 'item-7',
    title: 'Multi-Restaurant Management',
    icon: 'pi pi-building',
    content:
      'Manage multiple branches easily with separate tracking and reports for each location.',
  },
  {
    value: 'item-8',
    title: 'Simple & Intuitive Design',
    icon: 'pi pi-check-circle',
    content:
      'Built for everyone—no tech skills required. RestroMate’s interface is clean, modern, and easy to use.',
  },
])


</script>

<template>
  <div class="my-10 space-y-10">

    <section>


    </section>

    <section class="space-y-6 lg:w-1/2">
      <h2 class="text-4xl md:text-6xl">Modern and Powerful App that simplifies your work</h2>
      <p>
        Restro Mate helps you easily create roster, manage stocks and all the essential parts of
        restaurant easily.
      </p>
      <button class="bg-violet-500 px-4 py-2 text-white">Start Using</button>
    </section>

    <section class=" flex flex-col gap-6 md:flex-row md:items-center">
      <div class=" space-y-4 relative md:w-[50%] h-[480px] overflow-y-scroll scrollbar-hide  ">

        <div v-for="item in about_items">
          <About_Section_Accordion :item="item"></About_Section_Accordion>
        </div>

      </div>
      <div class=" w-full">
        <img src="../../assets/Macbook-Air-localhost.png" class=" w-full"></img>
      </div>
    </section>
  </div>
</template>


