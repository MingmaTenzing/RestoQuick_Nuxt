import type { TableSessionCheckoutResponse } from "~~/types/table_session_with_orders";

export default defineEventHandler(async (event) => {
  const prisma = usePrisma();
  const sessionId = getRouterParam(event, "session_id");

  if (!sessionId) {
    throw createError({
      statusCode: 400,
      statusMessage: "session_id is required",
    });
  }

  const tableSession = await prisma.tableSession.findUnique({
    where: {
      id: sessionId,
    },
    include: {
      table: true,
      orders: {
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
      },
    },
  });

  if (!tableSession) {
    throw createError({
      statusCode: 404,
      statusMessage: "No session found for this id",
    });
  }

  const orders = tableSession.orders ?? [];
  const payableOrders = orders.filter(
    (order) => order.paymentStatus === "UNPAID",
  );
  const paidOrders = orders.filter((order) => order.paymentStatus === "PAID");

  const sessionTotalCents = orders.reduce(
    (total, order) => total + order.totalAmountCents,
    0,
  );
  const payableTotalCents = payableOrders.reduce(
    (total, order) => total + order.totalAmountCents,
    0,
  );
  const paidTotalCents = paidOrders.reduce(
    (total, order) => total + order.totalAmountCents,
    0,
  );

  const tableSessionCheckoutResponse: TableSessionCheckoutResponse = {
    ...tableSession,
    summary: {
      orderCount: orders.length,
      payableOrderCount: payableOrders.length,
      paidOrderCount: paidOrders.length,
      payableOrderIds: payableOrders.map((order) => order.id),
      sessionTotalCents,
      payableTotalCents,
      paidTotalCents,
      hasOutstandingBalance: payableTotalCents > 0,
    },
  };

  return tableSessionCheckoutResponse;
});
