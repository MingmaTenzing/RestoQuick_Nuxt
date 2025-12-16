<script lang="ts" setup>
import { table } from 'node:console';
import { create } from 'node:domain';
import type { MenuItem } from '~/generated/prisma/client';
import type Order_Cart_Item from '~~/types/order-cart';




const { data: menu_items } = useFetch<MenuItem[]>('/api/menu-items')
const { cart_items } = useOrderCart()

// router param with table id 

const table_id = useRoute().params;
console.log(table_id.table_id)




const selectedCategory = ref("All")
const show_cart = ref(true);




// here  i've explicitly defineed the category name
const categories = [
    { id: "all", name: "All", icon: "🍽️" },
    { id: "appetizers", name: 'APPETIZER', icon: "🥗" },
    { id: "mains", name: 'MAIN_COURSE', icon: "🍖" },
    { id: "desserts", name: 'DESSERT', icon: "🍰" },
    { id: "drinks", name:' BEVERAGE', icon: "🍹" },
    { id: "sides", name: 'SIDE', icon: "🥟" },
]


const totalAmount = computed(() => 
  cart_items.value.reduce((sum: number, item: Order_Cart_Item) => {
    return sum + item.unitPrice * item.quantity;
  }, 0).toFixed(2)
)

const selectedCategory_menu_items = computed(() =>

{
    if (selectedCategory.value == 'All') {
        console.log(selectedCategory.value)
        return menu_items.value;
    }
    else {
        
        return  menu_items.value?.filter((item) => item.category == selectedCategory.value)
    }}
);


async function place_order() {
    const create_order = await $fetch("/api/orders", {
        method: 'POST',
        body: {
            cart_items: cart_items.value,
            table_id: table_id,
        }
    })

    console.log(create_order)
}


</script>

<template >
<main class="w-full p-4 space-y-6 h-screen ">


    <!-- header -->
    <section class=" flex space-x-2 items-center ">
        <img src="../../assets/images/RestroMate.png"  class="invert w-20 not-dark:invert-0"></img>
       <div class=" flex flex-col">
           <span class=" text-2xl font-semibold">Order Now</span>
           <span class=" text-muted-foreground text-sm font-light">Table Unknown</span>
       </div>

    </section>

<!-- categories -->
<section class=" flex  gap-2 overflow-x-scroll no-scrollbar">
     <div  v-for="category in categories" :key="category.id" class=" ">
 
         <button v-on:click="selectedCategory = category.name" class=" flex space-x-2 rounded-full border px-4 py-2">
             <span>{{category.icon}}</span>
             <span> {{category.name}}</span>
             
         </button>
 
     </div>

    </section>



    <!-- menu items list -->
 <section class=" space-y-4 overflow-y-scroll no-scrollbar ">


    
    <!-- list of menu items -->
        <div  v-for="item in selectedCategory_menu_items" :key="item.id" class=" space-y-4 last:pb-26">
 
            <OrderComponentsMenuItem :menu_item="item" ></OrderComponentsMenuItem>           

        </div>


</section>




<!-- view Cart component  -->



        <!-- the position is set the fixed  -->

    <section class="w-full   fixed bottom-0 left-0">

        <Transition name="slide-fade">

        
    
    <!-- order summary popup when clicked on view cart -->
        <div v-if="show_cart" class="h-[70vh] bg-card p-4 rounded-t-xl flex flex-col justify-between">
    
    
            <!-- order summary header -->
            <section class=" mb-4 flex justify-between ">
    
                
                <div class=" flex flex-col">
                    <span class="font-bold text-2xl">Order Summary</span>
                    <span class=" font-light text-muted-foreground text-sm">Table Unknown</span>
    
                </div>
                <div @click="show_cart = false">
                    <i class=" pi pi-times"></i>
                </div>
    
            </section>
    
    
    
            <!-- food items cart list -->

            <section class=" flex ">

            </section>
    
            <section class="space-y-4  overflow-y-scroll flex-1 ">


                 <div class="" v-for="item in cart_items" :key="item.menuItemId">
                    
                                <!-- list of cart items -->
                                 <OrderComponentsCartItem :cart_item="item" ></OrderComponentsCartItem>
                </div>
      


                
                
                
            </section>
            
            
            <!-- total cost and tax -->
              <section>
    
                        <!-- subtotal and tax -->
                    <div class=" flex  justify-between  border-t border-b py-2">
                        <div class=" flex flex-col space-y-2">
    
                            <span class=" font-semibold ">SubTotal</span>
                            <span class=" text-sm">Tax (0%)</span>
                        </div>
                        <div class=" flex flex-col  space-y-2">
                            <span>${{ totalAmount }}</span>
                            <span class=" text-sm">$0</span>
                        </div>
                    </div>
        
                    <!-- final total price -->
                    <div class=" flex justify-between items-center py-2">
                        <span class=" font-bold">Total</span>
                        <span class=" font-bold">${{totalAmount}}</span>
                    </div>
                </section>
    
        </div>
    
        <!-- view cart button-->
    
        
        
    </Transition>
    

    <!-- view cart buttons -->
    <div v-if="!show_cart && cart_items.length>0" @click="show_cart = !show_cart" class="bg-amber-600 w-full text-white  p-4  flex space-x-2 items-center justify-center">
        <i class=" pi pi-shopping-cart"></i>
        <div>View Cart</div>
        <div>{{ cart_items.length }}</div>
        <div class="font-bold">${{totalAmount}}</div>

    </div>

    <!-- checkout button -->
    <div @click="place_order()" v-if="show_cart"  class="bg-green-600 w-full text-white  p-4  flex space-x-2 items-center justify-center">
        <div>Checkout</div>
      

    </div>
    
    </section>
</main>

</template>


<style>
    /*
  Enter and leave animations can use different
  durations and timing functions.
*/
.slide-fade-enter-active {
  transition: all 0.3s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.3s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateY(20px);
  opacity: 0;
}
</style>