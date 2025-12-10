from sqlalchemy import Column, String, Text, DateTime, ForeignKey, Integer, Enum as SQLEnum, Boolean
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from datetime import datetime
import uuid
import enum

from app.core.database import Base

class SourceType(str, enum.Enum):
    DOCUMENT = "document"
    WEBSITE = "website"
    TEXT = "text"
    FAQ = "faq"

class ProcessingStatus(str, enum.Enum):
    PENDING = "pending"
    PROCESSING = "processing"
    COMPLETED = "completed"
    FAILED = "failed"

class KnowledgeSource(Base):
    __tablename__ = "knowledge_sources"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    workspace_id = Column(UUID(as_uuid=True), ForeignKey("workspaces.id", ondelete="CASCADE"), nullable=False)
    
    name = Column(String(255), nullable=False)
    source_type = Column(SQLEnum(SourceType), nullable=False)
    
    # Source details
    file_url = Column(String(500))
    file_name = Column(String(255))
    file_size = Column(Integer)
    website_url = Column(String(500))
    text_content = Column(Text)
    
    # Processing
    status = Column(SQLEnum(ProcessingStatus), default=ProcessingStatus.PENDING)
    chunk_count = Column(Integer, default=0)
    token_count = Column(Integer, default=0)
    error_message = Column(Text)
    
    # Vector store reference
    vector_collection_id = Column(String(255))
    
    is_active = Column(Boolean, default=True)
    last_synced_at = Column(DateTime)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    workspace = relationship("Workspace", back_populates="knowledge_sources")
