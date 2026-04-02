<script setup lang="ts">
import auth from '~/middleware/auth'

definePageMeta({
	layout: 'dashboard-layout',
	middleware: [auth]
})
</script>

<template>
	<NuxtPage />
</template>