import { MenuCategory, Prisma } from "~/generated/prisma/client";

export default defineEventHandler(async (event) => {
  const prisma = usePrisma();

  // Check if menu items already exist

  // Sample menu items organized by category
  const menuItemsData: Prisma.MenuItemCreateInput[] = [
    // APPETIZERS
    {
      name: "Bruschetta",
      description:
        "Toasted bread topped with fresh tomatoes, basil, and garlic",
      price: 8.99,
      category: "APPETIZER",
      isAvailable: true,
    },
    {
      name: "Mozzarella Sticks",
      description: "Crispy fried mozzarella with marinara sauce",
      price: 7.99,
      category: "APPETIZER",
      isAvailable: true,
    },
    {
      name: "Chicken Wings",
      description: "Spicy buffalo wings with blue cheese dip",
      price: 12.99,
      category: "APPETIZER",
      isAvailable: true,
    },
    {
      name: "Spring Rolls",
      description: "Crispy vegetable spring rolls with sweet chili sauce",
      price: 6.99,
      category: "APPETIZER",
      isAvailable: true,
    },

    // SALADS
    {
      name: "Caesar Salad",
      description:
        "Fresh romaine lettuce with Caesar dressing, croutons, and parmesan",
      price: 9.99,
      category: "SALAD",
      isAvailable: true,
    },
    {
      name: "Greek Salad",
      description:
        "Mixed greens with feta cheese, olives, tomatoes, and Greek dressing",
      price: 10.99,
      category: "SALAD",
      isAvailable: true,
    },
    {
      name: "Garden Salad",
      description: "Fresh mixed greens with seasonal vegetables",
      price: 8.99,
      category: "SALAD",
      isAvailable: true,
    },

    // MAIN COURSES
    {
      name: "Margherita Pizza",
      description:
        "Classic pizza with tomato sauce, mozzarella, and fresh basil",
      price: 12.99,
      category: "MAIN_COURSE",
      isAvailable: true,
    },
    {
      name: "Pepperoni Pizza",
      description: "Traditional pizza with pepperoni and mozzarella cheese",
      price: 14.99,
      category: "MAIN_COURSE",
      isAvailable: true,
    },
    {
      name: "Grilled Chicken",
      description: "Tender grilled chicken breast with herbs and lemon",
      price: 18.99,
      category: "MAIN_COURSE",
      isAvailable: true,
    },
    {
      name: "Pasta Carbonara",
      description: "Creamy pasta with bacon, eggs, and parmesan cheese",
      price: 16.99,
      category: "MAIN_COURSE",
      isAvailable: true,
    },
    {
      name: "Burger Deluxe",
      description:
        "Beef patty with lettuce, tomato, onion, pickles, and special sauce",
      price: 13.99,
      category: "MAIN_COURSE",
      isAvailable: true,
    },
    {
      name: "Fish & Chips",
      description: "Beer-battered fish with crispy fries and tartar sauce",
      price: 15.99,
      category: "MAIN_COURSE",
      isAvailable: true,
    },
    {
      name: "Beef Steak",
      description: "8oz ribeye steak cooked to perfection with mashed potatoes",
      price: 24.99,
      category: "MAIN_COURSE",
      isAvailable: true,
    },
    {
      name: "Salmon Fillet",
      description: "Pan-seared salmon with vegetables and lemon butter sauce",
      price: 22.99,
      category: "MAIN_COURSE",
      isAvailable: true,
    },

    // SIDES
    {
      name: "French Fries",
      description: "Crispy golden fries",
      price: 4.99,
      category: "SIDE",
      isAvailable: true,
    },
    {
      name: "Onion Rings",
      description: "Crispy battered onion rings",
      price: 5.99,
      category: "SIDE",
      isAvailable: true,
    },
    {
      name: "Garlic Bread",
      description: "Toasted bread with garlic butter",
      price: 4.99,
      category: "SIDE",
      isAvailable: true,
    },
    {
      name: "Mashed Potatoes",
      description: "Creamy mashed potatoes with butter",
      price: 5.99,
      category: "SIDE",
      isAvailable: true,
    },

    // DESSERTS
    {
      name: "Chocolate Cake",
      description: "Rich chocolate layer cake with chocolate frosting",
      price: 7.99,
      category: "DESSERT",
      isAvailable: true,
    },
    {
      name: "Tiramisu",
      description: "Classic Italian dessert with coffee and mascarpone",
      price: 8.99,
      category: "DESSERT",
      isAvailable: true,
    },
    {
      name: "Cheesecake",
      description: "New York style cheesecake with berry compote",
      price: 8.99,
      category: "DESSERT",
      isAvailable: true,
    },
    {
      name: "Ice Cream Sundae",
      description: "Vanilla ice cream with chocolate sauce and whipped cream",
      price: 6.99,
      category: "DESSERT",
      isAvailable: true,
    },
    {
      name: "Apple Pie",
      description: "Warm apple pie with vanilla ice cream",
      price: 7.99,
      category: "DESSERT",
      isAvailable: true,
    },

    // BEVERAGES
    {
      name: "Coca Cola",
      description: "Classic cola soft drink",
      price: 2.99,
      category: "BEVERAGE",
      isAvailable: true,
    },
    {
      name: "Orange Juice",
      description: "Fresh squeezed orange juice",
      price: 3.99,
      category: "BEVERAGE",
      isAvailable: true,
    },
    {
      name: "Coffee",
      description: "Freshly brewed coffee",
      price: 3.49,
      category: "BEVERAGE",
      isAvailable: true,
    },
    {
      name: "Iced Tea",
      description: "Refreshing iced tea",
      price: 2.99,
      category: "BEVERAGE",
      isAvailable: true,
    },
    {
      name: "Lemonade",
      description: "Fresh lemonade",
      price: 3.49,
      category: "BEVERAGE",
      isAvailable: true,
    },
    {
      name: "Water",
      description: "Bottled water",
      price: 1.99,
      category: "BEVERAGE",
      isAvailable: true,
    },
  ];

  // Create all menu items

  const createItems = await prisma.menuItem.create({
    data: {
      name: "Bruschetta",
      description:
        "Toasted bread topped with fresh tomatoes, basil, and garlic",
      price: 8.99,
      category: MenuCategory.APPETIZER,
      isAvailable: true,
    },
  });
  return createItems;
});
