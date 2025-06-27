const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '..')));

// OpenAI API configuration
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

// EmailJS configuration (if using server-side email)
const SMTP_CONFIG = {
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: process.env.SMTP_PORT || 587,
    secure: false,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
};

// Chat API endpoint - Proxy to OpenAI
app.post('/api/chat', async (req, res) => {
    try {
        const { message, context } = req.body;

        if (!OPENAI_API_KEY) {
            return res.status(500).json({ 
                error: 'OpenAI API key not configured',
                response: 'I apologize, but the AI service is currently unavailable. Please try the quick reply options or contact our support team directly.' 
            });
        }

        // Build the conversation for OpenAI
        const messages = [
            {
                role: "system",
                content: context || buildDefaultContext()
            },
            {
                role: "user", 
                content: message
            }
        ];

        // Call OpenAI API
        // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
        const openaiResponse = await fetch(OPENAI_API_URL, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${OPENAI_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: 'gpt-4o',
                messages: messages,
                max_tokens: 500,
                temperature: 0.7,
                response_format: { type: "json_object" }
            })
        });

        if (!openaiResponse.ok) {
            throw new Error(`OpenAI API error: ${openaiResponse.status}`);
        }

        const aiData = await openaiResponse.json();
        let responseText = aiData.choices[0].message.content;

        try {
            // Try to parse as JSON
            const parsedResponse = JSON.parse(responseText);
            res.json({
                response: parsedResponse.response || responseText,
                action: parsedResponse.action || null
            });
        } catch (parseError) {
            // If not JSON, return as plain text
            res.json({
                response: responseText,
                action: null
            });
        }

    } catch (error) {
        console.error('Chat API error:', error);
        res.status(500).json({
            error: 'Failed to process chat message',
            response: 'I apologize, but I\'m having trouble processing your request right now. Please try again or contact our support team.'
        });
    }
});

// Email sending endpoint
app.post('/api/send-email', async (req, res) => {
    try {
        const { to, subject, template, data } = req.body;

        // If using nodemailer for server-side email
        if (process.env.SMTP_USER && process.env.SMTP_PASS) {
            const nodemailer = require('nodemailer');
            
            const transporter = nodemailer.createTransporter(SMTP_CONFIG);

            let htmlContent = '';
            if (template === 'subscription') {
                htmlContent = generateSubscriptionEmailHTML(data);
            }

            const mailOptions = {
                from: process.env.SMTP_USER,
                to: to,
                subject: subject,
                html: htmlContent
            };

            await transporter.sendMail(mailOptions);
            res.json({ success: true, message: 'Email sent successfully' });
        } else {
            // Return success even if SMTP is not configured
            // The frontend will handle EmailJS as fallback
            res.json({ success: true, message: 'Email configuration not available, using client-side method' });
        }

    } catch (error) {
        console.error('Email sending error:', error);
        res.status(500).json({ 
            error: 'Failed to send email',
            message: 'Please try contacting us directly via WhatsApp or email'
        });
    }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'ok', 
        timestamp: new Date().toISOString(),
        openai_configured: !!OPENAI_API_KEY,
        email_configured: !!(process.env.SMTP_USER && process.env.SMTP_PASS)
    });
});

// Serve static files (for integration with existing websites)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'integration-example.html'));
});

function buildDefaultContext() {
    return `You are an AI assistant for an IPTV (Internet Protocol Television) service company. 

Your role is to help customers with:
- Information about IPTV services and technology
- Subscription plans and pricing
- Technical support and troubleshooting
- Account management questions
- General customer service inquiries

Company Information:
- We offer premium IPTV streaming services
- Multiple subscription plans available (Basic $9.99/month, Premium $19.99/month, Ultimate $29.99/month)
- 24/7 customer support
- High-quality streaming with minimal buffering
- Compatible with various devices (Smart TV, mobile, tablets, Fire TV, etc.)
- Over 8000 channels available in the Ultimate plan
- VOD library with 50,000+ titles
- 4K Ultra HD support on Premium and Ultimate plans

Guidelines:
- Be helpful, friendly, and professional
- Provide accurate information about IPTV services
- If you don't know something specific, direct them to human support
- Keep responses concise but informative
- Always try to guide towards a subscription or support resolution
- For pricing questions, suggest they see the pricing plans
- For subscription requests, suggest they use the subscription form

IMPORTANT: Always respond in JSON format with a 'response' field containing your answer. 
You can optionally include an 'action' field with values like 'show_pricing' or 'show_subscription_form' to trigger specific UI actions.

Example response format:
{
  "response": "I'd be happy to help you with information about our IPTV service. What would you like to know?",
  "action": null
}`;
}

function generateSubscriptionEmailHTML(data) {
    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <title>New IPTV Subscription Request</title>
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; }
            .info-section { margin: 20px 0; }
            .info-label { font-weight: bold; color: #667eea; }
            .footer { background: #f8f9fa; padding: 20px; text-align: center; color: #6c757d; }
        </style>
    </head>
    <body>
        <div class="header">
            <h1>New IPTV Subscription Request</h1>
        </div>
        
        <div class="content">
            <div class="info-section">
                <div class="info-label">Customer Name:</div>
                <div>${data.customer_name}</div>
            </div>
            
            <div class="info-section">
                <div class="info-label">Email Address:</div>
                <div>${data.customer_email}</div>
            </div>
            
            <div class="info-section">
                <div class="info-label">Phone Number:</div>
                <div>${data.customer_phone}</div>
            </div>
            
            <div class="info-section">
                <div class="info-label">Selected Plan:</div>
                <div>${data.selected_plan} - ${data.plan_price}</div>
            </div>
            
            <div class="info-section">
                <div class="info-label">Additional Message:</div>
                <div>${data.customer_message}</div>
            </div>
            
            <div class="info-section">
                <div class="info-label">Submission Date:</div>
                <div>${data.submission_date}</div>
            </div>
        </div>
        
        <div class="footer">
            <p>This request was submitted through the IPTV chatbot system.</p>
            <p>Please follow up with the customer within 24 hours.</p>
        </div>
    </body>
    </html>`;
}

// Start server
app.listen(PORT, '0.0.0.0', () => {
    console.log(`IPTV Chatbot Proxy Server running on port ${PORT}`);
    console.log(`OpenAI API Key configured: ${!!OPENAI_API_KEY}`);
    console.log(`SMTP Email configured: ${!!(process.env.SMTP_USER && process.env.SMTP_PASS)}`);
});

module.exports = app;
