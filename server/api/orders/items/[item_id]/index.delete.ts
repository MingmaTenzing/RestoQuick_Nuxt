import { updateOrderTotalCents } from "~~/server/utils/orderTotals";
import { usePrisma } from "~~/server/utils/prisma";

export default defineEventHandler(async (event) => {
  const prisma = usePrisma();
  const itemId = getRouterParam(event, "item_id");

  if (!itemId) {
    throw createError({
      statusCode: 400,
      statusMessage: "item_id is required",
    });
  }

  const orderItem = await prisma.orderItem.delete({
    where: { id: itemId },
    select: { orderId: true },
  });
  await updateOrderTotalCents(prisma, orderItem.orderId);

  return { success: true };
});
