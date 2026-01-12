<script lang="ts" setup>
import { ref, watch } from 'vue';

const { close_edit_table_mdoal, selected_table } = useManage_Table_Modal();

const tableNumber = ref('');
const capacity = ref<number | null>(null);

watch(selected_table, (val) => {
  if (val) {
    tableNumber.value = val.number ?? '';
    capacity.value = val.capacity ?? 1;
  }
});

const save = async () => {
  if (!selected_table.value) return;
  try {
    await $fetch('/api/tables', {
      method: 'PUT',
      body: {
        table_id: selected_table.value.id,
        table_number: tableNumber.value,
        capacity: Number(capacity.value),
      },
    });
    close_edit_table_mdoal();
  } catch (e) {
    console.error(e);
  }
};

const del = async () => {
  if (!selected_table.value) return;
  if (!confirm('Are you sure you want to delete this table?')) return;
  try {
    await $fetch('/api/tables', {
      method: 'DELETE',
      body: {
        table_id: selected_table.value.id,
      },
    });
    close_edit_table_mdoal();
  } catch (e) {
    console.error(e);
  }
};
</script>

<template>
  <div class="bg-card rounded-lg w-full max-w-md p-6 shadow-md">
    <div class="flex justify-between items-center mb-4">
      <h3 class="text-lg font-medium">Edit Table</h3>
      <button @click="close_edit_table_mdoal" class="text-muted-foreground">✕</button>
    </div>

    <form class="space-y-4" @submit.prevent="save">
      <div>
        <label class="block text-sm font-medium text-muted-foreground mb-1">Number</label>
        <input v-model="tableNumber" type="text" class="w-full px-3 py-2 border rounded" placeholder="e.g. A1" />
      </div>

      <div>
        <label class="block text-sm font-medium text-muted-foreground mb-1">Capacity</label>
        <input v-model.number="capacity" type="number" min="1" class="w-full px-3 py-2 border rounded" placeholder="e.g. 4" />
      </div>

      <div class="flex justify-between space-x-2 mt-6">
        <div>
          <button @click.prevent="del" type="button" class="px-4 py-2 rounded bg-destructive/20 text-destructive hover:border-destructive">Delete</button>
        </div>
        <div class="flex space-x-2">
          <button @click.prevent="close_edit_table_mdoal" type="button" class="px-4 py-2 rounded border">Cancel</button>
          <button type="submit" class="px-4 py-2 rounded bg-card-foreground text-card">Save</button>
        </div>
      </div>
    </form>
  </div>
</template> 