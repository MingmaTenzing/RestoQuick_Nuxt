export default defineEventHandler(async (event) => {
  const prisma = usePrisma();
  const leaveRequests = await prisma.leaveRequest.findMany({
    include: {
      staff: true,
    },
    orderBy: {
      submittedAt: "desc",
    },
  });
  return leaveRequests;
});
