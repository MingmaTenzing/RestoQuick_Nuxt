import { tool } from "@openai/agents";
import z from "zod";

const stockCategorySchema = z.enum([
  "INGREDIENTS",
  "BEVERAGES",
  "SUPPLIES",
  "OTHER",
]);

export const stock_tools = () => {
  const prisma = usePrisma();

  const get_stock_items = tool({
    name: "get_all_stock_items",
    description: "Get all stock items.",
    parameters: z.object({}),
    execute: async () => {
      const stockItems = await prisma.stockItem.findMany({
        orderBy: {
          createdAt: "desc",
        },
      });

      return stockItems;
    },
  });

  const add_stock_item = tool({
    name: "add_stock_item",
    description:
      "Create a stock item with name, category, stock amount, unit, reorder level, reorder quantity, and optional supplier.",
    parameters: z.object({
      name: z.string().min(1),
      category: stockCategorySchema.default("INGREDIENTS"),
      currentStock: z.number().int().min(0),
      unit: z.string().min(1),
      reorderLevel: z.number().int().min(0),
      reorderQuantity: z.number().int().min(0),
      supplier: z.string().nullable(),
    }),
    execute: async ({
      name,
      category,
      currentStock,
      unit,
      reorderLevel,
      reorderQuantity,
      supplier,
    }) => {
      const stockItem = await prisma.stockItem.create({
        data: {
          name,
          category,
          currentStock,
          unit,
          reorderLevel,
          reorderQuantity,
          ...(supplier ? { supplier } : {}),
        },
      });

      return stockItem;
    },
  });

  const update_stock_item = tool({
    name: "update_stock_item",
    description:
      "Update a stock item using the exact stock name. Pass null for any field you do not want to change.",
    parameters: z
      .object({
        name: z.string().min(1),
        category: stockCategorySchema.nullable(),
        currentStock: z.number().int().min(0).nullable(),
        unit: z.string().nullable(),
        reorderLevel: z.number().int().min(0).nullable(),
        reorderQuantity: z.number().int().min(0).nullable(),
        supplier: z.string().nullable(),
      })
      .strict(),
    execute: async ({
      name,
      category,
      currentStock,
      unit,
      reorderLevel,
      reorderQuantity,
      supplier,
    }) => {
      const existingStockItem = await prisma.stockItem.findFirst({
        where: {
          name,
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      if (!existingStockItem) {
        throw new Error("Stock item not found for this name.");
      }

      const stockItem = await prisma.stockItem.update({
        where: {
          id: existingStockItem.id,
        },
        data: {
          ...(category !== null ? { category } : {}),
          ...(currentStock !== null ? { currentStock } : {}),
          ...(unit !== null ? { unit } : {}),
          ...(reorderLevel !== null ? { reorderLevel } : {}),
          ...(reorderQuantity !== null ? { reorderQuantity } : {}),
          ...(supplier !== null ? { supplier } : {}),
        },
      });

      return stockItem;
    },
  });

  const delete_stock_item = tool({
    name: "delete_stock_item",
    description: "Delete all stock items that match an exact stock name.",
    parameters: z.object({
      name: z.string().min(1),
    }),
    execute: async ({ name }) => {
      const stockItems = await prisma.stockItem.findMany({
        where: {
          name,
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      const deletedStockItems = await prisma.stockItem.deleteMany({
        where: {
          name,
        },
      });

      return {
        name,
        deletedCount: deletedStockItems.count,
        deletedStockItems: stockItems,
      };
    },
  });

  return [
    get_stock_items,
    add_stock_item,
    update_stock_item,
    delete_stock_item,
  ];
};
