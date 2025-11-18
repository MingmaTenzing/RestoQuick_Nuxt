export default defineEventHandler(async (event) => {
  const prisma = usePrisma();
  const shiftId = getRouterParam(event, "shiftId");
  const deleteShift = await prisma.shift.delete({
    where: {
      id: shiftId,
    },
  });
  return deleteShift;
});
