import { read } from "fs";

//this endpoint updates the staus of leaveRequest
export default defineEventHandler(async (event) => {
  const prisma = usePrisma();
  const leave_request_id = getRouterParam(event, "request_id");
  const status = await readBody(event);
  const updated_leave_request = await prisma.leaveRequest.update({
    where: {
      id: leave_request_id,
    },
    data: {
      status: status,
    },
  });
  return updated_leave_request;
});
