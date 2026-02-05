export default defineEventHandler(async (event) => {
  const prisma = usePrisma();
  const id = getRouterParam(event, "id");
  const body = await readBody(event);

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: "Stock ID is required",
    });
  }

  const updatedStock = await prisma.stockItem.update({
    where: { id },
    data: {
      currentStock: body.currentStock,
    },
  });

  return updatedStock;
});
