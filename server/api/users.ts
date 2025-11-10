import { PrismaClient } from "~/generated/prisma/client";

const prisma = new PrismaClient();
export default defineEventHandler(async (event) => {
  const data = await prisma.user.findMany();
  return {
    data,
  };
});
