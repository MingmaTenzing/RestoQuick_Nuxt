export default defineEventHandler(async (event) => {
  const prisma = usePrisma();

  const body = await readBody(event);
  const add_stock = await prisma.stockItem.create({
    data: body,
  });

  return add_stock;
});
