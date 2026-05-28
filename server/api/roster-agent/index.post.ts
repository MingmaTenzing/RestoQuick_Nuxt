import { Agent, run, tool } from "@openai/agents";
import { rosterAgent } from "../../utils/agent/roster-agent";
import { type RosterAgentStructuredOutput } from "../../../zod_schema/roster_agent_schema";

export default defineEventHandler(async (event) => {
  const body = await readBody<{ message: string }>(event);

  const user_message =
    body?.message?.trim() ||
    "create roster for next week put more staff on weekends cause we have a lot of bookings but make sure casuals only get 24 hours max";

  const result = await run(rosterAgent, user_message, {});
  const output = result.finalOutput as RosterAgentStructuredOutput;

  return {
    shifts: output?.shifts ?? [],
    assistantMessage: {
      content: output?.assistantMessage?.content ?? "",
      caution: output?.assistantMessage?.caution ?? "",
    },
  };
});
