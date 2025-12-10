from sqlalchemy import Column, String, Text, Boolean, DateTime, ForeignKey, Integer, Float, JSON
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from datetime import datetime
import uuid

from app.core.database import Base

class Agent(Base):
    __tablename__ = "agents"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    workspace_id = Column(UUID(as_uuid=True), ForeignKey("workspaces.id", ondelete="CASCADE"), nullable=False)
    name = Column(String(255), nullable=False)
    description = Column(Text)
    avatar_url = Column(String(500))
    system_prompt = Column(Text)
    model = Column(String(100), default="gpt-4")
    temperature = Column(Float, default=0.7)
    max_tokens = Column(Integer, default=1000)
    is_active = Column(Boolean, default=True)
    
    # Escalation settings
    escalation_enabled = Column(Boolean, default=False)
    escalation_keywords = Column(JSON, default=list)
    escalation_email = Column(String(255))
    
    # Stats
    total_conversations = Column(Integer, default=0)
    accuracy_rate = Column(Float, default=0.0)
    avg_response_time = Column(Float, default=0.0)
    
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    workspace = relationship("Workspace", back_populates="agents")
    knowledge_sources = relationship("AgentKnowledge", back_populates="agent")
    conversations = relationship("Conversation", back_populates="agent")

class AgentKnowledge(Base):
    __tablename__ = "agent_knowledge"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    agent_id = Column(UUID(as_uuid=True), ForeignKey("agents.id", ondelete="CASCADE"), nullable=False)
    knowledge_source_id = Column(UUID(as_uuid=True), ForeignKey("knowledge_sources.id", ondelete="CASCADE"), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    agent = relationship("Agent", back_populates="knowledge_sources")
    knowledge_source = relationship("KnowledgeSource")
