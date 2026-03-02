import { MenuCategory } from "~/generated/prisma/client";

export default defineEventHandler(async (event) => {
  const prisma = usePrisma();
  const body = await readBody(event);

  if (!body?.name || !body?.category || body?.priceCents == null) {
    throw createError({
      statusCode: 400,
      statusMessage: "name, category and priceCents are required",
    });
  }

  const menuItem = await prisma.menuItem.create({
    data: {
      name: body.name,
      description: body.description,
      priceCents: Number(body.priceCents),
      category: body.category,
      imageUrl: body.imageUrl,
      isAvailable: body.isAvailable,
    },
  });

  return menuItem;
});
