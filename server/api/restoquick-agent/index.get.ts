import { Agent, run, webSearchTool } from "@openai/agents";
import { booking_tools } from "~~/server/utils/agent-tools/booking_tools";
import { leave_request_tools } from "~~/server/utils/agent-tools/leave_request_tools";
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
      ...stock_tools(),
      ...table_tools(),
    ],
  });

  const result = await run(
    agent,
    "update the table t1 and set it capacity to 6",
  );

  return result.finalOutput;
});
