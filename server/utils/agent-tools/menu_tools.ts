import { tool } from "@openai/agents";
import z from "zod";

const menuCategorySchema = z.enum([
  "APPETIZER",
  "MAIN_COURSE",
  "DESSERT",
  "BEVERAGE",
  "SIDE",
  "SALAD",
]);

export const menu_tools = () => {
  const prisma = usePrisma();

  const get_menu_items = tool({
    name: "get_all_menu_items",
    description: "Get all menu items with their options.",
    parameters: z.object({}),
    execute: async () => {
      const menuItems = await prisma.menuItem.findMany({
        orderBy: [{ category: "asc" }, { name: "asc" }],
        include: {
          options: true,
        },
      });

      return menuItems;
    },
  });

  const add_menu_item = tool({
    name: "add_menu_item",
    description:
      "Create a menu item with name, category, price, and optional description, image, and availability.",
    parameters: z.object({
      name: z.string().min(1),
      category: menuCategorySchema.default("MAIN_COURSE"),
      priceCents: z.number().int().min(0),
      description: z.string().nullable(),
      imageUrl: z.string().nullable(),
      isAvailable: z.boolean().default(true),
    }),
    execute: async ({
      name,
      category,
      priceCents,
      description,
      imageUrl,
      isAvailable,
    }) => {
      const menuItem = await prisma.menuItem.create({
        data: {
          name,
          category,
          priceCents,
          ...(description ? { description } : {}),
          ...(imageUrl ? { imageUrl } : {}),
          isAvailable,
        },
        include: {
          options: true,
        },
      });

      return menuItem;
    },
  });

  const update_menu_item = tool({
    name: "update_menu_item",
    description:
      "Update a menu item using the exact menu item name. Pass null for any field you do not want to change.",
    parameters: z
      .object({
        menuItemName: z.string().min(1),
        name: z.string().nullable(),
        category: menuCategorySchema.nullable(),
        priceCents: z.number().int().min(0).nullable(),
        description: z.string().nullable(),
        imageUrl: z.string().nullable(),
        isAvailable: z.boolean().nullable(),
      })
      .strict(),
    execute: async ({
      menuItemName,
      name,
      category,
      priceCents,
      description,
      imageUrl,
      isAvailable,
    }) => {
      const existingMenuItem = await prisma.menuItem.findFirst({
        where: {
          name: menuItemName,
        },
      });

      if (!existingMenuItem) {
        throw new Error("Menu item not found for this name.");
      }

      const menuItem = await prisma.menuItem.update({
        where: {
          id: existingMenuItem.id,
        },
        data: {
          ...(name !== null ? { name } : {}),
          ...(category !== null ? { category } : {}),
          ...(priceCents !== null ? { priceCents } : {}),
          ...(description !== null ? { description } : {}),
          ...(imageUrl !== null ? { imageUrl } : {}),
          ...(isAvailable !== null ? { isAvailable } : {}),
        },
        include: {
          options: true,
        },
      });

      return menuItem;
    },
  });

  const delete_menu_item = tool({
    name: "delete_menu_item",
    description: "Delete a menu item using the exact menu item name.",
    parameters: z.object({
      menuItemName: z.string().min(1),
    }),
    execute: async ({ menuItemName }) => {
      const existingMenuItem = await prisma.menuItem.findFirst({
        where: {
          name: menuItemName,
        },
      });

      if (!existingMenuItem) {
        throw new Error("Menu item not found for this name.");
      }

      const menuItem = await prisma.menuItem.delete({
        where: {
          id: existingMenuItem.id,
        },
        include: {
          options: true,
        },
      });

      return menuItem;
    },
  });

  return [get_menu_items, add_menu_item, update_menu_item, delete_menu_item];
};
