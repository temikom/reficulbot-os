from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List
import re

from app.core.database import get_db
from app.core.security import get_current_user
from app.models.user import User, UserRole, RoleType
from app.models.workspace import Workspace, WorkspaceMember, MemberRole
from app.schemas.workspace import (
    WorkspaceCreate, 
    WorkspaceUpdate, 
    WorkspaceResponse,
    WorkspaceMemberResponse,
    InviteMemberRequest
)

router = APIRouter()

def generate_slug(name: str) -> str:
    slug = re.sub(r'[^a-zA-Z0-9\s-]', '', name.lower())
    slug = re.sub(r'[\s_]+', '-', slug)
    return slug[:50]

@router.get("", response_model=List[WorkspaceResponse])
async def list_workspaces(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(
        select(Workspace)
        .join(WorkspaceMember)
        .where(WorkspaceMember.user_id == current_user.id)
    )
    return result.scalars().all()

@router.post("", response_model=WorkspaceResponse, status_code=status.HTTP_201_CREATED)
async def create_workspace(
    workspace_data: WorkspaceCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    slug = generate_slug(workspace_data.name)
    
    # Check slug uniqueness
    result = await db.execute(select(Workspace).where(Workspace.slug == slug))
    if result.scalar_one_or_none():
        slug = f"{slug}-{str(current_user.id)[:8]}"
    
    workspace = Workspace(
        name=workspace_data.name,
        slug=slug,
        owner_id=current_user.id
    )
    db.add(workspace)
    await db.flush()
    
    # Add owner as member
    member = WorkspaceMember(
        workspace_id=workspace.id,
        user_id=current_user.id,
        role=MemberRole.OWNER
    )
    db.add(member)
    
    # Add owner role
    role = UserRole(
        user_id=current_user.id,
        workspace_id=workspace.id,
        role=RoleType.ADMIN
    )
    db.add(role)
    
    await db.commit()
    await db.refresh(workspace)
    
    return workspace

@router.get("/{workspace_id}", response_model=WorkspaceResponse)
async def get_workspace(
    workspace_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(
        select(Workspace)
        .join(WorkspaceMember)
        .where(
            Workspace.id == workspace_id,
            WorkspaceMember.user_id == current_user.id
        )
    )
    workspace = result.scalar_one_or_none()
    
    if not workspace:
        raise HTTPException(status_code=404, detail="Workspace not found")
    
    return workspace

@router.put("/{workspace_id}", response_model=WorkspaceResponse)
async def update_workspace(
    workspace_id: str,
    workspace_data: WorkspaceUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(
        select(Workspace)
        .join(WorkspaceMember)
        .where(
            Workspace.id == workspace_id,
            WorkspaceMember.user_id == current_user.id,
            WorkspaceMember.role.in_([MemberRole.OWNER, MemberRole.ADMIN])
        )
    )
    workspace = result.scalar_one_or_none()
    
    if not workspace:
        raise HTTPException(status_code=404, detail="Workspace not found or access denied")
    
    for field, value in workspace_data.model_dump(exclude_unset=True).items():
        setattr(workspace, field, value)
    
    await db.commit()
    await db.refresh(workspace)
    
    return workspace

@router.get("/{workspace_id}/members", response_model=List[WorkspaceMemberResponse])
async def list_workspace_members(
    workspace_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    # Verify user has access
    result = await db.execute(
        select(WorkspaceMember).where(
            WorkspaceMember.workspace_id == workspace_id,
            WorkspaceMember.user_id == current_user.id
        )
    )
    if not result.scalar_one_or_none():
        raise HTTPException(status_code=404, detail="Workspace not found")
    
    result = await db.execute(
        select(WorkspaceMember)
        .where(WorkspaceMember.workspace_id == workspace_id)
    )
    return result.scalars().all()

@router.post("/{workspace_id}/invite")
async def invite_member(
    workspace_id: str,
    invite_data: InviteMemberRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    # Verify user is admin/owner
    result = await db.execute(
        select(WorkspaceMember).where(
            WorkspaceMember.workspace_id == workspace_id,
            WorkspaceMember.user_id == current_user.id,
            WorkspaceMember.role.in_([MemberRole.OWNER, MemberRole.ADMIN])
        )
    )
    if not result.scalar_one_or_none():
        raise HTTPException(status_code=403, detail="Access denied")
    
    # Find user by email
    result = await db.execute(select(User).where(User.email == invite_data.email))
    invited_user = result.scalar_one_or_none()
    
    if not invited_user:
        # TODO: Send invitation email
        return {"message": f"Invitation sent to {invite_data.email}"}
    
    # Check if already member
    result = await db.execute(
        select(WorkspaceMember).where(
            WorkspaceMember.workspace_id == workspace_id,
            WorkspaceMember.user_id == invited_user.id
        )
    )
    if result.scalar_one_or_none():
        raise HTTPException(status_code=400, detail="User is already a member")
    
    member = WorkspaceMember(
        workspace_id=workspace_id,
        user_id=invited_user.id,
        role=invite_data.role
    )
    db.add(member)
    await db.commit()
    
    return {"message": f"User {invite_data.email} added to workspace"}

@router.delete("/{workspace_id}/members/{user_id}")
async def remove_member(
    workspace_id: str,
    user_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    # Verify current user is admin/owner
    result = await db.execute(
        select(WorkspaceMember).where(
            WorkspaceMember.workspace_id == workspace_id,
            WorkspaceMember.user_id == current_user.id,
            WorkspaceMember.role.in_([MemberRole.OWNER, MemberRole.ADMIN])
        )
    )
    if not result.scalar_one_or_none():
        raise HTTPException(status_code=403, detail="Access denied")
    
    # Find and remove member
    result = await db.execute(
        select(WorkspaceMember).where(
            WorkspaceMember.workspace_id == workspace_id,
            WorkspaceMember.user_id == user_id
        )
    )
    member = result.scalar_one_or_none()
    
    if not member:
        raise HTTPException(status_code=404, detail="Member not found")
    
    if member.role == MemberRole.OWNER:
        raise HTTPException(status_code=400, detail="Cannot remove workspace owner")
    
    await db.delete(member)
    await db.commit()
    
    return {"message": "Member removed"}
