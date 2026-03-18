import { broadCast } from "../../../utils/kitchenSocket";

export default defineEventHandler(async (event) => {
  const prisma = usePrisma();
  const body = await readBody(event);
  const data = body?.data;

  if (!data?.customerName || !data?.items?.create?.length) {
    throw createError({
      statusCode: 400,
      statusMessage: "Invalid takeaway order payload",
    });
  }

  const order = await prisma.order.create({
    data: {
      ...data,
      orderType: "TAKEAWAY",
      tableId: null,
      paymentStatus: "UNPAID",
      paymentMethod: null,
      paidAt: null,

      // POS orders do not come from Stripe checkout, so generate a unique session id.
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
    console.warn("Failed to broadcast takeaway POS order created event", error);
  }

  return order;
});
