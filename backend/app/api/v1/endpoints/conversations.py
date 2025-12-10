from fastapi import APIRouter, Depends, HTTPException, status, Header, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, desc
from typing import List, Optional

from app.core.database import get_db
from app.core.security import get_current_user
from app.models.user import User
from app.models.conversation import Conversation, Message, ConversationStatus, ChannelType
from app.schemas.conversation import (
    ConversationResponse, 
    ConversationUpdate, 
    MessageCreate, 
    MessageResponse,
    ConversationFilter
)

router = APIRouter()

@router.get("", response_model=List[ConversationResponse])
async def list_conversations(
    x_workspace_id: str = Header(...),
    status: Optional[ConversationStatus] = None,
    channel: Optional[ChannelType] = None,
    agent_id: Optional[str] = None,
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    query = select(Conversation).where(Conversation.workspace_id == x_workspace_id)
    
    if status:
        query = query.where(Conversation.status == status)
    if channel:
        query = query.where(Conversation.channel == channel)
    if agent_id:
        query = query.where(Conversation.agent_id == agent_id)
    
    query = query.order_by(desc(Conversation.last_message_at)).offset(skip).limit(limit)
    
    result = await db.execute(query)
    return result.scalars().all()

@router.get("/{conversation_id}", response_model=ConversationResponse)
async def get_conversation(
    conversation_id: str,
    x_workspace_id: str = Header(...),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(
        select(Conversation).where(
            Conversation.id == conversation_id,
            Conversation.workspace_id == x_workspace_id
        )
    )
    conversation = result.scalar_one_or_none()
    
    if not conversation:
        raise HTTPException(status_code=404, detail="Conversation not found")
    
    # Load messages
    messages_result = await db.execute(
        select(Message)
        .where(Message.conversation_id == conversation_id)
        .order_by(Message.created_at)
    )
    conversation.messages = messages_result.scalars().all()
    
    return conversation

@router.put("/{conversation_id}", response_model=ConversationResponse)
async def update_conversation(
    conversation_id: str,
    update_data: ConversationUpdate,
    x_workspace_id: str = Header(...),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(
        select(Conversation).where(
            Conversation.id == conversation_id,
            Conversation.workspace_id == x_workspace_id
        )
    )
    conversation = result.scalar_one_or_none()
    
    if not conversation:
        raise HTTPException(status_code=404, detail="Conversation not found")
    
    for field, value in update_data.model_dump(exclude_unset=True).items():
        setattr(conversation, field, value)
    
    await db.commit()
    await db.refresh(conversation)
    
    return conversation

@router.post("/{conversation_id}/messages", response_model=MessageResponse, status_code=status.HTTP_201_CREATED)
async def send_message(
    conversation_id: str,
    message_data: MessageCreate,
    x_workspace_id: str = Header(...),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(
        select(Conversation).where(
            Conversation.id == conversation_id,
            Conversation.workspace_id == x_workspace_id
        )
    )
    conversation = result.scalar_one_or_none()
    
    if not conversation:
        raise HTTPException(status_code=404, detail="Conversation not found")
    
    message = Message(
        conversation_id=conversation_id,
        role=message_data.role,
        content=message_data.content
    )
    db.add(message)
    
    # Update conversation last message time
    from datetime import datetime
    conversation.last_message_at = datetime.utcnow()
    
    await db.commit()
    await db.refresh(message)
    
    # TODO: Send message to channel (WhatsApp, Instagram, etc.)
    
    return message

@router.put("/{conversation_id}/assign")
async def assign_conversation(
    conversation_id: str,
    user_id: Optional[str] = None,
    agent_id: Optional[str] = None,
    x_workspace_id: str = Header(...),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(
        select(Conversation).where(
            Conversation.id == conversation_id,
            Conversation.workspace_id == x_workspace_id
        )
    )
    conversation = result.scalar_one_or_none()
    
    if not conversation:
        raise HTTPException(status_code=404, detail="Conversation not found")
    
    if user_id:
        conversation.assigned_user_id = user_id
    if agent_id:
        conversation.agent_id = agent_id
    
    await db.commit()
    
    return {"message": "Conversation assigned"}
