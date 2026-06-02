import type { PaymentMethod, PrismaClient } from "~/generated/prisma/client";
import type { DateRange } from "~~/server/utils/dateRange";

type WeeklySalesOrder = {
  id: string;
  orderNo: number;
  customerName: string;
  totalAmountCents: number;
  paymentMethod: PaymentMethod | null;
  orderType: string;
  paidAt: Date | null;
  tableNumber: string | null;
  itemCount: number;
};

type WeeklySalesDay = {
  date: string;
  revenueCents: number;
  orderCount: number;
};

export type WeeklySalesData = {
  revenueCents: number;
  paidOrderCount: number;
  orders: WeeklySalesOrder[];
  dailySales: WeeklySalesDay[];
  startOfWeek: Date;
  endOfWeek: Date;
};

export const getWeeklySalesData = async ({
  prisma,
  range,
}: {
  prisma: PrismaClient;
  range: DateRange;
}): Promise<WeeklySalesData> => {
  const paidOrders = await prisma.order.findMany({
    where: {
      paymentStatus: "PAID",
      paidAt: {
        gte: range.start,
        lt: range.end,
      },
    },
    select: {
      id: true,
      orderNo: true,
      customerName: true,
      totalAmountCents: true,
      paymentMethod: true,
      orderType: true,
      paidAt: true,
      table: {
        select: {
          number: true,
        },
      },
      items: {
        select: {
          quantity: true,
        },
      },
    },
    orderBy: {
      paidAt: "asc",
    },
  });

  let revenueCents = 0;
  const dailySalesMap = new Map<string, WeeklySalesDay>();

  const orders = paidOrders.map((order) => {
    revenueCents += order.totalAmountCents;

    if (order.paidAt) {
      const dateKey = order.paidAt.toISOString().split("T")[0];
      const currentDay = dailySalesMap.get(dateKey) ?? {
        date: dateKey,
        revenueCents: 0,
        orderCount: 0,
      };

      currentDay.revenueCents += order.totalAmountCents;
      currentDay.orderCount += 1;
      dailySalesMap.set(dateKey, currentDay);
    }

    return {
      id: order.id,
      orderNo: order.orderNo,
      customerName: order.customerName,
      totalAmountCents: order.totalAmountCents,
      paymentMethod: order.paymentMethod,
      orderType: order.orderType,
      paidAt: order.paidAt,
      tableNumber: order.table?.number ?? null,
      itemCount: order.items.reduce((total, item) => total + item.quantity, 0),
    };
  });

  return {
    revenueCents,
    paidOrderCount: orders.length,
    orders,
    dailySales: Array.from(dailySalesMap.values()),
    startOfWeek: range.start,
    endOfWeek: range.end,
  };
};