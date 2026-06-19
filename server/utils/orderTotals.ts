import { usePrisma } from "~~/server/utils/prisma";

type PrismaClient = ReturnType<typeof usePrisma>;

export async function updateOrderTotalCents(
  prisma: PrismaClient,
  orderId: string,
) {
  const orderItems = await prisma.orderItem.findMany({
    where: { orderId },
    include: {
      orderItemOptions: true,
    },
  });

  const totalAmountCents = orderItems.reduce((sum, item) => {
    const optionsTotalCents = item.orderItemOptions.reduce(
      (sum, option) => sum + option.quantity * option.priceCents,
      0,
    );
    const itemTotal = (item.unitPriceCents + optionsTotalCents) * item.quantity;

    return sum + itemTotal;
  }, 0);

  await prisma.order.update({
    where: { id: orderId },
    data: { totalAmountCents },
  });

  return totalAmountCents;
}
