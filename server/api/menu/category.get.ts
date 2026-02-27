import { MenuCategory } from "~/generated/prisma/enums";

export default defineEventHandler((event) => {
  return Object.values(MenuCategory);
});
