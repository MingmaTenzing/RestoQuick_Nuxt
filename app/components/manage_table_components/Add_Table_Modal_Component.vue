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


      <div class="w-full max-w-lg rounded-4xl border border-border bg-card p-6 shadow-sm sm:p-7">
        <div class="mb-6 flex items-start justify-between gap-4">
          <div class="space-y-2">
            <span class="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-accent text-foreground">
              <i class="pi pi-plus text-sm"></i>
            </span>
            <div>
              <h3 class="text-xl font-semibold text-foreground">Add Table</h3>
              <p class="text-sm text-muted-foreground">Create a new table with a clear number and seating capacity.</p>
            </div>
          </div>
          <button
            @click="close_add_table_modal"
            class="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-border bg-background text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            aria-label="Close add table form"
          >
            <i class="pi pi-times text-sm"></i>
          </button>
        </div>

        <form v-on:submit.prevent="addTable" class="space-y-5">
          <div class="space-y-2">
            <label class="block text-sm font-medium text-foreground">Number</label>
            <input type="text" class="w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground/80 focus:border-primary" v-model="table_number"  placeholder="e.g. A1" required />
          
          </div>

          <div class="space-y-2">
            <label class="block text-sm font-medium text-foreground">Capacity</label>
          
            <input type="number" min="1" v-model="capacity" class="w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground/80 focus:border-primary" placeholder="e.g. 4" />
          </div>

          <div class="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
            <button @click.prevent="close_add_table_modal" type="button" class="inline-flex items-center justify-center rounded-2xl border border-border bg-background px-4 py-3 text-sm font-medium text-foreground transition-colors hover:bg-accent">Cancel</button>
          
            <div v-if="loading"  class="inline-flex min-h-12 items-center justify-center rounded-2xl bg-card-foreground px-7 text-card">
              <div class="w-5 h-5 border-2 border-card border-t-transparent rounded-full animate-spin"></div>

            </div>

            <button v-else  type="submit" class="inline-flex items-center justify-center rounded-2xl bg-card-foreground px-5 py-3 text-sm font-medium text-card transition-opacity hover:opacity-90">Create</button>
          </div>
        </form>
      </div>

</template>