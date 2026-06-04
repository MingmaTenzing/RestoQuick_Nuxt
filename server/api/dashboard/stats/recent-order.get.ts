import { useStats } from "~~/server/utils/dashboard/stats";

export default defineEventHandler(async () => {
  const { getRecentOrdersData } = useStats();
  const recentOrders = await getRecentOrdersData();

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
