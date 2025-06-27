# IPTV AI Chatbot System

A fully automated AI-powered chatbot system designed specifically for IPTV subscription services. Built with vanilla JavaScript, HTML, and CSS for seamless integration with existing static websites.

## 🌟 Features

### Core Functionality
- **Floating Chat Widget**: Appears on all pages in the bottom-right corner
- **AI-Powered Responses**: Uses OpenAI GPT-4o for intelligent customer support
- **FAQ System**: Quick responses to common IPTV-related questions
- **Dynamic Pricing Display**: Shows subscription plans from JSON configuration
- **Customer Data Collection**: Collects and processes subscription requests
- **Human Support Integration**: WhatsApp and email handoff options
- **Email Notifications**: Automatic email alerts for new subscriptions
- **Chat History**: Persistent chat history using local storage

### Technical Features
- **Pure Vanilla JavaScript**: No frameworks required
- **Mobile-Friendly**: Responsive design that works on all devices
- **Cross-Browser Compatible**: Works on all modern browsers
- **Lightweight**: Minimal footprint for fast loading
- **Secure API Handling**: Proxy server for secure API key management
- **Easy Integration**: Simple HTML include for existing websites

## 🚀 Quick Start

### 1. Basic Integration

Add these lines to your existing HTML pages:

```html
<!-- Include Chatbot CSS -->
<link rel="stylesheet" href="chatbot/chatbot.css">

<!-- Include EmailJS for email functionality -->
<script src="https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js"></script>

<!-- Configure API keys -->
<script>
    window.OPENAI_API_KEY = ''; // Leave empty to use proxy server
    window.EMAILJS_PUBLIC_KEY = 'your_emailjs_public_key_here';
    window.WHATSAPP_NUMBER = '+1234567890';
    window.BUSINESS_EMAIL = 'support@iptv-service.com';
</script>

<!-- Add chatbot container before closing body tag -->
<div id="iptv-chatbot-container"></div>

<!-- Load chatbot -->
<script>
    fetch('chatbot/chatbot.html')
        .then(response => response.text())
        .then(html => {
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            const chatbotWidget = doc.getElementById('chatbot-widget');
            
            if (chatbotWidget) {
                document.getElementById('iptv-chatbot-container').appendChild(chatbotWidget);
                const script = document.createElement('script');
                script.src = 'chatbot/chatbot.js';
                document.head.appendChild(script);
            }
        });
</script>
