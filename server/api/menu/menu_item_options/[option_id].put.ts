export default defineEventHandler(async (event) => {
  const prisma = usePrisma();
  const optionId = getRouterParam(event, "option_id");
  const body = await readBody(event);
  const updateOption = body?.update_menu_option;

  if (!optionId) {
    throw createError({
      statusCode: 400,
      statusMessage: "Menu option ID is required",
    });
  }

  if (!updateOption?.name || updateOption?.priceCents == null) {
    throw createError({
      statusCode: 400,
      statusMessage: "name and priceCents are required",
    });
  }

  const updatedMenuOption = await prisma.menuOption.update({
    where: { id: optionId },
    data: {
      name: updateOption.name,
      priceCents: Number(updateOption.priceCents),
    },
  });

  return updatedMenuOption;
});
