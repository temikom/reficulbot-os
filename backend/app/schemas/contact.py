from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List, Dict, Any
from datetime import datetime
from uuid import UUID
from enum import Enum

class ContactStage(str, Enum):
    LEAD = "lead"
    PROSPECT = "prospect"
    CUSTOMER = "customer"
    CHURNED = "churned"

class ContactCreate(BaseModel):
    first_name: Optional[str] = Field(None, max_length=100)
    last_name: Optional[str] = Field(None, max_length=100)
    email: Optional[EmailStr] = None
    phone: Optional[str] = Field(None, max_length=50)
    company: Optional[str] = Field(None, max_length=255)
    job_title: Optional[str] = Field(None, max_length=255)
    stage: ContactStage = ContactStage.LEAD
    tags: List[str] = []
    notes: Optional[str] = None

class ContactUpdate(BaseModel):
    first_name: Optional[str] = Field(None, max_length=100)
    last_name: Optional[str] = Field(None, max_length=100)
    email: Optional[EmailStr] = None
    phone: Optional[str] = Field(None, max_length=50)
    company: Optional[str] = Field(None, max_length=255)
    job_title: Optional[str] = Field(None, max_length=255)
    stage: Optional[ContactStage] = None
    lead_score: Optional[int] = Field(None, ge=0, le=100)
    tags: Optional[List[str]] = None
    custom_fields: Optional[Dict[str, Any]] = None
    notes: Optional[str] = None

class ContactResponse(BaseModel):
    id: UUID
    workspace_id: UUID
    first_name: Optional[str]
    last_name: Optional[str]
    email: Optional[str]
    phone: Optional[str]
    avatar_url: Optional[str]
    company: Optional[str]
    job_title: Optional[str]
    stage: ContactStage
    lead_score: int
    tags: List[str]
    custom_fields: Dict[str, Any]
    notes: Optional[str]
    last_contacted_at: Optional[datetime]
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True

class ContactImportRequest(BaseModel):
    contacts: List[ContactCreate]
