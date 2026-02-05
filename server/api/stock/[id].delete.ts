export default defineEventHandler(async (event) => {
  const prisma = usePrisma();
  const id = getRouterParam(event, "id");

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: "Stock ID is required",
    });
  }

  const deletedStock = await prisma.stockItem.delete({
    where: { id },
  });

  return deletedStock;
});
