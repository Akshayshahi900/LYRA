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

    let finalAnswer = result;
    if (intent === "search" && result.content?.length) {
      finalAnswer = await summarizeSearch(message, result);
    }
    res.json({
      plan,
      finalAnswer,
    });
  } catch {
    return { error: "Tool Execution failed" };
  }
});

app.listen(3000, () => {
  console.log("LYRA orchestrator running");
});
