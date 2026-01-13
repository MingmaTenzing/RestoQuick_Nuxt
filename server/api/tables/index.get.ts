export default defineEventHandler(async (event) => {
  const prisma = usePrisma();

  const tables = await prisma.table.findMany({
    orderBy: {
      capacity: "asc",
    },
  });

  return tables;
});
