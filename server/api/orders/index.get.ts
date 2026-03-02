export default defineEventHandler(async (event) => {
  const prisma = usePrisma();
  //  sends all the orders
  const all_orders = await prisma.order.findMany({
    include: {
      table: true,
      items: {
        include: {
          menuItem: true,
        },
      },
    },

    orderBy: {
      createdAt: "desc",
    },
  });
  return all_orders;
});
