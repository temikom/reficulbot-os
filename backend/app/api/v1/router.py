from fastapi import APIRouter

from app.api.v1.endpoints import (
    auth,
    users,
    workspaces,
    agents,
    conversations,
    contacts,
    deals,
    flows,
    automations,
    broadcasts,
    knowledge,
    analytics,
    billing,
    settings,
    channels,
    chat,
    webhooks
)

api_router = APIRouter()

api_router.include_router(auth.router, prefix="/auth", tags=["Authentication"])
api_router.include_router(users.router, prefix="/users", tags=["Users"])
api_router.include_router(workspaces.router, prefix="/workspaces", tags=["Workspaces"])
api_router.include_router(agents.router, prefix="/agents", tags=["AI Agents"])
api_router.include_router(conversations.router, prefix="/conversations", tags=["Conversations"])
api_router.include_router(contacts.router, prefix="/contacts", tags=["Contacts"])
api_router.include_router(deals.router, prefix="/deals", tags=["Deals"])
api_router.include_router(flows.router, prefix="/flows", tags=["Flows"])
api_router.include_router(automations.router, prefix="/automations", tags=["Automations"])
api_router.include_router(broadcasts.router, prefix="/broadcasts", tags=["Broadcasts"])
api_router.include_router(knowledge.router, prefix="/knowledge", tags=["Knowledge Base"])
api_router.include_router(analytics.router, prefix="/analytics", tags=["Analytics"])
api_router.include_router(billing.router, prefix="/billing", tags=["Billing"])
api_router.include_router(settings.router, prefix="/settings", tags=["Settings"])
api_router.include_router(channels.router, prefix="/channels", tags=["Channels"])
api_router.include_router(chat.router, prefix="/chat", tags=["AI Chat"])
api_router.include_router(webhooks.router, prefix="/webhooks", tags=["Webhooks"])
