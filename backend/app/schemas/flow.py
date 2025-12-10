from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import datetime
from uuid import UUID

class FlowNodeCreate(BaseModel):
    node_type: str = Field(..., max_length=100)
    name: Optional[str] = Field(None, max_length=255)
    config: Dict[str, Any] = {}
    position_x: int = 0
    position_y: int = 0
    order: int = 0
    next_node_id: Optional[UUID] = None
    true_branch_node_id: Optional[UUID] = None
    false_branch_node_id: Optional[UUID] = None

class FlowNodeUpdate(BaseModel):
    node_type: Optional[str] = Field(None, max_length=100)
    name: Optional[str] = Field(None, max_length=255)
    config: Optional[Dict[str, Any]] = None
    position_x: Optional[int] = None
    position_y: Optional[int] = None
    order: Optional[int] = None
    next_node_id: Optional[UUID] = None
    true_branch_node_id: Optional[UUID] = None
    false_branch_node_id: Optional[UUID] = None

class FlowNodeResponse(BaseModel):
    id: UUID
    flow_id: UUID
    node_type: str
    name: Optional[str]
    config: Dict[str, Any]
    position_x: int
    position_y: int
    order: int
    next_node_id: Optional[UUID]
    true_branch_node_id: Optional[UUID]
    false_branch_node_id: Optional[UUID]
    created_at: datetime
    
    class Config:
        from_attributes = True

class FlowCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=255)
    description: Optional[str] = None
    trigger_type: Optional[str] = Field(None, max_length=100)
    trigger_config: Dict[str, Any] = {}

class FlowUpdate(BaseModel):
    name: Optional[str] = Field(None, max_length=255)
    description: Optional[str] = None
    trigger_type: Optional[str] = Field(None, max_length=100)
    trigger_config: Optional[Dict[str, Any]] = None
    is_active: Optional[bool] = None

class FlowResponse(BaseModel):
    id: UUID
    workspace_id: UUID
    name: str
    description: Optional[str]
    trigger_type: Optional[str]
    trigger_config: Dict[str, Any]
    is_active: bool
    version: int
    total_executions: int
    successful_executions: int
    nodes: List[FlowNodeResponse] = []
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True
