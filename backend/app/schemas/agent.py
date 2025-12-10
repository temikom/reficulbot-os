from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime
from uuid import UUID

class AgentCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=255)
    description: Optional[str] = None
    system_prompt: Optional[str] = None
    model: str = "gpt-4"
    temperature: float = Field(0.7, ge=0, le=2)
    max_tokens: int = Field(1000, ge=100, le=4000)

class AgentUpdate(BaseModel):
    name: Optional[str] = Field(None, max_length=255)
    description: Optional[str] = None
    avatar_url: Optional[str] = None
    system_prompt: Optional[str] = None
    model: Optional[str] = None
    temperature: Optional[float] = Field(None, ge=0, le=2)
    max_tokens: Optional[int] = Field(None, ge=100, le=4000)
    is_active: Optional[bool] = None
    escalation_enabled: Optional[bool] = None
    escalation_keywords: Optional[List[str]] = None
    escalation_email: Optional[str] = None

class AgentResponse(BaseModel):
    id: UUID
    workspace_id: UUID
    name: str
    description: Optional[str]
    avatar_url: Optional[str]
    system_prompt: Optional[str]
    model: str
    temperature: float
    max_tokens: int
    is_active: bool
    escalation_enabled: bool
    escalation_keywords: List[str]
    escalation_email: Optional[str]
    total_conversations: int
    accuracy_rate: float
    avg_response_time: float
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True

class AgentTestRequest(BaseModel):
    message: str = Field(..., min_length=1, max_length=1000)

class AgentTestResponse(BaseModel):
    response: str
    tokens_used: int
