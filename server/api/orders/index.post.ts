import { OrderItemCreateWithoutOrderInput } from "~/generated/prisma/models";
import type Order_Cart_Item from "../../../types/order-cart";
export default eventHandler(async (event) => {
  const prisma = usePrisma();
  const body = await readBody(event);
  // Read request body - expects cart items
  const cart_items: Order_Cart_Item[] = body.cart_items;
  const table_id = body.table_id;

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
  const totalAmount = cart_items.reduce((sum: number, item) => {
    return sum + item.unitPrice * item.quantity;
  }, 0);

  //mapping the cart_items coming from the request body to match order_schema_data_type
  // for the database.
  const order_items: OrderItemCreateWithoutOrderInput[] = cart_items.map(
    (item) => ({
      itemName: item.itemName,
      quantity: item.quantity,
      unitPriceCents: item.unitPrice,
      menuItemId: item.menuItemId,
      specialInstructions: item.specialInstructions,
    })
  );

  //mapping data for stripe line_items
  const stripe_line_items = cart_items.map((item) => ({
    price_data: {
      currency: "aud",
      unit_amount: item.unitPrice * 100, //the reason for multiplying by 100 is due cause unit_amount should be in cents;
      metadata: {
        table_id: table_id, //this is to reference the table_id when checkout completes to add to database
      },
      product_data: {
        name: item.itemName,
        metadata: {
          menuItemId: item.menuItemId, //this is to reference menuitemid lookup.. on database for future purpose.
        },
        // images: ["https://example.com/katsu-curry.png"],
      },
    },
    quantity: 2,
  }));

  try {
    // Create order with items from cart
    const order = await prisma.order.create({
      data: {
        totalAmountCents: totalAmount,
        tableId: table_id,
        checkoutSessionId: "", // Will be updated after Stripe checkout
        customerName: "Guest",
        items: {
          create: order_items,
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
  } catch (error) {
    console.error("Error creating order:", error);
    throw createError({
      statusCode: 500,
      statusMessage: "Failed to create order",
    });
  }
});
