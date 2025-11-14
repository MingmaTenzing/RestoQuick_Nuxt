import { usePrisma } from "~~/server/utils/prisma";

export default defineEventHandler(async (event) => {
  const prisma = usePrisma();

  const body = await readBody(event);
  console.log(body);
  console.log(event.method);
  const response = await prisma.shift.create({
    data: body,
  });
  return {
    response,
  };
});
