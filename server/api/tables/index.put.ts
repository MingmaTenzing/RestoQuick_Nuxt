import { PrismaClientKnownRequestError } from "@prisma/client/runtime/client";

export default defineEventHandler(async (event) => {
  const prisma = usePrisma();

  const body = await readBody(event);

  const capacity = body.capacity;
  const table_id = body.table_id;
  const layoutX = body.layoutX;
  const layoutY = body.layoutY;

  if (!table_id) {
    throw createError({
      statusCode: 400,
      message: "Please provie the table_id",
    });
  }

  if (capacity == null && layoutX == null && layoutY == null) {
    throw createError({
      statusCode: 400,
      message: "Please provide at least one field to update",
    });
  }

  const updateData: { capacity?: number; layoutX?: number; layoutY?: number } = {};

  if (capacity != null) {
    updateData.capacity = Number(capacity);
  }

  if (layoutX != null) {
    updateData.layoutX = Math.round(Number(layoutX));
  }

  if (layoutY != null) {
    updateData.layoutY = Math.round(Number(layoutY));
  }

  try {
    const update_table = await prisma.table.update({
      where: {
        id: table_id,
      },
      data: updateData,
    });
    return update_table;
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError) {
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
