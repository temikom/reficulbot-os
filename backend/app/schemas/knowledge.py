from pydantic import BaseModel, Field, HttpUrl
from typing import Optional
from datetime import datetime
from uuid import UUID
from enum import Enum

class SourceType(str, Enum):
    DOCUMENT = "document"
    WEBSITE = "website"
    TEXT = "text"
    FAQ = "faq"

class ProcessingStatus(str, Enum):
    PENDING = "pending"
    PROCESSING = "processing"
    COMPLETED = "completed"
    FAILED = "failed"

class KnowledgeDocumentCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=255)
    # File will be uploaded separately

class KnowledgeWebsiteCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=255)
    website_url: str = Field(..., max_length=500)

class KnowledgeTextCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=255)
    text_content: str = Field(..., min_length=1, max_length=50000)

class KnowledgeSourceResponse(BaseModel):
    id: UUID
    workspace_id: UUID
    name: str
    source_type: SourceType
    file_url: Optional[str]
    file_name: Optional[str]
    file_size: Optional[int]
    website_url: Optional[str]
    status: ProcessingStatus
    chunk_count: int
    token_count: int
    error_message: Optional[str]
    is_active: bool
    last_synced_at: Optional[datetime]
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True

class KnowledgeQueryRequest(BaseModel):
    query: str = Field(..., min_length=1, max_length=1000)
    top_k: int = Field(5, ge=1, le=20)

class KnowledgeQueryResponse(BaseModel):
    results: list
    query: str
