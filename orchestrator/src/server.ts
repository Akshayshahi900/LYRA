import express from "express";
import { routeIntent } from "./router";
import { createPlan } from "./planner";
import { runPlan } from "./agentRunner";
const app = express();
app.use(express.json());

app.post("/ask", async (req, res) => {
  const { message } = req.body;
  const plan = await createPlan(message);
  const intent = await routeIntent(message);

  const toolResult = await runPlan(message, intent);
  res.json({
    plan,
    toolResult,
  });
});

app.listen(3000, () => {
  console.log("LYRA orchestrator running");
});
