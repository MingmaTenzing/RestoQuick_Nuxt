<script setup lang="ts">
definePageMeta({
  layout: 'dashboard-layout',
  middleware: 'is-admin'
})

import type { NuxtError } from '#app';
import Add_Table_Modal_Component from '~/components/manage_table_components/Add_Table_Modal_Component.vue';
import Edit_Table_Modal_Component from '~/components/manage_table_components/Edit_Table_Modal_Component.vue';
import Table_QR_Code from '~/components/manage_table_components/Table_QR_Code.vue';
import type { Table } from '~/generated/prisma/client';

const { edit_table_modal, add_table_modal, open_add_table_modal, open_edit_table_modal, } = useManage_Table_Modal();

const toast = useToast();

const qrModalShow = ref(false);

const selectedTable_for_Qr = ref<Table>();

const { data: tables, status, pending, error, refresh } = useFetch("/api/tables", {
})

async function delete_table(table_id: string) {

  try {
    const delete_table = await $fetch(`/api/tables/${table_id}`, {
      method: 'DELETE',
    })
    if (delete_table) {
      toast.warning({
        title: "Table Deleted"
      })
    }

  } catch (error) {
    const nuxtError = error as NuxtError;
    toast.error({
      title: nuxtError.statusMessage
    })


  }
  finally {
    //once the request is complete refresh will refetch the data
    refresh()
  }
}

function open_qr_modal(table: Table) {
  selectedTable_for_Qr.value = table
  qrModalShow.value = true;
}

function close_qr_modal() {
  selectedTable_for_Qr.value = {
    number: "",
    capacity: 0,
    id: ''
  }
  qrModalShow.value = false
}



</script>

