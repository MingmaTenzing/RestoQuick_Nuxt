import { useComposioSession } from "~~/server/utils/composio";

export default defineEventHandler(async (event) => {
  const body = await readBody<{ isConnected: boolean; cursor?: string }>(event);
  const session = await useComposioSession(event);
  const result = await session.toolkits({
    isConnected: body.isConnected,
    cursor: body.cursor,
    limit: 50,
  });

  return result;
});
