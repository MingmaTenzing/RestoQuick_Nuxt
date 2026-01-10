export default defineEventHandler(async (event) => {
  const prisma = usePrisma();

  //  sends all the pending orders only
  const all_orders = await prisma.order.findMany({
    where: {
      status: "PENDING",
    },
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
