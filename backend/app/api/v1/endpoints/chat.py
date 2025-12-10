from fastapi import APIRouter, Depends, HTTPException, Header
from sqlalchemy.ext.asyncio import AsyncSession
from pydantic import BaseModel
import openai

from app.core.database import get_db
from app.core.security import get_current_user
from app.core.config import settings
from app.models.user import User

router = APIRouter()

class ChatRequest(BaseModel):
    message: str
    context: list = []

class ChatResponse(BaseModel):
    response: str

SYSTEM_PROMPT = """You are ReficulBot's AI assistant. You help users navigate and use the ReficulBot platform effectively.

ReficulBot is an AI-powered customer engagement platform that provides:
- AI Agents: Create and customize AI chatbots for customer support
- Inbox: Unified inbox for all customer conversations across channels
- CRM: Manage contacts, deals, and customer relationships
- Flows: Visual automation builder for customer journeys
- Broadcasts: Send bulk messages to customers
- Analytics: Track performance and engagement metrics
- Knowledge Base: Store and retrieve information for AI agents

Be helpful, concise, and guide users to the right features for their needs."""

@router.post("/message", response_model=ChatResponse)
async def send_chat_message(
    chat_data: ChatRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    if not settings.OPENAI_API_KEY:
        raise HTTPException(status_code=500, detail="OpenAI API key not configured")
    
    client = openai.AsyncOpenAI(api_key=settings.OPENAI_API_KEY)
    
    messages = [
        {"role": "system", "content": SYSTEM_PROMPT},
        *chat_data.context,
        {"role": "user", "content": chat_data.message}
    ]
    
    try:
        response = await client.chat.completions.create(
            model="gpt-4",
            messages=messages,
            temperature=0.7,
            max_tokens=500
        )
        
        return ChatResponse(response=response.choices[0].message.content)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI error: {str(e)}")
