import { usePrisma } from "~~/server/utils/prisma";

type UndoTablePaidBody = {
  tableSessionId?: string;
};

/**
 * Revert a mistaken table checkout for a specific session id.
 *
 * Marks that session's paid orders UNPAID again so cashier can re-collect.
 * Does NOT reopen the session — it stays CLOSED so a new ACTIVE session can
 * still be opened on the same table for other guests.
 *
 * Kitchen order status is left alone — this only undoes payment.
 */
export default defineEventHandler(async (event) => {
  const prisma = usePrisma();
  const body = (await readBody(event)) as UndoTablePaidBody;
  const tableSessionId = String(body?.tableSessionId ?? "").trim();

  if (!tableSessionId) {
    throw createError({
      statusCode: 400,
      statusMessage: "tableSessionId is required",
    });
  }

  const result = await prisma.$transaction(async (transaction) => {
    const session = await transaction.tableSession.findUnique({
      where: { id: tableSessionId },
      select: {
        id: true,
        tableId: true,
        status: true,
      },
    });

    if (!session) {
      throw createError({
        statusCode: 404,
        statusMessage: "Table session not found",
      });
    }

    const paidOrders = await transaction.order.findMany({
      where: {
        tableSessionId,
        paymentStatus: "PAID",
      },
      select: { id: true },
    });

    if (!paidOrders.length) {
      throw createError({
        statusCode: 400,
        statusMessage: "No paid orders to undo for this session",
      });
    }

    const orderIds = paidOrders.map((order) => order.id);

    await transaction.order.updateMany({
      where: { id: { in: orderIds } },
      data: {
        paymentStatus: "UNPAID",
        paymentMethod: null,
        paidAt: null,
      },
    });

    return {
      tableSessionId: session.id,
      tableId: session.tableId,
      status: session.status,
      orderIds,
    };
  });

  return {
    tableSessionId: result.tableSessionId,
    tableId: result.tableId,
    status: result.status,
    orderIds: result.orderIds,
    updatedCount: result.orderIds.length,
  };
});
