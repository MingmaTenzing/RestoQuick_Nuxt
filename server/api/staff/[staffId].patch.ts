export default defineEventHandler(async (event) => {
  const prisma = usePrisma();
  const staffId = getRouterParam(event, "staffId");
  const body = await readBody(event);

  try {
    const updatedStaff = await prisma.staff.update({
      where: {
        id: staffId,
      },
      data: body,
    });

    return updatedStaff;
  } catch (error) {
    console.log(error);
    throw createError({
      statusCode: 400,
      statusMessage: "Failed to update staff",
      data: error,
    });
  }
});
