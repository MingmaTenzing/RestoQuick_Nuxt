<script lang="ts" setup>

const route = useRoute();
const session_id = route.query.session_id;


const { data} = useFetch(`/api/stripe-checkout?session_id=${session_id}`)





</script>

<template>

    dsf
</template>