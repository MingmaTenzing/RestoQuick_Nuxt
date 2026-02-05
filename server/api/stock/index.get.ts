export default defineEventHandler(async (event) => {
  const prisma = usePrisma();

  const stockItems = await prisma.stockItem.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  return stockItems;
});
