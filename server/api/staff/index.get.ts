export default defineEventHandler(async (event) => {
  const prisma = usePrisma();
  const query = getQuery(event);
  const staffName = (query.staff_name as string)?.trim();

  const staffs = await prisma.staff.findMany({
    orderBy: { firstname: "asc" },
    ...(staffName
      ? { 
          where: {
            OR: [
              { firstname: { contains: staffName, mode: "insensitive" } },
              { lastName: { contains: staffName, mode: "insensitive" } },
            ],
          },
        }
      : {}),
  });
  return staffs;
});
