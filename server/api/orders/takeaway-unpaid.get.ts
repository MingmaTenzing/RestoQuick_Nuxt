import type { OrderDetailsWithInclude } from "~~/types/orderwithInclude";
import { usePrisma } from "~~/server/utils/prisma";

export default defineEventHandler(async () => {
  const prisma = usePrisma();

  const takeawayOrders: OrderDetailsWithInclude[] = await prisma.order.findMany(
    {
      where: {
        orderType: "TAKEAWAY",
        paymentStatus: "UNPAID",
      },
      include: {
        table: true,
        items: {
          include: {
            menuItem: true,
            orderItemOptions: {
              include: {
                menuOption: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    },
  );

  return takeawayOrders;
});
