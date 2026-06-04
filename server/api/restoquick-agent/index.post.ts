import { Agent, imageGenerationTool, run, webSearchTool } from "@openai/agents";
import { useMainAgent } from "~~/server/utils/agents/main-agent";

type ChatRole = "assistant" | "user";

type ChatMessage = {
  id: string;
  role: ChatRole;
  content: string;
};

export default defineEventHandler(async (event) => {
  const { main_agent } = await useMainAgent();
  const body = await readBody<{ messages: ChatMessage[] }>(event);
  const messages = body?.messages ?? [];

  if (!messages.length) {
    throw createError({
      statusCode: 400,
      statusMessage: "A messages array is required.",
    });
  }

  console.log(messages);

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
