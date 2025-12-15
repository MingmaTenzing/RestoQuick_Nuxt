export default interface Order_Cart_Item {
  itemName: string;
  quantity: number;
  unitPrice: number;
  specialInstructions?: string;

  menuItemId: string;
}
