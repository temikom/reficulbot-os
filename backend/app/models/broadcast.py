from sqlalchemy import Column, String, Text, DateTime, ForeignKey, Integer, JSON, Enum as SQLEnum, Float
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from datetime import datetime
import uuid
import enum

from app.core.database import Base

class BroadcastStatus(str, enum.Enum):
    DRAFT = "draft"
    SCHEDULED = "scheduled"
    SENDING = "sending"
    SENT = "sent"
    FAILED = "failed"

class RecipientStatus(str, enum.Enum):
    PENDING = "pending"
    SENT = "sent"
    DELIVERED = "delivered"
    READ = "read"
    FAILED = "failed"

class Broadcast(Base):
    __tablename__ = "broadcasts"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    workspace_id = Column(UUID(as_uuid=True), ForeignKey("workspaces.id", ondelete="CASCADE"), nullable=False)
    
    name = Column(String(255), nullable=False)
    channel = Column(String(50), nullable=False)  # whatsapp, instagram, etc.
    
    # Content
    message_content = Column(Text, nullable=False)
    media_url = Column(String(500))
    template_id = Column(String(255))  # For WhatsApp templates
    
    # Audience
    audience_type = Column(String(50))  # all, segment, tags
    audience_filter = Column(JSON, default=dict)
    
    # Scheduling
    status = Column(SQLEnum(BroadcastStatus), default=BroadcastStatus.DRAFT)
    scheduled_at = Column(DateTime)
    sent_at = Column(DateTime)
    
    # Stats
    total_recipients = Column(Integer, default=0)
    sent_count = Column(Integer, default=0)
    delivered_count = Column(Integer, default=0)
    read_count = Column(Integer, default=0)
    failed_count = Column(Integer, default=0)
    open_rate = Column(Float, default=0.0)
    click_rate = Column(Float, default=0.0)
    
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    workspace = relationship("Workspace", back_populates="broadcasts")
    recipients = relationship("BroadcastRecipient", back_populates="broadcast")

class BroadcastRecipient(Base):
    __tablename__ = "broadcast_recipients"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    broadcast_id = Column(UUID(as_uuid=True), ForeignKey("broadcasts.id", ondelete="CASCADE"), nullable=False)
    contact_id = Column(UUID(as_uuid=True), ForeignKey("contacts.id", ondelete="SET NULL"))
    
    status = Column(SQLEnum(RecipientStatus), default=RecipientStatus.PENDING)
    channel_message_id = Column(String(255))
    sent_at = Column(DateTime)
    delivered_at = Column(DateTime)
    read_at = Column(DateTime)
    error_message = Column(Text)
    
    # Relationships
    broadcast = relationship("Broadcast", back_populates="recipients")
