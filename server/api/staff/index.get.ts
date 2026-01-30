export default defineEventHandler(async () => {
  const prisma = usePrisma();
  const staffs = await prisma.staff.findMany({
    orderBy: {
      firstname: "asc",
    },
  });
  return staffs;
});
