import { useDateRange } from "~~/server/utils/dateRange";
import { useStats } from "~~/server/utils/dashboard/stats";

export default defineEventHandler(async (event) => {
  const { getWeekRange } = useDateRange();
  const { getRosterOverviewData } = useStats();
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
    await getRosterOverviewData(rangeStart, rangeEnd);

  return {
    totalStaff,
    weeklyShiftCount,
    pendingLeaveRequests,
    startDate: rangeStart,
    endDate: rangeEnd,
  };
});
