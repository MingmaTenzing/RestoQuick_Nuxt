<script setup lang="ts">
const route = useRoute();

console.log(route.path)

</script>

<template> 
<aside class=" w-[220px] h-[calc(100vh-4rem)] bg-sidebar p-4 space-y-2 ">
    

    <NuxtLink to="/dashboard/roster" :class="[ 'cursor-pointer flex space-x-4 items-center   text-sm xl:text-base text-muted-foreground  p-2 rounded-lg ' , route.path == '/dashboard/roster' ? 'bg-primary text-primary-foreground ': 'hover:bg-sidebar-accent  outline-none hover:border-sidebar-border ']">
        <i class=" pi pi-calendar "></i>
        <span class=" ">Roster</span>
    </NuxtLink>
    <NuxtLink to="/dashboard/bookings" :class="[ 'cursor-pointer flex space-x-4 items-center   text-sm xl:text-base text-muted-foreground  p-2 rounded-lg ' , route.path == '/dashboard/bookings' ? 'bg-primary text-primary-foreground ': 'hover:bg-sidebar-accent  outline-none hover:border-sidebar-border hover:text-accent-foreground']">
        <i class=" pi pi-calendar-clock"></i>
        <span>Bookings</span>
    </NuxtLink>
    
    <NuxtLink to="/dashboard/orders" :class="[ 'cursor-pointer flex space-x-4 items-center   text-sm xl:text-base text-muted-foreground  p-2 rounded-lg ' , route.path == '/dashboard/orders' ? 'bg-primary text-primary-foreground ': 'hover:bg-sidebar-accent  outline-none hover:border-sidebar-border hover:text-accent-foreground']">
        <i class=" pi pi-shopping-cart"></i>
        <span>Orders</span>
    </NuxtLink>
    <NuxtLink to="/dashboard/kitchen" :class="[ 'cursor-pointer flex space-x-4 items-center   text-sm xl:text-base text-muted-foreground  p-2 rounded-lg ' , route.path == '/dashboard/kitchen' ? 'bg-primary text-primary-foreground ': 'hover:bg-sidebar-accent  outline-none hover:border-sidebar-border hover:text-accent-foreground']">
        <i class=" pi pi-building-columns"></i>
        <span>Kitchen</span>
    </NuxtLink>
    <NuxtLink to="/dashboard/staff&integration" :class="[ 'cursor-pointer flex space-x-4 items-center   text-sm xl:text-base text-muted-foreground  p-2 rounded-lg ' , route.path == '/dashboard/staff&integration' ? 'bg-primary text-primary-foreground ': 'hover:bg-sidebar-accent  outline-none hover:border-sidebar-border hover:text-accent-foreground']">
        <i class=" pi pi-users"></i>
        <span>Staff & Integrations</span>
    </NuxtLink>
    <NuxtLink to="/dashboard/stock" :class="[ 'cursor-pointer flex space-x-4 items-center   text-sm xl:text-base text-muted-foreground  p-2 rounded-lg ' , route.path == '/dashboard/stock' ? 'bg-primary text-primary-foreground ': 'hover:bg-sidebar-accent  outline-none hover:border-sidebar-border hover:text-accent-foreground']">
        <i class=" pi pi-box"></i>
        <span>Stock</span>
    </NuxtLink>
    <NuxtLink to="/dashboard/tables" :class="[ 'cursor-pointer flex space-x-4 items-center   text-sm xl:text-base text-muted-foreground  p-2 rounded-lg ' , route.path == '/dashboard/tables' ? 'bg-primary text-primary-foreground ': 'hover:bg-sidebar-accent  outline-none hover:border-sidebar-border hover:text-accent-foreground']">
        <i class=" pi pi-qrcode"></i>
        <span>Tables</span>
    </NuxtLink>



</aside>
</template>