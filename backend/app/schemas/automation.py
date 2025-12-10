from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import datetime
from uuid import UUID
from enum import Enum

class AutomationStatus(str, Enum):
    ACTIVE = "active"
    PAUSED = "paused"
    DRAFT = "draft"

class LogStatus(str, Enum):
    SUCCESS = "success"
    FAILED = "failed"
    PENDING = "pending"

class AutomationCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=255)
    description: Optional[str] = None
    trigger_type: str = Field(..., max_length=100)
    trigger_config: Dict[str, Any] = {}
    actions: List[Dict[str, Any]] = []
    conditions: List[Dict[str, Any]] = []

class AutomationUpdate(BaseModel):
    name: Optional[str] = Field(None, max_length=255)
    description: Optional[str] = None
    trigger_type: Optional[str] = Field(None, max_length=100)
    trigger_config: Optional[Dict[str, Any]] = None
    actions: Optional[List[Dict[str, Any]]] = None
    conditions: Optional[List[Dict[str, Any]]] = None
    status: Optional[AutomationStatus] = None

class AutomationResponse(BaseModel):
    id: UUID
    workspace_id: UUID
    name: str
    description: Optional[str]
    trigger_type: str
    trigger_config: Dict[str, Any]
    actions: List[Dict[str, Any]]
    conditions: List[Dict[str, Any]]
    status: AutomationStatus
    total_executions: int
    successful_executions: int
    failed_executions: int
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True

class AutomationLogResponse(BaseModel):
    id: UUID
    automation_id: UUID
    status: LogStatus
    trigger_data: Optional[Dict[str, Any]]
    execution_data: Optional[Dict[str, Any]]
    error_message: Optional[str]
    started_at: datetime
    completed_at: Optional[datetime]
    
    class Config:
        from_attributes = True
