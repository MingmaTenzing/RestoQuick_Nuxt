<script setup lang="ts">
import auth from '~/middleware/auth'

definePageMeta({
	// layout: 'dashboard-layout',
	middleware: [auth]
})
</script>

<template>
	<NuxtLayout name="dashboard-layout">

		<NuxtPage />
	</NuxtLayout>
</template>