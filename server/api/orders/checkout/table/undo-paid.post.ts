import { usePrisma } from "~~/server/utils/prisma";

type UndoTablePaidBody = {
  tableSessionId?: string;
};

/**
 * Revert a mistaken table checkout: reopen the CLOSED session by id and
 * mark its paid orders UNPAID again.
 *
 * Guard: if another ACTIVE session already exists for the same table, refuse
 * so we never leave two open sessions on one table.
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

    const conflictingActive = await transaction.tableSession.findFirst({
      where: {
        tableId: session.tableId,
        status: "ACTIVE",
        id: { not: tableSessionId },
      },
      select: { id: true },
    });

    if (conflictingActive) {
      throw createError({
        statusCode: 409,
        statusMessage:
          "Another active session is open for this table. Close or finish that session before undoing payment.",
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

    const reopenedSession = await transaction.tableSession.update({
      where: { id: tableSessionId },
      data: {
        status: "ACTIVE",
        closedAt: null,
      },
      select: {
        id: true,
        tableId: true,
        status: true,
      },
    });

    return {
      tableSessionId: reopenedSession.id,
      tableId: reopenedSession.tableId,
      status: reopenedSession.status,
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
