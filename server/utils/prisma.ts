import { PrismaClient } from "~/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const runtimeConfig = useRuntimeConfig();

const adapter = new PrismaPg({ connectionString: runtimeConfig.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

export const usePrisma = () => {
  return prisma;
};
