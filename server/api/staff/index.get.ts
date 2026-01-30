export default defineEventHandler(async (event) => {
  const prisma = usePrisma();

  const query = getQuery(event);
  console.log(query);
  const staffs = await prisma.staff.findMany({
    orderBy: {
      firstname: "asc",
    },
    where: {
      firstname: {
        contains: query.staff_name as string,
        mode: "insensitive",
      },
    },
  });
  return staffs;
});
