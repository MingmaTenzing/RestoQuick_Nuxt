import { Agent, imageGenerationTool, run, webSearchTool } from "@openai/agents";

import { main_agent } from "~~/server/utils/agent/main-agent";

type ChatRole = "assistant" | "user";

type ChatMessage = {
  id: string;
  role: ChatRole;
  content: string;
};

export default defineEventHandler(async (event) => {
  const body = await readBody<{ messages: ChatMessage[] }>(event);
  const messages = body?.messages ?? [];

  if (!messages.length) {
    throw createError({
      statusCode: 400,
      statusMessage: "A messages array is required.",
    });
  }

  console.log(messages);

  const runtimeConfig = useRuntimeConfig();

  if (!runtimeConfig.OPENAI_API_KEY?.trim()) {
    throw createError({
      statusCode: 500,
      statusMessage: "OPENAI_API_KEY is not configured.",
    });
  }

  const result = await run(
    main_agent,
    messages.map((message) =>
      message.role === "user"
        ? {
            role: "user",
            content: message.content,
          }
        : {
            role: "assistant",
            status: "completed",
            content: [
              {
                type: "output_text",
                text: message.content,
              },
            ],
          },
    ),

    { stream: true },
  );

  setResponseHeader(event, "content-type", "text/plain; charset=utf-8");
  setResponseHeader(event, "cache-control", "no-cache, no-transform");

  return sendStream(
    event,
    result.toTextStream({ compatibleWithNodeStreams: true }),
  );
});
