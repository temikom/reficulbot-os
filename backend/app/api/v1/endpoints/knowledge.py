from fastapi import APIRouter, Depends, HTTPException, status, Header, UploadFile, File, BackgroundTasks
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List

from app.core.database import get_db
from app.core.security import get_current_user
from app.models.user import User
from app.models.knowledge import KnowledgeSource, SourceType, ProcessingStatus
from app.schemas.knowledge import (
    KnowledgeDocumentCreate,
    KnowledgeWebsiteCreate,
    KnowledgeTextCreate,
    KnowledgeSourceResponse,
    KnowledgeQueryRequest,
    KnowledgeQueryResponse
)

router = APIRouter()

async def process_knowledge_source(source_id: str, db: AsyncSession):
    """Background task to process and embed knowledge source"""
    # TODO: Implement actual document processing and embedding
    # 1. Extract text from document/website
    # 2. Split into chunks
    # 3. Generate embeddings
    # 4. Store in vector database (ChromaDB/Pinecone)
    pass

@router.get("", response_model=List[KnowledgeSourceResponse])
async def list_knowledge_sources(
    x_workspace_id: str = Header(...),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(
        select(KnowledgeSource).where(KnowledgeSource.workspace_id == x_workspace_id)
    )
    return result.scalars().all()

@router.post("/documents", response_model=KnowledgeSourceResponse, status_code=status.HTTP_201_CREATED)
async def upload_document(
    name: str,
    file: UploadFile = File(...),
    background_tasks: BackgroundTasks = None,
    x_workspace_id: str = Header(...),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    # Validate file type
    allowed_types = ["application/pdf", "text/plain", "application/msword", 
                     "application/vnd.openxmlformats-officedocument.wordprocessingml.document"]
    if file.content_type not in allowed_types:
        raise HTTPException(status_code=400, detail="Unsupported file type")
    
    # TODO: Upload file to S3 and get URL
    file_url = f"/uploads/knowledge/{x_workspace_id}/{file.filename}"
    
    source = KnowledgeSource(
        workspace_id=x_workspace_id,
        name=name,
        source_type=SourceType.DOCUMENT,
        file_url=file_url,
        file_name=file.filename,
        file_size=file.size,
        status=ProcessingStatus.PENDING
    )
    db.add(source)
    await db.commit()
    await db.refresh(source)
    
    # Start background processing
    if background_tasks:
        background_tasks.add_task(process_knowledge_source, str(source.id), db)
    
    return source

@router.post("/websites", response_model=KnowledgeSourceResponse, status_code=status.HTTP_201_CREATED)
async def add_website(
    website_data: KnowledgeWebsiteCreate,
    background_tasks: BackgroundTasks,
    x_workspace_id: str = Header(...),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    source = KnowledgeSource(
        workspace_id=x_workspace_id,
        name=website_data.name,
        source_type=SourceType.WEBSITE,
        website_url=website_data.website_url,
        status=ProcessingStatus.PENDING
    )
    db.add(source)
    await db.commit()
    await db.refresh(source)
    
    # Start background processing
    background_tasks.add_task(process_knowledge_source, str(source.id), db)
    
    return source

@router.post("/text", response_model=KnowledgeSourceResponse, status_code=status.HTTP_201_CREATED)
async def add_text_content(
    text_data: KnowledgeTextCreate,
    background_tasks: BackgroundTasks,
    x_workspace_id: str = Header(...),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    source = KnowledgeSource(
        workspace_id=x_workspace_id,
        name=text_data.name,
        source_type=SourceType.TEXT,
        text_content=text_data.text_content,
        status=ProcessingStatus.PENDING
    )
    db.add(source)
    await db.commit()
    await db.refresh(source)
    
    # Start background processing
    background_tasks.add_task(process_knowledge_source, str(source.id), db)
    
    return source

@router.get("/{source_id}", response_model=KnowledgeSourceResponse)
async def get_knowledge_source(
    source_id: str,
    x_workspace_id: str = Header(...),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(
        select(KnowledgeSource).where(
            KnowledgeSource.id == source_id,
            KnowledgeSource.workspace_id == x_workspace_id
        )
    )
    source = result.scalar_one_or_none()
    
    if not source:
        raise HTTPException(status_code=404, detail="Knowledge source not found")
    
    return source

@router.delete("/{source_id}")
async def delete_knowledge_source(
    source_id: str,
    x_workspace_id: str = Header(...),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(
        select(KnowledgeSource).where(
            KnowledgeSource.id == source_id,
            KnowledgeSource.workspace_id == x_workspace_id
        )
    )
    source = result.scalar_one_or_none()
    
    if not source:
        raise HTTPException(status_code=404, detail="Knowledge source not found")
    
    # TODO: Delete from vector database
    # TODO: Delete file from S3 if applicable
    
    await db.delete(source)
    await db.commit()
    
    return {"message": "Knowledge source deleted"}

@router.post("/query", response_model=KnowledgeQueryResponse)
async def query_knowledge(
    query_data: KnowledgeQueryRequest,
    x_workspace_id: str = Header(...),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    # TODO: Implement vector search
    # 1. Generate embedding for query
    # 2. Search vector database
    # 3. Return top_k results
    
    return KnowledgeQueryResponse(
        results=[],
        query=query_data.query
    )
