export default defineEventHandler(async (event) => {
  const prisma = usePrisma();
  const menuItemId = getRouterParam(event, "menu_item_id");
  const body = await readBody(event);

  if (!menuItemId) {
    throw createError({
      statusCode: 400,
      statusMessage: "Menu item ID is required",
    });
  }

  if (typeof body?.isAvailable !== "boolean") {
    throw createError({
      statusCode: 400,
      statusMessage: "isAvailable must be a boolean",
    });
  }

  const updatedMenuItem = await prisma.menuItem.update({
    where: { id: menuItemId },
    data: {
      isAvailable: body.isAvailable,
    },
  });

  return updatedMenuItem;
});
