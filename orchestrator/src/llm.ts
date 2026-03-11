import ollama from "ollama";

export async function askLLm(prompt: string) {
  const response = await ollama.chat({
    model: "llama3.1:8b",
    messages: [{ role: "user", content: prompt }],
  });
  return response.message.content;
}
