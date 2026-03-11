<script lang="ts" setup>
import type { Table } from '~/generated/prisma/client'

defineProps<{
    table: Table
}>()
</script>


<template>
    <div class=" border rounded-xl bg-card space-y-2  w-60 hover:border-ring ">
        <div class=" p-4 flex flex-col space-y-4">
              <div class="bg-accent rounded-lg px-4 py-[1px] text-sm w-fit">

                  <span class=" text-sm">Table</span>
              </div>
                     <h2 class=" text-5xl font-semibold">{{ table.number }}</h2>
               

         </div>
            <div class=" space-y-3">


                <div class="flex items-center justify-between  gap-2  bg-accent/20  border-t p-4 bg- ">
                    <div>
                        <p class=" text-muted-foreground">Capacity </p>
                    </div>
                    <div class=" flex items-center gap-2">

                        <i class=" pi pi-users"></i>
                        <span class=" ">{{ table.capacity }}</span>
                    </div>

                </div>
            </div>
      
    </div>
</template>