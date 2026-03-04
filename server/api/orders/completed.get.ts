export default defineEventHandler(async (event) => {
  // only returns the completed order within 24 hours | TODAY
  const prisma = usePrisma();

  const now = new Date();
  const startOfDay = new Date(now);
  startOfDay.setHours(0, 0, 0, 0);

  const startOfNextDay = new Date(startOfDay);
  startOfNextDay.setDate(startOfNextDay.getDate() + 1);

  // sends today's completed orders only
  const all_orders = await prisma.order.findMany({
    where: {
      status: "COMPLETED",
      createdAt: {
        gte: startOfDay,
        lt: startOfNextDay,
      },
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
