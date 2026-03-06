export default interface Order_Cart_Item {
  itemName: string;
  quantity: number;
  unitPrice: number;
  specialInstructions?: string;
  image_url: string | null;
  menuItemId: string;
}
