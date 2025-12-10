from sqlalchemy import Column, String, Text, DateTime, ForeignKey, Integer, JSON, Enum as SQLEnum
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from datetime import datetime
import uuid
import enum

from app.core.database import Base

class ContactStage(str, enum.Enum):
    LEAD = "lead"
    PROSPECT = "prospect"
    CUSTOMER = "customer"
    CHURNED = "churned"

class Contact(Base):
    __tablename__ = "contacts"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    workspace_id = Column(UUID(as_uuid=True), ForeignKey("workspaces.id", ondelete="CASCADE"), nullable=False)
    
    # Basic info
    first_name = Column(String(100))
    last_name = Column(String(100))
    email = Column(String(255), index=True)
    phone = Column(String(50), index=True)
    avatar_url = Column(String(500))
    
    # Company info
    company = Column(String(255))
    job_title = Column(String(255))
    
    # Channel identifiers
    whatsapp_id = Column(String(100))
    instagram_id = Column(String(100))
    messenger_id = Column(String(100))
    
    # CRM fields
    stage = Column(SQLEnum(ContactStage), default=ContactStage.LEAD)
    lead_score = Column(Integer, default=0)
    tags = Column(JSON, default=list)
    custom_fields = Column(JSON, default=dict)
    
    notes = Column(Text)
    last_contacted_at = Column(DateTime)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    workspace = relationship("Workspace", back_populates="contacts")
    conversations = relationship("Conversation", back_populates="contact")
    deals = relationship("Deal", back_populates="contact")
