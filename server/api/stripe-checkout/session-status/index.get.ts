//this end point retrieves the checkout session status and details
//and if checkout is successfull then make a another request for line_items
//and then use that items for adding it to database;

import { useServerStripe } from "#stripe/server";
import { OrderItemCreateManyOrderInput } from "~/generated/prisma/models";
import { broadCast } from "../../../utils/kitchenSocket";

export default defineEventHandler(async (event) => {
  const stripe = await useServerStripe(event);
  const prisma = usePrisma();
  const query = getQuery(event);

  const session_id = query.session_id as string;

  const session = await stripe.checkout.sessions.retrieve(session_id);
  const lineItems = await stripe.checkout.sessions.listLineItems(session_id);

  //checking is status is expired or open, if yes throw error or send message that checkout is still open
  if (session.status == "expired") {
    throw createError({
      statusCode: 410,
      statusMessage: "Checkout Session has expired",
    });
  } else if (session.status == "open") {
    return {
      status: "checkout is still open so please proceed to payment first",
      checkoutUrl: session.url,
    };
  }

  // check existing order first
  const existing_order = await prisma.order.findUnique({
    where: {
      checkoutSessionId: session.id,
    },
    include: {
      table: true,
      items: true,
    },
  });

  if (existing_order) {
    throw createError({
      status: 409,
      statusMessage: "order already created ",
    });
  }

  //here's by this point its obvious that the session.status is complete so can proceed to add line_items to order table

  if (!lineItems) {
    throw createError({
      statusCode: 500,
      statusMessage: "Cannot get the line_items using the session id",
    });
  }

  const mapped_order_data: OrderItemCreateManyOrderInput[] = lineItems.data.map(
    (item) => ({
      itemName: item.metadata!.name,
      quantity: item.quantity!,
      unitPriceCents: item.price!.unit_amount!,
      specialInstructions: item.metadata!.specialInstructions,
      menuItemId: item.metadata!.menuItemId,
    })
  );

  try {
    // Create order with items from cart
    const order = await prisma.order.create({
      data: {
        checkoutSessionId: session.id,
        customerName: session.customer_details!.name!,
        totalAmountCents: session.amount_total!,
        tableId: session.metadata!.table_id!,
        items: {
          create: mapped_order_data,
        },
      },
      include: {
        items: true,
        table: true,
      },
    });
    console.log(order);

    // Notify kitchen clients that a new order was created
    try {
      broadCast({ type: "ORDER_CREATED", payload: order });
    } catch (e) {
      // fail silently — broadcasting should not block order creation
      console.warn("Failed to broadcast order created event", e);
    }

    return {
      order,
      customerDetails: {
        email: session.customer_details?.email,
        name: session.customer_details?.name,
      },
    };
  } catch (error) {
    console.error("Error creating order:", error);
    throw createError({
      statusCode: 500,
      statusMessage: "Failed to create order",
    });
  }
  // return {
  //   status: session.status,
  //   customer_email: session.customer_details?.email,
  //   lineItems: lineItems,
  //   table: table_id,
  // };
});
