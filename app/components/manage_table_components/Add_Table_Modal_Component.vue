<script lang="ts" setup>
import type { NuxtError } from '#app';
import type { Table } from '~/generated/prisma/client';



const { close_add_table_modal, } = useManage_Table_Modal();


const emit = defineEmits(['table_added'])





const table_number = ref("")
const toast = useToast();
const loading = ref(false)
const capacity = ref(0)

const capitalized_table_number = computed(() => table_number.value.toUpperCase())


async function addTable() {
  loading.value = true;

  try {

     const addedTable = await $fetch<Table>('/api/tables', {
      method: 'POST',
      body: {

        table_number: capitalized_table_number.value,
        capacity: capacity.value,



      }
     })

    if (addedTable) {
      toast.success({
        title: "New Table Added",
        
      })
     }
    
  } catch (error) {
    const nuxtError = error as NuxtError;
    if (nuxtError.statusCode == 409) {
        toast.error({
          title: 'Duplicate Table Number',
        message: "Table Number already exists"
      })
    }
     console.log(error)
  }
  finally {
    loading.value = false;
    capacity.value = 0;
    table_number.value = ''

  }


  //regardless of the outcome here the table_added event is emitted to the parent 
  //so that tables page can refetch the table data.. 
  emit('table_added')
    
}




     
    


</script>

<template>


      <div class=" bg-card rounded-lg w-full max-w-md p-6 shadow-md">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg font-medium">Add Table</h3>
          <button @click="close_add_table_modal" class="text-muted-foreground">✕</button>
        </div>

        <form v-on:submit.prevent="addTable" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-muted-foreground mb-1">Number</label>
            <input type="text" class="w-full px-3 py-2 border rounded" v-model="table_number"  placeholder="e.g. A1" required />
          
          </div>

          <div>
            <label class="block text-sm font-medium text-muted-foreground mb-1">Capacity</label>
          
            <input type="number" min="1" v-model="capacity" class="w-full px-3 py-2 border rounded" placeholder="e.g. 4" />
          </div>

          <div class="flex justify-end space-x-2 mt-6">
            <button @click.prevent="close_add_table_modal" type="button" class="px-4 py-2 rounded-lg hover:border-ring border">Cancel</button>
          
            <div v-if="loading"  class="bg-card-foreground  px-7  rounded-lg flex justify-center items-center ">
              <div class="w-5 h-5 border-2 border-card border-t-transparent rounded-full animate-spin"></div>

            </div>

            <button v-else  type="submit" class="px-4 py-2 rounded-lg hover:border-ring border  bg-card-foreground text-card">Create</button>
          </div>
        </form>
      </div>

</template>