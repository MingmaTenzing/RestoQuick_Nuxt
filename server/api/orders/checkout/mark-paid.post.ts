import { PaymentMethod } from "~/generated/prisma/enums";
import { usePrisma } from "~~/server/utils/prisma";

type MarkPaidBody = {
  tableSessionId: string;
  orderIds: string[];
  paymentMethod: PaymentMethod;
};

export default defineEventHandler(async (event) => {
  const prisma = usePrisma();
  const body = (await readBody(event)) as MarkPaidBody;

  const tableSessionId = body.tableSessionId;
  const orderIds = body.orderIds;
  const paymentMethod = body.paymentMethod;

  if (!orderIds.length) {
    throw createError({
      statusCode: 400,
      statusMessage: "orderIds are required",
    });
  }

  return prisma.$transaction(async (transaction) => {
    let unpaidOrders: { id: string; totalAmountCents: number }[] = [];

    try {
      unpaidOrders = await transaction.order.findMany({
        where: {
          id: {
            in: orderIds,
          },
          paymentStatus: "UNPAID",
        },
        select: {
          id: true,
          totalAmountCents: true,
        },
      });
    } catch {
      throw createError({
        statusCode: 500,
        statusMessage: "Failed to fetch unpaid orders",
      });
    }

    if (!unpaidOrders.length) {
      throw createError({
        statusCode: 400,
        statusMessage: "No unpaid orders found for the provided orderIds",
      });
    }

    const paid_at = new Date();
    const unpaidOrderIds = unpaidOrders.map(
      (order: { id: string }) => order.id,
    );

    await transaction.order.updateMany({
      where: {
        id: {
          in: unpaidOrderIds,
        },
      },
      data: {
        paymentStatus: "PAID",
        status: "COMPLETED", //marking the order as completed once it's paid
        paymentMethod,
        paidAt: paid_at,
      },
    });

    //closes the session once the orders are marked ass paid
    try {
      await transaction.tableSession.update({
        where: {
          id: tableSessionId,
        },
        data: {
          status: "CLOSED",
          closedAt: paid_at,
        },
      });
    } catch {
      throw createError({
        statusCode: 500,
        statusMessage: "Failed to close table session",
      });
    }

    const totalPaidCents = unpaidOrders.reduce(
      (sum: number, order: { totalAmountCents: number }) =>
        sum + order.totalAmountCents,
      0,
    );

    return {
      updatedCount: unpaidOrderIds.length,
      totalPaidCents,
      paidAt: paid_at,
      paymentMethod,
      orderIds: unpaidOrderIds,
    };
  });
});
