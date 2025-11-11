import { PrismaClient } from "~/generated/prisma/client";
import { usePrisma } from "~~/server/utils/prisma";

export default defineEventHandler(async (event) => {
  const prisma = usePrisma();
  console.log(event.method);
  const data = await prisma.staff.findMany();
  return {
    data,
  };
});
