// Client-side cart item used before an order is persisted in database.
// Kept separate from Prisma OrderItem because this shape is shared by POS
// and order-table page flows, and it only contains the UI/order-building data

import type { MenuItem, MenuOption } from "~/generated/prisma/browser";

export interface Selected_Options extends MenuOption {
  //added the quantity cause the selected option can be multiple quanity of same like
  //2x extra mayo
  //3x extra noodle
  quantity: number; //its later then added to orderitem option quanity.
}
// those pages need while the user is still composing an order.
export default interface Order_Cart_Item {
  itemName: string;
  quantity: number;
  unitPrice: number; //unit price always should be cents
  specialInstructions?: string;
  image_url: string | null;
  menuItemId: string;
  selected_options: Selected_Options[];
}
