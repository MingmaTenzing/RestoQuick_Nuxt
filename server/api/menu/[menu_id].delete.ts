export default defineEventHandler(async (event) => {
  const prisma = usePrisma();
  const menuId = getRouterParam(event, "menu_id");

  if (!menuId) {
    throw createError({
      statusCode: 400,
      statusMessage: "Menu item ID is required",
    });
  }

  const deletedMenuItem = await prisma.menuItem.delete({
    where: { id: menuId },
  });

  return deletedMenuItem;
});
