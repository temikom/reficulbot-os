# ReficulBot Backend API

FastAPI backend for ReficulBot - AI-Powered Customer Engagement Platform.

## Features

- 🔐 JWT Authentication
- 👥 Multi-workspace support
- 🤖 AI Agent management
- 💬 Unified inbox for all channels
- 📊 CRM (Contacts & Deals)
- 🔄 Flow automation builder
- 📢 Broadcast messaging
- 📚 Knowledge base with RAG
- 📈 Analytics dashboard
- 💳 Stripe billing integration
- 📱 WhatsApp, Instagram, Messenger integration

## Quick Start

### Prerequisites

- Python 3.11+
- PostgreSQL 15+
- Redis 7+

### Development Setup

1. Clone and install dependencies:
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
```

2. Copy environment variables:
```bash
cp .env.example .env
# Edit .env with your configuration
```

3. Run database migrations:
```bash
alembic upgrade head
```

4. Start the development server:
```bash
uvicorn app.main:app --reload
```

API will be available at `http://localhost:8000`

### Docker Deployment

1. Build and run with Docker Compose:
```bash
docker-compose up -d
```

2. Run migrations:
```bash
docker-compose exec api alembic upgrade head
```

## API Documentation

Once running, access the API docs at:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

## Project Structure

```
backend/
├── app/
│   ├── api/
│   │   └── v1/
│   │       └── endpoints/     # API route handlers
│   ├── core/                  # Config, security, database
│   ├── models/                # SQLAlchemy models
│   ├── schemas/               # Pydantic schemas
│   └── services/              # Business logic services
├── alembic/                   # Database migrations
├── requirements.txt
├── Dockerfile
└── docker-compose.yml
```

## Environment Variables

| Variable | Description |
|----------|-------------|
| `SECRET_KEY` | Application secret key |
| `DATABASE_URL` | PostgreSQL connection string |
| `REDIS_URL` | Redis connection string |
| `JWT_SECRET_KEY` | JWT signing key |
| `OPENAI_API_KEY` | OpenAI API key for AI features |
| `STRIPE_SECRET_KEY` | Stripe secret key |
| `RESEND_API_KEY` | Resend API key for emails |
| `WHATSAPP_API_TOKEN` | WhatsApp Business API token |
| `META_APP_SECRET` | Meta app secret for webhooks |

## Deployment

### VPS Deployment

1. Install Docker and Docker Compose on your VPS

2. Clone the repository:
```bash
git clone https://github.com/yourusername/reficulbot.git
cd reficulbot/backend
```

3. Create `.env` file with production values

4. Start services:
```bash
docker-compose up -d
```

5. Set up reverse proxy (Nginx/Caddy) for HTTPS

6. Configure webhooks for WhatsApp/Instagram/Messenger

### Production Checklist

- [ ] Set strong `SECRET_KEY` and `JWT_SECRET_KEY`
- [ ] Configure HTTPS with SSL certificates
- [ ] Set up database backups
- [ ] Configure rate limiting
- [ ] Set up monitoring and logging
- [ ] Configure webhook URLs in Meta Business Manager

## License

Proprietary - ReficulBot
