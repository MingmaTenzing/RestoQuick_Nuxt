export default defineEventHandler(async (event) => {
  const prisma = usePrisma();
  const staffId = getRouterParam(event, "staffId");
  

  if (!staffId) {
    throw createError({
      statusCode: 400,
      statusMessage: "Staff ID is required",
    });
  }

  const deletedStaff = await prisma.staff.delete({
    where: {
      id: staffId,
    },
  });

  return deletedStaff;
});
