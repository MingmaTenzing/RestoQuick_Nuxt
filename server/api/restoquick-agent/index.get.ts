import { Agent, run } from "@openai/agents";
import { leave_request_tools } from "~~/server/utils/agent-tools/leave_request_tools";

import { restoquickAgentInstructions } from "~~/server/utils/restoquick-agent-instructions";
export default defineEventHandler(async (event) => {
  const agent = new Agent({
    name: "RestoQuick Assistant",
    model: "gpt-5-mini-2025-08-07",
    instructions: restoquickAgentInstructions,
    tools: [...leave_request_tools()],
  });

  const result = await run(agent, "show me all the leave requests", {});

  return result.finalOutput;
});
