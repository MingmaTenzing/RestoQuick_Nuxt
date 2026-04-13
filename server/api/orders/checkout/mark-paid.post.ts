import { usePrisma } from "~~/server/utils/prisma";

type MarkPaidBody = {
  tableId?: string;
  orderIds?: string[];
  paymentMethod?: "CASH" | "CARD_TERMINAL";
};

export default defineEventHandler(async (event) => {
  const prisma = usePrisma() as any;
  const body = (await readBody(event)) as MarkPaidBody;

  const tableId = body?.tableId;
  const requestedOrderIds = body?.orderIds ?? [];
  const paymentMethod =
    body?.paymentMethod === "CASH" || body?.paymentMethod === "CARD_TERMINAL"
      ? body.paymentMethod
      : "CARD_TERMINAL";

  if (!tableId) {
    throw createError({
      statusCode: 400,
      statusMessage: "tableId is required",
    });
  }

  const unpaidCompletedOrders = await prisma.order.findMany({
    where: {
      tableId,
      status: "COMPLETED",
      paymentStatus: "UNPAID",
    },
    select: {
      id: true,
      totalAmountCents: true,
    },
  });

  if (!unpaidCompletedOrders.length) {
    return {
      tableId,
      updatedCount: 0,
      totalPaidCents: 0,
      orders: [],
      message: "No unpaid completed orders found for this table",
    };
  }

  const unpaidOrderIds = unpaidCompletedOrders.map(
    (order: { id: string }) => order.id,
  );
  const targetOrderIds = requestedOrderIds.length
    ? requestedOrderIds.filter((orderId) => unpaidOrderIds.includes(orderId))
    : unpaidOrderIds;

  if (!targetOrderIds.length) {
    throw createError({
      statusCode: 400,
      statusMessage: "No matching unpaid orderIds found for this table",
    });
  }

  const paidAt = new Date();

  await prisma.order.updateMany({
    where: {
      id: {
        in: targetOrderIds,
      },
    },
    data: {
      paymentStatus: "PAID",
      paymentMethod,
      paidAt,
    },
  });

  const paidOrders = await prisma.order.findMany({
    where: {
      id: {
        in: targetOrderIds,
      },
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
    orderBy: {
      createdAt: "asc",
    },
  });

  const totalPaidCents = paidOrders.reduce(
    (sum: number, order: { totalAmountCents: number }) =>
      sum + order.totalAmountCents,
    0,
  );

  return {
    tableId,
    updatedCount: paidOrders.length,
    totalPaidCents,
    paidAt,
    paymentMethod,
    orders: paidOrders,
  };
});
