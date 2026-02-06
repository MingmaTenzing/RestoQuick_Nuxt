import { usePrisma } from "~~/server/utils/prisma";

//returns the shift with staff details
export default defineEventHandler(async (event) => {
  const prisma = usePrisma();
  console.log(event.method);
  const data = await prisma.shift.findMany({
    include: {
      staff: true,
    },
  });
  return data;
});
