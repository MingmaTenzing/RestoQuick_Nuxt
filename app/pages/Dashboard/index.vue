<script setup lang="ts">

definePageMeta({
    layout: 'dashboard-layout'
})

const { data } = await useFetch('/api/users');
console.log(data.value)

</script>


<template>

    i'm dashboard
    <button class="border">add users</button>

<div>
    {{ data }}
</div>
</template>