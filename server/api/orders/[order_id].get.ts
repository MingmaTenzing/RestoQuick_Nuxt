import { usePrisma } from "~~/server/utils/prisma";

export default defineEventHandler(async (event) => {
  const prisma = usePrisma();
  const order_id = getRouterParam(event, "order_id");

  if (!order_id) {
    throw createError({
      statusCode: 400,
      statusMessage: "order_id is required",
    });
  }

  const order = await prisma.order.findUnique({
    where: { id: order_id },
    include: {
      table: true,
      items: {
        include: {
          menuItem: true,
        },
      },
    },
  });

  if (!order) {
    throw createError({
      statusCode: 404,
      statusMessage: "Order not found",
    });
  }

  return order;
});
