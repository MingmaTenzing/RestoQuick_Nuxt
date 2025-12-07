export default defineEventHandler(async (event) => {
  const prisma = usePrisma();

  const menuItems = await prisma.menuItem.findMany({
    orderBy: [
      { category: 'asc' },
      { name: 'asc' },
    ],
  });

  return menuItems;
});

