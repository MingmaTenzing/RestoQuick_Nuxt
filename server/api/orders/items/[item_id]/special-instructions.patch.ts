import { usePrisma } from "~~/server/utils/prisma";

type UpdateOrderItemSpecialInstructionsBody = {
  specialInstructions?: string | null;
};

export default defineEventHandler(async (event) => {
  const prisma = usePrisma();
  const itemId = getRouterParam(event, "item_id");
  const body = (await readBody(
    event,
  )) as UpdateOrderItemSpecialInstructionsBody;

  if (!itemId) {
    throw createError({
      statusCode: 400,
      statusMessage: "item_id is required",
    });
  }

  if (
    body.specialInstructions !== null &&
    body.specialInstructions !== undefined &&
    typeof body.specialInstructions !== "string"
  ) {
    throw createError({
      statusCode: 400,
      statusMessage: "Special instructions must be text",
    });
  }

  await prisma.orderItem.update({
    where: { id: itemId },
    data: {
      specialInstructions: body.specialInstructions?.trim() || null,
    },
  });

  return { success: true };
});
