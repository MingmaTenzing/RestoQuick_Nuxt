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

const menuOptionCreateSchema = z.object({
  name: z.string().min(1),
  priceCents: z.number().int().min(0),
});

const menuOptionUpsertSchema = z
  .object({
    id: z.string().min(1).nullable().optional(),
    currentName: z.string().min(1).nullable().optional(),
    name: z.string().min(1),
    priceCents: z.number().int().min(0),
  })
  .strict();

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
      "Create a menu item with name, category, price, and optional description, image, availability, and menu options.",
    parameters: z.object({
      name: z.string().min(1),
      category: menuCategorySchema.default("MAIN_COURSE"),
      priceCents: z.number().int().min(0),
      description: z.string().nullable(),
      imageUrl: z.string().nullable(),
      isAvailable: z.boolean().default(true),
      options: z.array(menuOptionCreateSchema).nullable().optional(),
    }),
    execute: async ({
      name,
      category,
      priceCents,
      description,
      imageUrl,
      isAvailable,
      options,
    }) => {
      const menuItem = await prisma.menuItem.create({
        data: {
          name,
          category,
          priceCents,
          ...(description ? { description } : {}),
          ...(imageUrl ? { imageUrl } : {}),
          isAvailable,
          ...(options?.length
            ? {
                options: {
                  create: options,
                },
              }
            : {}),
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
      "Update a menu item using the exact menu item name. Pass null for any top-level field you do not want to change. Options can update existing menu options or create new ones in the same call.",
    parameters: z
      .object({
        menuItemName: z.string().min(1),
        name: z.string().nullable(),
        category: menuCategorySchema.nullable(),
        priceCents: z.number().int().min(0).nullable(),
        description: z.string().nullable(),
        imageUrl: z.string().nullable(),
        isAvailable: z.boolean().nullable(),
        options: z.array(menuOptionUpsertSchema).nullable().optional(),
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
      options,
    }) => {
      const existingMenuItem = await prisma.menuItem.findFirst({
        where: {
          name: menuItemName,
        },
        include: {
          options: true,
        },
      });

      if (!existingMenuItem) {
        throw new Error("Menu item not found for this name.");
      }

      const optionsToCreate = [];
      const optionUpdates = [];

      for (const option of options ?? []) {
        const existingOption = existingMenuItem.options.find((itemOption) => {
          if (option.id) {
            return itemOption.id === option.id;
          }

          if (option.currentName) {
            return itemOption.name === option.currentName;
          }

          return false;
        });

        if (existingOption) {
          optionUpdates.push({
            where: { id: existingOption.id },
            data: {
              name: option.name,
              priceCents: option.priceCents,
            },
          });
          continue;
        }

        optionsToCreate.push({
          name: option.name,
          priceCents: option.priceCents,
        });
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
          ...(optionUpdates.length
            ? {
                options: {
                  update: optionUpdates,
                },
              }
            : {}),
          ...(optionsToCreate.length
            ? {
                options: {
                  ...(optionUpdates.length
                    ? {
                        update: optionUpdates,
                      }
                    : {}),
                  create: optionsToCreate,
                },
              }
            : {}),
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
