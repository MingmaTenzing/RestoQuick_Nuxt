<script lang="ts" setup>
import { ref, computed } from 'vue'

definePageMeta({
    layout: 'dashboard-layout'
})

</script>


<template>

    <main>
            <!-- header -->
        <section class=" space-y-4">
 <div>
     <h2 class="text-2xl md:text-6xl"> Kitchen Display </h2>
     <p class=" text-sm lg:text-base text-muted-foreground">Manage incoming order and preparation status</p>
 

 </div>
            <!-- stats -->
            <section class=" flex justify-around gap-4">
                    <!-- pending orders -->
                <div class="p-4 border bg-card rounded-lg h-40  justify-between flex flex-col w-full  ">
                    <div class=" flex gap-2 text-lg text-amber-600 items-center">
                        <p class=" ">Pending Orders </p>
                        <i class=" pi pi-clock"></i>

                    </div>
        
                    <div class=" flex flex-col">
                        <span class=" text-4xl font-bold text-amber-600">7</span>
                        <p class=" text-muted-foreground font-light text-sm">Currently in Kitchen</p>
                    </div>
                    
                </div>
        
                <!-- completed orders -->
                <div class="p-4 border bg-card rounded-lg h-40  justify-between flex flex-col w-full ">
                     <div class=" flex gap-2 text-lg text-green-600 items-center">
                        <p class=" ">Completed Orders </p>
                        <i class=" pi pi-check-circle"></i>

                    </div>
                    <div class=" flex flex-col">
                        <span class=" text-4xl font-bold text-green-600">78</span>
                        <p class=" text-muted-foreground font-light text-sm">Completed by kitchen</p>
                    </div>
                    
        
                </div>
        
        
                <!-- total orders -->
                <div class="p-4 border bg-card rounded-lg h-40  justify-between flex flex-col w-full ">
                    <p class=" text-lg">Total Orders (Today) </p>
        
                    <div class=" flex flex-col">
                        <span class=" text-4xl font-bold">121</span>
                        <p class=" text-muted-foreground font-light text-sm">Total for {{ new Date(Date.now()) }}</p>
                    </div>
                    
                </div>
              
        
            </section>
        </section>



        <!-- orders -->

        <section class=" flex ">

            <div class=" w-full p-4 border rounded-lg space-y-4">

                <!-- table number and time ago order was placed -->
                <div>
                    <p class=" text-xl font-semibold">Table 5</p>
                    <div class=" flex gap-2 items-center text-muted-foreground font-light">
                        <i class=" pi pi-clock"></i>
                        <p>4 mins ago</p>
                    </div>

                </div>


                <!-- order items -->

                <div >
                    <div class=" flex justify-between">
                        <div class=" flex space-x-2">
                            <p>2x</p>
                            <p>Classic Burger</p>
                        </div>
                        <div>
                            <span>$25.98</span>
                        </div>
                    </div>
                    
                    <div class=" flex justify-between">
                        <div class=" flex space-x-2">
                            <p>2x</p>
                            <p>Classic Burger</p>
                        </div>
                        <div>
                            <span>$25.98</span>
                        </div>
                    </div>


                </div>


                    <!--  special instructions -->
                <div class=" bg-accent p-2 rounded-lg text-sm">


                    <p class=" font-light text-muted-foreground">Special Instructions</p>
                    <p>No onions on one burger please</p>


                </div>


                <!-- customer -->

                <div>
                    <p>Customer: {{ 'Sarah Williams' }}</p>
                </div>

                <!-- divider line -->

                <div class=" w-full h-[0.1px] bg-foreground/20 mt-4 mb-4" />


                <!-- ready button -->

                <div >
                    <button class="w-full py-2 rounded-lg font-bold  bg-amber-500 text-white ">Mark as Ready</button>
                </div>



            </div>
            <div class=" w-full p-4 border rounded-lg space-y-4">

                <!-- table number and time ago order was placed -->
                <div>
                    <p class=" text-xl font-semibold">Table 5</p>
                    <div class=" flex gap-2 items-center text-muted-foreground font-light">
                        <i class=" pi pi-clock"></i>
                        <p>4 mins ago</p>
                    </div>

                </div>


                <!-- order items -->

                <div >
                    <div class=" flex justify-between">
                        <div class=" flex space-x-2">
                            <p>2x</p>
                            <p>Classic Burger</p>
                        </div>
                        <div>
                            <span>$25.98</span>
                        </div>
                    </div>
                    
                    <div class=" flex justify-between">
                        <div class=" flex space-x-2">
                            <p>2x</p>
                            <p>Classic Burger</p>
                        </div>
                        <div>
                            <span>$25.98</span>
                        </div>
                    </div>


                </div>


                    <!--  special instructions -->
                <div class=" bg-accent p-2 rounded-lg text-sm">


                    <p class=" font-light text-muted-foreground">Special Instructions</p>
                    <p>No onions on one burger please</p>


                </div>


                <!-- customer -->

                <div>
                    <p>Customer: {{ 'Sarah Williams' }}</p>
                </div>

                <!-- divider line -->

                <div class=" w-full h-[0.1px] bg-foreground/20 mt-4 mb-4" />


                <!-- ready button -->

                <div >
                    <button class="w-full py-2 rounded-lg font-bold  bg-amber-500 text-white ">Mark as Ready</button>
                </div>



            </div>
            <div class=" w-full p-4 border rounded-lg space-y-4">

                <!-- table number and time ago order was placed -->
                <div>
                    <p class=" text-xl font-semibold">Table 5</p>
                    <div class=" flex gap-2 items-center text-muted-foreground font-light">
                        <i class=" pi pi-clock"></i>
                        <p>4 mins ago</p>
                    </div>

                </div>


                <!-- order items -->

                <div >
                    <div class=" flex justify-between">
                        <div class=" flex space-x-2">
                            <p>2x</p>
                            <p>Classic Burger</p>
                        </div>
                        <div>
                            <span>$25.98</span>
                        </div>
                    </div>
                    
                    <div class=" flex justify-between">
                        <div class=" flex space-x-2">
                            <p>2x</p>
                            <p>Classic Burger</p>
                        </div>
                        <div>
                            <span>$25.98</span>
                        </div>
                    </div>


                </div>


                    <!--  special instructions -->
                <div class=" bg-accent p-2 rounded-lg text-sm">


                    <p class=" font-light text-muted-foreground">Special Instructions</p>
                    <p>No onions on one burger please</p>


                </div>


                <!-- customer -->

                <div>
                    <p>Customer: {{ 'Sarah Williams' }}</p>
                </div>

                <!-- divider line -->

                <div class=" w-full h-[0.1px] bg-foreground/20 mt-4 mb-4" />


                <!-- ready button -->

                <div >
                    <button class="w-full py-2 rounded-lg font-bold  bg-amber-500 text-white ">Mark as Ready</button>
                </div>



            </div>
            <div class=" w-full p-4 border rounded-lg space-y-4">

                <!-- table number and time ago order was placed -->
                <div>
                    <p class=" text-xl font-semibold">Table 5</p>
                    <div class=" flex gap-2 items-center text-muted-foreground font-light">
                        <i class=" pi pi-clock"></i>
                        <p>4 mins ago</p>
                    </div>

                </div>


                <!-- order items -->

                <div >
                    <div class=" flex justify-between">
                        <div class=" flex space-x-2">
                            <p>2x</p>
                            <p>Classic Burger</p>
                        </div>
                        <div>
                            <span>$25.98</span>
                        </div>
                    </div>
                    
                    <div class=" flex justify-between">
                        <div class=" flex space-x-2">
                            <p>2x</p>
                            <p>Classic Burger</p>
                        </div>
                        <div>
                            <span>$25.98</span>
                        </div>
                    </div>


                </div>


                    <!--  special instructions -->
                <div class=" bg-accent p-2 rounded-lg text-sm">


                    <p class=" font-light text-muted-foreground">Special Instructions</p>
                    <p>No onions on one burger please</p>


                </div>


                <!-- customer -->

                <div>
                    <p>Customer: {{ 'Sarah Williams' }}</p>
                </div>

                <!-- divider line -->

                <div class=" w-full h-[0.1px] bg-foreground/20 mt-4 mb-4" />


                <!-- ready button -->

                <div >
                    <button class="w-full py-2 rounded-lg font-bold  bg-amber-500 text-white ">Mark as Ready</button>
                </div>



            </div>
            <div class=" w-full p-4 border rounded-lg space-y-4">

                <!-- table number and time ago order was placed -->
                <div>
                    <p class=" text-xl font-semibold">Table 5</p>
                    <div class=" flex gap-2 items-center text-muted-foreground font-light">
                        <i class=" pi pi-clock"></i>
                        <p>4 mins ago</p>
                    </div>

                </div>


                <!-- order items -->

                <div >
                    <div class=" flex justify-between">
                        <div class=" flex space-x-2">
                            <p>2x</p>
                            <p>Classic Burger</p>
                        </div>
                        <div>
                            <span>$25.98</span>
                        </div>
                    </div>
                    
                    <div class=" flex justify-between">
                        <div class=" flex space-x-2">
                            <p>2x</p>
                            <p>Classic Burger</p>
                        </div>
                        <div>
                            <span>$25.98</span>
                        </div>
                    </div>


                </div>


                    <!--  special instructions -->
                <div class=" bg-accent p-2 rounded-lg text-sm">


                    <p class=" font-light text-muted-foreground">Special Instructions</p>
                    <p>No onions on one burger please</p>


                </div>


                <!-- customer -->

                <div>
                    <p>Customer: {{ 'Sarah Williams' }}</p>
                </div>

                <!-- divider line -->

                <div class=" w-full h-[0.1px] bg-foreground/20 mt-4 mb-4" />


                <!-- ready button -->

                <div >
                    <button class="w-full py-2 rounded-lg font-bold  bg-amber-500 text-white ">Mark as Ready</button>
                </div>



            </div>




        </section>

    </main>
</template>