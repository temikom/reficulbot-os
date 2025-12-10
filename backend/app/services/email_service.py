import resend
from typing import List, Optional
from app.core.config import settings

class EmailService:
    def __init__(self):
        resend.api_key = settings.RESEND_API_KEY
    
    async def send_email(
        self,
        to: List[str],
        subject: str,
        html: str,
        from_email: str = "ReficulBot <noreply@reficulbot.com>"
    ) -> dict:
        """Send email using Resend"""
        if not settings.RESEND_API_KEY:
            raise Exception("Resend API key not configured")
        
        params = {
            "from": from_email,
            "to": to,
            "subject": subject,
            "html": html
        }
        
        response = resend.Emails.send(params)
        return response
    
    async def send_welcome_email(self, email: str, name: str) -> dict:
        """Send welcome email to new user"""
        html = f"""
        <h1>Welcome to ReficulBot, {name}!</h1>
        <p>Thank you for joining ReficulBot. We're excited to help you engage with your customers using AI.</p>
        <p>Here's what you can do next:</p>
        <ul>
            <li>Create your first AI Agent</li>
            <li>Connect your WhatsApp or Instagram</li>
            <li>Import your contacts</li>
        </ul>
        <p>If you have any questions, our support team is here to help.</p>
        <p>Best regards,<br>The ReficulBot Team</p>
        """
        
        return await self.send_email(
            to=[email],
            subject="Welcome to ReficulBot!",
            html=html
        )
    
    async def send_escalation_notification(
        self,
        admin_email: str,
        conversation_id: str,
        customer_message: str
    ) -> dict:
        """Send escalation notification to admin"""
        html = f"""
        <h2>Conversation Escalated</h2>
        <p>A conversation has been escalated and requires your attention.</p>
        <p><strong>Customer Message:</strong></p>
        <blockquote>{customer_message}</blockquote>
        <p><a href="https://app.reficulbot.com/inbox/{conversation_id}">View Conversation</a></p>
        """
        
        return await self.send_email(
            to=[admin_email],
            subject="[Escalation] Customer conversation requires attention",
            html=html
        )

email_service = EmailService()
