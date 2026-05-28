import { tool } from "@openai/agents";
import z from "zod";

export const table_tools = () => {
  const prisma = usePrisma();

  const get_tables = tool({
    name: "get_all_tables",
    description: "Get all tables with their active sessions.",
    parameters: z.object({}),
    execute: async () => {
      const tables = await prisma.table.findMany({
        orderBy: {
          number: "asc",
        },
      });

      return tables;
    },
  });

  const add_table = tool({
    name: "add_table",
    description: "Create a table with table number and capacity.",
    parameters: z.object({
      tableNumber: z.string().min(1),
      capacity: z.number().int().positive(),
    }),
    execute: async ({ tableNumber, capacity }) => {
      const table = await prisma.table.create({
        data: {
          number: tableNumber,
          capacity,
        },
      });

      return table;
    },
  });

  const update_table = tool({
    name: "update_table",
    description:
      "Update a table using the exact table number. Pass null for any field you do not want to change.",
    parameters: z
      .object({
        tableNumber: z.string().min(1),
        newTableNumber: z.string().nullable(),
        capacity: z.number().int().positive().nullable(),
      })
      .strict(),
    execute: async ({ tableNumber, newTableNumber, capacity }) => {
      const existingTable = await prisma.table.findUnique({
        where: {
          number: tableNumber,
        },
      });

      if (!existingTable) {
        throw new Error("Table not found for this table number.");
      }

      const table = await prisma.table.update({
        where: {
          id: existingTable.id,
        },
        data: {
          ...(newTableNumber !== null ? { number: newTableNumber } : {}),
          ...(capacity !== null ? { capacity } : {}),
        },
      });

      return table;
    },
  });

  const delete_table = tool({
    name: "delete_table",
    description: "Delete a table using the exact table number.",
    parameters: z.object({
      tableNumber: z.string().min(1),
    }),
    execute: async ({ tableNumber }) => {
      const table = await prisma.table.delete({
        where: {
          number: tableNumber,
        },
      });

      return table;
    },
  });

  return [get_tables, add_table, update_table, delete_table];
};
