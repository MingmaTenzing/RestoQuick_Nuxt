<script lang="ts" setup>

</script>



<template>


      <div class="flex border-b pb-4 justify-between ">
                <div class=" flex items-center gap-2 ">
                    <NuxtImg src="https://foodish-api.com/images/pizza/pizza40.jpg" width="80" class="rounded-lg " />
                    <div class=" space-y-2">
                        <div class=" font-semibold">Margereta Pizza</div>
                        <div class="font-light text-sm text-muted-foreground">$12.99 each</div>
                   
    
                        <!-- add or minus the items number button -->
                        <div class=" flex items-center gap-4">
                            <div class=" rounded-lg border p-2 w-10 h-10 flex justify-center items-center">
    
                                <span class=" ">-</span>
                            </div>
                            <div class="flex gap-1 items-center">
    
                                <span>2</span>
                                <span class=" font-light text-muted-foreground text-sm">in cart</span>
                            </div>
    <div class=" rounded-lg border p-2 w-10 h-10 flex justify-center items-center">
    
                                <span class=" ">+</span>
                            </div>
                        </div>
    
                    </div>
                </div>
    
    
                <!-- total -->
                <div class=" flex flex-col gap-4 justify-between items-end">
                     <i class=" pi pi-trash text-destructive"></i>
                    <span class=" font-bold ">$40.50</span>
    
                </div>
            </div>
</template>