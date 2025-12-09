<script lang="ts" setup>
import { MenuCategory, type MenuItem } from '~/generated/prisma/client';





const { data:menu_items } = useFetch<MenuItem[]>('/api/menu-items')


const show_cart = ref(true)



// the enum is not working when setting Menucategory.category.. so 
// here in dummy_categories... i've explicitly defineed the category name
const dummy_categories = [
    { id: "all", name: "All", icon: "🍽️" },
    { id: "appetizers", name: 'APPETIZER', icon: "🥗" },
    { id: "mains", name: 'MAIN_COURSE', icon: "🍖" },
    { id: "desserts", name: 'DESSERT', icon: "🍰" },
    { id: "drinks", name:' BEVERAGE', icon: "🍹" },
    { id: "sides", name: 'SIDE', icon: "🥟" },
  ]

// const categories = [
//     { id: "all", name: "All", icon: "🍽️" },
//     { id: "appetizers", name: MenuCategory.APPETIZER.toString(), icon: "🥗" },
//     { id: "mains", name: MenuCategory.MAIN_COURSE.toString(), icon: "🍖" },
//     { id: "desserts", name: MenuCategory.DESSERT.toString(), icon: "🍰" },
//     { id: "drinks", name: MenuCategory.BEVERAGE.toString(), icon: "🍹" },
//     { id: "sides", name: MenuCategory.SIDE.toString(), icon: "🥟" },
//   ]
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
     <div  v-for="category in dummy_categories" :key="category.id" class=" ">
 
         <div class=" flex space-x-2 rounded-full border px-4 py-2">
             <span>{{category.icon}}</span>
             <span> {{category.name}}</span>
             
         </div>
 
     </div>

    </section>


 <section class=" space-y-4 overflow-y-scroll h-[500px]">


    
    <!-- list of menu items -->
        <div  v-for="item in menu_items" class=" space-y-4 last:pb-26">
 
            <OrderComponentsMenuItem :menu_item="item" ></OrderComponentsMenuItem>           

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


            <!-- list of cart items -->
             <OrderComponentsCartItem></OrderComponentsCartItem>


        </section>


    </div>

    <!-- view cart button-->

    <div @click="show_cart = !show_cart" class="bg-green-600 w-full text-white  p-4  flex space-x-2 items-center justify-center">
        <i class=" pi pi-shopping-cart"></i>
        <div>View Cart</div>
        <div>(2 item)</div>
        <div class="font-bold">$65.45</div>

    </div>

    

</section>
</main>

</template>