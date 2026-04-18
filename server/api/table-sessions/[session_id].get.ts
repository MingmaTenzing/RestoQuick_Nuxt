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

  return tableSession;
});
