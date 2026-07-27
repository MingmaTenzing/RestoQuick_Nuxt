import { useStats } from "~~/server/utils/dashboard/stats";

export default defineEventHandler(async () => {
  // Top sellers last 30 days — full MenuItem fields + sold_quantity
  const { getPopularItemsData } = useStats();
  const popularItems = await getPopularItemsData();

  if (popularItems) {
    return popularItems;
  }

  throw createError({
    statusCode: 500,
    message: "Internal server error ",
  });
});
