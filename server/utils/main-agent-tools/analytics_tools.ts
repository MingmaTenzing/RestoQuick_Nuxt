import { tool } from "@openai/agents";
import z from "zod";
import { useDateRange } from "~~/server/utils/dateRange";
import { useStats } from "~~/server/utils/dashboard/stats";
import { useToMinutes } from "~~/server/utils/toMinutes";

export const analytics_tools = () => {
  const { getWeekRange, getDayRange } = useDateRange();
  const {
    getWeeklyKpiData,
    getRosterOverviewData,
    getPopularItemsData,
    getRevenueTrendData,
    getRecentOrdersData,
    getSoldByCategoryData,
  } = useStats();
  const { shift_hours_to_minutes } = useToMinutes();

  const get_weekly_sales = tool({
    name: "get_weekly_sales",
    description:
      "Tool to get a full dashboard analytics snapshot including weekly KPI, roster overview, popular items, revenue trend, recent orders, and sold-by-category.",
    parameters: z.object({}),
    execute: async () => {
      const weekRange = getWeekRange();
      const todayRange = getDayRange();

      const [
        [weeklyRevenue, weeklyOrderCount, todayBookingsCount, weeklyShifts],
        [totalStaff, weeklyShiftCount, pendingLeaveRequests],
        popularItems,
        revenueTrend,
        recentOrders,
        soldByCategoryItems,
      ] = await Promise.all([
        getWeeklyKpiData(weekRange, todayRange),
        getRosterOverviewData(weekRange.start, weekRange.end),
        getPopularItemsData(),
        getRevenueTrendData(),
        getRecentOrdersData(),
        getSoldByCategoryData(),
      ]);

      const revenueCents = weeklyRevenue._sum.totalAmountCents ?? 0;

      const weeklyShiftCostCents = weeklyShifts.reduce((total, shift) => {
        const startMinutes = shift_hours_to_minutes(shift.startTime);
        const endMinutes = shift_hours_to_minutes(shift.endTime);
        const durationMinutes =
          endMinutes >= startMinutes
            ? endMinutes - startMinutes
            : endMinutes + 24 * 60 - startMinutes;

        const hourlyRateCents = Math.round(
          Number(shift.staff.perHourRate) * 100,
        );
        const shiftCostCents = Math.round(
          (durationMinutes / 60) * hourlyRateCents,
        );

        return total + shiftCostCents;
      }, 0);

      const categoryTotals: Record<string, number> = {};
      let totalQuantity = 0;

      for (const item of soldByCategoryItems) {
        const category = item.menuItem?.category ?? "OTHER";
        categoryTotals[category] =
          (categoryTotals[category] ?? 0) + item.quantity;
        totalQuantity += item.quantity;
      }

      const soldByCategory = Object.entries(categoryTotals)
        .map(([category, quantity]) => ({
          category,
          percentage:
            totalQuantity > 0
              ? Math.round((quantity / totalQuantity) * 100)
              : 0,
        }))
        .sort((a, b) => b.percentage - a.percentage);

      return {
        weeklyKpi: {
          revenueCents,
          weeklyOrderCount,
          todayBookingsCount,
          weeklyShiftCostCents,
          startOfWeek: weekRange.start,
          endOfWeek: weekRange.end,
        },
        rosterOverview: {
          totalStaff,
          weeklyShiftCount,
          pendingLeaveRequests,
          startDate: weekRange.start,
          endDate: weekRange.end,
        },
        popularItems,
        revenueTrend,
        recentOrders: recentOrders.map((order) => ({
          id: order.id,
          orderNo: order.orderNo,
          customerName: order.customerName,
          status: order.status,
          orderType: order.orderType,
          totalAmountCents: order.totalAmountCents,
          createdAt: order.createdAt,
          tableNumber: order.table?.number ?? null,
          itemCount: order.items.reduce(
            (total, item) => total + item.quantity,
            0,
          ),
        })),
        soldByCategory,
      };
    },
  });

  return [get_weekly_sales];
};
