import { usePrisma } from "~~/server/utils/prisma";
import type { OrderStatus } from "~/generated/prisma/client";

export default defineEventHandler(async (event) => {
  const prisma = usePrisma();
  const orderId = getRouterParam(event, "order-id");
  const body = await readBody<{ status: OrderStatus }>(event);

  if (!orderId) {
    throw createError({
      statusCode: 400,
      statusMessage: "Order ID is required",
    });
  }

  if (!body.status) {
    throw createError({
      statusCode: 400,
      statusMessage: "Status is required",
    });
  }

  const updatedOrder = await prisma.order.update({
    where: {
      id: orderId,
    },
    data: {
      status: body.status,
    },
    include: {
      table: true,
      items: true,
    },
  });

  return updatedOrder;
});
