import axios from "axios";

const agents: Record<string, string> = {
  web: "http://localhost:8001",
  file: "http://localhost:8002",
  os: "http://localhost:8003",
};

// Generic agent caller
export async function callAgent(agent: string, path: string, payload: unknown) {
  const base = agents[agent];
  if (!base) throw new Error(`Unknown agent: "${agent}"`);

  const res = await axios.post(`${base}${path}`, payload, {
    headers: { "Content-Type": "application/json" },
    timeout: 15000,
  });

  return res.data;
}

// Web agent — typed, returns structured results
export async function searchWeb(query: string, deep: boolean = false) {
  return callAgent("web", "/search", { query, deep });
}

// Convenience: deep search for research tasks
export async function researchTopic(query: string) {
  return callAgent("web", "/search", { query, deep: true });
}
