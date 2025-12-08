<script lang="ts" setup>

const {data} = useFetch('/api/menu-items')
const categories = [
    { id: "all", name: "All", icon: "🍽️" },
    { id: "appetizers", name: "Starters", icon: "🥗" },
    { id: "mains", name: "Mains", icon: "🍖" },
    { id: "desserts", name: "Desserts", icon: "🍰" },
    { id: "drinks", name: "Drinks", icon: "🍹" },
  ]
</script>

<template >
<main class="w-full p-4 space-y-6">

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


 <section class=" space-y-4">


    
        <div  v-for="menu in data" class=" space-y-4 last:pb-26">

            <div class=" border flex p-4 gap-2  rounded-lg">
                <NuxtImg  src="https://foodish-api.com/images/burger/burger67.jpg" width="200" height="200" class="rounded-lg w-[100px] h-[100px] object-cover"/>

                <div class="space-y-2 w-full">
                    <div class=" flex justify-between items-center">

                        <span class="text-lg font-semibold ">{{ menu.name }}</span>
                        <span class=" bg-accent p-2 rounded-lg font-semibold"> ${{ menu.price }}</span>
                    </div>
                    <p class=" text-muted-foreground font-light text-sm">{{ menu.description }}</p>
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



<!-- view cart -->

<section>


</section>


</main>
</template>