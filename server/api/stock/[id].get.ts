export default defineEventHandler(async (event) => {
  const prisma = usePrisma();
  const id = getRouterParam(event, "id");

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: "Stock ID is required",
    });
  }

  const stockItem = await prisma.stockItem.findUnique({
    where: { id },
  });

  if (!stockItem) {
    throw createError({
      statusCode: 404,
      statusMessage: "Stock item not found",
    });
  }

  return stockItem;
});
