import type { OrderStatus } from "~/generated/prisma/enums";
import { usePrisma } from "~~/server/utils/prisma";

type UpdateOrderStatusBody = {
  status?: OrderStatus;
};

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

  await prisma.order.update({
    where: { id: orderId },
    data: {
      status: body.status,
    },
  });

  return { success: true };
});
