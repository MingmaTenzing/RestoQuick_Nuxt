export default interface Order_Cart_Item {
  itemName: string;
  quantity: number;
  unitPrice: number;
  specialInstructions?: string;

  menuItemId: string;

  // model OrderItem {
  //   id String @id @default(uuid())

  //   // Item Details
  //   itemName            String // Keep for backward compatibility, can be derived from MenuItem
  //   quantity            Int     @default(1)
  //   unitPrice           Float // Price at time of order (snapshot)
  //   specialInstructions String? // e.g. "No onions", "Extra spicy", "Allergy: Nuts"

  //   // Relations
  //   orderId String
  //   order   Order  @relation(fields: [orderId], references: [id], onDelete: Cascade)

  //   // Timestamps
  //   createdAt DateTime @default(now())
  //   updatedAt DateTime @updatedAt

  //   menuItem   MenuItem? @relation(fields: [menuItemId], references: [id])
  //   menuItemId String?
  // }
}
