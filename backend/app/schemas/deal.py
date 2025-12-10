from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime
from uuid import UUID
from enum import Enum

class DealStage(str, Enum):
    LEAD = "lead"
    QUALIFIED = "qualified"
    PROPOSAL = "proposal"
    NEGOTIATION = "negotiation"
    CLOSED_WON = "closed_won"
    CLOSED_LOST = "closed_lost"

class DealCreate(BaseModel):
    title: str = Field(..., min_length=1, max_length=255)
    description: Optional[str] = None
    contact_id: Optional[UUID] = None
    value: float = Field(0.0, ge=0)
    currency: str = Field("USD", max_length=3)
    stage: DealStage = DealStage.LEAD
    probability: float = Field(0.0, ge=0, le=100)
    expected_close_date: Optional[datetime] = None

class DealUpdate(BaseModel):
    title: Optional[str] = Field(None, max_length=255)
    description: Optional[str] = None
    contact_id: Optional[UUID] = None
    assigned_user_id: Optional[UUID] = None
    value: Optional[float] = Field(None, ge=0)
    currency: Optional[str] = Field(None, max_length=3)
    stage: Optional[DealStage] = None
    probability: Optional[float] = Field(None, ge=0, le=100)
    expected_close_date: Optional[datetime] = None

class DealResponse(BaseModel):
    id: UUID
    workspace_id: UUID
    contact_id: Optional[UUID]
    assigned_user_id: Optional[UUID]
    title: str
    description: Optional[str]
    value: float
    currency: str
    stage: DealStage
    probability: float
    expected_close_date: Optional[datetime]
    closed_at: Optional[datetime]
    created_at: datetime
    updated_at: datetime
    contact_name: Optional[str] = None
    
    class Config:
        from_attributes = True
