//this endpoint find the staff using staffId and return the staff;
export default defineEventHandler((event) => {
  const prisma = usePrisma();
  const staffId = getRouterParam(event, "staffId");

  const findStaff = prisma.staff.findUnique({
    where: {
      id: staffId,
    },
  });

  return findStaff;
});
