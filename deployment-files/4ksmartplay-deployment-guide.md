# 4ksmartplay IPTV Chatbot Deployment Guide

## 🚀 Quick Deployment to GitHub

### Step 1: Upload Files to Your Repository

1. **Download/copy these files to your local computer:**
   ```
   chatbot/
   ├── chatbot.html
   ├── chatbot.css  
   ├── chatbot.js
   └── config/
       ├── faqs.json
       └── pricing.json
   ```

2. **Add the chatbot folder to your GitHub repository:**
   - Go to your repository: https://github.com/eman000786/4ksmartplay-website
   - Click "Add file" → "Upload files"
   - Drag and drop the entire `chatbot` folder
   - Commit the changes

### Step 2: Update Your index.html

Add these lines to your existing `index.html`:

**A. Add to the `<head>` section (after your existing CSS):**
```html
<!-- IPTV Chatbot Integration -->
<link rel="stylesheet" href="chatbot/chatbot.css">
<script src="https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js"></script>

<!-- Configure chatbot settings -->
<script>
    window.EMAILJS_PUBLIC_KEY = 'your_emailjs_key_here'; // Optional: for email notifications
    window.WHATSAPP_NUMBER = '+1234567890'; // Replace with your WhatsApp number
    window.BUSINESS_EMAIL = 'support@4ksmartplay.com'; // Replace with your email
</script>

<!-- Chatbot theme matching -->
<style>
.chatbot-widget .chat-toggle {
    background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%) !important;
    box-shadow: 0 4px 20px rgba(59, 130, 246, 0.4) !important;
}
.chatbot-widget .chat-header {
    background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%) !important;
}
</style>
```

**B. Add before the closing `</body>` tag:**
```html
<!-- AI Chatbot Widget -->
<div id="iptv-chatbot-container"></div>

<script>
// Load chatbot
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
    })
    .catch(error => console.error('Chatbot loading failed:', error));
</script>
```

### Step 3: Configure Your Settings

**Update the WhatsApp number and email in the script:**
```javascript
window.WHATSAPP_NUMBER = 'https://wa.me/message/J57HF5KVRMSUJ1'; // Your actual WhatsApp link
window.BUSINESS_EMAIL = 'support@4ksmartplay.com'; // Your business email
```

### Step 4: Enable GitHub Pages

1. Go to your repository settings
2. Scroll to "Pages" section
3. Select "Deploy from a branch"
4. Choose "main" branch
5. Click "Save"

Your website will be live at: `https://eman000786.github.io/4ksmartplay-website`

## ✨ What Your Customers Will Experience

### Chatbot Features Available:
- **Floating chat button** in bottom-right corner
- **Instant FAQ responses** for common IPTV questions
- **Dynamic pricing display** showing your plans
- **Subscription form** to collect customer details
- **WhatsApp/Telegram handoff** for human support
- **Mobile-responsive design** matching your site theme

### Sample Conversations:
- "What is IPTV?" → Instant detailed explanation
- "Show me pricing plans" → Displays your subscription packages
- "How to subscribe?" → Opens subscription form
- "Need technical help" → Provides troubleshooting steps + human contact

## 🎨 Customization Options

### Update FAQ Responses
Edit `chatbot/config/faqs.json`:
```json
{
    "custom_question": {
        "keywords": ["keyword1", "keyword2"],
        "answer": "Your custom response",
        "action": null
    }
}
```

### Update Pricing Plans
Edit `chatbot/config/pricing.json`:
```json
{
    "plans": [
        {
            "id": "plan_id",
            "name": "Plan Name",
            "price": "$XX.XX/month",
            "features": ["Feature 1", "Feature 2"],
            "popular": true
        }
    ]
}
```

### Change Chatbot Colors
Add to your CSS:
```css
.chatbot-widget .chat-toggle {
    background: linear-gradient(135deg, #your-color1, #your-color2) !important;
}
```

## 🔧 Advanced Features (Optional)

### Email Notifications
1. Sign up at https://emailjs.com
2. Create a service and template
3. Add your public key to the configuration
4. Customers' subscription requests will be emailed to you

### Analytics Integration
Add to your chatbot script:
```javascript
// Track chatbot interactions
gtag('event', 'chatbot_interaction', {
    'event_category': 'engagement',
    'event_label': 'chat_opened'
});
```

## 🎯 Testing Your Chatbot

1. **Visit your GitHub Pages URL**
2. **Look for the chat button** (blue/purple gradient circle)
3. **Test these interactions:**
   - "What is IPTV?"
   - "Show pricing plans"
   - "How to subscribe?"
   - "Need help with buffering"

## 📞 Support Integration

The chatbot automatically integrates with your existing contact methods:
- WhatsApp: Uses your existing link
- Telegram: Links to your Telegram
- Discord: Links to your Discord server

## 🚀 Go Live Checklist

- [ ] Chatbot files uploaded to GitHub
- [ ] index.html updated with integration code
- [ ] WhatsApp number configured
- [ ] Business email configured  
- [ ] GitHub Pages enabled
- [ ] Chatbot tested on live site
- [ ] FAQ responses customized for 4ksmartplay
- [ ] Pricing plans updated with your packages

## 🎉 You're Ready!

Your 4ksmartplay IPTV website now has a professional AI chatbot that will:
- Answer customer questions 24/7
- Showcase your pricing plans
- Collect subscription requests
- Provide technical support
- Match your website's design perfectly

The chatbot will significantly improve customer experience and help convert visitors into subscribers!