<script lang="ts" setup>
import type { NuxtError } from '#app';
import type { Table } from '~/generated/prisma/client';



const { edit_table_modal, add_table_modal, open_add_table_mdoal, close_add_table_mdoal, open_edit_table_mdoal, close_edit_table_mdoal} = useManage_Table_Modal();


const table_number = ref("");
const toast = useToast();
const capacity = ref(0)


async function addTable() {

    const addedTable = await $fetch<Table>('/api/tables', {
      method: 'POST',
      body: {

        table_number: table_number.value,
        capacity: capacity.value,



      }
    }).catch(error => {
      if (error.statusCode == 409) {
        toast.error({
          title: 'Duplicate Table Number',
        message: "Table Number already exists"
      })
     }
    })

  if (addedTable) {
    toast.success({
      title:'New Table Created'
    })
    }
}




     
    


</script>

<template>


      <div class=" bg-card rounded-lg w-full max-w-md p-6 shadow-md">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg font-medium">Add Table</h3>
          <button @click="close_add_table_mdoal" class="text-muted-foreground">✕</button>
        </div>

        <form v-on:submit.prevent="addTable" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-muted-foreground mb-1">Number</label>
            <input type="text" class="w-full px-3 py-2 border rounded" v-model="table_number" placeholder="e.g. A1" required />
            {{ table_number }}
          </div>

          <div>
            <label class="block text-sm font-medium text-muted-foreground mb-1">Capacity</label>
            {{ capacity }}
            <input type="number" min="1" v-model="capacity" class="w-full px-3 py-2 border rounded" placeholder="e.g. 4" />
          </div>

          <div class="flex justify-end space-x-2 mt-6">
            <button @click.prevent="close_add_table_mdoal" type="button" class="px-4 py-2 rounded-lg hover:border-ring border">Cancel</button>
            <button type="submit" class="px-4 py-2 rounded-lg hover:border-ring border  bg-card-foreground text-card">Create</button>
          </div>
        </form>
      </div>

</template>