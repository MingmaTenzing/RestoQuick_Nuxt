import { LeaveRequest } from "~/generated/prisma/client";

export default defineEventHandler(async (event) => {
  const prisma = usePrisma();
  const leaveRequests = await prisma.leaveRequest.findMany({
    include: {
      staff: true,
    },
  });
  return leaveRequests;
});
