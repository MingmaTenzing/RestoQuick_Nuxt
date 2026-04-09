<script setup lang="ts">
const { isSidebar_open, open_side_bar, close_side_bar } = useSideBar();

const { orgRole } = useAuth();

const roleLabel = computed(() => {
    if (orgRole.value === 'org:admin') {
        return 'Admin';
    }

    if (orgRole.value === 'org:member') {
        return 'Member';
    }

    return null;
});


</script>
<template>
    <!-- nav bar dashboard -->
    <div class="flex min-w-full items-center justify-between gap-4">


        <div>

            <i v-if="!isSidebar_open" v-on:click="open_side_bar" class="pi pi-bars"></i>
            <i v-else v-on:click="close_side_bar" class="pi pi-times"></i>

        </div>


        <div class="flex items-center gap-4 sm:gap-6">
            <div
                class="rounded-full border border-border bg-card/80 p-2 shadow-sm backdrop-blur-sm flex justify-center items-center">
                <i v-on:click="$colorMode.preference = 'dark'" v-if="$colorMode.value === 'light'"
                    class="pi pi-moon text-muted-foreground transition-colors hover:text-foreground"></i>
                <i v-on:click="$colorMode.preference = 'light'" v-if="$colorMode.value === 'dark'"
                    class="pi pi-sun text-muted-foreground transition-colors hover:text-foreground"></i>
            </div>
            <div>

                <Show when="signed-out">
                    <SignInButton />
                    <SignUpButton />
                </Show>
                <Show when="signed-in">
                    <div
                        class="flex items-center justify-center gap-2 rounded-full border border-border bg-card/80 px-2 py-2 shadow-sm backdrop-blur-sm">
                        <div>

                            <span v-if="roleLabel"
                                class="inline-flex items-center rounded-full bg-accent px-3 py-1 text-xs font-light uppercase tracking-[0.16em] text-muted-foreground">
                                {{ roleLabel }}
                            </span>
                        </div>

                        <UserButton />


                    </div>
                </Show>
            </div>

        </div>

    </div>

</template>