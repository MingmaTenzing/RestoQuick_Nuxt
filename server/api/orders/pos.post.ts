import { broadCast } from "../../utils/kitchenSocket";

export default defineEventHandler(async (event) => {
  const prisma = usePrisma();
  const body = await readBody(event);
  const data = body?.data;

  if (!data?.tableId || !data?.customerName || !data?.items?.create?.length) {
    throw createError({
      statusCode: 400,
      statusMessage: "Invalid order payload",
    });
  }

  const order = await prisma.order.create({
    data: {
      ...data,

      // as checkoutSeessionId doesn't exist on POS
      // here just a random uuid is created to fill the field
      // checkoutSessionId only comes from Stripe Checkout.
      checkoutSessionId: `pos_${crypto.randomUUID()}`,
    },
    include: {
      items: {
        include: {
          menuItem: true,
        },
      },
      table: true,
    },
  });

  try {
    broadCast({ type: "ORDER_CREATED", payload: order });
  } catch (error) {
    console.warn("Failed to broadcast POS order created event", error);
  }

  return order;
});
