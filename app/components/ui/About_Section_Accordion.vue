<script lang="ts" setup>
import type accordionItems from "../../../types/accordionItems"
import { ref } from 'vue'

const items = defineProps<{ item: accordionItems }>()
const isFeatureHovered = ref(false)
</script>

<template>
  <section class="border-b cursor-pointer p-4 group/feature">
    <div class="" @click="isFeatureHovered = !isFeatureHovered">
      <div class="flex justify-between items-center">
        <!-- icon -->
        <div class="flex space-x-2 items-center">
          <i :class="` ${item.icon} `"></i>
          <h3 class="group-hover/feature:text-violet-500 text-lg font-medium">{{ item.title }}</h3>
        </div>
        <div>
          <i v-if="!isFeatureHovered" class="pi pi-angle-down"></i>
          <i v-else class="pi pi-angle-up"></i>
        </div>
      </div>
      <Transition>
        <div class="p-2" v-if="isFeatureHovered">
          <p>
            {{ item.content }}
          </p>
        </div>
      </Transition>
    </div>
  </section>
</template>

<style>
.v-enter-active,
.v-leave-active {
  transition:
    transform 0.5s ease,
    opacity 0.5s ease;
}

.v-enter-from,
.v-leave-to {
  transform: translateY(20%);
  opacity: 0;
}
/* .v-enter-to,
.v-leave-from {
  transform: translateY(0);
  opacity: 1;
} */
</style>
