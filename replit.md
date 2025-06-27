# IPTV AI Chatbot System

## Overview

This is a fully automated AI-powered chatbot system designed specifically for IPTV subscription services. The system is built with vanilla JavaScript, HTML, and CSS for seamless integration with existing static websites. It provides intelligent customer support, handles subscription inquiries, collects customer data, and integrates with external services for email notifications and human support handoff.

## System Architecture

### Frontend Architecture
- **Pure Vanilla JavaScript**: No frameworks or dependencies required for the client-side code
- **Modular Design**: Chatbot functionality is encapsulated in a single class (`IPTVChatbot`) for easy maintenance
- **Responsive UI**: CSS-based responsive design that works across all device types
- **Floating Widget**: Non-intrusive chat widget that appears in the bottom-right corner of web pages

### Backend Architecture
- **Express.js Proxy Server**: Node.js server that handles API requests securely
- **OpenAI Integration**: GPT-4 integration for intelligent conversational responses
- **Email Service**: Nodemailer integration for automated email notifications
- **CORS-Enabled**: Cross-origin resource sharing for frontend-backend communication

### Configuration Management
- **JSON-Based Configuration**: FAQ responses and pricing plans stored in separate JSON files
- **Environment Variables**: Secure API key management through environment variables
- **Fallback Mechanisms**: Default configurations when external resources fail to load

## Key Components

### 1. Chatbot Widget (`chatbot/chatbot.js`)
- Main chatbot class with conversation management
- AI response generation through OpenAI API
- FAQ pattern matching for instant responses
- Customer data collection and processing
- Local storage for chat history persistence
- WhatsApp and email integration for human handoff

### 2. User Interface (`chatbot/chatbot.html` & `chatbot/chatbot.css`)
- Floating chat toggle button with notification badge
- Expandable chat window with message history
- Quick reply buttons for common inquiries
- Subscription form for customer data collection
- Mobile-responsive design with smooth animations

### 3. Proxy Server (`chatbot/proxy-server.js`)
- Secure API key management for OpenAI requests
- CORS handling for cross-origin requests
- Email service integration for notifications
- Static file serving for the chatbot assets

### 4. Configuration Files
- **FAQs (`config/faqs.json`)**: Pre-defined responses for common IPTV questions
- **Pricing (`config/pricing.json`)**: Dynamic pricing plans with features and promotions

## Data Flow

1. **User Interaction**: User opens chat widget and sends a message
2. **Pattern Matching**: System first checks for FAQ pattern matches
3. **AI Processing**: If no FAQ match, message is sent to OpenAI API via proxy server
4. **Response Generation**: AI generates contextual response about IPTV services
5. **Data Collection**: When user requests subscription, form collects contact details
6. **Email Notification**: Customer data is sent via email using EmailJS or Nodemailer
7. **Human Handoff**: Users can escalate to WhatsApp or email support
8. **History Storage**: Chat history is saved to local storage for persistence

## External Dependencies

### Required npm Packages
- `express`: Web server framework
- `cors`: Cross-origin resource sharing middleware
- `dotenv`: Environment variable management
- `openai`: Official OpenAI API client
- `nodemailer`: Email sending functionality

### External APIs
- **OpenAI API**: GPT-4 for intelligent conversation responses
- **EmailJS**: Client-side email sending (alternative to server-side)
- **WhatsApp Business API**: Direct messaging integration for human support

### Third-Party Services
- **Email Services**: SMTP configuration for automated notifications
- **Static Hosting**: GitHub Pages or similar for hosting the frontend

## Deployment Strategy

### Static Website Integration
1. Include chatbot CSS and JavaScript files in existing HTML pages
2. Configure API keys and business contact information
3. Add chatbot container div to HTML pages
4. Deploy static files to hosting platform (GitHub Pages, Netlify, etc.)

### Proxy Server Deployment
1. Deploy Node.js server to cloud platform (Heroku, Vercel, Railway)
2. Configure environment variables for API keys
3. Update frontend configuration to point to deployed proxy server
4. Ensure CORS settings allow requests from static website domain

### Environment Configuration
- `OPENAI_API_KEY`: OpenAI API key for chat functionality
- `EMAILJS_PUBLIC_KEY`: EmailJS public key for email notifications
- `WHATSAPP_NUMBER`: Business WhatsApp number for human support
- `BUSINESS_EMAIL`: Business email for customer inquiries
- `SMTP_*`: SMTP configuration for server-side email sending

## Changelog

```
Changelog:
- June 27, 2025: Initial project setup
- June 27, 2025: Built complete IPTV AI chatbot system
  - Implemented floating chat widget with professional UI
  - Integrated OpenAI GPT-4o for intelligent responses
  - Created comprehensive FAQ system for instant answers
  - Built subscription form with email notifications
  - Added WhatsApp and email support handoff options
  - Configured proxy server for secure API management
  - Made responsive design for all device types
  - Server running successfully on port 5000
```

## User Preferences

Preferred communication style: Simple, everyday language.