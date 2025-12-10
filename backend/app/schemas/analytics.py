from pydantic import BaseModel
from typing import List, Dict, Any, Optional
from datetime import datetime

class DateRangeRequest(BaseModel):
    start_date: datetime
    end_date: datetime

class OverviewStats(BaseModel):
    total_conversations: int
    total_messages: int
    total_contacts: int
    total_deals: int
    pipeline_value: float
    ai_handled_percentage: float
    avg_response_time: float
    customer_satisfaction: float

class ConversationMetrics(BaseModel):
    total: int
    by_channel: Dict[str, int]
    by_status: Dict[str, int]
    by_date: List[Dict[str, Any]]
    avg_messages_per_conversation: float
    avg_resolution_time: float

class AgentPerformanceMetrics(BaseModel):
    agent_id: str
    agent_name: str
    total_conversations: int
    accuracy_rate: float
    avg_response_time: float
    escalation_rate: float
    customer_satisfaction: float

class RevenueMetrics(BaseModel):
    total_revenue: float
    revenue_by_date: List[Dict[str, Any]]
    deals_closed: int
    avg_deal_value: float
    conversion_rate: float

class FunnelMetrics(BaseModel):
    stages: List[Dict[str, Any]]
    conversion_rates: Dict[str, float]
    avg_time_in_stage: Dict[str, float]
