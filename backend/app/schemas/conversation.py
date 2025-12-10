from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime
from uuid import UUID
from enum import Enum

class ConversationStatus(str, Enum):
    ACTIVE = "active"
    PENDING = "pending"
    RESOLVED = "resolved"
    ARCHIVED = "archived"

class ChannelType(str, Enum):
    WHATSAPP = "whatsapp"
    INSTAGRAM = "instagram"
    MESSENGER = "messenger"
    WEBCHAT = "webchat"
    EMAIL = "email"

class MessageRole(str, Enum):
    USER = "user"
    ASSISTANT = "assistant"
    SYSTEM = "system"

class MessageCreate(BaseModel):
    content: str = Field(..., min_length=1, max_length=5000)
    role: MessageRole = MessageRole.ASSISTANT

class MessageResponse(BaseModel):
    id: UUID
    conversation_id: UUID
    role: MessageRole
    content: str
    is_read: bool
    created_at: datetime
    
    class Config:
        from_attributes = True

class ConversationResponse(BaseModel):
    id: UUID
    workspace_id: UUID
    contact_id: Optional[UUID]
    agent_id: Optional[UUID]
    assigned_user_id: Optional[UUID]
    channel: ChannelType
    status: ConversationStatus
    subject: Optional[str]
    is_ai_enabled: bool
    last_message_at: Optional[datetime]
    created_at: datetime
    messages: List[MessageResponse] = []
    contact_name: Optional[str] = None
    
    class Config:
        from_attributes = True

class ConversationUpdate(BaseModel):
    status: Optional[ConversationStatus] = None
    assigned_user_id: Optional[UUID] = None
    is_ai_enabled: Optional[bool] = None

class ConversationFilter(BaseModel):
    status: Optional[ConversationStatus] = None
    channel: Optional[ChannelType] = None
    agent_id: Optional[UUID] = None
    assigned_user_id: Optional[UUID] = None
