import type { TableSessionWithOrders } from "~~/types/table_session_with_orders";

export default defineEventHandler(async (event) => {
  const prisma = usePrisma();
  const query = getQuery(event);
  const status = String(query.status ?? "").toUpperCase();
  const table = String(query.table ?? "").trim();

  const sessions: TableSessionWithOrders[] = await prisma.tableSession.findMany(
    {
      where: {
        ...(status === "ACTIVE" || status === "CLOSED" ? { status } : {}),
        ...(table
          ? {
              table: {
                number: {
                  contains: table,
                  mode: "insensitive",
                },
              },
            }
          : {}),
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
      orderBy: {
        openedAt: "desc",
      },
    },
  );

  return sessions;
});
