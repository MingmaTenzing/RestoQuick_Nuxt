import type { OrderStatus } from "~/generated/prisma/enums";
import { broadCast } from "~~/server/utils/kitchenSocket";
import { usePrisma } from "~~/server/utils/prisma";

type UpdateOrderStatusBody = {
  status?: OrderStatus;
};

const orderInclude = {
  table: true,
  items: {
    include: {
      menuItem: true,
      orderItemOptions: true,
    },
  },
} as const;

export default defineEventHandler(async (event) => {
  const prisma = usePrisma();
  const orderId = getRouterParam(event, "order_id");
  const body = (await readBody(event)) as UpdateOrderStatusBody;

  if (!orderId) {
    throw createError({
      statusCode: 400,
      statusMessage: "order_id is required",
    });
  }

  if (!body.status) {
    throw createError({
      statusCode: 400,
      statusMessage: "status is required",
    });
  }

  const existingOrder = await prisma.order.findUnique({
    where: { id: orderId },
    select: { status: true },
  });

  if (!existingOrder) {
    throw createError({
      statusCode: 404,
      statusMessage: "Order not found",
    });
  }

  const order = await prisma.order.update({
    where: { id: orderId },
    data: {
      status: body.status,
    },
    include: orderInclude,
  });

  try {
    if (body.status === "COMPLETED") {
      broadCast({ type: "ORDER_MARKED_COMPLETED", payload: order });
    } else if (body.status === "CANCELLED") {
      broadCast({ type: "ORDER_CANCELLED", payload: order });
    } else if (
      body.status === "PENDING" &&
      existingOrder.status === "COMPLETED"
    ) {
      broadCast({ type: "ORDER_RECALL", payload: order });
    }
  } catch (error) {
    console.warn("Failed to broadcast order status update", error);
  }

  return order;
});
