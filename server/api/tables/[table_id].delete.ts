export default defineEventHandler(async (event) => {
  const table_id = getRouterParam(event, "table_id");
  console.log(table_id);
  const prisma = usePrisma();

  const delete_table = await prisma.table.delete({
    where: {
      id: table_id,
    },
  });

  return delete_table;
});
