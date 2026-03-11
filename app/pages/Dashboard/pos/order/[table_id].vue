<script lang="ts" setup>

definePageMeta({
    layout:'dashboard-layout'
})
const route = useRoute();
const table_id = route.params.table_id

console.log(table_id)
</script>

<template>
    i'm order
    </template>