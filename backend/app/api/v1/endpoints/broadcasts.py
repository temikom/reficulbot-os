from fastapi import APIRouter, Depends, HTTPException, status, Header, Query, BackgroundTasks
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List, Optional
from datetime import datetime

from app.core.database import get_db
from app.core.security import get_current_user
from app.models.user import User
from app.models.broadcast import Broadcast, BroadcastRecipient, BroadcastStatus
from app.models.contact import Contact
from app.schemas.broadcast import (
    BroadcastCreate, 
    BroadcastUpdate, 
    BroadcastResponse,
    BroadcastSchedule,
    BroadcastStatsResponse
)

router = APIRouter()

async def send_broadcast_messages(broadcast_id: str, db: AsyncSession):
    """Background task to send broadcast messages"""
    # TODO: Implement actual message sending via channels
    pass

@router.get("", response_model=List[BroadcastResponse])
async def list_broadcasts(
    x_workspace_id: str = Header(...),
    status: Optional[BroadcastStatus] = None,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    query = select(Broadcast).where(Broadcast.workspace_id == x_workspace_id)
    
    if status:
        query = query.where(Broadcast.status == status)
    
    result = await db.execute(query)
    return result.scalars().all()

@router.post("", response_model=BroadcastResponse, status_code=status.HTTP_201_CREATED)
async def create_broadcast(
    broadcast_data: BroadcastCreate,
    x_workspace_id: str = Header(...),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    broadcast = Broadcast(
        workspace_id=x_workspace_id,
        **broadcast_data.model_dump()
    )
    db.add(broadcast)
    await db.commit()
    await db.refresh(broadcast)
    
    return broadcast

@router.get("/{broadcast_id}", response_model=BroadcastResponse)
async def get_broadcast(
    broadcast_id: str,
    x_workspace_id: str = Header(...),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(
        select(Broadcast).where(
            Broadcast.id == broadcast_id,
            Broadcast.workspace_id == x_workspace_id
        )
    )
    broadcast = result.scalar_one_or_none()
    
    if not broadcast:
        raise HTTPException(status_code=404, detail="Broadcast not found")
    
    return broadcast

@router.put("/{broadcast_id}", response_model=BroadcastResponse)
async def update_broadcast(
    broadcast_id: str,
    broadcast_data: BroadcastUpdate,
    x_workspace_id: str = Header(...),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(
        select(Broadcast).where(
            Broadcast.id == broadcast_id,
            Broadcast.workspace_id == x_workspace_id
        )
    )
    broadcast = result.scalar_one_or_none()
    
    if not broadcast:
        raise HTTPException(status_code=404, detail="Broadcast not found")
    
    if broadcast.status not in [BroadcastStatus.DRAFT, BroadcastStatus.SCHEDULED]:
        raise HTTPException(status_code=400, detail="Cannot update sent broadcast")
    
    for field, value in broadcast_data.model_dump(exclude_unset=True).items():
        setattr(broadcast, field, value)
    
    await db.commit()
    await db.refresh(broadcast)
    
    return broadcast

@router.delete("/{broadcast_id}")
async def delete_broadcast(
    broadcast_id: str,
    x_workspace_id: str = Header(...),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(
        select(Broadcast).where(
            Broadcast.id == broadcast_id,
            Broadcast.workspace_id == x_workspace_id
        )
    )
    broadcast = result.scalar_one_or_none()
    
    if not broadcast:
        raise HTTPException(status_code=404, detail="Broadcast not found")
    
    await db.delete(broadcast)
    await db.commit()
    
    return {"message": "Broadcast deleted"}

@router.post("/{broadcast_id}/send")
async def send_broadcast(
    broadcast_id: str,
    background_tasks: BackgroundTasks,
    x_workspace_id: str = Header(...),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(
        select(Broadcast).where(
            Broadcast.id == broadcast_id,
            Broadcast.workspace_id == x_workspace_id
        )
    )
    broadcast = result.scalar_one_or_none()
    
    if not broadcast:
        raise HTTPException(status_code=404, detail="Broadcast not found")
    
    if broadcast.status not in [BroadcastStatus.DRAFT, BroadcastStatus.SCHEDULED]:
        raise HTTPException(status_code=400, detail="Broadcast already sent or sending")
    
    # Get recipients based on audience filter
    contacts_query = select(Contact).where(Contact.workspace_id == x_workspace_id)
    
    # Apply audience filter
    if broadcast.audience_type == "tags" and broadcast.audience_filter.get("tags"):
        # Filter by tags - this is simplified, actual implementation might be more complex
        pass
    
    contacts_result = await db.execute(contacts_query)
    contacts = contacts_result.scalars().all()
    
    # Create recipients
    for contact in contacts:
        recipient = BroadcastRecipient(
            broadcast_id=broadcast_id,
            contact_id=contact.id
        )
        db.add(recipient)
    
    broadcast.status = BroadcastStatus.SENDING
    broadcast.total_recipients = len(contacts)
    broadcast.sent_at = datetime.utcnow()
    
    await db.commit()
    
    # Start background task to send messages
    background_tasks.add_task(send_broadcast_messages, broadcast_id, db)
    
    return {"message": f"Sending broadcast to {len(contacts)} recipients"}

@router.post("/{broadcast_id}/schedule")
async def schedule_broadcast(
    broadcast_id: str,
    schedule_data: BroadcastSchedule,
    x_workspace_id: str = Header(...),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(
        select(Broadcast).where(
            Broadcast.id == broadcast_id,
            Broadcast.workspace_id == x_workspace_id
        )
    )
    broadcast = result.scalar_one_or_none()
    
    if not broadcast:
        raise HTTPException(status_code=404, detail="Broadcast not found")
    
    if schedule_data.scheduled_at <= datetime.utcnow():
        raise HTTPException(status_code=400, detail="Scheduled time must be in the future")
    
    broadcast.status = BroadcastStatus.SCHEDULED
    broadcast.scheduled_at = schedule_data.scheduled_at
    
    await db.commit()
    
    return {"message": f"Broadcast scheduled for {schedule_data.scheduled_at}"}

@router.get("/{broadcast_id}/stats", response_model=BroadcastStatsResponse)
async def get_broadcast_stats(
    broadcast_id: str,
    x_workspace_id: str = Header(...),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(
        select(Broadcast).where(
            Broadcast.id == broadcast_id,
            Broadcast.workspace_id == x_workspace_id
        )
    )
    broadcast = result.scalar_one_or_none()
    
    if not broadcast:
        raise HTTPException(status_code=404, detail="Broadcast not found")
    
    return BroadcastStatsResponse(
        total_recipients=broadcast.total_recipients,
        sent_count=broadcast.sent_count,
        delivered_count=broadcast.delivered_count,
        read_count=broadcast.read_count,
        failed_count=broadcast.failed_count,
        open_rate=broadcast.open_rate,
        click_rate=broadcast.click_rate
    )
