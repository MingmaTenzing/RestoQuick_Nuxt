import {
  Agent,
  hostedMcpTool,
  imageGenerationTool,
  setDefaultOpenAIClient,
  webSearchTool,
} from "@openai/agents";
import { menu_tools } from "../main-agent-tools/menu_tools";
import { shift_tools } from "../main-agent-tools/shift_tools";
import { staff_tool } from "../main-agent-tools/staff_tool";
import { analytics_tools } from "../main-agent-tools/analytics_tools";
import { rosterChatAgent } from "./roster-agent";
import OpenAI from "openai";
import type { H3Event } from "h3";
import { useComposioSession } from "../composio";

export const useMainAgent = async (event: H3Event) => {
  const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
  setDefaultOpenAIClient(client);
  const session = await useComposioSession(event);

  const main_agent = Agent.create({
    name: "RestoQuick Assistant",
    model: "gpt-5.4-mini",
    handoffs: [rosterChatAgent],

    instructions: restoquickAgentInstructions,
    tools: [
      hostedMcpTool({
        serverLabel: "composio",
        serverUrl: session.mcp.url,
        headers: session.mcp.headers,
      }),
      webSearchTool(),
      ...leave_request_tools(),
      ...booking_tools(),
      ...menu_tools(),
      ...orders_tools(),
      ...receipt_tool(),
      ...shift_tools(),
      ...staff_tool(),
      ...stock_tools(),
      ...table_tools(),
      ...analytics_tools(),
    ],
  });
  return { main_agent };
};
