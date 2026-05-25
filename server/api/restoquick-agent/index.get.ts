import { Agent, run, webSearchTool } from "@openai/agents";
import { booking_tools } from "~~/server/utils/agent-tools/booking_tools";
import { leave_request_tools } from "~~/server/utils/agent-tools/leave_request_tools";
import { orders_tools } from "~~/server/utils/agent-tools/orders_tools";
import { receipt_tool } from "~~/server/utils/agent-tools/receipt_tool";
import { stock_tools } from "~~/server/utils/agent-tools/stock_tools";
import { table_tools } from "~~/server/utils/agent-tools/table_tools";

import { restoquickAgentInstructions } from "~~/server/utils/restoquick-agent-instructions";
export default defineEventHandler(async (event) => {
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

  const result = await run(
    agent,
    "print receipt in the 192.168.1.250 printer for the session with id e0b1b9cf-50c5-4c94-9910-29e0b84d11ad",
  );

  return result.finalOutput;
});
