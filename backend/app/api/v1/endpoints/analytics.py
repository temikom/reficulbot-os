from fastapi import APIRouter, Depends, Header, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from datetime import datetime, timedelta
from typing import List

from app.core.database import get_db
from app.core.security import get_current_user
from app.models.user import User
from app.models.conversation import Conversation, Message
from app.models.contact import Contact
from app.models.deal import Deal, DealStage
from app.models.agent import Agent
from app.schemas.analytics import (
    DateRangeRequest,
    OverviewStats,
    ConversationMetrics,
    AgentPerformanceMetrics,
    RevenueMetrics,
    FunnelMetrics
)

router = APIRouter()

@router.get("/overview", response_model=OverviewStats)
async def get_overview_stats(
    x_workspace_id: str = Header(...),
    start_date: datetime = Query(default=None),
    end_date: datetime = Query(default=None),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    if not start_date:
        start_date = datetime.utcnow() - timedelta(days=30)
    if not end_date:
        end_date = datetime.utcnow()
    
    # Total conversations
    conv_result = await db.execute(
        select(func.count(Conversation.id)).where(
            Conversation.workspace_id == x_workspace_id,
            Conversation.created_at >= start_date,
            Conversation.created_at <= end_date
        )
    )
    total_conversations = conv_result.scalar() or 0
    
    # Total messages
    msg_result = await db.execute(
        select(func.count(Message.id))
        .join(Conversation)
        .where(
            Conversation.workspace_id == x_workspace_id,
            Message.created_at >= start_date,
            Message.created_at <= end_date
        )
    )
    total_messages = msg_result.scalar() or 0
    
    # Total contacts
    contact_result = await db.execute(
        select(func.count(Contact.id)).where(
            Contact.workspace_id == x_workspace_id
        )
    )
    total_contacts = contact_result.scalar() or 0
    
    # Total deals
    deal_result = await db.execute(
        select(func.count(Deal.id)).where(
            Deal.workspace_id == x_workspace_id
        )
    )
    total_deals = deal_result.scalar() or 0
    
    # Pipeline value
    pipeline_result = await db.execute(
        select(func.sum(Deal.value)).where(
            Deal.workspace_id == x_workspace_id,
            Deal.stage.notin_([DealStage.CLOSED_WON, DealStage.CLOSED_LOST])
        )
    )
    pipeline_value = pipeline_result.scalar() or 0.0
    
    # AI handled percentage
    ai_conv_result = await db.execute(
        select(func.count(Conversation.id)).where(
            Conversation.workspace_id == x_workspace_id,
            Conversation.is_ai_enabled == True,
            Conversation.created_at >= start_date,
            Conversation.created_at <= end_date
        )
    )
    ai_conversations = ai_conv_result.scalar() or 0
    ai_handled_percentage = (ai_conversations / total_conversations * 100) if total_conversations > 0 else 0
    
    return OverviewStats(
        total_conversations=total_conversations,
        total_messages=total_messages,
        total_contacts=total_contacts,
        total_deals=total_deals,
        pipeline_value=pipeline_value,
        ai_handled_percentage=ai_handled_percentage,
        avg_response_time=0.0,  # TODO: Calculate actual average
        customer_satisfaction=0.0  # TODO: Implement satisfaction tracking
    )

@router.get("/conversations", response_model=ConversationMetrics)
async def get_conversation_metrics(
    x_workspace_id: str = Header(...),
    start_date: datetime = Query(default=None),
    end_date: datetime = Query(default=None),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    if not start_date:
        start_date = datetime.utcnow() - timedelta(days=30)
    if not end_date:
        end_date = datetime.utcnow()
    
    # Total conversations
    result = await db.execute(
        select(func.count(Conversation.id)).where(
            Conversation.workspace_id == x_workspace_id,
            Conversation.created_at >= start_date,
            Conversation.created_at <= end_date
        )
    )
    total = result.scalar() or 0
    
    # By channel
    channel_result = await db.execute(
        select(Conversation.channel, func.count(Conversation.id))
        .where(
            Conversation.workspace_id == x_workspace_id,
            Conversation.created_at >= start_date,
            Conversation.created_at <= end_date
        )
        .group_by(Conversation.channel)
    )
    by_channel = {str(row[0].value): row[1] for row in channel_result.fetchall()}
    
    # By status
    status_result = await db.execute(
        select(Conversation.status, func.count(Conversation.id))
        .where(
            Conversation.workspace_id == x_workspace_id,
            Conversation.created_at >= start_date,
            Conversation.created_at <= end_date
        )
        .group_by(Conversation.status)
    )
    by_status = {str(row[0].value): row[1] for row in status_result.fetchall()}
    
    return ConversationMetrics(
        total=total,
        by_channel=by_channel,
        by_status=by_status,
        by_date=[],  # TODO: Implement daily breakdown
        avg_messages_per_conversation=0.0,
        avg_resolution_time=0.0
    )

@router.get("/agents", response_model=List[AgentPerformanceMetrics])
async def get_agent_performance(
    x_workspace_id: str = Header(...),
    start_date: datetime = Query(default=None),
    end_date: datetime = Query(default=None),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(
        select(Agent).where(Agent.workspace_id == x_workspace_id)
    )
    agents = result.scalars().all()
    
    metrics = []
    for agent in agents:
        metrics.append(AgentPerformanceMetrics(
            agent_id=str(agent.id),
            agent_name=agent.name,
            total_conversations=agent.total_conversations,
            accuracy_rate=agent.accuracy_rate,
            avg_response_time=agent.avg_response_time,
            escalation_rate=0.0,  # TODO: Calculate
            customer_satisfaction=0.0  # TODO: Calculate
        ))
    
    return metrics

@router.get("/revenue", response_model=RevenueMetrics)
async def get_revenue_metrics(
    x_workspace_id: str = Header(...),
    start_date: datetime = Query(default=None),
    end_date: datetime = Query(default=None),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    if not start_date:
        start_date = datetime.utcnow() - timedelta(days=30)
    if not end_date:
        end_date = datetime.utcnow()
    
    # Total revenue (closed won deals)
    revenue_result = await db.execute(
        select(func.sum(Deal.value)).where(
            Deal.workspace_id == x_workspace_id,
            Deal.stage == DealStage.CLOSED_WON,
            Deal.closed_at >= start_date,
            Deal.closed_at <= end_date
        )
    )
    total_revenue = revenue_result.scalar() or 0.0
    
    # Deals closed
    deals_result = await db.execute(
        select(func.count(Deal.id)).where(
            Deal.workspace_id == x_workspace_id,
            Deal.stage == DealStage.CLOSED_WON,
            Deal.closed_at >= start_date,
            Deal.closed_at <= end_date
        )
    )
    deals_closed = deals_result.scalar() or 0
    
    avg_deal_value = total_revenue / deals_closed if deals_closed > 0 else 0.0
    
    return RevenueMetrics(
        total_revenue=total_revenue,
        revenue_by_date=[],  # TODO: Implement daily breakdown
        deals_closed=deals_closed,
        avg_deal_value=avg_deal_value,
        conversion_rate=0.0  # TODO: Calculate
    )

@router.get("/funnel", response_model=FunnelMetrics)
async def get_funnel_metrics(
    x_workspace_id: str = Header(...),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    stages = []
    
    for stage in DealStage:
        result = await db.execute(
            select(func.count(Deal.id), func.sum(Deal.value)).where(
                Deal.workspace_id == x_workspace_id,
                Deal.stage == stage
            )
        )
        row = result.fetchone()
        stages.append({
            "stage": stage.value,
            "count": row[0] or 0,
            "value": row[1] or 0.0
        })
    
    return FunnelMetrics(
        stages=stages,
        conversion_rates={},  # TODO: Calculate stage-to-stage conversion
        avg_time_in_stage={}  # TODO: Calculate average time in each stage
    )
