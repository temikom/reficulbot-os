from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime
from uuid import UUID
from enum import Enum

class PlanType(str, Enum):
    FREE = "free"
    STARTER = "starter"
    PROFESSIONAL = "professional"
    ENTERPRISE = "enterprise"

class SubscriptionStatus(str, Enum):
    ACTIVE = "active"
    CANCELED = "canceled"
    PAST_DUE = "past_due"
    TRIALING = "trialing"

class InvoiceStatus(str, Enum):
    DRAFT = "draft"
    OPEN = "open"
    PAID = "paid"
    VOID = "void"
    UNCOLLECTIBLE = "uncollectible"

class SubscribeRequest(BaseModel):
    plan: PlanType
    payment_method_id: Optional[str] = None

class SubscriptionResponse(BaseModel):
    id: UUID
    workspace_id: UUID
    plan: PlanType
    status: SubscriptionStatus
    current_period_start: Optional[datetime]
    current_period_end: Optional[datetime]
    cancel_at_period_end: bool
    monthly_messages_limit: float
    monthly_messages_used: float
    created_at: datetime
    
    class Config:
        from_attributes = True

class InvoiceResponse(BaseModel):
    id: UUID
    workspace_id: UUID
    amount: float
    currency: str
    status: InvoiceStatus
    invoice_pdf: Optional[str]
    hosted_invoice_url: Optional[str]
    period_start: Optional[datetime]
    period_end: Optional[datetime]
    due_date: Optional[datetime]
    paid_at: Optional[datetime]
    created_at: datetime
    
    class Config:
        from_attributes = True

class PaymentMethodRequest(BaseModel):
    payment_method_id: str

class PlanDetails(BaseModel):
    plan: PlanType
    name: str
    price_monthly: float
    price_yearly: float
    features: List[str]
    messages_limit: int
    agents_limit: int
    team_members_limit: int
