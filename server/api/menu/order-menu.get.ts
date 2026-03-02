export default defineEventHandler(async () => {
  const prisma = usePrisma();

  const menuItems = await prisma.menuItem.findMany({
    where: {
      isAvailable: true,
    },
    orderBy: [{ category: "asc" }, { name: "asc" }],
  });

  return menuItems;
});
