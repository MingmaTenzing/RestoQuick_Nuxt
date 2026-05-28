import { tool } from "@openai/agents";
import z from "zod";

const orderStatusSchema = z.enum(["PENDING", "COMPLETED", "CANCELLED"]);

export const orders_tools = () => {
  const prisma = usePrisma();

  const get_orders = tool({
    name: "get_all_orders",
    description: "Get all orders with their table and item details.",
    parameters: z.object({}),
    execute: async () => {
      const orders = await prisma.order.findMany({
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
      });

      return orders;
    },
  });

  const get_order = tool({
    name: "get_order",
    description:
      "Get one order using the exact order id or order number. Just use it to show the details don't ask for any other further actions.",
    parameters: z
      .object({
        orderId: z.string().min(1).nullable(),
        orderNumber: z.number().int().positive().nullable(),
      })
      .strict(),
    execute: async ({ orderId, orderNumber }) => {
      if (orderId === null && orderNumber === null) {
        throw new Error("orderId or orderNumber is required.");
      }

      let order = null;

      if (orderId !== null) {
        order = await prisma.order.findUnique({
          where: {
            id: orderId,
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
        });
      }

      if (orderId === null && orderNumber !== null) {
        order = await prisma.order.findUnique({
          where: {
            orderNo: orderNumber,
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
        });
      }

      if (!order) {
        throw new Error("Order not found for this order id or order number.");
      }

      return order;
    },
  });

  const update_order_status = tool({
    name: "update_order_status",
    description: "Update an order status using the exact order id.",
    parameters: z.object({
      orderId: z.string().min(1),
      status: orderStatusSchema,
    }),
    execute: async ({ orderId, status }) => {
      const order = await prisma.order.update({
        where: {
          id: orderId,
        },
        data: {
          status,
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
      });

      return order;
    },
  });

  const delete_order = tool({
    name: "delete_order",
    description: "Delete an order using the exact order id.",
    parameters: z.object({
      orderId: z.string().min(1),
    }),
    execute: async ({ orderId }) => {
      const order = await prisma.order.delete({
        where: {
          id: orderId,
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
      });

      return order;
    },
  });

  return [get_orders, get_order, update_order_status, delete_order];
};
