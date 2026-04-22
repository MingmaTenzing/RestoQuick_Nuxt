import { PaymentMethod } from "~/generated/prisma/enums";
import { broadCast } from "~~/server/utils/kitchenSocket";
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

  const checkoutResult = await prisma.$transaction(async (transaction) => {
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
    const settledOrderIds = unpaidOrders.map(
      (order: { id: string }) => order.id,
    );

    await transaction.order.updateMany({
      where: {
        id: {
          in: settledOrderIds,
        },
      },
      data: {
        paymentStatus: "PAID",
        status: "COMPLETED", //marking the order as completed once it's paid
        paymentMethod,
        paidAt: paid_at,
      },
    });

    const completedOrders = await transaction.order.findMany({
      where: {
        id: {
          in: settledOrderIds,
        },
      },
      include: {
        table: true,
        items: {
          include: {
            menuItem: true,
            orderItemOptions: true,
          },
        },
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

    return {
      updatedCount: settledOrderIds.length,
      paidAt: paid_at,
      paymentMethod,
      orderIds: settledOrderIds,
      completedOrders,
    };
  });

  for (const order of checkoutResult.completedOrders) {
    broadCast({ type: "ORDER_MARKED_COMPLETED", payload: order });
  }

  return {
    updatedCount: checkoutResult.updatedCount,
    paidAt: checkoutResult.paidAt,
    paymentMethod: checkoutResult.paymentMethod,
    orderIds: checkoutResult.orderIds,
  };
});
