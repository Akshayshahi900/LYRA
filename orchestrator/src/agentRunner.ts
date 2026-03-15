import { searchWeb, callAgent } from "./toolRegistry";

export async function runPlan(query: string, intent: string) {
  if (intent === "search") {
    return searchWeb(query, true);
  }
  if (intent === "file") {
    return callAgent("file", "/action", {
      action: "list_directory",
      payload: { path: "." },
    });
  }
  if (intent === "system") {
    return callAgent("os", "/run", { command: "uptime" });
  }
  return { message: "No Tool Executed" };
}
