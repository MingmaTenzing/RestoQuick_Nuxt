export default defineEventHandler(async (event) => {
  const prisma = usePrisma();
  const tables_data = [
    {
      number: "A1",
      capacity: 2,
    },
    {
      number: "A2",
      capacity: 2,
    },
    {
      number: "B1",
      capacity: 4,
    },
    {
      number: "B2",
      capacity: 4,
    },
    {
      number: "C1",
      capacity: 6,
    },
    {
      number: "C2",
      capacity: 6,
    },
    {
      number: "Bar-1",
      capacity: 1,
    },
    {
      number: "Bar-2",
      capacity: 1,
    },
  ];

  const tables = await prisma.table.createMany({
    data: tables_data,
  });

  return tables;
});
