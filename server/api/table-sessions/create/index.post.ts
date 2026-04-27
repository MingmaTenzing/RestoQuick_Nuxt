export default defineEventHandler(async (event) => {
  const prisma = usePrisma();
  const body = await readBody(event);
  const tableId = String(body?.tableId ?? "").trim();

  if (!tableId) {
    throw createError({
      statusCode: 400,
      statusMessage: "tableId is required",
    });
  }

  const existingSession = await prisma.tableSession.findFirst({
    where: {
      tableId,
      status: "ACTIVE",
    },
    select: {
      id: true,
      tableId: true,
      status: true,
    },
    orderBy: {
      openedAt: "desc",
    },
  });

  if (existingSession) {
    return existingSession;
  }

  const createdSession = await prisma.tableSession.create({
    data: {
      tableId,
      status: "ACTIVE",
    },
    select: {
      id: true,
      tableId: true,
      status: true,
    },
  });

  return createdSession;
});
