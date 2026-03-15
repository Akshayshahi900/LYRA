import express from "express";
import { routeIntent } from "./router";
import { createPlan } from "./planner";
import { runPlan } from "./agentRunner";
import { summarizeSearch } from "./summarizer";

const app = express();
app.use(express.json());

app.post("/ask", async (req, res) => {
  const { message } = req.body;
  const plan = await createPlan(message);
  const intent = await routeIntent(message);
  try {
    const result = await runPlan(message, intent);
    let finalAnswer: any = result;
    if (intent === "search" && result.content?.length) {
      finalAnswer = await summarizeSearch(message, result);
    }
    res.json({ plan, intent, finalAnswer });
  } catch (err: any) {
    res
      .status(500)
      .json({ error: "Tool execution failed", detail: err.message });
  }
});

app.get("/health", (_req, res) =>
  res.json({ status: "ok", service: "orchestrator" }),
);

const PORT = process.env.ORCHESTRATOR_PORT ?? 3001;
app.listen(PORT, () => console.log(`LYRA orchestrator running on :${PORT}`));
