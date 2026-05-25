import { Agent, Runner } from "@openai/agents";
import { OpenAIProvider } from "@openai/agents-openai";
import { booking_tools } from "~~/server/utils/agent-tools/booking_tools";
import { leave_request_tools } from "~~/server/utils/agent-tools/leave_request_tools";
import { orders_tools } from "~~/server/utils/agent-tools/orders_tools";
import { receipt_tool } from "~~/server/utils/agent-tools/receipt_tool";
import { stock_tools } from "~~/server/utils/agent-tools/stock_tools";
import { table_tools } from "~~/server/utils/agent-tools/table_tools";

import { restoquickAgentInstructions } from "~~/server/utils/restoquick-agent-instructions";
export default defineEventHandler(async (event) => {
  const runtimeConfig = useRuntimeConfig();
  const ollamaBaseUrl = runtimeConfig.OLLAMA_BASE_URL?.trim();
  const ollamaModel = runtimeConfig.OLLAMA_MODEL?.trim();
  const ollamaApiBaseUrl = ollamaBaseUrl?.endsWith("/v1")
    ? ollamaBaseUrl
    : `${ollamaBaseUrl}/v1`;

  const agent = new Agent({
    name: "RestoQuick Assistant",
    model: ollamaModel || "gpt-5-mini-2025-08-07",

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

  const runner = new Runner(
    ollamaApiBaseUrl
      ? {
          modelProvider: new OpenAIProvider({
            apiKey: runtimeConfig.OLLAMA_API_KEY || "ollama",
            baseURL: ollamaApiBaseUrl,
            useResponses: false,
          }),
        }
      : undefined,
  );

  const result = await runner.run(
    agent,
    "provide me the order details of the last order made.",
  );

  return result.finalOutput;
});
