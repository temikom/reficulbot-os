from sqlalchemy import Column, String, DateTime, ForeignKey, Enum as SQLEnum
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from datetime import datetime
import uuid
import enum

from app.core.database import Base

class MemberRole(str, enum.Enum):
    OWNER = "owner"
    ADMIN = "admin"
    MEMBER = "member"

class Workspace(Base):
    __tablename__ = "workspaces"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String(255), nullable=False)
    slug = Column(String(100), unique=True, index=True)
    logo_url = Column(String(500))
    owner_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    members = relationship("WorkspaceMember", back_populates="workspace")
    agents = relationship("Agent", back_populates="workspace")
    contacts = relationship("Contact", back_populates="workspace")
    deals = relationship("Deal", back_populates="workspace")
    conversations = relationship("Conversation", back_populates="workspace")
    flows = relationship("Flow", back_populates="workspace")
    automations = relationship("Automation", back_populates="workspace")
    broadcasts = relationship("Broadcast", back_populates="workspace")
    knowledge_sources = relationship("KnowledgeSource", back_populates="workspace")
    channels = relationship("Channel", back_populates="workspace")
    user_roles = relationship("UserRole", back_populates="workspace")

class WorkspaceMember(Base):
    __tablename__ = "workspace_members"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    workspace_id = Column(UUID(as_uuid=True), ForeignKey("workspaces.id", ondelete="CASCADE"), nullable=False)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    role = Column(SQLEnum(MemberRole), default=MemberRole.MEMBER)
    invited_at = Column(DateTime, default=datetime.utcnow)
    joined_at = Column(DateTime)
    
    # Relationships
    workspace = relationship("Workspace", back_populates="members")
    user = relationship("User", back_populates="workspace_memberships")
