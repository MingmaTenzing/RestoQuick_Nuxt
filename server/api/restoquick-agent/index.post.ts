import { Agent, imageGenerationTool, run, webSearchTool } from "@openai/agents";
import { booking_tools } from "~~/server/utils/agent-tools/booking_tools";
import { leave_request_tools } from "~~/server/utils/agent-tools/leave_request_tools";
import { menu_tools } from "~~/server/utils/agent-tools/menu_tools";
import { orders_tools } from "~~/server/utils/agent-tools/orders_tools";
import { receipt_tool } from "~~/server/utils/agent-tools/receipt_tool";
import { shift_tools } from "~~/server/utils/agent-tools/shift_tools";
import { staff_tool } from "~~/server/utils/agent-tools/staff_tool";
import { stock_tools } from "~~/server/utils/agent-tools/stock_tools";
import { table_tools } from "~~/server/utils/agent-tools/table_tools";

import { restoquickAgentInstructions } from "~~/server/utils/restoquick-agent-instructions";
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

  const agent = new Agent({
    name: "RestoQuick Assistant",
    model: "gpt-5-mini-2025-08-07",

    instructions: restoquickAgentInstructions,
    tools: [
      webSearchTool(),
      imageGenerationTool(),
      ...leave_request_tools(),
      ...booking_tools(),
      ...menu_tools(),
      ...orders_tools(),
      ...receipt_tool(),
      ...shift_tools(),
      ...staff_tool(),
      ...stock_tools(),
      ...table_tools(),
    ],
  });

  const result = await run(
    agent,
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
