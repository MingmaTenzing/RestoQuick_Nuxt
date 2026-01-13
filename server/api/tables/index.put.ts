import { table } from "console";
import { Prisma } from "~/generated/prisma/client";

export default defineEventHandler(async (event) => {
  const prisma = usePrisma();

  const body = await readBody(event);

  const capacity = body.capacity;
  const table_id = body.table_id;

  if (!table_id) {
    throw createError({
      status: 400,
      message: "Please provie the table_id",
    });
  }
  if (!capacity) {
    throw createError({
      statusCode: 400,
      message: "Please provide the field - capacity to update",
    });
  }

  try {
    const update_table = await prisma.table.update({
      where: {
        id: table_id,
      },
      data: {
        capacity: capacity,
      },
    });
    return update_table;
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code == "P2025") {
        throw createError({
          status: 500,
          message: "Cannot find the Table_id, does not exit",
        });
      }
    }
    return error;
  }
});
