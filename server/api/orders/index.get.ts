import { usePrisma } from "~~/server/utils/prisma";

enum OrderRange {
  ALL = "all",
  DAY = "day",
  WEEK = "week",
  MONTH = "month",
}

export default defineEventHandler(async (event) => {
  const prisma = usePrisma();
  const query = getQuery(event);
  const customerQuery = String(
    query.customer ?? query.customerName ?? "",
  ).trim();

  const range = Object.values(OrderRange).includes(
    String(query.range) as OrderRange,
  )
    ? (String(query.range) as OrderRange)
    : undefined;

  const now = new Date();
  let createdAtFilter: { gte: Date; lt: Date } | undefined;

  if (range === OrderRange.DAY) {
    const startOfDay = new Date(now);
    startOfDay.setHours(0, 0, 0, 0);

    const startOfNextDay = new Date(startOfDay);
    startOfNextDay.setDate(startOfNextDay.getDate() + 1);

    createdAtFilter = { gte: startOfDay, lt: startOfNextDay };
  }

  if (range === OrderRange.WEEK) {
    const startOfWeek = new Date(now);
    const day = startOfWeek.getDay();
    const diffToMonday = (day + 6) % 7;

    startOfWeek.setHours(0, 0, 0, 0);
    startOfWeek.setDate(startOfWeek.getDate() - diffToMonday);

    const startOfNextWeek = new Date(startOfWeek);
    startOfNextWeek.setDate(startOfNextWeek.getDate() + 7);

    createdAtFilter = { gte: startOfWeek, lt: startOfNextWeek };
  }

  if (range === OrderRange.MONTH) {
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfNextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);

    createdAtFilter = { gte: startOfMonth, lt: startOfNextMonth };
  }

  const whereClause = {
    ...(createdAtFilter ? { createdAt: createdAtFilter } : {}),
    ...(customerQuery
      ? {
          customerName: {
            contains: customerQuery,
            mode: "insensitive" as const,
          },
        }
      : {}),
  };

  //  sends all the orders
  const all_orders = await prisma.order.findMany({
    where: Object.keys(whereClause).length ? whereClause : undefined,
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
