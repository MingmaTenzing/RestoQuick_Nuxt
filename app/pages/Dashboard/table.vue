<script setup lang="ts">


definePageMeta({
     layout: 'dashboard-layout'   
})

const show_edit_modal = ref(false);
const show_add_modal = ref(false);


const {data:tables} = useFetch("/api/tables")



</script>

<template>
  <div class="p-6">
    <div class="flex items-center justify-between mb-6">
     <div>
        <h2 class="text-2xl md:text-6xl"> Manage Tables</h2>
        <p class=" text-sm lg:text-base text-muted-foreground"> Manage your tables and print qr codes.  </p>

    </div>
      <div class="flex items-center space-x-3">
        <button @click="show_add_modal = true" class=" bg-accent border hover:border-ring px-4 py-2 rounded-lg">Add Table</button>
        <NuxtLink to="/print-qr-codes" class="px-4 py-2 rounded-lg border  hover:border-ring space-x-2"> <i class="pi pi-qrcode"></i> <span>Print All QR Codes</span></NuxtLink>
      </div>
    </div>

    <!-- Table list -->
    <div class="overflow-x-auto">
      <table class="min-w-full  rounded-lg shadow-sm ">
        <thead>
          <tr class="text-left text-sm text-muted-foreground">
           
            <th class="px-4 py-3">Id</th>
            <th class="px-4 py-3">Number</th>
            <th class="px-4 py-3">Capacity</th>
            <th class="px-4 py-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          <!-- Example row structure; replace with v-for / real data when wiring logic -->
          <tr v-for="table in tables" class="border-t hover:bg-secondary/30">
            <td class="px-4 py-3">{{table.id}}</td>
            <td class="px-4 py-3">{{table.number}}</td>
            <td class="px-4 py-3">{{table.capacity}}</td>
            <td class="px-4 py-3">
              <div class="flex space-x-2">
                <NuxtLink :to="`/order-table/$dd`" class="px-3 py-1 rounded-lg border hover:border-ring">QR</NuxtLink>
                <button @click="show_edit_modal = true" class="px-3 py-1 rounded-lg border hover:border-ring">Edit</button>
                <button class="px-3 py-1 rounded-lg border bg-destructive/20 text-destructive hover:border-destructive  ">Delete</button>
              </div>
            </td>
          </tr>

        </tbody>
      </table>
    </div>

    <!-- Edit Modal (template only) -->
    <div v-if="show_edit_modal" class="fixed inset-0 z-50 flex items-center justify-center bg-background/80" aria-hidden="true">
      <div class="bg-white rounded-lg w-full max-w-md p-6 shadow-md">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg font-medium">Edit Table</h3>
          <button @click="show_edit_modal = false" class="text-muted-foreground">✕</button>
        </div>

        <form class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-muted-foreground mb-1">Number</label>
            <input type="text" class="w-full px-3 py-2 border rounded" placeholder="e.g. A1" />
          </div>

          <div>
            <label class="block text-sm font-medium text-muted-foreground mb-1">Capacity</label>
            <input type="number" min="1" class="w-full px-3 py-2 border rounded" placeholder="e.g. 4" />
          </div>

          <div class="flex justify-end space-x-2 mt-6">
            <button @click.prevent="show_edit_modal = false" type="button" class="px-4 py-2 rounded border">Cancel</button>
            <button type="submit" class="px-4 py-2 rounded bg-primary text-white">Save</button>
          </div>
        </form>
      </div>
    </div>

    <!-- Add Modal (template only) -->
    <div v-if="show_add_modal" class="fixed inset-0 z-50 flex items-center justify-center bg-background/80" aria-hidden="true">
      <div class="bg-white rounded-lg w-full max-w-md p-6 shadow-md">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg font-medium">Add Table</h3>
          <button @click="show_add_modal = false" class="text-muted-foreground">✕</button>
        </div>

        <form class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-muted-foreground mb-1">Number</label>
            <input type="text" class="w-full px-3 py-2 border rounded" placeholder="e.g. A1" />
          </div>

          <div>
            <label class="block text-sm font-medium text-muted-foreground mb-1">Capacity</label>
            <input type="number" min="1" class="w-full px-3 py-2 border rounded" placeholder="e.g. 4" />
          </div>

          <div class="flex justify-end space-x-2 mt-6">
            <button @click.prevent="show_add_modal = false" type="button" class="px-4 py-2 rounded border">Cancel</button>
            <button type="submit" class="px-4 py-2 rounded bg-primary text-white">Create</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
