import { PrismaClientKnownRequestError } from "@prisma/client/runtime/client";

export default defineEventHandler(async (event) => {
  const prisma = usePrisma();
  const body = await readBody(event);

  const { table_number, capacity } = body;
  console.log(table_number, capacity);
  try {
    const create_table = await prisma.table.create({
      data: {
        number: table_number,
        capacity: capacity,
      },
    });

    return create_table;
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError) {
      if ((error.code = "P2002")) {
        throw createError({
          message:
            "Table Number Exists Already. Please use a differet table number",
          statusCode: 409,
        });
      }
    }
    return error;
  }
});
