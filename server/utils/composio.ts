import { Composio } from "@composio/core";
import type { H3Event } from "h3";

let composio: Composio | null = null;

const useComposio = (event: H3Event) => {
  if (composio) {
    return composio;
  }

  const config = useRuntimeConfig(event);

  if (!config.COMPOSIO_API_KEY) {
    throw createError({
      statusCode: 500,
      statusMessage: "COMPOSIO_API_KEY is not configured.",
    });
  }

  composio = new Composio({ apiKey: config.COMPOSIO_API_KEY });
  return composio;
};

export const useComposioSession = async (event: H3Event) => {
  const { userId } = event.context.auth();

  if (!userId) {
    throw createError({
      statusCode: 401,
      statusMessage: "Unauthorized: User not signed in",
    });
  }

  return await useComposio(event).create(userId);
};

export const createComposioConnectionRequest = async (
  event: H3Event,
  toolkitSlug: string,
) => {
  const config = useRuntimeConfig(event);
  const requestUrl = getRequestURL(event);
  const baseUrl = config.BASE_URL || requestUrl.origin;
  const callbackUrl = new URL("/dashboard/agent", baseUrl).toString();
  const session = await useComposioSession(event);
  const connectionRequest = await session.authorize(toolkitSlug, {
    callbackUrl,
  });

  if (!connectionRequest.redirectUrl) {
    throw createError({
      statusCode: 400,
      statusMessage: "This toolkit did not return an authentication URL.",
    });
  }

  return {
    redirectUrl: connectionRequest.redirectUrl,
  };
};
