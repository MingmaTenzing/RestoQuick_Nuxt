import type { PaymentMethod } from "~/generated/prisma/enums";
import { broadCast } from "~~/server/utils/kitchenSocket";
import { usePrisma } from "~~/server/utils/prisma";

type CloseTakeawaySaleBody = {
  orderId?: string;
  paymentMethod?: PaymentMethod;
};

export default defineEventHandler(async (event) => {
  const prisma = usePrisma();
  const body = (await readBody(event)) as CloseTakeawaySaleBody;

  if (!body.orderId) {
    throw createError({
      statusCode: 400,
      statusMessage: "orderId is required",
    });
  }

  const paidAt = new Date();
  const paymentMethod = body.paymentMethod ?? "CASH";

  const updatedOrder = await prisma.$transaction(async (transaction) => {
    const existingOrder = await transaction.order.findUnique({
      where: {
        id: body.orderId,
      },
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
        statusMessage: "Only takeaway orders can be closed here",
      });
    }

    if (existingOrder.paymentStatus === "PAID") {
      throw createError({
        statusCode: 400,
        statusMessage: "Order is already paid",
      });
    }

    return transaction.order.update({
      where: {
        id: body.orderId,
      },
      data: {
        paymentStatus: "PAID",
        status: "COMPLETED",
        paymentMethod,
        paidAt,
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

  try {
    broadCast({ type: "ORDER_MARKED_COMPLETED", payload: updatedOrder });
  } catch (error) {
    console.warn("Failed to broadcast takeaway order completion", error);
  }

  return updatedOrder;
});
