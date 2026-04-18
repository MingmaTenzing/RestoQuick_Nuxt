import type { PaymentMethod } from "~/generated/prisma/enums";
import type { OrderGetPayload } from "~/generated/prisma/models";

export type CashierPaidOrder = OrderGetPayload<{
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
}>;

export type CashierPaymentMethod = Extract<
  PaymentMethod,
  "CASH" | "CARD_TERMINAL"
>;

export type CashierReceipt = {
  tableId: string;
  updatedCount: number;
  totalPaidCents: number;
  paidAt: Date | string | null;
  paymentMethod: CashierPaymentMethod;
  orders: CashierPaidOrder[];
  tenderedCents: number;
  changeDueCents: number;
};
