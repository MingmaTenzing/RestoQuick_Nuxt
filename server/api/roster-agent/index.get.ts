import { Agent, run } from "@openai/agents";
export default defineEventHandler(async (event) => {
  const agent = new Agent({
    name: "Roster Agent",
    model: "gpt-5-mini",
    instructions:
      "You are a helpful assisntant that helps with the roster managment",
  });

  const result = await run(
    agent,
    "how should i approach on budget for my roster next week",
  );

  return result;
});
