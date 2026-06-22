export default defineEventHandler(async () => {
  const prisma = usePrisma();

  const categories = await prisma.menuCategory.findMany({
    orderBy: { name: "asc" },
    select: { name: true },
  });

  return categories.map((category) => category.name);
});
