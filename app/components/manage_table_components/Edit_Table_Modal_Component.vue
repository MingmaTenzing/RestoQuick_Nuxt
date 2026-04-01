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
      <div class="w-full max-w-lg rounded-4xl border border-border bg-card p-6 shadow-sm sm:p-7">
        <div class="mb-6 flex items-start justify-between gap-4">
          <div class="space-y-2">
            <span class="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-accent text-foreground">
              <i class="pi pi-pencil text-sm"></i>
            </span>
            <div>
              <h3 class="text-xl font-semibold text-foreground">Edit Table</h3>
              <p class="text-sm text-muted-foreground">Update the seating capacity while keeping the table setup consistent.</p>
            </div>
          </div>
          <button
            @click="close_edit_table_modal"
            class="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-border bg-background text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            aria-label="Close edit table form"
          >
            <i class="pi pi-times text-sm"></i>
          </button>
        </div>

        <form v-on:submit.prevent="editTable" class="space-y-5">
     

          <div class="space-y-2">
            <label class="block text-sm font-medium text-foreground">Capacity</label>
            <input type="number" min="1" class="w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground/80 focus:border-primary" v-model="capacity" placeholder="e.g. 4" />
          </div>

          <div class="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
            <button @click.prevent="close_edit_table_modal" type="button" class="inline-flex items-center justify-center rounded-2xl border border-border bg-background px-4 py-3 text-sm font-medium text-foreground transition-colors hover:bg-accent">Cancel</button>
           
             <div v-if="loading" class="inline-flex min-h-12 items-center justify-center rounded-2xl bg-card-foreground px-6 text-card">
              <div class="w-5 h-5 border-2 border-card border-t-transparent rounded-full animate-spin"></div>

            </div>
            <button v-else type="submit" class="inline-flex items-center justify-center rounded-2xl bg-card-foreground px-5 py-3 text-sm font-medium text-card transition-opacity hover:opacity-90">Save</button>
          </div>
        </form>
      </div>
    
</template>