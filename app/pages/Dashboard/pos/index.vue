<script lang="ts" setup>
import Table_Card from '~/components/pos_components/Table_Card.vue';



definePageMeta({
    layout: 'dashboard-layout'
})

const { data: tables } = useFetch('/api/tables')
</script>


<template>
    <main class="space-y-8">
        <section class="space-y-2">
            <h1 class="text-2xl md:text-4xl">Select Table and Start Ordering</h1>
        </section>

        <section class=" flex flex-wrap gap-10 ">
            <div v-for="table in tables" :key="table.id" class=" ">
                <NuxtLink :to="`/dashboard/pos/order/${table.id}`">
                    <Table_Card :table ></Table_Card>

                </NuxtLink>
            </div>
        </section>

    </main>
</template>