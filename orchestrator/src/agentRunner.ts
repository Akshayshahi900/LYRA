import { searchWeb } from "./toolRegistry";

export async function runPlan(query: string, intent: string) {
  if (intent === "search") {
    const result = await searchWeb(query, true);
    return result;
  }
  return {
    message: "No Tool Executed",
  };
}
