import express from "express";
import { routeIntent } from "./router";
import { createPlan } from "./planner";

const app = express();
app.use(express.json());

app.post("/ask", async (req, res) => {
  const { message } = req.body;
  const intent = await routeIntent(message);

  const plan = await createPlan(message);

  res.json({
    intent,
    plan,
  });
});

app.listen(3000, () => {
  console.log("LYRA orchestrator running");
});
