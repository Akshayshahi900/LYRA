from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from scraper import web_search

app = FastAPI()

# Pydantic model — proper validation, not raw dict
class SearchRequest(BaseModel):
    query: str
    deep: bool = False          # defaults to fast mode

@app.post("/search")
def search(req: SearchRequest):
    if not req.query.strip():
        raise HTTPException(status_code=400, detail="Query cannot be empty")
    return web_search(req.query, deep=req.deep)

@app.get("/health")
def health():
    return {"status": "ok", "agent": "web"}
