import { usePrisma } from "~~/server/utils/prisma";

export default defineEventHandler(async (event) => {
  const prisma = usePrisma();
  const table_id = getRouterParam(event, "table_id");

  if (!table_id) {
    throw createError({
      statusCode: 400,
      statusMessage: "table_id is required",
    });
  }

  const unpaid_completed_orders = await prisma.order.findMany({
    where: {
      tableId: table_id,
      status: "COMPLETED",
      paymentStatus: "UNPAID",
    },
    include: {
      table: true,
      items: {
        include: {
          menuItem: true,
        },
      },
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  const total_due_cents = unpaid_completed_orders.reduce(
    (sum, order) => sum + order.totalAmountCents,
    0,
  );

  return {
    tableId: table_id,
    orderCount: unpaid_completed_orders.length,
    totalDueCents: total_due_cents,
    orders: unpaid_completed_orders,
  };
});
