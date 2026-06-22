export default defineEventHandler(async (event) => {
  const prisma = usePrisma();
  const body = await readBody(event);

  const name = String(body?.name ?? "").trim();

  if (!name) {
    throw createError({
      statusCode: 400,
      statusMessage: "Category name is required",
    });
  }

  const category = await prisma.menuCategory.upsert({
    where: { name },
    update: {},
    create: { name },
    select: { name: true },
  });

  return category;
});
