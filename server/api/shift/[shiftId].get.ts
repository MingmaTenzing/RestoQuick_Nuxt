export default defineEventHandler(async (event) => {
  const prisma = usePrisma();
  const shiftId = getRouterParam(event, "shiftId");

  const findShift_with_Staff = await prisma.shift.findUnique({
    where: {
      id: shiftId,
    },
    include: {
      staff: true,
    },
  });

  return findShift_with_Staff;
});
