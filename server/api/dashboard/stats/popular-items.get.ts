export default defineEventHandler(async (event) => {
  //returns the most popular items sold by quantity in the last 30days
  const prisma = usePrisma();

  const popularItems = await prisma.orderItem.groupBy({
    by: ["itemName"],
    where: {
      order: {
        status: "COMPLETED",
        createdAt: {
          gte: new Date(new Date().setDate(new Date().getDate() - 30)),
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
