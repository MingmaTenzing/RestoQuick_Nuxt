import { useStats } from "~~/server/utils/dashboard/stats";

export default defineEventHandler(async () => {
  //returns the most popular items sold by quantity in the last 30days
  const { getPopularItemsData } = useStats();
  const popularItems = await getPopularItemsData();

  if (popularItems) {
    return popularItems.map((item) => ({
      name: item.itemName,
      sold_quantity: item._sum.quantity ?? 0,
    }));
  } else {
    throw createError({
      statusCode: 500,
      message: "Internal server error ",
    });
  }
});
