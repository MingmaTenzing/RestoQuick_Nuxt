<script setup lang="ts">
import Add_Table_Modal_Component from '~/components/manage_table_components/Add_Table_Modal_Component.vue';
import Edit_Table_Modal_Component from '~/components/manage_table_components/Edit_Table_Modal_Component.vue';
import { useManage_Table_Modal } from '~/composables/useManage_Table_Modal';



definePageMeta({
     layout: 'dashboard-layout'   
})

const { edit_table_modal, add_table_modal, open_add_table_mdoal, close_add_table_mdoal, open_edit_table_mdoal, close_edit_table_mdoal} = useManage_Table_Modal();


const {data:tables, status, pending, error } = useFetch("/api/tables")


// async function addTable() {

// }


</script>

<template>
  <div class="p-6">
    <div class="flex items-center justify-between mb-6">
     <div>
        <h2 class="text-2xl md:text-6xl"> Manage Tables</h2>
        <p class=" text-sm lg:text-base text-muted-foreground"> Manage your tables and print qr codes.  </p>

    </div>
      <div class="flex items-center space-x-3">
        <button @click="open_add_table_mdoal" class=" bg-accent border hover:border-ring px-4 py-2 rounded-lg">Add Table</button>
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
                <button @click="open_edit_table_mdoal" class="px-3 py-1 rounded-lg border hover:border-ring">Edit</button>
                <button class="px-3 py-1 rounded-lg border bg-destructive/20 text-destructive hover:border-destructive  ">Delete</button>
              </div>
            </td>
          </tr>

        </tbody>
      </table>
    </div>

    <!-- Edit Modal (template only) -->

 <Transition>
     
           <div  v-if="edit_table_modal"  class="fixed inset-0 z-50 flex items-center justify-center bg-background/80" aria-hidden="true">


     <Edit_Table_Modal_Component></Edit_Table_Modal_Component>
     </div>


 </Transition>
   

    <!-- Add Modal (template only) -->


<Transition>

  <div v-if="add_table_modal" class="fixed inset-0 z-100 flex items-center justify-center bg-background/80" aria-hidden="true">
  
  
  <Add_Table_Modal_Component>
  
  </Add_Table_Modal_Component>
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