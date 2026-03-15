import express from "express";
import ollama from "ollama";

const app = express();
app.use(express.json());

const MODEL = process.env.OLLAMA_MODEL ?? "llama3.1:8b";

app.post("/chat", async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt) { res.status(400).json({ error: "prompt is required" }); return; }
    const response = await ollama.chat({
      model: MODEL,
      messages: [{ role: "user", content: prompt }],
    });
    res.json({ content: response.message.content });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/health", (_req, res) => res.json({ status: "ok", service: "llm-service", model: MODEL }));

const PORT = process.env.LLM_PORT ?? 4000;
app.listen(PORT, () => console.log(`LYRA llm-service running on :${PORT}`));
