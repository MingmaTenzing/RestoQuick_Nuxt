import { broadCast } from "../../utils/kitchenSocket";

export default defineEventHandler(async (event) => {
  const prisma = usePrisma();
  const body = await readBody(event);
  const order_id = body.order_id;

  if (!order_id) {
    throw createError({
      statusCode: 400,
      statusMessage: "order_id is required",
    });
  }

  try {
    const updatedOrder = await prisma.order.update({
      where: { id: order_id },
      data: { status: "READY" },
      include: {
        items: {
          include: {
            menuItem: true,
          },
        },
        table: true,
      },
    });

    broadCast({ type: "ORDER_UPDATED", payload: updatedOrder });

    return {
      statusCode: 200,
      data: updatedOrder,
    };
  } catch (error) {
    console.log(error);
    throw createError({
      message: "Something went wrong",
      statusCode: 500,
    });
  }
});
