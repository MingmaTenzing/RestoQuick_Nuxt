import { updateOrderTotalCents } from "~~/server/utils/orderTotals";
import { usePrisma } from "~~/server/utils/prisma";

export default defineEventHandler(async (event) => {
  const prisma = usePrisma();
  const itemId = getRouterParam(event, "item_id");
  const optionId = getRouterParam(event, "option_id");

  if (!itemId || !optionId) {
    throw createError({
      statusCode: 400,
      statusMessage: "item_id and option_id are required",
    });
  }

  const orderItemOption = await prisma.orderItemOption.delete({
    where: { id: optionId },
    select: {
      orderItem: {
        select: { orderId: true },
      },
    },
  });
  await updateOrderTotalCents(prisma, orderItemOption.orderItem.orderId);

  return { success: true };
});
