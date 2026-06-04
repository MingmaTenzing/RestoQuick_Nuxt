import { useStats } from "~~/server/utils/dashboard/stats";

export default defineEventHandler(async () => {
  const { getSoldByCategoryData } = useStats();
  // Get all completed order items with their menu item category
  const orderItems = await getSoldByCategoryData();

  // Group by category and sum quantities
  const categoryTotals: Record<string, number> = {};
  let totalQuantity = 0;

  for (const item of orderItems) {
    const category = item.menuItem?.category ?? "OTHER";
    categoryTotals[category] = (categoryTotals[category] ?? 0) + item.quantity;
    totalQuantity += item.quantity;
  }

  // Convert to percentage format
  const result = Object.entries(categoryTotals).map(([category, quantity]) => ({
    category,
    percentage:
      totalQuantity > 0 ? Math.round((quantity / totalQuantity) * 100) : 0,
  }));

  // Sort by percentage descending
  result.sort((a, b) => b.percentage - a.percentage);

  return result;
});
