import type { MenuItem, MenuOption } from "~/generated/prisma/browser";
import type { MenuCategory } from "~/generated/prisma/enums";

export type MenuItemWithOptions = MenuItem & {
  options: MenuOption[];
};

export type MenuOptionDraft = {
  name: string;
  price: number;
};

export type MenuItemFormState = {
  name: string;
  description: string;
  price: number;
  category: MenuCategory;
  imageUrl: string;
  isAvailable: boolean;
};
