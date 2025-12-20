// import { MenuCategory } from "~/generated/prisma/enums";

// export default defineEventHandler(async (event) => {
//   const prisma = usePrisma();

//   const menuItems = [
//     // 🍟 APPETIZERS
//     {
//       name: "Garlic Bread",
//       description: "Toasted sourdough with garlic butter and herbs",
//       priceCents: 650,
//       category: MenuCategory.APPETIZER,
//       imageUrl: null,
//       isAvailable: true,
//     },
//     {
//       name: "Crispy Calamari",
//       description: "Lightly battered calamari served with aioli",
//       priceCents: 1350,
//       category: MenuCategory.APPETIZER,
//       imageUrl: null,
//       isAvailable: true,
//     },
//     {
//       name: "Chicken Wings",
//       description: "Spicy buffalo wings with ranch dip",
//       priceCents: 1450,
//       category: MenuCategory.APPETIZER,
//       imageUrl: null,
//       isAvailable: true,
//     },
//     {
//       name: "Spring Rolls",
//       description: "Vegetable spring rolls with sweet chili sauce",
//       priceCents: 1200,
//       category: MenuCategory.APPETIZER,
//       imageUrl: null,
//       isAvailable: true,
//     },

//     // 🍝 MAIN COURSE
//     {
//       name: "Grilled Ribeye Steak",
//       description: "300g ribeye steak with pepper sauce and fries",
//       priceCents: 3490,
//       category: MenuCategory.MAIN_COURSE,
//       imageUrl: null,
//       isAvailable: true,
//     },
//     {
//       name: "Chicken Parmigiana",
//       description:
//         "Crumbed chicken breast topped with napoli sauce and mozzarella",
//       priceCents: 2450,
//       category: MenuCategory.MAIN_COURSE,
//       imageUrl: null,
//       isAvailable: true,
//     },
//     {
//       name: "Spaghetti Carbonara",
//       description: "Classic carbonara with pancetta, egg, and parmesan",
//       priceCents: 2250,
//       category: MenuCategory.MAIN_COURSE,
//       imageUrl: null,
//       isAvailable: true,
//     },
//     {
//       name: "Vegetable Stir Fry",
//       description: "Seasonal vegetables tossed in soy-ginger sauce",
//       priceCents: 1950,
//       category: MenuCategory.MAIN_COURSE,
//       imageUrl: null,
//       isAvailable: true,
//     },

//     // 🥗 SALAD
//     {
//       name: "Caesar Salad",
//       description: "Cos lettuce, parmesan, croutons, and Caesar dressing",
//       priceCents: 1550,
//       category: MenuCategory.SALAD,
//       imageUrl: null,
//       isAvailable: true,
//     },
//     {
//       name: "Greek Salad",
//       description: "Tomato, cucumber, olives, feta, and oregano dressing",
//       priceCents: 1500,
//       category: MenuCategory.SALAD,
//       imageUrl: null,
//       isAvailable: true,
//     },

//     // 🍟 SIDE
//     {
//       name: "French Fries",
//       description: "Golden crispy fries with sea salt",
//       priceCents: 750,
//       category: MenuCategory.SIDE,
//       imageUrl: null,
//       isAvailable: true,
//     },
//     {
//       name: "Mashed Potatoes",
//       description: "Creamy mashed potatoes with butter",
//       priceCents: 800,
//       category: MenuCategory.SIDE,
//       imageUrl: null,
//       isAvailable: true,
//     },
//     {
//       name: "Steamed Vegetables",
//       description: "Seasonal vegetables lightly steamed",
//       priceCents: 700,
//       category: MenuCategory.SIDE,
//       imageUrl: null,
//       isAvailable: true,
//     },

//     // 🍰 Menu
//     {
//       name: "Chocolate Lava Cake",
//       description: "Warm chocolate cake with molten center",
//       priceCents: 1200,
//       category: MenuCategory.DESSERT,
//       imageUrl: null,
//       isAvailable: true,
//     },
//     {
//       name: "Cheesecake",
//       description: "Classic baked cheesecake with berry coulis",
//       priceCents: 1150,
//       category: MenuCategory.DESSERT,
//       imageUrl: null,
//       isAvailable: true,
//     },
//     {
//       name: "Ice Cream Trio",
//       description: "Vanilla, chocolate, and strawberry scoops",
//       priceCents: 950,
//       category: MenuCategory.DESSERT,
//       imageUrl: null,
//       isAvailable: true,
//     },

//     // 🥤 BEVERAGE
//     {
//       name: "Coca-Cola",
//       description: "Chilled soft drink",
//       priceCents: 450,
//       category: MenuCategory.BEVERAGE,
//       imageUrl: null,
//       isAvailable: true,
//     },
//     {
//       name: "Fresh Orange Juice",
//       description: "Freshly squeezed oranges",
//       priceCents: 650,
//       category: MenuCategory.BEVERAGE,
//       imageUrl: null,
//       isAvailable: true,
//     },
//     {
//       name: "Cappuccino",
//       description: "Espresso with steamed milk and foam",
//       priceCents: 550,
//       category: MenuCategory.BEVERAGE,
//       imageUrl: null,
//       isAvailable: true,
//     },
//     {
//       name: "Mineral Water",
//       description: "Still or sparkling water",
//       priceCents: 400,
//       category: MenuCategory.BEVERAGE,
//       imageUrl: null,
//       isAvailable: true,
//     },
//   ];

//   const menuItem = await prisma.menuItem.createMany({
//     data: menuItems,
//   });

//   return menuItem;
// });
