<template>
    <div class="w-75 p-4 border border-border rounded-lg space-y-4 animate-pulse">

  <!-- table number + time -->
  <div class="flex justify-between items-center">
    <div class="h-6 w-16 bg-accent rounded"></div>

    <div class="flex gap-2 items-center">
      <div class="h-4 w-4 bg-accent rounded-full"></div>
      <div class="h-4 w-20 bg-accent rounded"></div>
    </div>
  </div>

  <!-- order items (repeat 2–3 times visually) -->
  <div class="space-y-3">
    <div class="flex space-x-2">
      <div class="h-4 w-6 bg-accent rounded"></div>
      <div class="h-4 w-32 bg-accent rounded"></div>
    </div>

    <!-- special instructions placeholder -->
    <div class="border bg-accent/30 p-2 rounded-lg space-y-2">
      <div class="h-3 w-28 bg-accent rounded"></div>
      <div class="h-3 w-full bg-accent rounded"></div>
    </div>

    <div class="flex space-x-2">
      <div class="h-4 w-6 bg-accent rounded"></div>
      <div class="h-4 w-24 bg-accent rounded"></div>
    </div>
  </div>

  <!-- divider -->
  <div class="w-full h-[0.5px] bg-foreground/20 mt-4 mb-4"></div>

  <!-- customer -->
  <div class="flex gap-2 items-center">
    <div class="h-4 w-20 bg-accent rounded"></div>
    <div class="h-4 w-28 bg-accent rounded"></div>
  </div>

  <!-- divider -->
  <div class="w-full h-[0.5px] bg-foreground/20 mt-4 mb-4"></div>

  <!-- button -->
  <div class="h-10 w-full bg-accent rounded-lg"></div>

</div>
</template>