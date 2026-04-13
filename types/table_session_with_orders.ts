import type { TableSessionGetPayload } from "~/generated/prisma/models";

export type TableSessionWithOrders = TableSessionGetPayload<{
  include: {
    table: true;
    orders: {
      include: {
        table: true;
        items: {
          include: {
            menuItem: true;
            orderItemOptions: {
              include: {
                menuOption: true;
              };
            };
          };
        };
      };
    };
  };
}>;
