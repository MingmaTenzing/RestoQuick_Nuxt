import { usePrisma } from "~~/server/utils/prisma";

type UndoTakeawayPaidBody = {
  orderId?: string;
};

/**
 * Revert a mistaken takeaway checkout: mark the order UNPAID again so it
 * returns to the unpaid takeaway cashier queue.
 *
 * Kitchen order status is left alone — this only undoes payment.
 */
export default defineEventHandler(async (event) => {
  const prisma = usePrisma();
  const body = (await readBody(event)) as UndoTakeawayPaidBody;
  const orderId = String(body?.orderId ?? "").trim();

  if (!orderId) {
    throw createError({
      statusCode: 400,
      statusMessage: "orderId is required",
    });
  }

  const existingOrder = await prisma.order.findUnique({
    where: { id: orderId },
    select: {
      id: true,
      orderType: true,
      paymentStatus: true,
    },
  });

  if (!existingOrder) {
    throw createError({
      statusCode: 404,
      statusMessage: "Order not found",
    });
  }

  if (existingOrder.orderType !== "TAKEAWAY") {
    throw createError({
      statusCode: 400,
      statusMessage: "Only takeaway orders can be undone here",
    });
  }

  if (existingOrder.paymentStatus !== "PAID") {
    throw createError({
      statusCode: 400,
      statusMessage: "Order is not paid",
    });
  }

  return prisma.order.update({
    where: { id: orderId },
    data: {
      paymentStatus: "UNPAID",
      paymentMethod: null,
      paidAt: null,
    },
    include: {
      table: true,
      items: {
        include: {
          menuItem: true,
          orderItemOptions: {
            include: {
              menuOption: true,
            },
          },
        },
      },
    },
  });
});
