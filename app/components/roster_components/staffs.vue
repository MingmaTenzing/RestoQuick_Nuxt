<script lang="ts" setup>
import type { Staff } from '~/lib/roster-mockdata';

defineProps< { staff: Staff}> ()
</script>


<template>

    <div>
        
        <div class=" border border-border bg-card text-card-foreground flex items-center gap-4 p-4 rounded-lg">

            <i class=" pi pi-ellipsis-v">

            </i>

            <div class=" flex items-center gap-4">
                <div class=" w-10 h-10 bg-accent rounded-full flex justify-center items-center">{{staff.name[0], staff.name[1]}}</div>
                
                <div class="space-y-2 flex flex-col">

                    <div>{{staff.name}}</div>
                    <div class=" rounded-lg border border-border bg-secondary text-muted-foreground px-4 text-sm  w-fit  ">
                        <span class=" w-auto">{{ staff.role }}</span>
                    </div>
                </div>
            </div>

        </div>
    </div>

    </template>