from fastapi import APIRouter, Depends, HTTPException, status, Header
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List

from app.core.database import get_db
from app.core.security import get_current_user
from app.models.user import User
from app.models.channel import Channel, ChannelType, ChannelStatus

router = APIRouter()

@router.get("")
async def list_channels(
    x_workspace_id: str = Header(...),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(
        select(Channel).where(Channel.workspace_id == x_workspace_id)
    )
    channels = result.scalars().all()
    
    # Mask sensitive data
    return [
        {
            "id": str(channel.id),
            "channel_type": channel.channel_type.value,
            "name": channel.name,
            "status": channel.status.value,
            "is_active": channel.is_active,
            "created_at": channel.created_at
        }
        for channel in channels
    ]

@router.post("/whatsapp/connect")
async def connect_whatsapp(
    phone_number_id: str,
    access_token: str,
    x_workspace_id: str = Header(...),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    # Verify WhatsApp credentials
    # TODO: Validate with Meta API
    
    channel = Channel(
        workspace_id=x_workspace_id,
        channel_type=ChannelType.WHATSAPP,
        name=f"WhatsApp ({phone_number_id[-4:]})",
        external_id=phone_number_id,
        access_token=access_token,  # TODO: Encrypt before storing
        status=ChannelStatus.CONNECTED
    )
    db.add(channel)
    await db.commit()
    
    return {"message": "WhatsApp connected successfully", "channel_id": str(channel.id)}

@router.post("/instagram/connect")
async def connect_instagram(
    page_id: str,
    access_token: str,
    x_workspace_id: str = Header(...),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    # TODO: Validate with Meta API
    
    channel = Channel(
        workspace_id=x_workspace_id,
        channel_type=ChannelType.INSTAGRAM,
        name=f"Instagram ({page_id[-4:]})",
        external_id=page_id,
        access_token=access_token,
        status=ChannelStatus.CONNECTED
    )
    db.add(channel)
    await db.commit()
    
    return {"message": "Instagram connected successfully", "channel_id": str(channel.id)}

@router.post("/messenger/connect")
async def connect_messenger(
    page_id: str,
    access_token: str,
    x_workspace_id: str = Header(...),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    # TODO: Validate with Meta API
    
    channel = Channel(
        workspace_id=x_workspace_id,
        channel_type=ChannelType.MESSENGER,
        name=f"Messenger ({page_id[-4:]})",
        external_id=page_id,
        access_token=access_token,
        status=ChannelStatus.CONNECTED
    )
    db.add(channel)
    await db.commit()
    
    return {"message": "Messenger connected successfully", "channel_id": str(channel.id)}

@router.delete("/{channel_id}")
async def disconnect_channel(
    channel_id: str,
    x_workspace_id: str = Header(...),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(
        select(Channel).where(
            Channel.id == channel_id,
            Channel.workspace_id == x_workspace_id
        )
    )
    channel = result.scalar_one_or_none()
    
    if not channel:
        raise HTTPException(status_code=404, detail="Channel not found")
    
    await db.delete(channel)
    await db.commit()
    
    return {"message": "Channel disconnected"}

@router.put("/{channel_id}/toggle")
async def toggle_channel(
    channel_id: str,
    x_workspace_id: str = Header(...),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(
        select(Channel).where(
            Channel.id == channel_id,
            Channel.workspace_id == x_workspace_id
        )
    )
    channel = result.scalar_one_or_none()
    
    if not channel:
        raise HTTPException(status_code=404, detail="Channel not found")
    
    channel.is_active = not channel.is_active
    await db.commit()
    
    return {"message": f"Channel {'activated' if channel.is_active else 'deactivated'}"}
