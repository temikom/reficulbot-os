from fastapi import APIRouter, Depends, HTTPException, status, Header
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List
import secrets
import hashlib
from datetime import datetime, timedelta

from app.core.database import get_db
from app.core.security import get_current_user
from app.models.user import User
from app.models.api_key import APIKey
from app.schemas.settings import (
    NotificationSettings,
    SecuritySettings,
    APIKeyCreate,
    APIKeyResponse,
    APIKeyCreatedResponse,
    SettingsResponse
)

router = APIRouter()

@router.get("", response_model=SettingsResponse)
async def get_settings(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    # TODO: Load from database
    return SettingsResponse(
        notifications=NotificationSettings(),
        security=SecuritySettings()
    )

@router.put("/notifications", response_model=NotificationSettings)
async def update_notification_settings(
    settings_data: NotificationSettings,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    # TODO: Save to database
    return settings_data

@router.put("/security", response_model=SecuritySettings)
async def update_security_settings(
    settings_data: SecuritySettings,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    # TODO: Save to database
    return settings_data

@router.get("/api-keys", response_model=List[APIKeyResponse])
async def list_api_keys(
    x_workspace_id: str = Header(...),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(
        select(APIKey).where(
            APIKey.workspace_id == x_workspace_id,
            APIKey.user_id == current_user.id
        )
    )
    return result.scalars().all()

@router.post("/api-keys", response_model=APIKeyCreatedResponse, status_code=status.HTTP_201_CREATED)
async def create_api_key(
    key_data: APIKeyCreate,
    x_workspace_id: str = Header(...),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    # Generate API key
    raw_key = f"rb_{secrets.token_urlsafe(32)}"
    key_hash = hashlib.sha256(raw_key.encode()).hexdigest()
    key_prefix = raw_key[:10]
    
    expires_at = None
    if key_data.expires_in_days:
        expires_at = datetime.utcnow() + timedelta(days=key_data.expires_in_days)
    
    api_key = APIKey(
        workspace_id=x_workspace_id,
        user_id=current_user.id,
        name=key_data.name,
        key_prefix=key_prefix,
        key_hash=key_hash,
        expires_at=expires_at
    )
    db.add(api_key)
    await db.commit()
    await db.refresh(api_key)
    
    # Return with the full key (only shown once)
    return APIKeyCreatedResponse(
        id=api_key.id,
        name=api_key.name,
        key_prefix=api_key.key_prefix,
        key=raw_key,
        is_active=api_key.is_active,
        last_used_at=api_key.last_used_at,
        expires_at=api_key.expires_at,
        created_at=api_key.created_at
    )

@router.delete("/api-keys/{key_id}")
async def delete_api_key(
    key_id: str,
    x_workspace_id: str = Header(...),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(
        select(APIKey).where(
            APIKey.id == key_id,
            APIKey.workspace_id == x_workspace_id,
            APIKey.user_id == current_user.id
        )
    )
    api_key = result.scalar_one_or_none()
    
    if not api_key:
        raise HTTPException(status_code=404, detail="API key not found")
    
    await db.delete(api_key)
    await db.commit()
    
    return {"message": "API key deleted"}
