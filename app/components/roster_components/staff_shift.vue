<script lang="ts" setup>
import { mockStaff, type Staff } from '~/lib/roster-mockdata';

const props = defineProps<{ staff_id: string }>()


// mocking fetching data of staff
const staff = ref<Staff>()
onMounted(() => {
    const find_staff = mockStaff.find((employee) => props.staff_id == employee.id)
    staff.value = find_staff;
})


</script>

<template>

<div class=" rounded-lg border border-border bg-card flex flex-col">
    <span>{{ staff?.name }}</span>
    <span>{{ staff?.role }}</span>

</div>


</template>