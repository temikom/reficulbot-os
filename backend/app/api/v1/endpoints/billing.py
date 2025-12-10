from fastapi import APIRouter, Depends, HTTPException, status, Header, Request
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List
import stripe

from app.core.database import get_db
from app.core.security import get_current_user
from app.core.config import settings
from app.models.user import User
from app.models.billing import Subscription, Invoice, PlanType, SubscriptionStatus
from app.schemas.billing import (
    SubscribeRequest,
    SubscriptionResponse,
    InvoiceResponse,
    PaymentMethodRequest,
    PlanDetails
)

router = APIRouter()

# Initialize Stripe
stripe.api_key = settings.STRIPE_SECRET_KEY

PLAN_DETAILS = {
    PlanType.FREE: PlanDetails(
        plan=PlanType.FREE,
        name="Free",
        price_monthly=0,
        price_yearly=0,
        features=["1,000 messages/month", "1 AI Agent", "Basic analytics"],
        messages_limit=1000,
        agents_limit=1,
        team_members_limit=1
    ),
    PlanType.STARTER: PlanDetails(
        plan=PlanType.STARTER,
        name="Starter",
        price_monthly=29,
        price_yearly=290,
        features=["10,000 messages/month", "3 AI Agents", "Advanced analytics", "Email support"],
        messages_limit=10000,
        agents_limit=3,
        team_members_limit=3
    ),
    PlanType.PROFESSIONAL: PlanDetails(
        plan=PlanType.PROFESSIONAL,
        name="Professional",
        price_monthly=99,
        price_yearly=990,
        features=["50,000 messages/month", "10 AI Agents", "Full analytics", "Priority support", "API access"],
        messages_limit=50000,
        agents_limit=10,
        team_members_limit=10
    ),
    PlanType.ENTERPRISE: PlanDetails(
        plan=PlanType.ENTERPRISE,
        name="Enterprise",
        price_monthly=299,
        price_yearly=2990,
        features=["Unlimited messages", "Unlimited AI Agents", "Custom integrations", "Dedicated support", "SLA"],
        messages_limit=999999,
        agents_limit=999,
        team_members_limit=999
    )
}

@router.get("/plans", response_model=List[PlanDetails])
async def get_plans():
    return list(PLAN_DETAILS.values())

@router.get("/subscription", response_model=SubscriptionResponse)
async def get_subscription(
    x_workspace_id: str = Header(...),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(
        select(Subscription).where(Subscription.workspace_id == x_workspace_id)
    )
    subscription = result.scalar_one_or_none()
    
    if not subscription:
        # Create free subscription if none exists
        subscription = Subscription(
            workspace_id=x_workspace_id,
            plan=PlanType.FREE,
            status=SubscriptionStatus.ACTIVE,
            monthly_messages_limit=1000
        )
        db.add(subscription)
        await db.commit()
        await db.refresh(subscription)
    
    return subscription

@router.post("/subscribe", response_model=SubscriptionResponse)
async def subscribe(
    subscribe_data: SubscribeRequest,
    x_workspace_id: str = Header(...),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    if not settings.STRIPE_SECRET_KEY:
        raise HTTPException(status_code=500, detail="Stripe not configured")
    
    result = await db.execute(
        select(Subscription).where(Subscription.workspace_id == x_workspace_id)
    )
    subscription = result.scalar_one_or_none()
    
    if not subscription:
        subscription = Subscription(workspace_id=x_workspace_id)
        db.add(subscription)
    
    # Create or get Stripe customer
    if not subscription.stripe_customer_id:
        customer = stripe.Customer.create(
            email=current_user.email,
            metadata={"workspace_id": str(x_workspace_id)}
        )
        subscription.stripe_customer_id = customer.id
    
    # Create subscription in Stripe
    plan_details = PLAN_DETAILS.get(subscribe_data.plan)
    if not plan_details:
        raise HTTPException(status_code=400, detail="Invalid plan")
    
    if subscribe_data.plan == PlanType.FREE:
        subscription.plan = PlanType.FREE
        subscription.status = SubscriptionStatus.ACTIVE
        subscription.monthly_messages_limit = plan_details.messages_limit
    else:
        # TODO: Create actual Stripe subscription with price ID
        subscription.plan = subscribe_data.plan
        subscription.status = SubscriptionStatus.ACTIVE
        subscription.monthly_messages_limit = plan_details.messages_limit
    
    await db.commit()
    await db.refresh(subscription)
    
    return subscription

@router.post("/cancel")
async def cancel_subscription(
    x_workspace_id: str = Header(...),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(
        select(Subscription).where(Subscription.workspace_id == x_workspace_id)
    )
    subscription = result.scalar_one_or_none()
    
    if not subscription:
        raise HTTPException(status_code=404, detail="Subscription not found")
    
    if subscription.stripe_subscription_id:
        stripe.Subscription.modify(
            subscription.stripe_subscription_id,
            cancel_at_period_end=True
        )
    
    subscription.cancel_at_period_end = True
    await db.commit()
    
    return {"message": "Subscription will be canceled at end of billing period"}

@router.get("/invoices", response_model=List[InvoiceResponse])
async def list_invoices(
    x_workspace_id: str = Header(...),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(
        select(Invoice).where(Invoice.workspace_id == x_workspace_id)
    )
    return result.scalars().all()

@router.post("/payment-method")
async def add_payment_method(
    payment_data: PaymentMethodRequest,
    x_workspace_id: str = Header(...),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(
        select(Subscription).where(Subscription.workspace_id == x_workspace_id)
    )
    subscription = result.scalar_one_or_none()
    
    if not subscription or not subscription.stripe_customer_id:
        raise HTTPException(status_code=400, detail="No active subscription")
    
    # Attach payment method to customer
    stripe.PaymentMethod.attach(
        payment_data.payment_method_id,
        customer=subscription.stripe_customer_id
    )
    
    # Set as default payment method
    stripe.Customer.modify(
        subscription.stripe_customer_id,
        invoice_settings={"default_payment_method": payment_data.payment_method_id}
    )
    
    return {"message": "Payment method added"}

@router.post("/webhook")
async def stripe_webhook(
    request: Request,
    db: AsyncSession = Depends(get_db)
):
    payload = await request.body()
    sig_header = request.headers.get("stripe-signature")
    
    try:
        event = stripe.Webhook.construct_event(
            payload, sig_header, settings.STRIPE_WEBHOOK_SECRET
        )
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
    
    # Handle events
    if event["type"] == "invoice.paid":
        # Handle successful payment
        pass
    elif event["type"] == "invoice.payment_failed":
        # Handle failed payment
        pass
    elif event["type"] == "customer.subscription.updated":
        # Handle subscription update
        pass
    elif event["type"] == "customer.subscription.deleted":
        # Handle subscription cancellation
        pass
    
    return {"received": True}
