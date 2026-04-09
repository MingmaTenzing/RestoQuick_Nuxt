import type { TableGetPayload } from "~/generated/prisma/models";

export type TableGetPayloadWithSession = TableGetPayload<{
  include: {
    sessions: {
      select: {
        id: true;
      };
    };
  };
}>;
