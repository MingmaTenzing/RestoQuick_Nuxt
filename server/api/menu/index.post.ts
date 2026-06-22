export default defineEventHandler(async (event) => {
  const prisma = usePrisma();
  const body = await readBody(event);
  const category = String(body?.category ?? "").trim();

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

  const menuItem = await prisma.menuItem.create({
    data: {
      name: body.name,
      description: body.description,
      priceCents: Number(body.priceCents),
      category,
      imageUrl: body.imageUrl,
      isAvailable: body.isAvailable,
      options: body.options,
    },
    select: {
      options: true,
    },
  });
  return menuItem;
});
