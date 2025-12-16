import type Order_Cart_Item from "../../../types/order-cart";
export default eventHandler(async (event) => {
  const prisma = usePrisma();

  // Read request body - expects cart items
  const body = await readBody(event);

  const { cart_items, table_id } = body;

  console.log(cart_items, table_id);

  //validates table id
  if (!table_id) {
    throw createError({
      statusCode: 400,
      statusMessage: "No table found.. please scan the qr code",
    });
  }

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

  try {
    // Create order with items from cart
    const order = await prisma.order.create({
      data: {
        totalAmount,

        tableId: table_id,
        items: {
          create: cart_items.map((item: Order_Cart_Item) => ({
            itemName: item.itemName,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            specialInstructions: item.specialInstructions,
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
