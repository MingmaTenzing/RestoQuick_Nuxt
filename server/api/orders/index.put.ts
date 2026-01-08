import { OrderStatus } from "~/generated/prisma/enums";
import { broadCast } from "../../utils/kitchenSocket";

//this end point updates the status of order

// at the momemnt its only handling two status updates
// if order is ready or pending..

export default defineEventHandler(async (event) => {
  const prisma = usePrisma();
  const body = await readBody(event);
  const order_id = body.order_id;
  const status: OrderStatus = body.status;

  if (!order_id) {
    throw createError({
      statusCode: 400,
      statusMessage: "order_id is required",
    });
  }

  try {
    const updatedOrder = await prisma.order.update({
      where: { id: order_id },
      data: { status: status },
      include: {
        items: {
          include: {
            menuItem: true,
          },
        },
        table: true,
      },
    });

    // once the order is updates here its being broadCast to the websocket clients
    // the

    if (updatedOrder.status == "READY") {
      //when orders is marked as reaady
      broadCast({ type: "ORDER_MARKED_READY", payload: updatedOrder });
    }

    //
    if (updatedOrder.status == "PENDING") {
      //here if frontend calls recall to kitchen
      //then the status is set back to pending and broadcasted to connected clients.
      broadCast({ type: "ORDER_RECALL", payload: updatedOrder });
    }

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
