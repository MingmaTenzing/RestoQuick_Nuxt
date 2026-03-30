import { usePrisma } from "~~/server/utils/prisma";

export default defineEventHandler(async (event) => {
  // only returns the completed order within the last 24 hours to cap the results
  // and more relative to real world kitchen scenario.
  const prisma = usePrisma();

  const cuttoff_for_24_hours = new Date(Date.now() - 24 * 60 * 60 * 1000);

  // sends today's completed orders only
  const all_orders = await prisma.order.findMany({
    where: {
      status: "COMPLETED",
      createdAt: {
        gte: cuttoff_for_24_hours,
      },
    },
    include: {
      table: true,
      items: {
        include: {
          menuItem: true,
          orderItemOptions: true,
        },
      },
    },

    orderBy: {
      createdAt: "desc",
    },
  });
  return all_orders;
});
