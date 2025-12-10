from fastapi import APIRouter, Depends, HTTPException, status, Header
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List
import openai

from app.core.database import get_db
from app.core.security import get_current_user
from app.core.config import settings
from app.models.user import User
from app.models.agent import Agent
from app.schemas.agent import AgentCreate, AgentUpdate, AgentResponse, AgentTestRequest, AgentTestResponse

router = APIRouter()

@router.get("", response_model=List[AgentResponse])
async def list_agents(
    x_workspace_id: str = Header(...),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(
        select(Agent).where(Agent.workspace_id == x_workspace_id)
    )
    return result.scalars().all()

@router.post("", response_model=AgentResponse, status_code=status.HTTP_201_CREATED)
async def create_agent(
    agent_data: AgentCreate,
    x_workspace_id: str = Header(...),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    agent = Agent(
        workspace_id=x_workspace_id,
        **agent_data.model_dump()
    )
    db.add(agent)
    await db.commit()
    await db.refresh(agent)
    
    return agent

@router.get("/{agent_id}", response_model=AgentResponse)
async def get_agent(
    agent_id: str,
    x_workspace_id: str = Header(...),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(
        select(Agent).where(
            Agent.id == agent_id,
            Agent.workspace_id == x_workspace_id
        )
    )
    agent = result.scalar_one_or_none()
    
    if not agent:
        raise HTTPException(status_code=404, detail="Agent not found")
    
    return agent

@router.put("/{agent_id}", response_model=AgentResponse)
async def update_agent(
    agent_id: str,
    agent_data: AgentUpdate,
    x_workspace_id: str = Header(...),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(
        select(Agent).where(
            Agent.id == agent_id,
            Agent.workspace_id == x_workspace_id
        )
    )
    agent = result.scalar_one_or_none()
    
    if not agent:
        raise HTTPException(status_code=404, detail="Agent not found")
    
    for field, value in agent_data.model_dump(exclude_unset=True).items():
        setattr(agent, field, value)
    
    await db.commit()
    await db.refresh(agent)
    
    return agent

@router.delete("/{agent_id}")
async def delete_agent(
    agent_id: str,
    x_workspace_id: str = Header(...),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(
        select(Agent).where(
            Agent.id == agent_id,
            Agent.workspace_id == x_workspace_id
        )
    )
    agent = result.scalar_one_or_none()
    
    if not agent:
        raise HTTPException(status_code=404, detail="Agent not found")
    
    await db.delete(agent)
    await db.commit()
    
    return {"message": "Agent deleted"}

@router.post("/{agent_id}/test", response_model=AgentTestResponse)
async def test_agent(
    agent_id: str,
    test_data: AgentTestRequest,
    x_workspace_id: str = Header(...),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(
        select(Agent).where(
            Agent.id == agent_id,
            Agent.workspace_id == x_workspace_id
        )
    )
    agent = result.scalar_one_or_none()
    
    if not agent:
        raise HTTPException(status_code=404, detail="Agent not found")
    
    if not settings.OPENAI_API_KEY:
        raise HTTPException(status_code=500, detail="OpenAI API key not configured")
    
    client = openai.AsyncOpenAI(api_key=settings.OPENAI_API_KEY)
    
    messages = [
        {"role": "system", "content": agent.system_prompt or "You are a helpful assistant."},
        {"role": "user", "content": test_data.message}
    ]
    
    response = await client.chat.completions.create(
        model=agent.model,
        messages=messages,
        temperature=agent.temperature,
        max_tokens=agent.max_tokens
    )
    
    return AgentTestResponse(
        response=response.choices[0].message.content,
        tokens_used=response.usage.total_tokens
    )
