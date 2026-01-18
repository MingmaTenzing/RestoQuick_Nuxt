export default defineEventHandler(async () => {
  const prisma = usePrisma();
  const staffs = await prisma.staff.findMany();
  return staffs;
});
