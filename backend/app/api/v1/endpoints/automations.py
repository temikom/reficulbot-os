from fastapi import APIRouter, Depends, HTTPException, status, Header, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, desc
from typing import List, Optional

from app.core.database import get_db
from app.core.security import get_current_user
from app.models.user import User
from app.models.automation import Automation, AutomationLog, AutomationStatus
from app.schemas.automation import (
    AutomationCreate, 
    AutomationUpdate, 
    AutomationResponse,
    AutomationLogResponse
)

router = APIRouter()

@router.get("", response_model=List[AutomationResponse])
async def list_automations(
    x_workspace_id: str = Header(...),
    status: Optional[AutomationStatus] = None,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    query = select(Automation).where(Automation.workspace_id == x_workspace_id)
    
    if status:
        query = query.where(Automation.status == status)
    
    result = await db.execute(query)
    return result.scalars().all()

@router.post("", response_model=AutomationResponse, status_code=status.HTTP_201_CREATED)
async def create_automation(
    automation_data: AutomationCreate,
    x_workspace_id: str = Header(...),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    automation = Automation(
        workspace_id=x_workspace_id,
        **automation_data.model_dump()
    )
    db.add(automation)
    await db.commit()
    await db.refresh(automation)
    
    return automation

@router.get("/{automation_id}", response_model=AutomationResponse)
async def get_automation(
    automation_id: str,
    x_workspace_id: str = Header(...),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(
        select(Automation).where(
            Automation.id == automation_id,
            Automation.workspace_id == x_workspace_id
        )
    )
    automation = result.scalar_one_or_none()
    
    if not automation:
        raise HTTPException(status_code=404, detail="Automation not found")
    
    return automation

@router.put("/{automation_id}", response_model=AutomationResponse)
async def update_automation(
    automation_id: str,
    automation_data: AutomationUpdate,
    x_workspace_id: str = Header(...),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(
        select(Automation).where(
            Automation.id == automation_id,
            Automation.workspace_id == x_workspace_id
        )
    )
    automation = result.scalar_one_or_none()
    
    if not automation:
        raise HTTPException(status_code=404, detail="Automation not found")
    
    for field, value in automation_data.model_dump(exclude_unset=True).items():
        setattr(automation, field, value)
    
    await db.commit()
    await db.refresh(automation)
    
    return automation

@router.delete("/{automation_id}")
async def delete_automation(
    automation_id: str,
    x_workspace_id: str = Header(...),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(
        select(Automation).where(
            Automation.id == automation_id,
            Automation.workspace_id == x_workspace_id
        )
    )
    automation = result.scalar_one_or_none()
    
    if not automation:
        raise HTTPException(status_code=404, detail="Automation not found")
    
    await db.delete(automation)
    await db.commit()
    
    return {"message": "Automation deleted"}

@router.get("/{automation_id}/logs", response_model=List[AutomationLogResponse])
async def get_automation_logs(
    automation_id: str,
    x_workspace_id: str = Header(...),
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    # Verify automation exists
    result = await db.execute(
        select(Automation).where(
            Automation.id == automation_id,
            Automation.workspace_id == x_workspace_id
        )
    )
    if not result.scalar_one_or_none():
        raise HTTPException(status_code=404, detail="Automation not found")
    
    result = await db.execute(
        select(AutomationLog)
        .where(AutomationLog.automation_id == automation_id)
        .order_by(desc(AutomationLog.started_at))
        .offset(skip)
        .limit(limit)
    )
    return result.scalars().all()
