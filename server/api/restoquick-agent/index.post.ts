import { Agent, run, tool } from "@openai/agents";
import { restoquickAgentInstructions } from "~~/server/utils/restoquick-agent-instructions";
export default defineEventHandler(async (event) => {
  const agent = new Agent({
    name: "RestoQuick Assistant",
    model: "gpt-5-mini-2025-08-07",
    instructions: restoquickAgentInstructions,
  });
});
