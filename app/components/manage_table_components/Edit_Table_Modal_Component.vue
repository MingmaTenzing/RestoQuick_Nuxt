<script lang="ts" setup>
import type { NuxtError } from '#app';
import type { Table } from '~/generated/prisma/client';


const {  close_edit_table_modal, edit_table_modal} = useManage_Table_Modal();

const emit = defineEmits(['table_edited'])





const toast = useToast();
const loading = ref(false)
const capacity = ref(0)



async function editTable() {
  loading.value = true;

  try {

    const updatedTable = await $fetch<Table>('/api/tables', {
      method: 'PUT',
      body: {

        table_id: edit_table_modal.value.table_id,
        capacity: capacity.value,



      }
    })

    if (updatedTable) {
      toast.success({
        title: "Table Updated",

      })
    }

  } catch (error) {
    const nuxtError = error as NuxtError;
    if (nuxtError.statusCode == 500 && nuxtError.message ==
      'Cannot find the Table_id, does not exit'
    ) {
      toast.error({
        title: 'Cannot find the table_id',
        message: "The table doesn't exist "
      })
    }
    else {
      toast.error({
        title: nuxtError.statusMessage,
        message: nuxtError.message
      })
    }
  }
  finally {
    loading.value = false;
    capacity.value = 0;

  }



  //regardless of the outcome here the table_edited event is emitted to the parent 
  //so that tables page can refetch the table data.. 
  emit('table_edited')
}
</script>

<template>
      <div class="bg-card rounded-lg w-full max-w-md p-6 shadow-md">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg font-medium">Edit Table</h3>
          <button @click="close_edit_table_modal" class="text-muted-foreground">✕</button>
        </div>

        <form v-on:submit.prevent="editTable" class="space-y-4">
     

          <div>
            <label class="block text-sm font-medium text-muted-foreground mb-1">Capacity</label>
            <input type="number" min="1" class="w-full px-3 py-2 border rounded" v-model="capacity" placeholder="e.g. 4" />
          </div>

          <div class="flex justify-end space-x-2 mt-6">
            <button @click.prevent="close_edit_table_modal" type="button" class="px-4 py-2 rounded border">Cancel</button>
           
             <div v-if="loading" class="bg-card-foreground  px-6  rounded flex justify-center items-center ">
              <div class="w-5 h-5 border-2 border-card border-t-transparent rounded-full animate-spin"></div>

            </div>
            <button v-else type="submit" class="px-4 py-2 rounded bg-card-foreground text-card">Save</button>
          </div>
        </form>
      </div>
    
</template>