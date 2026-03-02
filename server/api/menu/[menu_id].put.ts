export default defineEventHandler(async (event) => {
  const prisma = usePrisma();
  const menuId = getRouterParam(event, "menu_id");
  const body = await readBody(event);

  if (!menuId) {
    throw createError({
      statusCode: 400,
      statusMessage: "Menu item ID is required",
    });
  }

  if (!body?.name || !body?.category || body?.priceCents == null) {
    throw createError({
      statusCode: 400,
      statusMessage: "name, category and priceCents are required",
    });
  }

  const updatedMenuItem = await prisma.menuItem.update({
    where: { id: menuId },
    data: {
      name: body.name,
      description: body.description ?? null,
      priceCents: Number(body.priceCents),
      category: body.category,
      imageUrl: body.imageUrl ?? null,
      isAvailable: body.isAvailable,
    },
  });

  return updatedMenuItem;
});
