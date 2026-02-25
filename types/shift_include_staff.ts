import type { Prisma } from "~/generated/prisma/client";

export type Shift_With_Staff_Payload = Prisma.ShiftGetPayload<{
  include: {
    staff: true;
  };
}>;
