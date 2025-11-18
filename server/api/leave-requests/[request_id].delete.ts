export default defineEventHandler(async (event) => {
  const prisma = usePrisma();
  const leave_request_id = getRouterParam(event, "request_id");
  const deleteLeaveRequest = await prisma.leaveRequest.delete({
    where: {
      id: leave_request_id,
    },
  });
  return deleteLeaveRequest;
});
