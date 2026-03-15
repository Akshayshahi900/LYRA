import express from "express";
import axios from "axios";

const app = express();
app.use(express.json());

const ORCHESTRATOR_URL = process.env.ORCHESTRATOR_URL ?? "http://localhost:3001";

app.post("/ask", async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) { res.status(400).json({ error: "message is required" }); return; }
    const response = await axios.post(`${ORCHESTRATOR_URL}/ask`, { message });
    res.json(response.data);
  } catch (err: any) {
    res.status(500).json({ error: err.message ?? "Gateway error" });
  }
});

app.get("/health", (_req, res) => res.json({ status: "ok", service: "gateway" }));

const PORT = process.env.GATEWAY_PORT ?? 3000;
app.listen(PORT, () => console.log(`LYRA gateway running on :${PORT}`));
