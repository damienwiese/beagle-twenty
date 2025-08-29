# 🚀 Mac Mini Deployment Guide

## 📋 Prerequisites
- Node.js 18+ and Yarn
- PostgreSQL 15+
- Redis 6+
- Git

## 🔧 Environment Setup

Create `packages/twenty-server/.env` with your credentials:

```env
# Database
PG_DATABASE_URL=postgres://postgres:postgres@localhost:5432/test
REDIS_URL=redis://localhost:6379

# Application
APP_SECRET=generate_a_secure_random_string_here
SIGN_IN_PREFILLED=true
EXCEPTION_HANDLER_DRIVER=CONSOLE
MUTATION_MAXIMUM_RECORD_AFFECTED=100
FRONTEND_URL=http://localhost:3001
APP_BASE_URL=http://localhost:3000

# 🔐 TWILIO CREDENTIALS (Replace with yours)
TWILIO_ACCOUNT_SID=your_account_sid_starts_with_AC
TWILIO_API_KEY_SID=your_api_key_sid_starts_with_SK
TWILIO_API_KEY_SECRET=your_api_key_secret
TWILIO_PHONE_NUMBER=your_purchased_phone_number

# Optional Features
AUTH_GOOGLE_ENABLED=false
MESSAGING_PROVIDER_GMAIL_ENABLED=false
IS_IMAP_SMTP_CALDAV_ENABLED=false
CALENDAR_PROVIDER_GOOGLE_ENABLED=false
MESSAGING_PROVIDER_MICROSOFT_ENABLED=false
CALENDAR_PROVIDER_MICROSOFT_ENABLED=false
```

## 📱 Get Your Twilio Credentials
1. Go to https://console.twilio.com/
2. Copy your Account SID (starts with AC...)
3. Create an API Key (starts with SK...)
4. Copy the API Secret
5. Purchase/use your phone number

## 🛠 Installation Steps

```bash
# 1. Clone repository
git clone <your-repo-url>
cd beagle-twenty

# 2. Install dependencies
yarn install

# 3. Setup database
createdb test
# or
psql postgres -c "CREATE DATABASE test;"

# 4. Copy environment file
cp DEPLOYMENT_GUIDE.md packages/twenty-server/.env
# Edit the .env file with your actual credentials above

# 5. Start application
yarn start
```

## 🎯 Access Points
- **Frontend**: http://localhost:3001
- **Backend**: http://localhost:3000
- **Calling API**: http://localhost:3000/rest/calling/*
- **Phone Management**: http://localhost:3000/rest/phone-numbers/*

## 🔒 Security Notes
- Never commit `.env` files to git
- Use API Keys instead of Auth Tokens for Twilio
- Keep credentials secure and rotate regularly

## 🎉 Features Ready
✅ Multi-number provisioning  
✅ Call logging and recording  
✅ Real-time transcription  
✅ Lead assignment  
✅ Call outcomes tracking  
✅ HubSpot-style interface  
