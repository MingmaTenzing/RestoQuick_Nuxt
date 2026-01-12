<script lang="ts" setup>

const { edit_table_modal, add_table_modal, open_add_table_mdoal, close_add_table_mdoal, open_edit_table_mdoal, close_edit_table_mdoal} = useManage_Table_Modal();

</script>

<template>


      <div class=" bg-card rounded-lg w-full max-w-md p-6 shadow-md">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg font-medium">Add Table</h3>
          <button @click="close_add_table_mdoal" class="text-muted-foreground">✕</button>
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
            <button @click.prevent="close_add_table_mdoal" type="button" class="px-4 py-2 rounded-lg hover:border-ring border">Cancel</button>
            <button type="submit" class="px-4 py-2 rounded-lg hover:border-ring border  bg-card-foreground text-card">Create</button>
          </div>
        </form>
      </div>

</template>