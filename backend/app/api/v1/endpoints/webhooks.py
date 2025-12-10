from fastapi import APIRouter, Request, HTTPException, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
import hashlib
import hmac

from app.core.database import get_db
from app.core.config import settings
from app.models.channel import Channel
from app.models.conversation import Conversation, Message, ChannelType, ConversationStatus, MessageRole
from app.models.contact import Contact

router = APIRouter()

def verify_whatsapp_signature(payload: bytes, signature: str) -> bool:
    """Verify WhatsApp webhook signature"""
    if not settings.META_APP_SECRET:
        return False
    
    expected_signature = hmac.new(
        settings.META_APP_SECRET.encode(),
        payload,
        hashlib.sha256
    ).hexdigest()
    
    return hmac.compare_digest(f"sha256={expected_signature}", signature)

@router.get("/whatsapp")
async def verify_whatsapp_webhook(
    hub_mode: str = None,
    hub_verify_token: str = None,
    hub_challenge: str = None
):
    """Webhook verification for WhatsApp"""
    verify_token = "reficulbot_webhook_token"  # TODO: Move to config
    
    if hub_mode == "subscribe" and hub_verify_token == verify_token:
        return int(hub_challenge)
    
    raise HTTPException(status_code=403, detail="Verification failed")

@router.post("/whatsapp")
async def whatsapp_webhook(
    request: Request,
    db: AsyncSession = Depends(get_db)
):
    """Handle incoming WhatsApp messages"""
    payload = await request.body()
    signature = request.headers.get("X-Hub-Signature-256", "")
    
    # Verify signature in production
    # if not verify_whatsapp_signature(payload, signature):
    #     raise HTTPException(status_code=403, detail="Invalid signature")
    
    data = await request.json()
    
    # Process WhatsApp message
    if "entry" in data:
        for entry in data["entry"]:
            for change in entry.get("changes", []):
                if change.get("field") == "messages":
                    value = change.get("value", {})
                    messages = value.get("messages", [])
                    
                    for message in messages:
                        await process_whatsapp_message(message, value, db)
    
    return {"status": "ok"}

async def process_whatsapp_message(message: dict, value: dict, db: AsyncSession):
    """Process incoming WhatsApp message"""
    phone_number_id = value.get("metadata", {}).get("phone_number_id")
    from_number = message.get("from")
    message_text = message.get("text", {}).get("body", "")
    message_id = message.get("id")
    
    # Find channel
    result = await db.execute(
        select(Channel).where(
            Channel.external_id == phone_number_id,
            Channel.channel_type == ChannelType.WHATSAPP
        )
    )
    channel = result.scalar_one_or_none()
    
    if not channel:
        return
    
    # Find or create contact
    result = await db.execute(
        select(Contact).where(
            Contact.workspace_id == channel.workspace_id,
            Contact.whatsapp_id == from_number
        )
    )
    contact = result.scalar_one_or_none()
    
    if not contact:
        contact = Contact(
            workspace_id=channel.workspace_id,
            whatsapp_id=from_number,
            phone=from_number
        )
        db.add(contact)
        await db.flush()
    
    # Find or create conversation
    result = await db.execute(
        select(Conversation).where(
            Conversation.workspace_id == channel.workspace_id,
            Conversation.contact_id == contact.id,
            Conversation.channel == ChannelType.WHATSAPP,
            Conversation.status.in_([ConversationStatus.ACTIVE, ConversationStatus.PENDING])
        )
    )
    conversation = result.scalar_one_or_none()
    
    if not conversation:
        conversation = Conversation(
            workspace_id=channel.workspace_id,
            contact_id=contact.id,
            channel=ChannelType.WHATSAPP,
            channel_conversation_id=from_number,
            status=ConversationStatus.ACTIVE
        )
        db.add(conversation)
        await db.flush()
    
    # Create message
    new_message = Message(
        conversation_id=conversation.id,
        role=MessageRole.USER,
        content=message_text,
        channel_message_id=message_id
    )
    db.add(new_message)
    
    # Update conversation
    from datetime import datetime
    conversation.last_message_at = datetime.utcnow()
    
    await db.commit()
    
    # TODO: Trigger AI response if enabled

@router.get("/instagram")
async def verify_instagram_webhook(
    hub_mode: str = None,
    hub_verify_token: str = None,
    hub_challenge: str = None
):
    """Webhook verification for Instagram"""
    verify_token = "reficulbot_webhook_token"
    
    if hub_mode == "subscribe" and hub_verify_token == verify_token:
        return int(hub_challenge)
    
    raise HTTPException(status_code=403, detail="Verification failed")

@router.post("/instagram")
async def instagram_webhook(
    request: Request,
    db: AsyncSession = Depends(get_db)
):
    """Handle incoming Instagram messages"""
    data = await request.json()
    
    # TODO: Process Instagram message similar to WhatsApp
    
    return {"status": "ok"}

@router.get("/messenger")
async def verify_messenger_webhook(
    hub_mode: str = None,
    hub_verify_token: str = None,
    hub_challenge: str = None
):
    """Webhook verification for Messenger"""
    verify_token = "reficulbot_webhook_token"
    
    if hub_mode == "subscribe" and hub_verify_token == verify_token:
        return int(hub_challenge)
    
    raise HTTPException(status_code=403, detail="Verification failed")

@router.post("/messenger")
async def messenger_webhook(
    request: Request,
    db: AsyncSession = Depends(get_db)
):
    """Handle incoming Messenger messages"""
    data = await request.json()
    
    # TODO: Process Messenger message similar to WhatsApp
    
    return {"status": "ok"}
