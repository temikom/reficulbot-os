from fastapi import APIRouter, Depends, HTTPException, status, Header, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, or_
from typing import List, Optional

from app.core.database import get_db
from app.core.security import get_current_user
from app.models.user import User
from app.models.contact import Contact
from app.schemas.contact import ContactCreate, ContactUpdate, ContactResponse, ContactImportRequest

router = APIRouter()

@router.get("", response_model=List[ContactResponse])
async def list_contacts(
    x_workspace_id: str = Header(...),
    search: Optional[str] = None,
    stage: Optional[str] = None,
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    query = select(Contact).where(Contact.workspace_id == x_workspace_id)
    
    if search:
        search_filter = f"%{search}%"
        query = query.where(
            or_(
                Contact.first_name.ilike(search_filter),
                Contact.last_name.ilike(search_filter),
                Contact.email.ilike(search_filter),
                Contact.phone.ilike(search_filter),
                Contact.company.ilike(search_filter)
            )
        )
    
    if stage:
        query = query.where(Contact.stage == stage)
    
    query = query.offset(skip).limit(limit)
    
    result = await db.execute(query)
    return result.scalars().all()

@router.post("", response_model=ContactResponse, status_code=status.HTTP_201_CREATED)
async def create_contact(
    contact_data: ContactCreate,
    x_workspace_id: str = Header(...),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    contact = Contact(
        workspace_id=x_workspace_id,
        **contact_data.model_dump()
    )
    db.add(contact)
    await db.commit()
    await db.refresh(contact)
    
    return contact

@router.get("/{contact_id}", response_model=ContactResponse)
async def get_contact(
    contact_id: str,
    x_workspace_id: str = Header(...),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(
        select(Contact).where(
            Contact.id == contact_id,
            Contact.workspace_id == x_workspace_id
        )
    )
    contact = result.scalar_one_or_none()
    
    if not contact:
        raise HTTPException(status_code=404, detail="Contact not found")
    
    return contact

@router.put("/{contact_id}", response_model=ContactResponse)
async def update_contact(
    contact_id: str,
    contact_data: ContactUpdate,
    x_workspace_id: str = Header(...),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(
        select(Contact).where(
            Contact.id == contact_id,
            Contact.workspace_id == x_workspace_id
        )
    )
    contact = result.scalar_one_or_none()
    
    if not contact:
        raise HTTPException(status_code=404, detail="Contact not found")
    
    for field, value in contact_data.model_dump(exclude_unset=True).items():
        setattr(contact, field, value)
    
    await db.commit()
    await db.refresh(contact)
    
    return contact

@router.delete("/{contact_id}")
async def delete_contact(
    contact_id: str,
    x_workspace_id: str = Header(...),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(
        select(Contact).where(
            Contact.id == contact_id,
            Contact.workspace_id == x_workspace_id
        )
    )
    contact = result.scalar_one_or_none()
    
    if not contact:
        raise HTTPException(status_code=404, detail="Contact not found")
    
    await db.delete(contact)
    await db.commit()
    
    return {"message": "Contact deleted"}

@router.post("/import")
async def import_contacts(
    import_data: ContactImportRequest,
    x_workspace_id: str = Header(...),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    imported_count = 0
    
    for contact_data in import_data.contacts:
        contact = Contact(
            workspace_id=x_workspace_id,
            **contact_data.model_dump()
        )
        db.add(contact)
        imported_count += 1
    
    await db.commit()
    
    return {"message": f"Imported {imported_count} contacts"}
