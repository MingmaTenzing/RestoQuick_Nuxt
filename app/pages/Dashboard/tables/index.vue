<script setup lang="ts">
import type { NuxtError } from '#app';
import Add_Table_Modal_Component from '~/components/manage_table_components/Add_Table_Modal_Component.vue';
import Edit_Table_Modal_Component from '~/components/manage_table_components/Edit_Table_Modal_Component.vue';
import Table_QR_Code from '~/components/manage_table_components/Table_QR_Code.vue';
import Table_Loading_Skeleton from '~/components/manage_table_components/Table_Loading_Skeleton.vue';
import type { Table } from '~/generated/prisma/client';



definePageMeta({
  layout:'dashboard-layout'
})

const { edit_table_modal, add_table_modal, open_add_table_modal, open_edit_table_modal,} = useManage_Table_Modal();

const toast = useToast();

const qrModalShow = ref(false);

const selectedTable_for_Qr = ref<Table>();

const { data: tables, status, pending, error , refresh} = useFetch("/api/tables", {
})

async function delete_table(table_id: string) {

  try {
    const delete_table = await $fetch(`/api/tables/${table_id}`, {
      method:'DELETE',
    })
    if (delete_table) {
      toast.warning({
        title:"Table Deleted"
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
    id:''
  }
  qrModalShow.value = false
}



</script>

<template>
  <div class=" space-y-6">
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
        <button 
          @click="open_add_table_modal" 
          class="px-5 py-2.5 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-all hover:shadow-lg flex items-center gap-2 font-medium"
        >
          <i class="pi pi-plus"></i>
          <span>New Table</span>
        </button>
        <NuxtLink 
          to="/dashboard/tables/print-qr-codes" 
          class="px-5 py-2.5 rounded-lg border border-border hover:bg-muted transition-all flex items-center gap-2 font-medium text-foreground"
        >
          <i class="pi pi-print"></i>
          <span>Print QR Codes</span>
        </NuxtLink>
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <!-- Total Tables -->
      <div class="rounded-lg border bg-card p-6 hover:shadow-lg transition-shadow space-y-2">
        <div class="flex items-center justify-between">
          <span class="text-sm font-medium text-muted-foreground">Total Tables</span>
          <i class="pi pi-table text-primary text-lg" />
        </div>
        <span v-if="pending" class="w-20 h-8 bg-muted animate-pulse rounded inline-block"></span>
        <span v-else class="text-3xl font-bold block">{{ tables?.length || 0 }}</span>
        <p class="text-xs text-muted-foreground">Active seating</p>
      </div>

      <!-- Total Capacity -->
      <div class="rounded-lg border bg-card p-6 hover:shadow-lg transition-shadow space-y-2">
        <div class="flex items-center justify-between">
          <span class="text-sm font-medium text-muted-foreground">Total Capacity</span>
          <i class="pi pi-users text-green-600 text-lg" />
        </div>
        <span v-if="pending" class="w-20 h-8 bg-muted animate-pulse rounded inline-block"></span>
        <span v-else class="text-3xl font-bold block">{{ tables?.reduce((sum, t) => sum + (t.capacity || 0), 0) || 0 }}</span>
        <p class="text-xs text-muted-foreground">Total guests</p>
      </div>

      <!-- Average Capacity -->
      <div class="rounded-lg border bg-card p-6 hover:shadow-lg transition-shadow space-y-2">
        <div class="flex items-center justify-between">
          <span class="text-sm font-medium text-muted-foreground">Avg. Per Table</span>
          <i class="pi pi-chart-bar text-blue-600 text-lg" />
        </div>
        <span v-if="pending" class="w-20 h-8 bg-muted animate-pulse rounded inline-block"></span>
        <span v-else class="text-3xl font-bold block">{{ tables && tables.length > 0 ? Math.round(tables.reduce((sum, t) => sum + (t.capacity || 0), 0) / tables.length) : 0 }}</span>
        <p class="text-xs text-muted-foreground">Seats per table</p>
      </div>
    </div>

    <!-- Tables Section -->
    <div class="rounded-lg border bg-card overflow-hidden">
      <!-- Table -->
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-muted/50 border-b border-border">
            <tr>
              <th class="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide">Table Number</th>
              <th class="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide">Capacity</th>
              <th class="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide">Table ID</th>
              <th class="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide">Actions</th>
            </tr>
          </thead>
          <tbody v-if="pending" class="divide-y divide-border">
            <Table_Loading_Skeleton />
          </tbody>
          <tbody v-else-if="tables && tables.length === 0">
            <tr>
              <td colspan="4" class="px-6 py-12 text-center">
                <i class="pi pi-inbox text-4xl text-muted-foreground mb-3 block opacity-50"></i>
                <p class="text-muted-foreground mb-4">No tables yet. Create your first table to get started.</p>
                <button 
                  @click="open_add_table_modal" 
                  class="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  <i class="pi pi-plus"></i>
                  <span>Add Table</span>
                </button>
              </td>
            </tr>
          </tbody>
          <tbody v-else class="divide-y divide-border">
            <tr v-for="table in tables" :key="table.id" class="hover:bg-muted/20 transition-colors">
              <td class="px-6 py-4">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <i class="pi pi-table text-primary text-base"></i>
                  </div>
                  <span class="font-semibold text-foreground text-lg">{{ table.number }}</span>
                </div>
              </td>
              <td class="px-6 py-4">
                <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-500/10 text-green-600 font-medium text-sm">
                  <i class="pi pi-users"></i>
                  {{ table.capacity }} seats
                </span>
              </td>
              <td class="px-6 py-4">
                <code class="px-2.5 py-1.5 rounded bg-muted/50 text-xs font-mono text-foreground/80 max-w-xs truncate block">{{ table.id }}</code>
              </td>
              <td class="px-6 py-4">
                <div class="flex gap-2">
                  <button 
                    @click="open_qr_modal(table)" 
                    class="px-3 py-1.5 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground font-medium transition-colors flex items-center gap-1.5 text-sm"
                  >
                    <i class="pi pi-qrcode"></i>
                    QR
                  </button>
                  <button 
                    @click="open_edit_table_modal(table.id)" 
                    class="px-3 py-1.5 rounded-lg border border-border hover:bg-muted transition-colors font-medium text-sm"
                  >
                    <i class="pi pi-pencil"></i>
                  </button>
                  <button 
                    @click="delete_table(table.id)" 
                    class="px-3 py-1.5 rounded-lg border border-red-500/30 text-red-500 hover:bg-red-500/10 transition-colors font-medium text-sm"
                  >
                    <i class="pi pi-trash"></i>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Edit Modal (template only) -->

 <Transition>
     
           <div  v-if="edit_table_modal.isOpen"  class="fixed inset-0 z-50 flex items-center justify-center bg-background/80" aria-hidden="true">


     <Edit_Table_Modal_Component v-on:table_edited="refresh"></Edit_Table_Modal_Component>
     </div>


 </Transition>
   

    <!-- Add Modal (template only) -->


<Transition>

  <div v-if="add_table_modal" class="fixed inset-0 z-100 flex items-center justify-center bg-background/80" aria-hidden="true">
  
   <!-- here  whenever the child emits the table-added event it will refresh the fetch  -->
  <Add_Table_Modal_Component @table_added="refresh()">
  
  </Add_Table_Modal_Component>
  </div>
</Transition>
  
  <Transition>
    <div v-if="qrModalShow" class="fixed inset-0 z-50 flex items-center justify-center bg-background/80" aria-hidden="true">
 <Table_QR_Code  :table="selectedTable_for_Qr!" v-on:close="close_qr_modal"></Table_QR_Code>

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