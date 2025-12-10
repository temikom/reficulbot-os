from fastapi import APIRouter, Depends, HTTPException, status, Header, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List, Optional
from datetime import datetime

from app.core.database import get_db
from app.core.security import get_current_user
from app.models.user import User
from app.models.deal import Deal, DealStage
from app.schemas.deal import DealCreate, DealUpdate, DealResponse

router = APIRouter()

@router.get("", response_model=List[DealResponse])
async def list_deals(
    x_workspace_id: str = Header(...),
    stage: Optional[DealStage] = None,
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    query = select(Deal).where(Deal.workspace_id == x_workspace_id)
    
    if stage:
        query = query.where(Deal.stage == stage)
    
    query = query.offset(skip).limit(limit)
    
    result = await db.execute(query)
    return result.scalars().all()

@router.post("", response_model=DealResponse, status_code=status.HTTP_201_CREATED)
async def create_deal(
    deal_data: DealCreate,
    x_workspace_id: str = Header(...),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    deal = Deal(
        workspace_id=x_workspace_id,
        **deal_data.model_dump()
    )
    db.add(deal)
    await db.commit()
    await db.refresh(deal)
    
    return deal

@router.get("/{deal_id}", response_model=DealResponse)
async def get_deal(
    deal_id: str,
    x_workspace_id: str = Header(...),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(
        select(Deal).where(
            Deal.id == deal_id,
            Deal.workspace_id == x_workspace_id
        )
    )
    deal = result.scalar_one_or_none()
    
    if not deal:
        raise HTTPException(status_code=404, detail="Deal not found")
    
    return deal

@router.put("/{deal_id}", response_model=DealResponse)
async def update_deal(
    deal_id: str,
    deal_data: DealUpdate,
    x_workspace_id: str = Header(...),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(
        select(Deal).where(
            Deal.id == deal_id,
            Deal.workspace_id == x_workspace_id
        )
    )
    deal = result.scalar_one_or_none()
    
    if not deal:
        raise HTTPException(status_code=404, detail="Deal not found")
    
    for field, value in deal_data.model_dump(exclude_unset=True).items():
        setattr(deal, field, value)
    
    # If stage changed to closed_won or closed_lost, set closed_at
    if deal_data.stage in [DealStage.CLOSED_WON, DealStage.CLOSED_LOST]:
        deal.closed_at = datetime.utcnow()
    
    await db.commit()
    await db.refresh(deal)
    
    return deal

@router.delete("/{deal_id}")
async def delete_deal(
    deal_id: str,
    x_workspace_id: str = Header(...),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(
        select(Deal).where(
            Deal.id == deal_id,
            Deal.workspace_id == x_workspace_id
        )
    )
    deal = result.scalar_one_or_none()
    
    if not deal:
        raise HTTPException(status_code=404, detail="Deal not found")
    
    await db.delete(deal)
    await db.commit()
    
    return {"message": "Deal deleted"}