<template>
  <div class=" space-y-8">
    <!-- Header Section -->
    <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div class="space-y-1">
        <h1 class="text-2xl md:text-6xl">Table Management</h1>
        <p class="text-muted-foreground flex items-center gap-2">
          <i class="pi pi-table text-amber-400" />
          Organize seating and manage table layouts
        </p>
      </div>
      <div class="flex flex-col sm:flex-row gap-2">
        <button @click="open_add_table_modal"
          class="px-5 py-2.5 rounded-3xl bg-primary text-primary-foreground hover:bg-primary/90 transition-all hover:shadow-lg flex items-center gap-2 font-medium">
          <i class="pi pi-plus"></i>
          <span>New Table</span>
        </button>
        <NuxtLink to="/dashboard/tables/print-qr-codes"
          class="px-5 py-2.5 rounded-3xl border border-border hover:bg-muted transition-all flex items-center gap-2 font-medium text-foreground">
          <i class="pi pi-print"></i>
          <span>Print QR Codes</span>
        </NuxtLink>
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="flex flex-col gap-4 md:flex-row md:justify-around w-full md:flex-wrap lg:flex-nowrap">
      <!-- Total Tables -->
      <div
        class="border rounded-3xl shadow p-6 border-border w-full bg-card text-card-foreground h-42.5 flex items-center justify-between">
        <div class="flex flex-col justify-between h-full">
          <span class="font-light text-muted-foreground">Total Tables</span>
          <div class="flex flex-col">
            <span v-if="pending" class="w-25 h-12 bg-muted-foreground/20 animate-pulse rounded-3xl"></span>
            <span v-else class="text-lg md:text-4xl lg:text-5xl font-medium">{{ tables?.length || 0 }}</span>
            <span class="text-muted-foreground font-light text-sm">Active seating</span>
          </div>
        </div>
        <div>
          <i class="pi pi-table text-[120px] text-primary opacity-5"></i>
        </div>
      </div>

      <!-- Total Capacity -->
      <div
        class="border rounded-3xl shadow p-6 border-border w-full bg-card text-card-foreground h-42.5 flex items-center justify-between">
        <div class="flex flex-col justify-between h-full">
          <span class="font-light text-muted-foreground">Total Capacity</span>
          <div class="flex flex-col">
            <span v-if="pending" class="w-25 h-12 bg-muted-foreground/20 animate-pulse rounded-3xl"></span>
            <span v-else class="text-lg md:text-4xl lg:text-5xl font-medium ">{{tables?.reduce((sum, t) => sum +
              (t.capacity || 0), 0) || 0 }}</span>
            <span class="text-muted-foreground font-light text-sm">Total guests</span>
          </div>
        </div>
        <div>
          <i class="pi pi-users text-[120px] text-green-500 opacity-5"></i>
        </div>
      </div>

      <!-- Average Capacity -->
      <div
        class="border rounded-3xl shadow p-6 border-border w-full bg-card text-card-foreground h-42.5 flex items-center justify-between">
        <div class="flex flex-col justify-between h-full">
          <span class="font-light text-muted-foreground">Avg. Per Table</span>
          <div class="flex flex-col">
            <span v-if="pending" class="w-25 h-12 bg-muted-foreground/20 animate-pulse rounded-3xl"></span>
            <span v-else class="text-lg md:text-4xl lg:text-5xl font-medium">{{tables && tables.length > 0 ?
              Math.round(tables.reduce((sum, t) => sum + (t.capacity || 0), 0) / tables.length) : 0 }}</span>
            <span class="text-muted-foreground font-light text-sm">Seats per table</span>
          </div>
        </div>
        <div>
          <i class="pi pi-chart-bar text-[120px] text-blue-500 opacity-5"></i>
        </div>
      </div>
    </div>

    <!-- Tables Section (Card Layout) -->
    <div class="space-y-4">
      <div class="flex items-center justify-between">
        <h2 class="text-xl ">Tables</h2>
        <span class="text-sm text-muted-foreground">{{ tables?.length || 0 }} total</span>
      </div>

      <div v-if="pending" class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        <div v-for="i in 6" :key="i" class="rounded-3xl border bg-card p-5 space-y-4">
          <div class="h-8 w-24 rounded bg-muted animate-pulse"></div>
          <div class="h-5 w-28 rounded bg-muted animate-pulse"></div>
          <div class="h-4 w-full rounded bg-muted animate-pulse"></div>
          <div class="flex gap-2 justify-end">
            <div class="h-8 w-16 rounded bg-muted animate-pulse"></div>
            <div class="h-8 w-8 rounded bg-muted animate-pulse"></div>
            <div class="h-8 w-8 rounded bg-muted animate-pulse"></div>
          </div>
        </div>
      </div>

      <div v-else-if="tables && tables.length === 0" class="rounded-3xl border bg-card px-6 py-12 text-center">
        <i class="pi pi-inbox text-4xl text-muted-foreground mb-3 block opacity-50"></i>
        <p class="text-muted-foreground mb-4">No tables yet. Create your first table to get started.</p>
        <button @click="open_add_table_modal"
          class="inline-flex items-center gap-2 px-4 py-2 rounded-3xl bg-primary text-primary-foreground hover:bg-primary/90">
          <i class="pi pi-plus"></i>
          <span>Add Table</span>
        </button>
      </div>

      <div v-else class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        <div v-for="table in tables" :key="table.id"
          class="rounded-3xl border bg-card p-5 hover:shadow-lg transition-shadow">
          <div class="flex items-start justify-between">
            <div>
              <p class="text-xs uppercase tracking-wide text-muted-foreground">Table</p>
              <h3 class="text-4xl font-bold leading-none tracking-tight mt-1">{{ table.number }}</h3>
            </div>
            <div class="w-10 h-10 rounded-3xl bg-primary/10 flex items-center justify-center">
              <i class="pi pi-table text-primary"></i>
            </div>
          </div>

          <div class="mt-4 flex items-center justify-between">
            <span
              class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-500/10 text-green-600 font-medium text-sm">
              <i class="pi pi-users"></i>
              {{ table.capacity }} seats
            </span>
          </div>

          <code
            class="mt-4 px-2.5 py-1.5 rounded bg-muted/50 text-xs font-mono text-foreground/80 max-w-full truncate block">Table Id: {{ table.id }}</code>

          <div class="mt-4 flex gap-2 justify-end">
            <button @click="open_qr_modal(table)"
              class="px-3 py-1.5 rounded-3xl bg-primary hover:bg-primary/90 text-primary-foreground font-medium transition-colors flex items-center gap-1.5 text-sm">
              <i class="pi pi-qrcode"></i>
              QR
            </button>
            <button @click="open_edit_table_modal(table.id)"
              class="px-3 py-1.5 rounded-3xl border border-border hover:bg-muted transition-colors font-medium text-sm">
              <i class="pi pi-pencil"></i>
            </button>
            <button @click="delete_table(table.id)"
              class="px-3 py-1.5 rounded-3xl border border-red-500/30 text-red-500 hover:bg-red-500/10 transition-colors font-medium text-sm">
              <i class="pi pi-trash"></i>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Edit Modal (template only) -->

    <Transition>

      <div v-if="edit_table_modal.isOpen"
        class="fixed inset-0 z-50 flex items-center justify-center bg-background/80 p-4 sm:p-6" aria-hidden="true">


        <Edit_Table_Modal_Component v-on:table_edited="refresh"></Edit_Table_Modal_Component>
      </div>


    </Transition>


    <!-- Add Modal (template only) -->


    <Transition>

      <div v-if="add_table_modal"
        class="fixed inset-0 z-100 flex items-center justify-center bg-background/80 p-4 sm:p-6" aria-hidden="true">

        <!-- here  whenever the child emits the table-added event it will refresh the fetch  -->
        <Add_Table_Modal_Component @table_added="refresh()">

        </Add_Table_Modal_Component>
      </div>
    </Transition>

    <Transition>
      <div v-if="qrModalShow" class="fixed inset-0 z-50 flex items-center justify-center bg-background/80"
        aria-hidden="true">
        <Table_QR_Code :table="selectedTable_for_Qr!" v-on:close="close_qr_modal"></Table_QR_Code>

      </div>
    </Transition>

  </div>
</template>

<style>
/* The active classes manage the duration and timing function */
.v-enter-active,
.v-leave-active {
  transition: opacity 0.5s ease, transform 0.5s ease;
}

/* The 'from' and 'to' states define the starting point of the enter 
   and the ending point of the leave */
.v-enter-from,
.v-leave-to {
  opacity: 0;
  /* Positive Y moves the element down; it will slide 'up' to 0 */
  transform: translateY(30px);
}
</style>