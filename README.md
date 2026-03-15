# LYRA — A Local Personal Ai Assistant

## Architecture
```
lyra/
├── docker-compose.yml
├── .env
├── gateway/           ← TypeScript :3000  (public entry point)
├── orchestrator/      ← TypeScript :3001  (router, planner, agentRunner)
├── llm-service/       ← TypeScript :4000  (Ollama wrapper)
└── agents/
    ├── web/           ← Python    :8001  (DuckDuckGo + Playwright)
    ├── file/          ← TypeScript :8002  (fs read/write/search)
    ├── os/            ← TypeScript :8003  (safe shell commands)
    ├── voice/         ← Python    :8004  (stub — not yet built)
    └── camera/        ← Python    :8005  (stub — not yet built)
```

## Quick Start (Docker)
```bash
docker-compose up --build
curl -X POST http://localhost:3000/ask \
  -H "Content-Type: application/json" \
  -d '{"message": "latest AI news"}'
```

## Dev (no Docker) — run each service independently
```bash
# Orchestrator
cd orchestrator && npm install && npm run dev

# Web Agent
cd agents/web
pip install -r requirements.txt
playwright install chromium
uvicorn main:app --port 8001

# File Agent
cd agents/file && npm install && npm run dev

# OS Agent
cd agents/os && npm install && npm run dev
```

## Bugs fixed from your original files
| File | Bug | Fix |
|------|-----|-----|
| `agentRunner.ts` | `file` intent branch was cut off mid-line | Completed with `callAgent("file", "/action", ...)` |
| `fileTools.ts` | `searchFiles` filter missing `return` (silent bug — always returned `[]`) | Added `return` in the callback |
| `server.ts` (orchestrator) | Port 3000 clashed with gateway | Changed to 3001 |
| `fileAgent.ts` | Imported `askLLM` from `../../orchestrator/src/llm` (broken path in new structure) | Removed — file agent doesn't need LLM |
