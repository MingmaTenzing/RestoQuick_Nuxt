import { useDateRange } from "~~/server/utils/dateRange";
import { usePrisma } from "~~/server/utils/prisma";

enum OrderRange {
  ALL = "all",
  DAY = "day",
  WEEK = "week",
  MONTH = "month",
}

export default defineEventHandler(async (event) => {
  const { getDayRange, getWeekRange, getMonthRange } = useDateRange();
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

  let createdAtFilter: { gte: Date; lt: Date } | undefined;

  if (range === OrderRange.DAY) {
    const { start, end } = getDayRange();
    createdAtFilter = { gte: start, lt: end };
  }

  if (range === OrderRange.WEEK) {
    const { start, end } = getWeekRange();
    createdAtFilter = { gte: start, lt: end };
  }

  if (range === OrderRange.MONTH) {
    const { start, end } = getMonthRange();
    createdAtFilter = { gte: start, lt: end };
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
