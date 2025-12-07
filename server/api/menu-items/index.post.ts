export default defineEventHandler(async (event) => {
  const prisma = usePrisma();
  const body = await readBody(event);

  const menuItem = await prisma.menuItem.create({
    data: body,
  });

  return menuItem;
});

