import openai
from typing import List, Dict, Optional
from app.core.config import settings

class AIService:
    def __init__(self):
        self.client = openai.AsyncOpenAI(api_key=settings.OPENAI_API_KEY)
    
    async def generate_response(
        self,
        messages: List[Dict[str, str]],
        system_prompt: str,
        model: str = "gpt-4",
        temperature: float = 0.7,
        max_tokens: int = 1000
    ) -> str:
        """Generate AI response for conversation"""
        full_messages = [
            {"role": "system", "content": system_prompt},
            *messages
        ]
        
        response = await self.client.chat.completions.create(
            model=model,
            messages=full_messages,
            temperature=temperature,
            max_tokens=max_tokens
        )
        
        return response.choices[0].message.content
    
    async def generate_embeddings(self, text: str) -> List[float]:
        """Generate embeddings for text"""
        response = await self.client.embeddings.create(
            model="text-embedding-ada-002",
            input=text
        )
        
        return response.data[0].embedding
    
    async def check_escalation(
        self,
        message: str,
        keywords: List[str]
    ) -> bool:
        """Check if message requires escalation"""
        message_lower = message.lower()
        
        for keyword in keywords:
            if keyword.lower() in message_lower:
                return True
        
        return False

ai_service = AIService()
