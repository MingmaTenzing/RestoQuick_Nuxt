import { updateOrderTotalCents } from "~~/server/utils/orderTotals";
import { usePrisma } from "~~/server/utils/prisma";

type UpdateOrderItemOptionQuantityBody = {
  quantity?: number;
};

export default defineEventHandler(async (event) => {
  const prisma = usePrisma();
  const itemId = getRouterParam(event, "item_id");
  const optionId = getRouterParam(event, "option_id");
  const body = (await readBody(event)) as UpdateOrderItemOptionQuantityBody;
  const quantity = Number(body.quantity);

  if (!itemId || !optionId) {
    throw createError({
      statusCode: 400,
      statusMessage: "item_id and option_id are required",
    });
  }

  if (!Number.isInteger(quantity) || quantity < 1) {
    throw createError({
      statusCode: 400,
      statusMessage: "Quantity must be a whole number greater than 0",
    });
  }

  const orderItemOption = await prisma.orderItemOption.update({
    where: { id: optionId },
    data: { quantity },
    select: {
      orderItem: {
        select: { orderId: true },
      },
    },
  });
  await updateOrderTotalCents(prisma, orderItemOption.orderItem.orderId);

  return { success: true };
});
