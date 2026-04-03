<script setup lang="ts">
const route = useRoute();

const navItems = [
    { to: '/dashboard', icon: 'pi pi-chart-line', label: 'Dashboard Overview' },
    { to: '/dashboard/roster/weekly', icon: 'pi pi-calendar', label: 'Roster' },
    { to: '/dashboard/bookings', icon: 'pi pi-calendar-clock', label: 'Bookings' },
    { to: '/dashboard/orders', icon: 'pi pi-shopping-cart', label: 'Orders' },
    { to: '/dashboard/pos', icon: 'pi pi-desktop', label: 'POS' },
    { to: '/dashboard/kitchen', icon: 'pi pi-building-columns', label: 'Kitchen' },
    { to: '/dashboard/menu', icon: 'pi pi-file-check', label: 'Menu' },
    { to: '/dashboard/staff', icon: 'pi pi-users', label: 'Staff' },
    { to: '/dashboard/stock', icon: 'pi pi-box', label: 'Stock' },
    { to: '/dashboard/tables', icon: 'pi pi-qrcode', label: 'Tables' }
];

const isActive = (path: string) => {
    if (path === '/dashboard') {
        return route.path === path;
    }

    const sectionPath = path.endsWith('/') ? path : `${path}/`;
    return route.path === path || route.path.startsWith(sectionPath);
}
</script>

<template>
    <aside class="h-full min-w-44 shrink-0 bg-sidebar p-4 flex flex-col justify-between">
        <div class=" space-y-8">
            <div class="flex justify-center">
                        <img src="../../assets/images/RestoQuick.png" width="100" class="dark:invert w-12 md:w-20"/>
    
            </div>
            <nav aria-label="Sidebar" class="space-y-4">
                <ul class="space-y-2">
                    <li v-for="item in navItems" :key="item.to">
                        <NuxtLink
                            :to="item.to"
                            :class="[
                                'flex items-center space-x-4 text-sm xl:text-base text-muted-foreground p-2 rounded-3xl',
                                isActive(item.to) ? 'bg-primary text-primary-foreground' : 'hover:bg-sidebar-accent hover:border-sidebar-border hover:text-accent-foreground'
                            ]"
                        >
                            <i :class="item.icon"></i>
                            <span>{{ item.label }}</span>
                        </NuxtLink>
                    </li>
                </ul>
            </nav>

        </div>

     
    </aside>
</template>