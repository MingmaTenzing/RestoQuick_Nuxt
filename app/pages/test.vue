<script lang="ts" setup>

const data = ref('hello world')
data.value = "not hello world"
</script>


<template>


<p class=" font-bold bg-amber-400">{{ data }}</p>
</template>