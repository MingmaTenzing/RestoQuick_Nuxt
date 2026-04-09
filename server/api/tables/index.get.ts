export default defineEventHandler(async (event) => {
  const prisma = usePrisma();

  //returns the all the tables with active sessions
  // as a session needs to be closed before new once can be created
  // it only returns one active session per table...
  // however tables still store the history of all previously closed session.
  const tables = await prisma.table.findMany({
    include: {
      sessions: {
        where: {
          status: "ACTIVE",
        },
        select: {
          id: true,
        },
      },
    },
    orderBy: {
      number: "asc",
    },
  });

  return tables;
});
