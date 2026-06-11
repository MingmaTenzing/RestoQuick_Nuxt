import type { OrderStatus, OrderType } from "~/generated/prisma/enums";
import { usePrisma } from "~~/server/utils/prisma";

type UpdateOrderBody = {
  customerName?: string;
  orderType?: OrderType;
  status?: OrderStatus;
  items?: Array<{
    id: string;
    quantity?: number;
    remove?: boolean;
    removeOptionIds?: string[];
    options?: Array<{
      id: string;
      quantity?: number;
    }>;
  }>;
};

export default defineEventHandler(async (event) => {
  const prisma = usePrisma();
  const order_id = getRouterParam(event, "order_id");
  const body = (await readBody(event)) as UpdateOrderBody;

  if (!order_id) {
    throw createError({
      statusCode: 400,
      statusMessage: "order_id is required",
    });
  }

  const existingOrder = await prisma.order.findUnique({
    where: { id: order_id },
    include: {
      items: {
        include: {
          orderItemOptions: true,
        },
      },
    },
  });

  if (!existingOrder) {
    throw createError({
      statusCode: 404,
      statusMessage: "Order not found",
    });
  }

  const orderItemMap = new Map(
    existingOrder.items.map((item) => [item.id, item]),
  );

  for (const incomingItem of body.items ?? []) {
    const existingItem = orderItemMap.get(incomingItem.id);
    if (!existingItem) {
      throw createError({
        statusCode: 400,
        statusMessage: `Invalid order item id: ${incomingItem.id}`,
      });
    }

    const optionIds = new Set(
      existingItem.orderItemOptions.map((option) => option.id),
    );
    for (const incomingOption of incomingItem.options ?? []) {
      if (!optionIds.has(incomingOption.id)) {
        throw createError({
          statusCode: 400,
          statusMessage: `Invalid order item option id: ${incomingOption.id}`,
        });
      }
    }

    for (const removeOptionId of incomingItem.removeOptionIds ?? []) {
      if (!optionIds.has(removeOptionId)) {
        throw createError({
          statusCode: 400,
          statusMessage: `Invalid order item option id: ${removeOptionId}`,
        });
      }
    }
  }

  await prisma.$transaction(async (tx) => {
    await tx.order.update({
      where: { id: order_id },
      data: {
        customerName: body.customerName,
        orderType: body.orderType,
        status: body.status,
      },
    });

    for (const incomingItem of body.items ?? []) {
      if (incomingItem.remove) {
        await tx.orderItem.delete({
          where: { id: incomingItem.id },
        });
        continue;
      }

      await tx.orderItem.update({
        where: { id: incomingItem.id },
        data: {
          quantity: incomingItem.quantity,
        },
      });

      if ((incomingItem.removeOptionIds ?? []).length > 0) {
        await tx.orderItemOption.deleteMany({
          where: {
            orderItemId: incomingItem.id,
            id: {
              in: incomingItem.removeOptionIds,
            },
          },
        });
      }

      for (const incomingOption of incomingItem.options ?? []) {
        await tx.orderItemOption.update({
          where: { id: incomingOption.id },
          data: {
            quantity: incomingOption.quantity,
          },
        });
      }
    }

    const orderItems = await tx.orderItem.findMany({
      where: { orderId: order_id },
      include: {
        orderItemOptions: true,
      },
    });

    const nextTotalAmountCents = orderItems.reduce((sum, item) => {
      const itemBase = item.quantity * item.unitPriceCents;
      const optionTotal = item.orderItemOptions.reduce(
        (optionSum, option) => optionSum + option.quantity * option.priceCents,
        0,
      );
      return sum + itemBase + optionTotal;
    }, 0);

    await tx.order.update({
      where: { id: order_id },
      data: {
        totalAmountCents: nextTotalAmountCents,
      },
    });
  });

  const updatedOrder = await prisma.order.findUnique({
    where: { id: order_id },
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

  return updatedOrder;
});
