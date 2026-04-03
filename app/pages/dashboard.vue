<script setup lang="ts">


// the dashboard checks the auth in two layers..
// first is route middleware 
// another is the page gaurd... so ensure only authenticated users are allowed to view dashboard.


definePageMeta({
	middleware: 'auth',
	layout:'dashboard-layout'
})


const { isSignedIn, isLoaded} = useAuth();
</script>


<template>
	<main v-if="isLoaded">
		<NuxtPage v-if="isSignedIn"/>

	</main>
</template>