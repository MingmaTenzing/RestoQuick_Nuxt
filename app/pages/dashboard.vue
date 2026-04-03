<script setup lang="ts">


// the dashboard checks the auth in two layers..
// first is route middleware 
// another is the page gaurd... so ensure only authenticated users are allowed to view dashboard.


definePageMeta({
	middleware: 'auth',
	layout:'dashboard-layout'
})


</script>


<template>
	<main>
		<NuxtPage />

	</main>
</template>