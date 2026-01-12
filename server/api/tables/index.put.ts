import { Prisma } from "~/generated/prisma/client";

export default defineEventHandler(async (event) => {
  const prisma = usePrisma();
  const body = await readBody(event);

  const { table_id, table_number, capacity } = body;

  if (!table_id) {
    throw createError({
      statusCode: 400,
      statusMessage: "table_id is required",
    });
  }

  const data: Record<string, any> = {};

  if (table_number !== undefined) {
    data.number = table_number;
  }

  if (capacity !== undefined) {
    const capacityInt = Number(capacity);
    if (!Number.isInteger(capacityInt) || capacityInt <= 0) {
      throw createError({
        statusCode: 400,
        statusMessage: "capacity must be a positive integer",
      });
    }
    data.capacity = capacityInt;
  }

  try {
    const updatedTable = await prisma.table.update({
      where: { id: table_id },
      data: data,
    });

    return {
      statusCode: 200,
      data: updatedTable,
    };
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        throw createError({
          message:
            "Table number already exists. Please use a different table number",
          statusCode: 409,
        });
      }
    }

    console.error(error);
    throw createError({
      message: "Something went wrong",
      statusCode: 500,
    });
  }
});
