from sqlalchemy import Column, String, Text, DateTime, ForeignKey, Boolean, JSON, Integer, Enum as SQLEnum
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from datetime import datetime
import uuid
import enum

from app.core.database import Base

class AutomationStatus(str, enum.Enum):
    ACTIVE = "active"
    PAUSED = "paused"
    DRAFT = "draft"

class LogStatus(str, enum.Enum):
    SUCCESS = "success"
    FAILED = "failed"
    PENDING = "pending"

class Automation(Base):
    __tablename__ = "automations"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    workspace_id = Column(UUID(as_uuid=True), ForeignKey("workspaces.id", ondelete="CASCADE"), nullable=False)
    
    name = Column(String(255), nullable=False)
    description = Column(Text)
    
    # Trigger configuration
    trigger_type = Column(String(100), nullable=False)  # new_contact, keyword, scheduled, etc.
    trigger_config = Column(JSON, default=dict)
    
    # Actions
    actions = Column(JSON, default=list)  # Array of action objects
    
    # Conditions
    conditions = Column(JSON, default=list)
    
    status = Column(SQLEnum(AutomationStatus), default=AutomationStatus.DRAFT)
    
    # Stats
    total_executions = Column(Integer, default=0)
    successful_executions = Column(Integer, default=0)
    failed_executions = Column(Integer, default=0)
    
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    workspace = relationship("Workspace", back_populates="automations")
    logs = relationship("AutomationLog", back_populates="automation")

class AutomationLog(Base):
    __tablename__ = "automation_logs"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    automation_id = Column(UUID(as_uuid=True), ForeignKey("automations.id", ondelete="CASCADE"), nullable=False)
    
    status = Column(SQLEnum(LogStatus), default=LogStatus.PENDING)
    trigger_data = Column(JSON)
    execution_data = Column(JSON)
    error_message = Column(Text)
    
    started_at = Column(DateTime, default=datetime.utcnow)
    completed_at = Column(DateTime)
    
    # Relationships
    automation = relationship("Automation", back_populates="logs")
