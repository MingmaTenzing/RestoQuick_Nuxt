export default defineEventHandler(async (event) => {
  const prisma = usePrisma();
  const tableId = getRouterParam(event, "table_id");

  if (!tableId) {
    throw createError({
      statusCode: 400,
      statusMessage: "table_id is required",
    });
  }

  //returns the active session table with orders with the same session id.
  const tableSession = await prisma.tableSession.findFirst({
    where: {
      tableId,
      status: "ACTIVE",
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

  if (tableSession) {
    return tableSession;
  } else {
    throw createError({
      statusCode: 404,
      statusMessage: "No active session found for this table",
    });
  }
});
