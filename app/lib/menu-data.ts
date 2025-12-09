export interface MenuItem {
  id: string
  name: string
  description: string
  price: number
  category: 'APPETIZER' | 'MAIN_COURSE' | 'DESSERT' | 'BEVERAGE' | 'SIDE' | 'SALAD'
  image?: string
  isAvailable?: boolean
}

export const menuItems: MenuItem[] = [
  // APPETIZERS
  {
    id: 'app-1',
    name: 'Bruschetta',
    description: 'Toasted bread topped with fresh tomatoes, basil, and garlic',
    price: 8.99,
    category: 'APPETIZER',
    isAvailable: true,
  },
  {
    id: 'app-2',
    name: 'Mozzarella Sticks',
    description: 'Crispy fried mozzarella with marinara sauce',
    price: 7.99,
    category: 'APPETIZER',
    isAvailable: true,
  },
  {
    id: 'app-3',
    name: 'Chicken Wings',
    description: 'Spicy buffalo wings with blue cheese dip',
    price: 12.99,
    category: 'APPETIZER',
    isAvailable: true,
  },
  {
    id: 'app-4',
    name: 'Spring Rolls',
    description: 'Crispy vegetable spring rolls with sweet chili sauce',
    price: 6.99,
    category: 'APPETIZER',
    isAvailable: true,
  },

  // SALADS
  {
    id: 'sal-1',
    name: 'Caesar Salad',
    description: 'Fresh romaine lettuce with Caesar dressing, croutons, and parmesan',
    price: 9.99,
    category: 'SALAD',
    isAvailable: true,
  },
  {
    id: 'sal-2',
    name: 'Greek Salad',
    description: 'Mixed greens with feta cheese, olives, tomatoes, and Greek dressing',
    price: 10.99,
    category: 'SALAD',
    isAvailable: true,
  },
  {
    id: 'sal-3',
    name: 'Garden Salad',
    description: 'Fresh mixed greens with seasonal vegetables',
    price: 8.99,
    category: 'SALAD',
    isAvailable: true,
  },

  // MAIN COURSES
  {
    id: 'main-1',
    name: 'Margherita Pizza',
    description: 'Classic pizza with tomato sauce, mozzarella, and fresh basil',
    price: 12.99,
    category: 'MAIN_COURSE',
    isAvailable: true,
  },
  {
    id: 'main-2',
    name: 'Pepperoni Pizza',
    description: 'Traditional pizza with pepperoni and mozzarella cheese',
    price: 14.99,
    category: 'MAIN_COURSE',
    isAvailable: true,
  },
  {
    id: 'main-3',
    name: 'Grilled Chicken',
    description: 'Tender grilled chicken breast with herbs and lemon',
    price: 18.99,
    category: 'MAIN_COURSE',
    isAvailable: true,
  },
  {
    id: 'main-4',
    name: 'Pasta Carbonara',
    description: 'Creamy pasta with bacon, eggs, and parmesan cheese',
    price: 16.99,
    category: 'MAIN_COURSE',
    isAvailable: true,
  },
  {
    id: 'main-5',
    name: 'Burger Deluxe',
    description: 'Beef patty with lettuce, tomato, onion, pickles, and special sauce',
    price: 13.99,
    category: 'MAIN_COURSE',
    isAvailable: true,
  },
  {
    id: 'main-6',
    name: 'Fish & Chips',
    description: 'Beer-battered fish with crispy fries and tartar sauce',
    price: 15.99,
    category: 'MAIN_COURSE',
    isAvailable: true,
  },
  {
    id: 'main-7',
    name: 'Beef Steak',
    description: '8oz ribeye steak cooked to perfection with mashed potatoes',
    price: 24.99,
    category: 'MAIN_COURSE',
    isAvailable: true,
  },
  {
    id: 'main-8',
    name: 'Salmon Fillet',
    description: 'Pan-seared salmon with vegetables and lemon butter sauce',
    price: 22.99,
    category: 'MAIN_COURSE',
    isAvailable: true,
  },

  // SIDES
  {
    id: 'side-1',
    name: 'French Fries',
    description: 'Crispy golden fries',
    price: 4.99,
    category: 'SIDE',
    isAvailable: true,
  },
  {
    id: 'side-2',
    name: 'Onion Rings',
    description: 'Crispy battered onion rings',
    price: 5.99,
    category: 'SIDE',
    isAvailable: true,
  },
  {
    id: 'side-3',
    name: 'Garlic Bread',
    description: 'Toasted bread with garlic butter',
    price: 4.99,
    category: 'SIDE',
    isAvailable: true,
  },
  {
    id: 'side-4',
    name: 'Mashed Potatoes',
    description: 'Creamy mashed potatoes with butter',
    price: 5.99,
    category: 'SIDE',
    isAvailable: true,
  },

  // DESSERTS
  {
    id: 'des-1',
    name: 'Chocolate Cake',
    description: 'Rich chocolate layer cake with chocolate frosting',
    price: 7.99,
    category: 'DESSERT',
    isAvailable: true,
  },
  {
    id: 'des-2',
    name: 'Tiramisu',
    description: 'Classic Italian dessert with coffee and mascarpone',
    price: 8.99,
    category: 'DESSERT',
    isAvailable: true,
  },
  {
    id: 'des-3',
    name: 'Cheesecake',
    description: 'New York style cheesecake with berry compote',
    price: 8.99,
    category: 'DESSERT',
    isAvailable: true,
  },
  {
    id: 'des-4',
    name: 'Ice Cream Sundae',
    description: 'Vanilla ice cream with chocolate sauce and whipped cream',
    price: 6.99,
    category: 'DESSERT',
    isAvailable: true,
  },
  {
    id: 'des-5',
    name: 'Apple Pie',
    description: 'Warm apple pie with vanilla ice cream',
    price: 7.99,
    category: 'DESSERT',
    isAvailable: true,
  },

  // BEVERAGES
  {
    id: 'bev-1',
    name: 'Coca Cola',
    description: 'Classic cola soft drink',
    price: 2.99,
    category: 'BEVERAGE',
    isAvailable: true,
  },
  {
    id: 'bev-2',
    name: 'Orange Juice',
    description: 'Fresh squeezed orange juice',
    price: 3.99,
    category: 'BEVERAGE',
    isAvailable: true,
  },
  {
    id: 'bev-3',
    name: 'Coffee',
    description: 'Freshly brewed coffee',
    price: 3.49,
    category: 'BEVERAGE',
    isAvailable: true,
  },
  {
    id: 'bev-4',
    name: 'Iced Tea',
    description: 'Refreshing iced tea',
    price: 2.99,
    category: 'BEVERAGE',
    isAvailable: true,
  },
  {
    id: 'bev-5',
    name: 'Lemonade',
    description: 'Fresh lemonade',
    price: 3.49,
    category: 'BEVERAGE',
    isAvailable: true,
  },
  {
    id: 'bev-6',
    name: 'Water',
    description: 'Bottled water',
    price: 1.99,
    category: 'BEVERAGE',
    isAvailable: true,
  },
]

