from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime
from uuid import UUID

class NotificationSettings(BaseModel):
    email_notifications: bool = True
    push_notifications: bool = True
    new_conversation_alert: bool = True
    new_message_alert: bool = True
    daily_digest: bool = False
    weekly_report: bool = True

class SecuritySettings(BaseModel):
    two_factor_enabled: bool = False
    session_timeout_minutes: int = Field(60, ge=15, le=1440)
    ip_whitelist: List[str] = []

class APIKeyCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=255)
    expires_in_days: Optional[int] = Field(None, ge=1, le=365)

class APIKeyResponse(BaseModel):
    id: UUID
    name: str
    key_prefix: str
    is_active: bool
    last_used_at: Optional[datetime]
    expires_at: Optional[datetime]
    created_at: datetime
    
    class Config:
        from_attributes = True

class APIKeyCreatedResponse(APIKeyResponse):
    key: str  # Full key, only shown once on creation

class SettingsResponse(BaseModel):
    notifications: NotificationSettings
    security: SecuritySettings
