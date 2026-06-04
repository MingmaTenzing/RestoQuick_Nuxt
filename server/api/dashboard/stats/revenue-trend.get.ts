import { useStats } from "~~/server/utils/dashboard/stats";

export default defineEventHandler(async () => {
  const { getRevenueTrendData } = useStats();
  const revenueTrend = await getRevenueTrendData();

  return revenueTrend;
});
