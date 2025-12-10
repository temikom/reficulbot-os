from sqlalchemy import Column, String, Text, DateTime, ForeignKey, Boolean, JSON, Integer
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from datetime import datetime
import uuid

from app.core.database import Base

class Flow(Base):
    __tablename__ = "flows"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    workspace_id = Column(UUID(as_uuid=True), ForeignKey("workspaces.id", ondelete="CASCADE"), nullable=False)
    
    name = Column(String(255), nullable=False)
    description = Column(Text)
    trigger_type = Column(String(100))  # keyword, first_message, scheduled, etc.
    trigger_config = Column(JSON, default=dict)
    
    is_active = Column(Boolean, default=False)
    version = Column(Integer, default=1)
    
    # Stats
    total_executions = Column(Integer, default=0)
    successful_executions = Column(Integer, default=0)
    
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    workspace = relationship("Workspace", back_populates="flows")
    nodes = relationship("FlowNode", back_populates="flow", order_by="FlowNode.order")

class FlowNode(Base):
    __tablename__ = "flow_nodes"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    flow_id = Column(UUID(as_uuid=True), ForeignKey("flows.id", ondelete="CASCADE"), nullable=False)
    
    node_type = Column(String(100), nullable=False)  # message, condition, delay, action, etc.
    name = Column(String(255))
    config = Column(JSON, default=dict)
    position_x = Column(Integer, default=0)
    position_y = Column(Integer, default=0)
    order = Column(Integer, default=0)
    
    # Connections
    next_node_id = Column(UUID(as_uuid=True), ForeignKey("flow_nodes.id", ondelete="SET NULL"))
    true_branch_node_id = Column(UUID(as_uuid=True), ForeignKey("flow_nodes.id", ondelete="SET NULL"))
    false_branch_node_id = Column(UUID(as_uuid=True), ForeignKey("flow_nodes.id", ondelete="SET NULL"))
    
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    flow = relationship("Flow", back_populates="nodes")
