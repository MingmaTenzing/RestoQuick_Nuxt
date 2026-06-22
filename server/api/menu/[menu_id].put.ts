export default defineEventHandler(async (event) => {
  const prisma = usePrisma();
  const menuId = getRouterParam(event, "menu_id");
  const body = await readBody(event);
  const category = String(body?.category ?? "").trim();

  if (!menuId) {
    throw createError({
      statusCode: 400,
      statusMessage: "Menu item ID is required",
    });
  }

  if (!body?.name || !category || body?.priceCents == null) {
    throw createError({
      statusCode: 400,
      statusMessage: "name, category and priceCents are required",
    });
  }

  await prisma.menuCategory.upsert({
    where: { name: category },
    update: {},
    create: { name: category },
  });

  const updatedMenuItem = await prisma.menuItem.update({
    where: { id: menuId },
    data: {
      name: body.name,
      description: body.description ?? null,
      priceCents: Number(body.priceCents),
      category,
      imageUrl: body.imageUrl ?? null,
      isAvailable: body.isAvailable,
    },
  });

  return updatedMenuItem;
});
