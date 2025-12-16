import { table } from "node:console";

export default eventHandler(async (event) => {
  const prisma = usePrisma();

  // Read request body - expects cart items
  const body = await readBody(event);

  const { cart_items, tableId, orderType } = body;

  console.log(cart_items, tableId);

  // Validate cart items
  if (!cart_items || cart_items.length === 0) {
    throw createError({
      statusCode: 400,
      statusMessage: "Cart cannot be empty",
    });
  }

  // Calculate total amount
  const totalAmount = cart_items.reduce((sum: number, item: any) => {
    return sum + item.unitPrice * item.quantity;
  }, 0);

  // Generate order number (e.g., ORD-2025-001)
  const orderNumber = `ORD-${Date.now()}`;

  try {
    // Create order with items from cart
    const order = await prisma.order.create({
      data: {
        orderNumber,
        status: "PENDING",
        totalAmount,
        orderType,
        tableId,
        items: {
          create: cart_items.map((item: any) => ({
            itemName: item.itemName,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            specialInstructions:
              item.specialInstructions || specialInstructions,
          })),
        },
      },
      include: {
        items: true,
        table: true,
      },
    });

    return {
      statusCode: 201,
      data: order,
    };
  } catch (error: any) {
    console.error("Error creating order:", error);
    throw createError({
      statusCode: 500,
      statusMessage: error.message || "Failed to create order",
    });
  }
});
