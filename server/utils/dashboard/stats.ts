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

  const getPopularItemsData = () => {
    return prisma.orderItem.groupBy({
      by: ["itemName"],
      where: {
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
