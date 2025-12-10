from fastapi import APIRouter, Depends, HTTPException, status, Header
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List

from app.core.database import get_db
from app.core.security import get_current_user
from app.models.user import User
from app.models.flow import Flow, FlowNode
from app.schemas.flow import (
    FlowCreate, 
    FlowUpdate, 
    FlowResponse,
    FlowNodeCreate,
    FlowNodeUpdate,
    FlowNodeResponse
)

router = APIRouter()

@router.get("", response_model=List[FlowResponse])
async def list_flows(
    x_workspace_id: str = Header(...),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(
        select(Flow).where(Flow.workspace_id == x_workspace_id)
    )
    flows = result.scalars().all()
    
    # Load nodes for each flow
    for flow in flows:
        nodes_result = await db.execute(
            select(FlowNode).where(FlowNode.flow_id == flow.id).order_by(FlowNode.order)
        )
        flow.nodes = nodes_result.scalars().all()
    
    return flows

@router.post("", response_model=FlowResponse, status_code=status.HTTP_201_CREATED)
async def create_flow(
    flow_data: FlowCreate,
    x_workspace_id: str = Header(...),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    flow = Flow(
        workspace_id=x_workspace_id,
        **flow_data.model_dump()
    )
    db.add(flow)
    await db.commit()
    await db.refresh(flow)
    
    flow.nodes = []
    return flow

@router.get("/{flow_id}", response_model=FlowResponse)
async def get_flow(
    flow_id: str,
    x_workspace_id: str = Header(...),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(
        select(Flow).where(
            Flow.id == flow_id,
            Flow.workspace_id == x_workspace_id
        )
    )
    flow = result.scalar_one_or_none()
    
    if not flow:
        raise HTTPException(status_code=404, detail="Flow not found")
    
    # Load nodes
    nodes_result = await db.execute(
        select(FlowNode).where(FlowNode.flow_id == flow_id).order_by(FlowNode.order)
    )
    flow.nodes = nodes_result.scalars().all()
    
    return flow

@router.put("/{flow_id}", response_model=FlowResponse)
async def update_flow(
    flow_id: str,
    flow_data: FlowUpdate,
    x_workspace_id: str = Header(...),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(
        select(Flow).where(
            Flow.id == flow_id,
            Flow.workspace_id == x_workspace_id
        )
    )
    flow = result.scalar_one_or_none()
    
    if not flow:
        raise HTTPException(status_code=404, detail="Flow not found")
    
    for field, value in flow_data.model_dump(exclude_unset=True).items():
        setattr(flow, field, value)
    
    await db.commit()
    await db.refresh(flow)
    
    # Load nodes
    nodes_result = await db.execute(
        select(FlowNode).where(FlowNode.flow_id == flow_id).order_by(FlowNode.order)
    )
    flow.nodes = nodes_result.scalars().all()
    
    return flow

@router.delete("/{flow_id}")
async def delete_flow(
    flow_id: str,
    x_workspace_id: str = Header(...),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(
        select(Flow).where(
            Flow.id == flow_id,
            Flow.workspace_id == x_workspace_id
        )
    )
    flow = result.scalar_one_or_none()
    
    if not flow:
        raise HTTPException(status_code=404, detail="Flow not found")
    
    await db.delete(flow)
    await db.commit()
    
    return {"message": "Flow deleted"}

@router.post("/{flow_id}/activate")
async def toggle_flow_activation(
    flow_id: str,
    x_workspace_id: str = Header(...),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(
        select(Flow).where(
            Flow.id == flow_id,
            Flow.workspace_id == x_workspace_id
        )
    )
    flow = result.scalar_one_or_none()
    
    if not flow:
        raise HTTPException(status_code=404, detail="Flow not found")
    
    flow.is_active = not flow.is_active
    await db.commit()
    
    return {"message": f"Flow {'activated' if flow.is_active else 'deactivated'}"}

# Flow Nodes endpoints
@router.post("/{flow_id}/nodes", response_model=FlowNodeResponse, status_code=status.HTTP_201_CREATED)
async def create_flow_node(
    flow_id: str,
    node_data: FlowNodeCreate,
    x_workspace_id: str = Header(...),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    # Verify flow exists
    result = await db.execute(
        select(Flow).where(
            Flow.id == flow_id,
            Flow.workspace_id == x_workspace_id
        )
    )
    if not result.scalar_one_or_none():
        raise HTTPException(status_code=404, detail="Flow not found")
    
    node = FlowNode(
        flow_id=flow_id,
        **node_data.model_dump()
    )
    db.add(node)
    await db.commit()
    await db.refresh(node)
    
    return node

@router.put("/{flow_id}/nodes/{node_id}", response_model=FlowNodeResponse)
async def update_flow_node(
    flow_id: str,
    node_id: str,
    node_data: FlowNodeUpdate,
    x_workspace_id: str = Header(...),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(
        select(FlowNode).where(
            FlowNode.id == node_id,
            FlowNode.flow_id == flow_id
        )
    )
    node = result.scalar_one_or_none()
    
    if not node:
        raise HTTPException(status_code=404, detail="Node not found")
    
    for field, value in node_data.model_dump(exclude_unset=True).items():
        setattr(node, field, value)
    
    await db.commit()
    await db.refresh(node)
    
    return node

@router.delete("/{flow_id}/nodes/{node_id}")
async def delete_flow_node(
    flow_id: str,
    node_id: str,
    x_workspace_id: str = Header(...),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(
        select(FlowNode).where(
            FlowNode.id == node_id,
            FlowNode.flow_id == flow_id
        )
    )
    node = result.scalar_one_or_none()
    
    if not node:
        raise HTTPException(status_code=404, detail="Node not found")
    
    await db.delete(node)
    await db.commit()
    
    return {"message": "Node deleted"}
