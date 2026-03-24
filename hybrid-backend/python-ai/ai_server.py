"""
🧠 AETERNA AI SERVER - Python Component
DeepSeek AI + Stripe + Business Logic
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import httpx
import os

app = FastAPI(title="AETERNA AI Engine", version="2.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

DEEPSEEK_API_KEY = os.getenv("DEEPSEEK_API_KEY", "sk-2fbc148564eb48c28576314d2fa89a30")

class ChatRequest(BaseModel):
    message: str
    context: str = ""

class ChatResponse(BaseModel):
    response: str
    model: str = "deepseek-chat"

@app.get("/health")
async def health():
    return {"status": "healthy", "engine": "python-ai"}

@app.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    """Process chat with DeepSeek AI"""
    async with httpx.AsyncClient(timeout=30.0) as client:
        try:
            response = await client.post(
                "https://api.deepseek.com/v1/chat/completions",
                headers={
                    "Authorization": f"Bearer {DEEPSEEK_API_KEY}",
                    "Content-Type": "application/json"
                },
                json={
                    "model": "deepseek-chat",
                    "messages": [
                        {
                            "role": "system",
                            "content": "You are QAntum, an advanced AI assistant. Part of the AETERNA system. Respond concisely."
                        },
                        {
                            "role": "user", 
                            "content": request.message
                        }
                    ],
                    "max_tokens": 1000,
                    "temperature": 0.7
                }
            )
            
            data = response.json()
            ai_response = data["choices"][0]["message"]["content"]
            
            return ChatResponse(response=ai_response)
            
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))

@app.post("/analyze")
async def analyze(request: ChatRequest):
    """Deep analysis with reasoning"""
    async with httpx.AsyncClient(timeout=60.0) as client:
        try:
            response = await client.post(
                "https://api.deepseek.com/v1/chat/completions",
                headers={
                    "Authorization": f"Bearer {DEEPSEEK_API_KEY}",
                    "Content-Type": "application/json"
                },
                json={
                    "model": "deepseek-reasoner",
                    "messages": [
                        {
                            "role": "system",
                            "content": "You are a deep reasoning AI. Analyze thoroughly and provide structured insights."
                        },
                        {
                            "role": "user",
                            "content": request.message
                        }
                    ],
                    "max_tokens": 2000
                }
            )
            
            data = response.json()
            return {"analysis": data["choices"][0]["message"]["content"]}
            
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))
