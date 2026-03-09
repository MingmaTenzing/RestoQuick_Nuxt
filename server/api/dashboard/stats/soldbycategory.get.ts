export default defineEventHandler(async () => {
  const prisma = usePrisma();

  // Get all completed order items with their menu item category
  const orderItems = await prisma.orderItem.findMany({
    where: {
      order: {
        status: "COMPLETED",
        createdAt: {
          gte: new Date(new Date().setDate(new Date().getDate() - 30)),
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
