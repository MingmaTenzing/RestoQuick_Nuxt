import { useDateRange } from "~~/server/utils/dateRange";
import { usePrisma } from "~~/server/utils/prisma";

export default defineEventHandler(async (event) => {
  const prisma = usePrisma();
  const { getWeekRange } = useDateRange();
  const query = getQuery(event);

  const fallbackRange = getWeekRange();
  const requestedStart = query.startDate
    ? new Date(String(query.startDate))
    : fallbackRange.start;
  const requestedEnd = query.endDate
    ? new Date(String(query.endDate))
    : fallbackRange.end;

  const rangeStart = Number.isNaN(requestedStart.getTime())
    ? fallbackRange.start
    : requestedStart;
  const rangeEnd = Number.isNaN(requestedEnd.getTime())
    ? fallbackRange.end
    : requestedEnd;

  const [totalStaff, weeklyShiftCount, pendingLeaveRequests] =
    await Promise.all([
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

  return {
    totalStaff,
    weeklyShiftCount,
    pendingLeaveRequests,
    startDate: rangeStart,
    endDate: rangeEnd,
  };
});
