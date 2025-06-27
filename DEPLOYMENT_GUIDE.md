# IPTV Chatbot Deployment Guide

## ✅ Current Status
Your IPTV AI chatbot system is fully built and ready for deployment! Here's what's been completed:

### What's Working Right Now
- ✅ AI-powered chatbot with OpenAI GPT-4o integration
- ✅ Floating chat widget with professional design
- ✅ FAQ system for instant responses to common IPTV questions
- ✅ Dynamic pricing display from JSON configuration
- ✅ Customer subscription form with email notifications
- ✅ WhatsApp and email support integration
- ✅ Mobile-responsive design
- ✅ Proxy server for secure API management

### Server Status
- ✅ Server running on port 5000
- ✅ OpenAI API key configured and working
- ✅ All endpoints responding correctly
- ✅ Static file serving operational

## 🚀 How to Test Your Chatbot

### Local Testing (Working Now)
1. Open your browser and go to: `http://localhost:5000`
2. You'll see the IPTV service example page
3. Look for the purple chat button in the bottom-right corner
4. Click it to open the chatbot
5. Try these test messages:
   - "What is IPTV?" (FAQ response)
   - "Show me pricing plans" (Dynamic pricing)
   - "I want to subscribe" (Subscription form)
   - "Help with streaming" (Technical support)

### FAQ System (Works Instantly)
The chatbot includes pre-programmed responses for:
- What is IPTV?
- How to subscribe
- Channel packages available
- Troubleshooting streaming issues
- Device compatibility
- Payment methods
- Free trial information
- Customer support options
- Internet speed requirements

## 📁 Project Structure

```
your-project/
├── chatbot/
│   ├── chatbot.html          # Chat widget UI
│   ├── chatbot.css           # Styling and animations  
│   ├── chatbot.js            # Main chatbot logic
│   ├── proxy-server.js       # Backend API server
│   ├── icons.svg             # SVG icons
│   └── config/
│       ├── faqs.json         # FAQ responses
│       └── pricing.json      # Pricing plans
├── integration-example.html  # Example website with chatbot
├── package.json             # Dependencies
└── README.md               # Documentation
```

## 🔧 Integration with Your Website

### Simple Integration (5 minutes)
Add this code to any HTML page where you want the chatbot:

```html
<!-- Include Chatbot CSS -->
<link rel="stylesheet" href="chatbot/chatbot.css">

<!-- Include EmailJS for notifications -->
<script src="https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js"></script>

<!-- Configure your settings -->
<script>
    window.EMAILJS_PUBLIC_KEY = 'your_emailjs_key_here';
    window.WHATSAPP_NUMBER = '+1234567890';
    window.BUSINESS_EMAIL = 'support@yourdomain.com';
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
```

## ⚙️ Configuration

### 1. Update FAQ Responses
Edit `chatbot/config/faqs.json` to customize responses:
```json
{
    "your_question": {
        "keywords": ["keyword1", "keyword2"],
        "answer": "Your custom response here",
        "action": null
    }
}
```

### 2. Update Pricing Plans  
Edit `chatbot/config/pricing.json`:
```json
{
    "plans": [
        {
            "id": "basic",
            "name": "Basic Plan",
            "price": "$9.99/month",
            "features": ["Feature 1", "Feature 2"],
            "popular": false
        }
    ]
}
```

### 3. Configure Contact Information
Update the script section in your HTML:
```javascript
window.WHATSAPP_NUMBER = '+your_whatsapp_number';
window.BUSINESS_EMAIL = 'your_email@domain.com';
```

## 📧 Email Notifications

### Option 1: EmailJS (Client-side)
1. Sign up at https://www.emailjs.com
2. Create a service and template
3. Get your public key and configure it in the script

### Option 2: Server-side Email (Advanced)
Set these environment variables:
```
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
```

## 🎨 Customization

### Brand Colors
Edit `chatbot/chatbot.css` and update these CSS variables:
```css
:root {
    --primary-gradient: linear-gradient(135deg, #your-color1 0%, #your-color2 100%);
    --primary-color: #your-brand-color;
}
```

### Chat Widget Position
Change position in `chatbot/chatbot.css`:
```css
.chatbot-widget {
    bottom: 20px;  /* Distance from bottom */
    right: 20px;   /* Distance from right */
    left: 20px;    /* Use this for left positioning */
}
```

## 🌐 Deployment Options

### GitHub Pages (Free)
1. Push your code to a GitHub repository
2. Enable GitHub Pages in repository settings
3. Your chatbot will be available at: `https://username.github.io/repository-name`

### Netlify (Free)
1. Connect your GitHub repository to Netlify
2. Deploy automatically on every push
3. Get a custom domain for your IPTV site

### Your Existing Website
1. Upload the `chatbot/` folder to your web server
2. Add the integration code to your existing pages
3. Ensure the paths match your server structure

## 🔧 Troubleshooting

### Chatbot Not Appearing
- Check browser console for JavaScript errors
- Ensure all file paths are correct
- Verify the chatbot files are uploaded to the server

### AI Responses Not Working
- Check if OpenAI API key is configured correctly
- Verify the proxy server is running
- Check server logs for API errors

### Email Notifications Not Sending
- Verify EmailJS configuration
- Check SMTP settings if using server-side email
- Test email service independently

## 📞 Support Features

### Human Handoff Options
The chatbot includes buttons for:
- WhatsApp direct messaging
- Email contact form
- Phone support (customizable)

### Chat History
- Automatically saves chat history in browser
- Persists across page reloads
- Clears when user clears browser data

## 🎯 Next Steps

1. **Test the chatbot** using the methods above
2. **Customize the FAQ responses** for your specific IPTV service
3. **Update pricing plans** with your actual packages
4. **Configure email notifications** for subscription requests
5. **Integrate with your existing website** using the provided code
6. **Deploy to your hosting platform** of choice

Your IPTV AI chatbot system is production-ready and will provide excellent customer support for your streaming service!