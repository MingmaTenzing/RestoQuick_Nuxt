import { Prisma } from "~/generated/prisma/client";

export default defineEventHandler(async (event) => {
  const prisma = usePrisma();
  const body = await readBody(event);
  const { table_id } = body;

  if (!table_id) {
    throw createError({ statusCode: 400, statusMessage: "table_id is required" });
  }

  try {
    await prisma.table.delete({ where: { id: table_id } });

    return {
      statusCode: 200,
      message: "Table deleted",
    };
  } catch (error: any) {
    // P2025 = Record to delete does not exist
    if (error?.code === "P2025") {
      throw createError({ statusCode: 404, statusMessage: "Table not found" });
    }

    console.error(error);
    throw createError({ statusCode: 500, statusMessage: "Something went wrong" });
  }
});