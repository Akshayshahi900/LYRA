import express from "express";
import { fileAgent } from "./fileAgent";

const app = express();
app.use(express.json());

app.post("/action", async (req, res) => {
  try {
    const { action, payload } = req.body;
    const result = await fileAgent(action, payload);
    res.json({ result });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/health", (_req, res) => res.json({ status: "ok", service: "file-agent" }));

const PORT = process.env.FILE_AGENT_PORT ?? 8002;
app.listen(PORT, () => console.log(`LYRA file-agent running on :${PORT}`));
