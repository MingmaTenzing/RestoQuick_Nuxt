export default defineEventHandler(async () => {
  const prisma = usePrisma();

  const recentOrders = await prisma.order.findMany({
    take: 5,
    orderBy: {
      createdAt: "desc",
    },
    include: {
      table: true,
      items: true,
    },
  });

  return recentOrders.map((order) => ({
    id: order.id,
    orderNo: order.orderNo,
    customerName: order.customerName,
    status: order.status,
    orderType: order.orderType,
    totalAmountCents: order.totalAmountCents,
    createdAt: order.createdAt,
    tableNumber: order.table?.number ?? null,
    itemCount: order.items.reduce((total, item) => total + item.quantity, 0),
  }));
});
