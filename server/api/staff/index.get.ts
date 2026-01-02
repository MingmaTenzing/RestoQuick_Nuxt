import { usePrisma } from "~~/server/utils/prisma";

export default defineEventHandler(async () => {
  const prisma = usePrisma();
  const staffs = await prisma.staff.findMany();
  return staffs;
});
