import { usePrisma } from "~~/server/utils/prisma";

//returns the shift with staff details, optionally filtered by date range
export default defineEventHandler(async (event) => {
  const prisma = usePrisma();
  const query = getQuery(event);

  if (!query.startDate || !query.endDate) {
    throw createError({
      message: "No start or end date of the week provided as query",
    });
  }
  const startDate = new Date(query.startDate as string);

  const endDate = new Date(query.endDate as string);

  const data = await prisma.shift.findMany({
    where:
      startDate && endDate
        ? {
            date: {
              gte: startDate,
              lte: endDate,
            },
          }
        : undefined,
    include: {
      staff: true,
    },
    orderBy: {
      date: "asc",
    },
  });
  return data;
});
