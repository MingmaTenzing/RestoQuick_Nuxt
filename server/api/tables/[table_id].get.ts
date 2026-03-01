export default defineEventHandler(async (event) => {
  const table_id = getRouterParam(event, "table_id");
  const prisma = usePrisma();

  if (!table_id) {
    throw createError({
      statusCode: 400,
      message: "Please provide table_id",
    });
  }

  const table = await prisma.table.findUnique({
    where: {
      id: table_id,
    },
  });

  if (!table) {
    throw createError({
      statusCode: 404,
      message: "Table not found",
    });
  }

  return table;
});
