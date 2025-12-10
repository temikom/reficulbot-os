from pydantic import BaseModel, Field
from typing import Optional, Dict, Any
from datetime import datetime
from uuid import UUID
from enum import Enum

class BroadcastStatus(str, Enum):
    DRAFT = "draft"
    SCHEDULED = "scheduled"
    SENDING = "sending"
    SENT = "sent"
    FAILED = "failed"

class BroadcastCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=255)
    channel: str = Field(..., max_length=50)
    message_content: str = Field(..., min_length=1, max_length=5000)
    media_url: Optional[str] = None
    template_id: Optional[str] = None
    audience_type: str = Field("all", max_length=50)
    audience_filter: Dict[str, Any] = {}

class BroadcastUpdate(BaseModel):
    name: Optional[str] = Field(None, max_length=255)
    message_content: Optional[str] = Field(None, max_length=5000)
    media_url: Optional[str] = None
    audience_type: Optional[str] = Field(None, max_length=50)
    audience_filter: Optional[Dict[str, Any]] = None

class BroadcastSchedule(BaseModel):
    scheduled_at: datetime

class BroadcastResponse(BaseModel):
    id: UUID
    workspace_id: UUID
    name: str
    channel: str
    message_content: str
    media_url: Optional[str]
    template_id: Optional[str]
    audience_type: str
    audience_filter: Dict[str, Any]
    status: BroadcastStatus
    scheduled_at: Optional[datetime]
    sent_at: Optional[datetime]
    total_recipients: int
    sent_count: int
    delivered_count: int
    read_count: int
    failed_count: int
    open_rate: float
    click_rate: float
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True

class BroadcastStatsResponse(BaseModel):
    total_recipients: int
    sent_count: int
    delivered_count: int
    read_count: int
    failed_count: int
    open_rate: float
    click_rate: float
