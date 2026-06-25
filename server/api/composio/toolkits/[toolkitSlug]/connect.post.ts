import { createComposioConnectionRequest } from "~~/server/utils/composio";

export default defineEventHandler(async (event) => {
  const toolkitSlug = getRouterParam(event, "toolkitSlug");

  if (!toolkitSlug) {
    throw createError({
      statusCode: 400,
      statusMessage: "Toolkit slug is required.",
    });
  }

  return await createComposioConnectionRequest(event, toolkitSlug);
});
