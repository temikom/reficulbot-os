from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime
from uuid import UUID
from enum import Enum

class MemberRole(str, Enum):
    OWNER = "owner"
    ADMIN = "admin"
    MEMBER = "member"

class WorkspaceCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=255)

class WorkspaceUpdate(BaseModel):
    name: Optional[str] = Field(None, max_length=255)
    logo_url: Optional[str] = None

class WorkspaceResponse(BaseModel):
    id: UUID
    name: str
    slug: str
    logo_url: Optional[str]
    owner_id: UUID
    created_at: datetime
    
    class Config:
        from_attributes = True

class WorkspaceMemberResponse(BaseModel):
    id: UUID
    user_id: UUID
    role: MemberRole
    joined_at: Optional[datetime]
    user_email: Optional[str] = None
    user_name: Optional[str] = None
    
    class Config:
        from_attributes = True

class InviteMemberRequest(BaseModel):
    email: str
    role: MemberRole = MemberRole.MEMBER
