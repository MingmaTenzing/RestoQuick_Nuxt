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
<main class="w-full p-4">

    <section class=" flex space-x-2 items-center ">
        <img src="../assets/images/RestroMate.png"  class="invert w-20"></img>
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


    
        <div  v-for="menu in data" class=" space-y-4">

            <div class=" border flex p-4 gap-2 items-center justify-center rounded-lg">
                <NuxtImg  src="https://foodish-api.com/images/burger/burger67.jpg" width="100" height="100" class="rounded-lg w-[100px] h-[80px] object-cover"/>

                <div class="space-y-2">
                    <div class=" flex justify-between items-center">

                        <span class="text-lg font-semibold ">{{ menu.name }}</span>
                        <span class=" bg-accent p-2 rounded-lg"> ${{ menu.price }}</span>
                    </div>
                    <p class=" text-muted-foreground font-light text-sm">{{ menu.description }}</p>
                    <div>
                        <span class=" rounded-lg border p-2">-</span>
                        <span>2</span>
                        <span class="rounded-lg border p-2">+</span>
                    </div>
                </div>

            </div>

        </div>


</section>


</main>
</template>