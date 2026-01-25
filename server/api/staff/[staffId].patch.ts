export default defineEventHandler(async (event) => {
  const prisma = usePrisma();
  const staffId = getRouterParam(event, "staffId");

  try {
    const body = await readBody(event);

    const updatedStaff = await prisma.staff.update({
      where: {
        id: staffId,
      },
      data: {
        firstname: body.firstname,
        lastName: body.lastName,
        email: body.email,
        phone: body.phone,
        role: body.role,
        availability: body.availability,
      },
    });

    return updatedStaff;
  } catch (error) {
    throw createError({
      statusCode: 400,
      statusMessage: "Failed to update staff",
      data: error,
    });
  }
});
