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

export type TableSessionCheckoutResponse = TableSessionWithOrders & {
  summary: {
    orderCount: number;
    payableOrderCount: number;
    paidOrderCount: number;
    payableOrderIds: string[];
    sessionTotalCents: number;
    payableTotalCents: number;
    paidTotalCents: number;
    hasOutstandingBalance: boolean;
  };
};
