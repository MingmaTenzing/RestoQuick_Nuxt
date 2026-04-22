<script lang="ts" setup>
definePageMeta({
	layout: 'dashboard-layout'
})
import { type TableGetPayloadWithSession } from '~~/types/table_include_session'
import Assign_Table_Session_Modal from '~/components/pos_components/Assign_Table_Session_Modal.vue'
import Table_Card from '~/components/pos_components/Table_Card.vue'
import { start } from 'repl'


//the table is returned with active sessions included, 
//as one table can only have one active session, 
// we can check if the table has an active session by checking if the sessions array is empty or not.
const { data: tables, pending, refresh } = await useFetch<TableGetPayloadWithSession[]>('/api/tables')

const router = useRouter();
const toast = useToast();
const showAssignModal = ref(false);
const selectedTable = ref<TableGetPayloadWithSession | null>(null)
const isAssigningTable = ref(false)

const searchQuery = ref('')

const search_filteredTables = computed(() => {
	const allTables = tables.value ?? []
	const normalizedQuery = searchQuery.value.trim().toLowerCase()

	if (!normalizedQuery) {
		return allTables
	}

	return allTables.filter((table) => {
		return table.number.toLowerCase().includes(normalizedQuery) || String(table.capacity).includes(normalizedQuery)
	})
})


function Assign_or_redirect(table: TableGetPayloadWithSession) {
	//check if has active session if yes, redirect to the order page for that table, if not, open the assign modal to

	if (table.sessions.length > 0) {
		//redirect to the order page for that table
		return router.push(`/dashboard/pos/order/${table.id}`)
	}
	//else open the assign modal to assign the table to a session and then redirect to the order page for that table
	showAssignModal.value = true;
	selectedTable.value = table;


}


async function assignTable() {
	// open the assign modal and pass the table id to the modal
	isAssigningTable.value = true;

	try {
		const start_session = await $fetch('/api/table-sessions', {
			method: 'post',
			body: {
				tableId: selectedTable.value?.id
			}
		})

		if (start_session) {

			console.log(start_session)
			toast.success({ message: 'Table assigned successfully!' });

		}


	} catch (error) {

		console.log(error)
		toast.error({ message: 'Failed to assign table. Please try again.' });


	}
	finally {
		isAssigningTable.value = false;
		showAssignModal.value = false;
		selectedTable.value = null;
		refresh()

	}


}

function closeAssignModal() {
	showAssignModal.value = false
	selectedTable.value = null
}
</script>


<template>
	<main class="space-y-8">
		<section class="rounded-4xl border border-border bg-card p-6 shadow-sm md:p-8">
			<div class=" flex justify-between items-center">

				<div>

					<p class="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">Dining service
					</p>
					<h1 class="text-2xl md:text-5xl">Choose a table</h1>
					<p class="text-sm leading-6 text-muted-foreground md:text-base">
						Select a table here and you will be redirected to the order page for that table.
					</p>
				</div>

				<NuxtLink to="/dashboard/pos"
					class="inline-flex items-center gap-4  rounded-full border border-border bg-secondary px-6 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-accent">
					<i class="pi pi-arrow-left text-sm"></i>
					<span>Back to POS</span>
				</NuxtLink>

			</div>
		</section>

		<section class="rounded-4xl border border-border bg-card p-5 shadow-sm md:p-6">
			<div class="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
				<div>
					<p class="text-sm font-medium text-foreground">Table overview</p>
					<p class="mt-1 text-sm text-muted-foreground">Browse active dining tables and start a new order in
						one tap.</p>
				</div>

				<div class="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
					<label class="relative block w-full max-w-md">
						<span
							class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-muted-foreground">
							<i class="pi pi-search text-sm"></i>
						</span>
						<input v-model="searchQuery" type="search" placeholder="Search by table number or capacity"
							class="h-12 w-full rounded-2xl border border-border bg-background pl-11 pr-4 text-sm text-foreground outline-none transition focus:border-ring focus:ring-2 focus:ring-ring/20">
					</label>

					<div class="inline-flex items-center gap-2 rounded-2xl bg-accent px-3 py-2 text-sm text-foreground">
						<i class="pi pi-th-large text-xs"></i>
						<span>{{ search_filteredTables.length }} of {{ tables?.length ?? 0 }} tables</span>
					</div>
				</div>
			</div>
		</section>

		<section v-if="pending" class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
			<div v-for="index in 8" :key="index" class="h-56 animate-pulse rounded-4xl border border-border bg-card">
			</div>
		</section>

		<section v-else-if="search_filteredTables.length"
			class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
			<div v-for="table in search_filteredTables" :key="table.id" class=" block h-full">

				<div v-on:click="Assign_or_redirect(table)">

					<Table_Card :table="table" :is-active="table.sessions.length > 0" />
				</div>

			</div>
		</section>

		<section v-else-if="tables?.length"
			class="rounded-4xl border border-dashed border-border bg-card px-6 py-14 text-center shadow-sm">
			<h2 class="text-xl font-semibold text-foreground">No matching tables</h2>
			<p class="mt-2 text-sm leading-6 text-muted-foreground">
				Try another table number or search by seat capacity.
			</p>
		</section>

		<section v-else class="rounded-4xl border border-dashed border-border bg-card px-6 py-14 text-center shadow-sm">
			<h2 class="text-xl font-semibold text-foreground">No tables available</h2>
			<p class="mt-2 text-sm leading-6 text-muted-foreground">
				Add your tables first before starting a dining order.
			</p>
		</section>

		<Transition>
			<div v-if="showAssignModal && selectedTable"
				class="fixed inset-0 z-50 flex items-center justify-center bg-background/80 p-4">
				<Assign_Table_Session_Modal :table="selectedTable" :is-assigning="isAssigningTable"
					@close="closeAssignModal" @assign="assignTable" />
			</div>
		</Transition>
	</main>
</template>
