import type { OrderGetPayload } from "~/generated/prisma/models";

export type OrderDetailsWithInclude = OrderGetPayload<{
  include: {
    table: true;
    items: {
      include: {
        menuItem: true;
      };
    };
  };
}>;
