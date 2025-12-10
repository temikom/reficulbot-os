import httpx
from typing import Optional
from app.core.config import settings

class WhatsAppService:
    BASE_URL = "https://graph.facebook.com/v18.0"
    
    async def send_message(
        self,
        phone_number_id: str,
        access_token: str,
        to: str,
        message: str
    ) -> dict:
        """Send WhatsApp message"""
        url = f"{self.BASE_URL}/{phone_number_id}/messages"
        
        headers = {
            "Authorization": f"Bearer {access_token}",
            "Content-Type": "application/json"
        }
        
        payload = {
            "messaging_product": "whatsapp",
            "to": to,
            "type": "text",
            "text": {"body": message}
        }
        
        async with httpx.AsyncClient() as client:
            response = await client.post(url, json=payload, headers=headers)
            return response.json()
    
    async def send_template_message(
        self,
        phone_number_id: str,
        access_token: str,
        to: str,
        template_name: str,
        language_code: str = "en"
    ) -> dict:
        """Send WhatsApp template message"""
        url = f"{self.BASE_URL}/{phone_number_id}/messages"
        
        headers = {
            "Authorization": f"Bearer {access_token}",
            "Content-Type": "application/json"
        }
        
        payload = {
            "messaging_product": "whatsapp",
            "to": to,
            "type": "template",
            "template": {
                "name": template_name,
                "language": {"code": language_code}
            }
        }
        
        async with httpx.AsyncClient() as client:
            response = await client.post(url, json=payload, headers=headers)
            return response.json()

class InstagramService:
    BASE_URL = "https://graph.facebook.com/v18.0"
    
    async def send_message(
        self,
        page_id: str,
        access_token: str,
        recipient_id: str,
        message: str
    ) -> dict:
        """Send Instagram Direct message"""
        url = f"{self.BASE_URL}/{page_id}/messages"
        
        headers = {
            "Authorization": f"Bearer {access_token}",
            "Content-Type": "application/json"
        }
        
        payload = {
            "recipient": {"id": recipient_id},
            "message": {"text": message}
        }
        
        async with httpx.AsyncClient() as client:
            response = await client.post(url, json=payload, headers=headers)
            return response.json()

class MessengerService:
    BASE_URL = "https://graph.facebook.com/v18.0"
    
    async def send_message(
        self,
        page_id: str,
        access_token: str,
        recipient_id: str,
        message: str
    ) -> dict:
        """Send Messenger message"""
        url = f"{self.BASE_URL}/{page_id}/messages"
        
        headers = {
            "Authorization": f"Bearer {access_token}",
            "Content-Type": "application/json"
        }
        
        payload = {
            "recipient": {"id": recipient_id},
            "message": {"text": message}
        }
        
        async with httpx.AsyncClient() as client:
            response = await client.post(url, json=payload, headers=headers)
            return response.json()

whatsapp_service = WhatsAppService()
instagram_service = InstagramService()
messenger_service = MessengerService()
