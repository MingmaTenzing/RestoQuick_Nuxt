import {
  Agent,
  hostedMcpTool,
  imageGenerationTool,
  setDefaultOpenAIClient,
  webSearchTool,
} from "@openai/agents";
import { menu_tools } from "../agent-tools/menu_tools";
import { shift_tools } from "../agent-tools/shift_tools";
import { staff_tool } from "../agent-tools/staff_tool";
import { analytics_tools } from "../agent-tools/analytics_tools";
import { rosterAgent } from "./roster-agent";
import { Composio } from "@composio/core";
import OpenAI from "openai";

export const useMainAgent = async () => {
  const composio = new Composio();
  const client = new OpenAI({
    baseURL: "http://localhost:11434/v1",
    apiKey: "ollama",
  });
  setDefaultOpenAIClient(client);
  const userId = "user_33455";

  const session = await composio.create(userId);

  const main_agent = Agent.create({
    name: "RestoQuick Assistant",
    model: "gemma4:e2b-mlx ",
    handoffs: [rosterAgent],

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
