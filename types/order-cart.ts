// Client-side cart item used before an order is persisted in database.
// Kept separate from Prisma OrderItem because this shape is shared by POS
// and order-table page flows, and it only contains the UI/order-building data
// those pages need while the user is still composing an order.
export default interface Order_Cart_Item {
  itemName: string;
  quantity: number;
  unitPrice: number;
  specialInstructions?: string;
  image_url: string | null;
  menuItemId: string;
}
