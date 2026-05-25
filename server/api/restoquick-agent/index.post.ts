import { Agent, run } from "@openai/agents";
import { OpenAIProvider } from "@openai/agents-openai";
import { booking_tools } from "~~/server/utils/agent-tools/booking_tools";
import { leave_request_tools } from "~~/server/utils/agent-tools/leave_request_tools";
import { orders_tools } from "~~/server/utils/agent-tools/orders_tools";
import { receipt_tool } from "~~/server/utils/agent-tools/receipt_tool";
import { stock_tools } from "~~/server/utils/agent-tools/stock_tools";
import { table_tools } from "~~/server/utils/agent-tools/table_tools";

import { restoquickAgentInstructions } from "~~/server/utils/restoquick-agent-instructions";
export default defineEventHandler(async (event) => {
  const body = await readBody<{ message?: string }>(event);
  const userMessage = body?.message?.trim();

  if (!userMessage) {
    throw createError({
      statusCode: 400,
      statusMessage: "A message is required.",
    });
  }

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
      ...leave_request_tools(),
      ...booking_tools(),
      ...orders_tools(),
      ...receipt_tool(),
      ...stock_tools(),
      ...table_tools(),
    ],
  });

  const result = await run(agent, userMessage, { stream: true });

  setResponseHeader(event, "content-type", "text/plain; charset=utf-8");
  setResponseHeader(event, "cache-control", "no-cache, no-transform");

  return sendStream(
    event,
    result.toTextStream({ compatibleWithNodeStreams: true }),
  );
});
