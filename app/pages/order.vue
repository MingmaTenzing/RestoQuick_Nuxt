<script lang="ts" setup>

const { data } = useFetch('/api/menu-items')

const show_cart = ref(true)

const categories = [
    { id: "all", name: "All", icon: "🍽️" },
    { id: "appetizers", name: "Starters", icon: "🥗" },
    { id: "mains", name: "Mains", icon: "🍖" },
    { id: "desserts", name: "Desserts", icon: "🍰" },
    { id: "drinks", name: "Drinks", icon: "🍹" },
  ]
</script>

<template >
<main class="w-full p-4 space-y-6 h-screen ">

    <section class=" flex space-x-2 items-center ">
        <img src="../assets/images/RestroMate.png"  class="invert w-20 not-dark:invert-0"></img>
       <div class=" flex flex-col">
           <span class=" text-2xl font-semibold">Order Now</span>
           <span class=" text-muted-foreground text-sm font-light">Table Unknown</span>
       </div>

    </section>

<!-- category -->
 <section class=" flex  gap-2 overflow-x-scroll ">
     <div  v-for="category in categories" :key="category.id" class=" ">
 
         <div class=" flex space-x-2 rounded-full border px-4 py-2">
             <span>{{category.icon}}</span>
             <span> {{category.name}}</span>
             
         </div>
 
     </div>

    </section>


 <section class=" space-y-4 overflow-y-scroll h-[500px]">


    
        <div  v-for="menu in data" class=" space-y-4 last:pb-26">

            <div class=" border flex p-4 gap-2  rounded-lg">
                <NuxtImg  src="https://foodish-api.com/images/burger/burger67.jpg" width="200" height="200" class="rounded-lg w-[100px] h-[100px] object-cover"/>

                <div class="space-y-2 w-full">
                    <div class=" flex justify-between items-center">

                        <span class="text-lg font-semibold ">{{ menu.name }}</span>
                        <span class=" bg-accent p-2 rounded-lg font-semibold"> ${{ menu.price }}</span>
                    </div>
                    <p class=" text-muted-foreground font-light text-sm">{{ menu.description }}</p>


                    <!-- add or minus the items number button -->
                    <div class=" flex items-center justify-between">
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

        </div>


</section>








<!-- the position is set the fixed  -->
<section class="w-full   fixed bottom-0 left-0">

<!-- order summary popup when clicked on view cart -->
    <div v-if="show_cart" class="h-[500px] bg-card p-4 rounded-t-xl">


        <!-- order summary header -->
        <div class=" mb-4 flex justify-between ">

            
            <div class=" flex flex-col">
                <span class="font-bold text-2xl">Order Summary</span>
                <span class=" font-light text-muted-foreground text-sm">Table Unknown</span>

            </div>
            <div>
                <i class=" pi pi-times"></i>
            </div>

        </div>



        <!-- food items cart list -->

        <section class="space-y-4 h-[400px] overflow-y-scroll">


            <!-- food item -->
            <div class="flex border-b pb-4 justify-between">
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
    
            <!-- food item -->
            <div class="flex border-b pb-4 justify-between">
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
    
            <!-- food item -->
            <div class="flex border-b pb-4 justify-between">
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
            <!-- food item -->
            <div class="flex border-b pb-4 justify-between">
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
            <!-- food item -->
            <div class="flex border-b pb-4 justify-between">
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
        </section>


    </div>

    <!-- view cart button-->

    <div @click="show_cart = !show_cart" class="bg-green-600 w-full text-white  p-4 rounded-lg flex space-x-2 items-center justify-center">
        <i class=" pi pi-shopping-cart"></i>
        <div>View Cart</div>
        <div>(2 item)</div>
        <div class="font-bold">$65.45</div>

    </div>

    

</section>
</main>

</template>