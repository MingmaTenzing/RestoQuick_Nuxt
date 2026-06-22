import type { MenuItem, MenuOption } from "~/generated/prisma/browser";

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
  category: string;
  imageUrl: string;
  isAvailable: boolean;
};
