export default defineEventHandler(async (event) => {
  const prisma = usePrisma();
  const body = await readBody(event);
  const addLeave_rqeuest = await prisma.leaveRequest.create({
    data: body,
  });
  return addLeave_rqeuest;
});
