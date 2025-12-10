from sqlalchemy import Column, String, DateTime, ForeignKey, Float, Enum as SQLEnum, Boolean
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from datetime import datetime
import uuid
import enum

from app.core.database import Base

class PlanType(str, enum.Enum):
    FREE = "free"
    STARTER = "starter"
    PROFESSIONAL = "professional"
    ENTERPRISE = "enterprise"

class SubscriptionStatus(str, enum.Enum):
    ACTIVE = "active"
    CANCELED = "canceled"
    PAST_DUE = "past_due"
    TRIALING = "trialing"

class InvoiceStatus(str, enum.Enum):
    DRAFT = "draft"
    OPEN = "open"
    PAID = "paid"
    VOID = "void"
    UNCOLLECTIBLE = "uncollectible"

class Subscription(Base):
    __tablename__ = "subscriptions"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    workspace_id = Column(UUID(as_uuid=True), ForeignKey("workspaces.id", ondelete="CASCADE"), nullable=False, unique=True)
    
    # Stripe references
    stripe_customer_id = Column(String(255))
    stripe_subscription_id = Column(String(255))
    stripe_price_id = Column(String(255))
    
    plan = Column(SQLEnum(PlanType), default=PlanType.FREE)
    status = Column(SQLEnum(SubscriptionStatus), default=SubscriptionStatus.ACTIVE)
    
    # Billing details
    current_period_start = Column(DateTime)
    current_period_end = Column(DateTime)
    cancel_at_period_end = Column(Boolean, default=False)
    canceled_at = Column(DateTime)
    
    # Usage limits
    monthly_messages_limit = Column(Float, default=1000)
    monthly_messages_used = Column(Float, default=0)
    
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class Invoice(Base):
    __tablename__ = "invoices"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    workspace_id = Column(UUID(as_uuid=True), ForeignKey("workspaces.id", ondelete="CASCADE"), nullable=False)
    
    stripe_invoice_id = Column(String(255))
    
    amount = Column(Float, nullable=False)
    currency = Column(String(3), default="USD")
    status = Column(SQLEnum(InvoiceStatus), default=InvoiceStatus.DRAFT)
    
    invoice_pdf = Column(String(500))
    hosted_invoice_url = Column(String(500))
    
    period_start = Column(DateTime)
    period_end = Column(DateTime)
    due_date = Column(DateTime)
    paid_at = Column(DateTime)
    
    created_at = Column(DateTime, default=datetime.utcnow)
