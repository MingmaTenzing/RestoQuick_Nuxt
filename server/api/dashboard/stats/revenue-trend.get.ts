export default defineEventHandler(async (event) => {
  const prisma = usePrisma();
  const revenueTrend = await prisma.order.groupBy({
    by: ["createdAt"],
    where: {
      status: "COMPLETED",
      createdAt: {
        gte: new Date(new Date().setDate(new Date().getDate() - 30)), // last 30 days
      },
    },
    _sum: {
      totalAmountCents: true,
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  return revenueTrend;
});
