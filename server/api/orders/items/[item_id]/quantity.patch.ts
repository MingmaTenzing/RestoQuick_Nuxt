import { updateOrderTotalCents } from "~~/server/utils/orderTotals";
import { usePrisma } from "~~/server/utils/prisma";

type UpdateOrderItemQuantityBody = {
  quantity?: number;
};

export default defineEventHandler(async (event) => {
  const prisma = usePrisma();
  const itemId = getRouterParam(event, "item_id");
  const body = (await readBody(event)) as UpdateOrderItemQuantityBody;
  const quantity = Number(body.quantity);

  if (!itemId) {
    throw createError({
      statusCode: 400,
      statusMessage: "item_id is required",
    });
  }

  if (!Number.isInteger(quantity) || quantity < 1) {
    throw createError({
      statusCode: 400,
      statusMessage: "Quantity must be a whole number greater than 0",
    });
  }

  const orderItem = await prisma.orderItem.update({
    where: { id: itemId },
    data: { quantity },
    select: { orderId: true },
  });
  await updateOrderTotalCents(prisma, orderItem.orderId);

  return { success: true };
});
