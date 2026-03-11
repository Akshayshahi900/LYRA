import { askLLM } from "./llm";

export async function routeIntent(input: string) {
  const prompt = `
  Classify the user request.

  Categories:
  search
  file
  system
  conversation

  User:${input}
  Respond with one word.
  `;

  const result = await askLLM(prompt);

  return result.trim();
}
