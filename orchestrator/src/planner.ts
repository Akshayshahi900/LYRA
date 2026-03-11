import { z } from "zod";
import { askLLM } from "./llm";

const PlanSchema = z.object({
  steps: z.array(z.string()),
});
export async function createPlan(task: string) {
  const prompt = `
  Break the task into steps.

  Task:${task}

  Return ONLY JSON like:
  {
    "steps": ["step1" , "step2"]
  }
  `;
  const response = await askLLM(prompt);

  const jsonMatch = response.match(/\{[\s\S]*\}/);

  const parsed = JSON.parse(jsonMatch![0]);

  return PlanSchema.parse(parsed);
}
