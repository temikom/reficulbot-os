from sqlalchemy import Column, String, DateTime, ForeignKey, Boolean, JSON, Enum as SQLEnum
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from datetime import datetime
import uuid
import enum

from app.core.database import Base

class ChannelType(str, enum.Enum):
    WHATSAPP = "whatsapp"
    INSTAGRAM = "instagram"
    MESSENGER = "messenger"
    WEBCHAT = "webchat"

class ChannelStatus(str, enum.Enum):
    CONNECTED = "connected"
    DISCONNECTED = "disconnected"
    PENDING = "pending"
    ERROR = "error"

class Channel(Base):
    __tablename__ = "channels"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    workspace_id = Column(UUID(as_uuid=True), ForeignKey("workspaces.id", ondelete="CASCADE"), nullable=False)
    
    channel_type = Column(SQLEnum(ChannelType), nullable=False)
    name = Column(String(255), nullable=False)
    
    # Channel-specific identifiers
    external_id = Column(String(255))  # Phone number ID, page ID, etc.
    access_token = Column(String(1000))  # Encrypted
    refresh_token = Column(String(1000))
    
    # Configuration
    config = Column(JSON, default=dict)
    webhook_url = Column(String(500))
    webhook_secret = Column(String(255))
    
    status = Column(SQLEnum(ChannelStatus), default=ChannelStatus.PENDING)
    is_active = Column(Boolean, default=True)
    
    last_sync_at = Column(DateTime)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    workspace = relationship("Workspace", back_populates="channels")
