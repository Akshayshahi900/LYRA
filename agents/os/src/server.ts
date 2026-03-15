import express from "express";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);
const app = express();
app.use(express.json());

const ALLOWED = ["uptime", "df -h", "free -m", "uname -a", "date", "pwd", "ls"];

app.post("/run", async (req, res) => {
  const { command } = req.body;
  if (!ALLOWED.includes(command)) { res.status(403).json({ error: "Command not allowed" }); return; }
  try {
    const { stdout, stderr } = await execAsync(command);
    res.json({ stdout, stderr });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/health", (_req, res) => res.json({ status: "ok", service: "os-agent" }));

const PORT = process.env.OS_AGENT_PORT ?? 8003;
app.listen(PORT, () => console.log(`LYRA os-agent running on :${PORT}`));
