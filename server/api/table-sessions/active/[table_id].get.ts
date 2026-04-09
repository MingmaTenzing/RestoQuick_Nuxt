export default defineEventHandler(async (event) => {
  const prisma = usePrisma();
  const tableId = getRouterParam(event, "table_id");

  if (!tableId) {
    throw createError({
      statusCode: 400,
      statusMessage: "table_id is required",
    });
  }

  const tableSession = await prisma.tableSession.findFirst({
    where: {
      tableId,
      status: "ACTIVE",
    },
    include: {
      table: true,
      orders: {
        orderBy: {
          createdAt: "asc",
        },
      },
    },
  });

  return tableSession;
});