import { usePrisma } from "~~/server/utils/prisma";

const daysAgo = (days: number) => {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date;
};

export const useStats = () => {
  const prisma = usePrisma();
  const getWeeklyKpiData = async (
    weekRange: { start: Date; end: Date },
    todayRange: { start: Date; end: Date },
  ) => {
    return Promise.all([
      prisma.order.aggregate({
        _sum: {
          totalAmountCents: true,
        },
        where: {
          createdAt: {
            gte: weekRange.start,
            lt: weekRange.end,
          },
          status: "COMPLETED",
        },
      }),
      prisma.order.count({
        where: {
          createdAt: {
            gte: weekRange.start,
            lt: weekRange.end,
          },
        },
      }),
      prisma.booking.count({
        where: {
          bookingTime: {
            gte: todayRange.start,
            lt: todayRange.end,
          },
        },
      }),
      prisma.shift.findMany({
        where: {
          date: {
            gte: weekRange.start,
            lt: weekRange.end,
          },
        },
        include: {
          staff: {
            select: {
              perHourRate: true,
            },
          },
        },
      }),
    ]);
  };

  const getRosterOverviewData = async (rangeStart: Date, rangeEnd: Date) => {
    return Promise.all([
      prisma.staff.count(),
      prisma.shift.count({
        where: {
          date: {
            gte: rangeStart,
            lt: rangeEnd,
          },
        },
      }),
      prisma.leaveRequest.count({
        where: {
          status: "pending",
        },
      }),
    ]);
  };

  /** Top sellers over the last 30 days — full MenuItem + sold_quantity. */
  const getPopularItemsData = async () => {
    const grouped = await prisma.orderItem.groupBy({
      by: ["menuItemId"],
      where: {
        menuItemId: { not: null },
        order: {
          status: "COMPLETED",
          createdAt: {
            gte: daysAgo(30),
          },
        },
      },
      _sum: {
        quantity: true,
      },
      orderBy: {
        _sum: {
          quantity: "desc",
        },
      },
      take: 5,
    });

    const menuItemIds = grouped
      .map((row) => row.menuItemId)
      .filter((id): id is string => Boolean(id));

    if (menuItemIds.length === 0) {
      return [];
    }

    const menuItems = await prisma.menuItem.findMany({
      where: { id: { in: menuItemIds } },
    });
    const menuById = new Map(menuItems.map((item) => [item.id, item]));

    return grouped.flatMap((row) => {
      if (!row.menuItemId) return [];
      const menuItem = menuById.get(row.menuItemId);
      if (!menuItem) return [];
      return [
        {
          ...menuItem,
          sold_quantity: row._sum.quantity ?? 0,
        },
      ];
    });
  };

  const getRevenueTrendData = () => {
    return prisma.order.groupBy({
      by: ["createdAt"],
      where: {
        status: "COMPLETED",
        createdAt: {
          gte: daysAgo(30),
        },
      },
      _sum: {
        totalAmountCents: true,
      },
      orderBy: {
        createdAt: "asc",
      },
    });
  };

  const getRecentOrdersData = () => {
    return prisma.order.findMany({
      take: 5,
      orderBy: {
        createdAt: "desc",
      },
      include: {
        table: true,
        items: true,
      },
    });
  };

  const getSoldByCategoryData = () => {
    return prisma.orderItem.findMany({
      where: {
        order: {
          status: "COMPLETED",
          createdAt: {
            gte: daysAgo(30),
          },
        },
        menuItemId: { not: null },
      },
      include: {
        menuItem: {
          select: {
            category: true,
          },
        },
      },
    });
  };

  return {
    getWeeklyKpiData,
    getRosterOverviewData,
    getPopularItemsData,
    getRevenueTrendData,
    getRecentOrdersData,
    getSoldByCategoryData,
  };
};
