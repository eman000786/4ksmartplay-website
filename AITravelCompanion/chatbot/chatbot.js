class IPTVChatbot {
    constructor() {
        this.isOpen = false;
        this.isMinimized = false;
        this.messages = [];
        this.faqs = {};
        this.pricing = {};
        this.config = {
            openaiApiKey: '', // Will be loaded from environment or proxy
            emailjsServiceId: 'service_iptv_chat',
            emailjsTemplateId: 'template_iptv_inquiry',
            emailjsPublicKey: '', // Will be loaded from environment
            whatsappNumber: '+1234567890', // Configure your WhatsApp Business number
            businessEmail: 'support@iptv-service.com'
        };
        
        this.init();
    }

    async init() {
        this.loadConfiguration();
        await this.loadFAQs();
        await this.loadPricingPlans();
        this.setupEventListeners();
        this.setupEmailJS();
        this.loadChatHistory();
        this.displayWelcomeMessage();
    }

    loadConfiguration() {
        // Load configuration from environment variables or fallback
        this.config.openaiApiKey = window.OPENAI_API_KEY || '';
        this.config.emailjsPublicKey = window.EMAILJS_PUBLIC_KEY || '';
        this.config.whatsappNumber = window.WHATSAPP_NUMBER || this.config.whatsappNumber;
        this.config.businessEmail = window.BUSINESS_EMAIL || this.config.businessEmail;
    }

    async loadFAQs() {
        try {
            const response = await fetch('./config/faqs.json');
            this.faqs = await response.json();
        } catch (error) {
            console.error('Failed to load FAQs:', error);
            this.faqs = this.getDefaultFAQs();
        }
    }

    async loadPricingPlans() {
        try {
            const response = await fetch('./config/pricing.json');
            this.pricing = await response.json();
            this.populatePlanSelect();
        } catch (error) {
            console.error('Failed to load pricing:', error);
            this.pricing = this.getDefaultPricing();
            this.populatePlanSelect();
        }
    }

    populatePlanSelect() {
        const select = document.getElementById('selected-plan');
        if (select && this.pricing.plans) {
            select.innerHTML = '<option value="">Select a plan...</option>';
            this.pricing.plans.forEach(plan => {
                const option = document.createElement('option');
                option.value = plan.id;
                option.textContent = `${plan.name} - ${plan.price}`;
                select.appendChild(option);
            });
        }
    }

    setupEventListeners() {
        // Chat toggle
        const toggleBtn = document.getElementById('chat-toggle');
        const chatWindow = document.getElementById('chat-window');
        const minimizeBtn = document.getElementById('minimize-chat');
        
        toggleBtn.addEventListener('click', () => this.toggleChat());
        minimizeBtn.addEventListener('click', () => this.minimizeChat());

        // Message input
        const chatInput = document.getElementById('chat-input');
        const sendButton = document.getElementById('send-message');
        
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });
        
        sendButton.addEventListener('click', () => this.sendMessage());

        // Quick replies
        const quickReplies = document.querySelectorAll('.quick-reply-btn');
        quickReplies.forEach(btn => {
            btn.addEventListener('click', () => {
                const message = btn.dataset.message;
                this.sendMessage(message);
            });
        });

        // Human support
        const humanSupportBtn = document.getElementById('human-support');
        humanSupportBtn.addEventListener('click', () => this.initializeHumanSupport());

        // Subscription modal
        const subscriptionForm = document.getElementById('subscription-form');
        const closeModal = document.getElementById('close-modal');
        const cancelSubscription = document.getElementById('cancel-subscription');

        subscriptionForm.addEventListener('submit', (e) => this.handleSubscriptionForm(e));
        closeModal.addEventListener('click', () => this.closeSubscriptionModal());
        cancelSubscription.addEventListener('click', () => this.closeSubscriptionModal());

        // Click outside modal to close
        const modal = document.getElementById('subscription-modal');
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.closeSubscriptionModal();
            }
        });
    }

    setupEmailJS() {
        if (this.config.emailjsPublicKey) {
            // Initialize EmailJS
            if (typeof emailjs !== 'undefined') {
                emailjs.init(this.config.emailjsPublicKey);
            }
        }
    }

    toggleChat() {
        const chatWindow = document.getElementById('chat-window');
        const chatIcon = document.querySelector('.chat-icon');
        const closeIcon = document.querySelector('.close-icon');
        const notificationBadge = document.getElementById('notification-badge');

        if (this.isOpen) {
            this.closeChat();
        } else {
            this.openChat();
        }

        this.isOpen = !this.isOpen;
        
        // Toggle icons
        chatIcon.classList.toggle('hidden');
        closeIcon.classList.toggle('hidden');
        
        // Hide notification badge when opening
        if (this.isOpen) {
            notificationBadge.classList.add('hidden');
        }
    }

    openChat() {
        const chatWindow = document.getElementById('chat-window');
        chatWindow.classList.remove('hidden');
        setTimeout(() => chatWindow.classList.add('show'), 10);
        
        // Focus on input
        setTimeout(() => {
            document.getElementById('chat-input').focus();
        }, 300);
    }

    closeChat() {
        const chatWindow = document.getElementById('chat-window');
        chatWindow.classList.remove('show');
        setTimeout(() => chatWindow.classList.add('hidden'), 300);
    }

    minimizeChat() {
        this.closeChat();
        this.isOpen = false;
        
        const chatIcon = document.querySelector('.chat-icon');
        const closeIcon = document.querySelector('.close-icon');
        
        chatIcon.classList.remove('hidden');
        closeIcon.classList.add('hidden');
    }

    async sendMessage(text = null) {
        const input = document.getElementById('chat-input');
        const message = text || input.value.trim();
        
        if (!message) return;

        // Clear input if not using quick reply
        if (!text) {
            input.value = '';
        }

        // Add user message
        this.addMessage(message, 'user');
        
        // Show typing indicator
        this.showTypingIndicator();

        try {
            // Process message and get response
            const response = await this.processMessage(message);
            
            // Hide typing indicator
            this.hideTypingIndicator();
            
            // Add bot response
            this.addMessage(response.text, 'bot', response.data);
            
        } catch (error) {
            console.error('Error processing message:', error);
            this.hideTypingIndicator();
            this.addMessage('I apologize, but I\'m having trouble processing your request right now. Please try again or contact our support team.', 'bot');
        }

        // Save chat history
        this.saveChatHistory();
    }

    async processMessage(message) {
        const messageText = message.toLowerCase();
        
        // Check for FAQ matches first
        for (const [key, faq] of Object.entries(this.faqs)) {
            if (faq.keywords.some(keyword => messageText.includes(keyword.toLowerCase()))) {
                return {
                    text: faq.answer,
                    data: faq.action ? { action: faq.action } : null
                };
            }
        }

        // Check for pricing request
        if (messageText.includes('price') || messageText.includes('plan') || messageText.includes('cost')) {
            return {
                text: 'Here are our current IPTV subscription plans:',
                data: { action: 'show_pricing' }
            };
        }

        // Check for subscription request
        if (messageText.includes('subscribe') || messageText.includes('sign up') || messageText.includes('buy')) {
            return {
                text: 'Great! I\'d be happy to help you subscribe to our IPTV service. Please provide your details and I\'ll get you started.',
                data: { action: 'show_subscription_form' }
            };
        }

        // Use AI for complex queries
        return await this.getAIResponse(message);
    }

    // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
    async getAIResponse(message) {
        try {
            // Use proxy server to call OpenAI API securely
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    message: message,
                    context: this.buildContextPrompt()
                })
            });

            if (!response.ok) {
                throw new Error('API request failed');
            }

            const data = await response.json();
            return {
                text: data.response || 'I\'m not sure how to help with that. Could you please rephrase your question?',
                data: data.action ? { action: data.action } : null
            };

        } catch (error) {
            console.error('AI response error:', error);
            return {
                text: 'I\'m having trouble understanding your request. Here are some things I can help you with:\n\n• Information about IPTV services\n• Pricing and subscription plans\n• Technical support\n• Account management\n\nWhat would you like to know more about?'
            };
        }
    }

    buildContextPrompt() {
        return `You are an AI assistant for an IPTV (Internet Protocol Television) service company. 
        
        Your role is to help customers with:
        - Information about IPTV services and technology
        - Subscription plans and pricing
        - Technical support and troubleshooting
        - Account management questions
        - General customer service inquiries
        
        Company Information:
        - We offer premium IPTV streaming services
        - Multiple subscription plans available
        - 24/7 customer support
        - High-quality streaming with minimal buffering
        - Compatible with various devices (Smart TV, mobile, tablets, etc.)
        
        Guidelines:
        - Be helpful, friendly, and professional
        - Provide accurate information about IPTV services
        - If you don't know something specific, direct them to human support
        - Keep responses concise but informative
        - Always try to guide towards a subscription or support resolution
        
        Respond in JSON format with 'response' field containing your answer and optionally an 'action' field if a specific action should be triggered (like 'show_pricing' or 'show_subscription_form').`;
    }

    addMessage(text, sender, data = null) {
        const messagesContainer = document.getElementById('chat-messages');
        const messageElement = document.createElement('div');
        messageElement.className = `message ${sender}-message`;
        
        const avatarSVG = sender === 'bot' 
            ? '<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle>'
            : '<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle>';

        messageElement.innerHTML = `
            <div class="message-avatar">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    ${avatarSVG}
                </svg>
            </div>
            <div class="message-content">
                <div class="message-text">${this.formatMessage(text)}</div>
                <div class="message-time">${this.formatTime(new Date())}</div>
            </div>
        `;

        messagesContainer.appendChild(messageElement);

        // Handle special actions
        if (data && data.action) {
            this.handleMessageAction(data.action, messageElement);
        }

        // Scroll to bottom
        messagesContainer.scrollTop = messagesContainer.scrollHeight;

        // Store message
        this.messages.push({
            text,
            sender,
            timestamp: new Date().toISOString(),
            data
        });
    }

    handleMessageAction(action, messageElement) {
        switch (action) {
            case 'show_pricing':
                this.showPricingCards(messageElement);
                break;
            case 'show_subscription_form':
                setTimeout(() => this.showSubscriptionModal(), 500);
                break;
        }
    }

    showPricingCards(messageElement) {
        if (!this.pricing.plans || this.pricing.plans.length === 0) return;

        const pricingHTML = `
            <div class="pricing-cards">
                ${this.pricing.plans.map(plan => `
                    <div class="pricing-card ${plan.popular ? 'popular' : ''}" onclick="chatbot.selectPlan('${plan.id}')">
                        <div class="plan-name">${plan.name}</div>
                        <div class="plan-price">${plan.price}</div>
                        <ul class="plan-features">
                            ${plan.features.map(feature => `<li>${feature}</li>`).join('')}
                        </ul>
                    </div>
                `).join('')}
            </div>
        `;

        const pricingContainer = document.createElement('div');
        pricingContainer.innerHTML = pricingHTML;
        messageElement.querySelector('.message-content').appendChild(pricingContainer);
    }

    selectPlan(planId) {
        const plan = this.pricing.plans.find(p => p.id === planId);
        if (plan) {
            this.addMessage(`Great choice! The ${plan.name} plan offers excellent value. Let me help you get started with the subscription process.`, 'bot');
            setTimeout(() => this.showSubscriptionModal(planId), 500);
        }
    }

    showSubscriptionModal(selectedPlanId = null) {
        const modal = document.getElementById('subscription-modal');
        const planSelect = document.getElementById('selected-plan');
        
        if (selectedPlanId && planSelect) {
            planSelect.value = selectedPlanId;
        }
        
        modal.classList.remove('hidden');
        setTimeout(() => modal.classList.add('show'), 10);
        
        // Focus on first input
        setTimeout(() => {
            document.getElementById('customer-name').focus();
        }, 300);
    }

    closeSubscriptionModal() {
        const modal = document.getElementById('subscription-modal');
        modal.classList.remove('show');
        setTimeout(() => modal.classList.add('hidden'), 300);
        
        // Reset form
        document.getElementById('subscription-form').reset();
    }

    async handleSubscriptionForm(e) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const subscriptionData = {
            name: document.getElementById('customer-name').value,
            email: document.getElementById('customer-email').value,
            phone: document.getElementById('customer-phone').value,
            plan: document.getElementById('selected-plan').value,
            message: document.getElementById('customer-message').value,
            timestamp: new Date().toISOString()
        };

        try {
            // Send email notification
            await this.sendSubscriptionEmail(subscriptionData);
            
            // Show success message
            this.addMessage('Thank you for your subscription request! We\'ve received your information and will contact you within 24 hours to complete the setup. You should also receive a confirmation email shortly.', 'bot');
            
            // Close modal
            this.closeSubscriptionModal();
            
        } catch (error) {
            console.error('Subscription submission error:', error);
            alert('There was an error submitting your request. Please try again or contact us directly.');
        }
    }

    async sendSubscriptionEmail(data) {
        const plan = this.pricing.plans.find(p => p.id === data.plan);
        const planName = plan ? plan.name : 'Unknown Plan';
        const planPrice = plan ? plan.price : 'N/A';

        const templateParams = {
            customer_name: data.name,
            customer_email: data.email,
            customer_phone: data.phone || 'Not provided',
            selected_plan: planName,
            plan_price: planPrice,
            customer_message: data.message || 'No additional message',
            submission_date: new Date().toLocaleString()
        };

        if (typeof emailjs !== 'undefined' && this.config.emailjsServiceId) {
            await emailjs.send(
                this.config.emailjsServiceId,
                this.config.emailjsTemplateId,
                templateParams
            );
        } else {
            // Fallback: send via proxy server
            await fetch('/api/send-email', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    to: this.config.businessEmail,
                    subject: `New IPTV Subscription Request - ${data.name}`,
                    template: 'subscription',
                    data: templateParams
                })
            });
        }
    }

    initializeHumanSupport() {
        const options = [
            {
                text: 'WhatsApp Support',
                action: () => this.openWhatsApp()
            },
            {
                text: 'Email Support', 
                action: () => this.openEmail()
            }
        ];

        const optionsHTML = options.map(option => 
            `<button class="quick-reply-btn" onclick="(${option.action.toString()})()">${option.text}</button>`
        ).join('');

        this.addMessage(`I'll connect you with our human support team. Choose your preferred method:

<div class="quick-replies" style="margin-top: 10px;">
    ${optionsHTML}
</div>`, 'bot');
    }

    openWhatsApp() {
        const message = encodeURIComponent('Hello, I need assistance with your IPTV service.');
        const whatsappUrl = `https://wa.me/${this.config.whatsappNumber.replace('+', '')}?text=${message}`;
        window.open(whatsappUrl, '_blank');
        
        this.addMessage('Opening WhatsApp... You can also save our number: ' + this.config.whatsappNumber, 'bot');
    }

    openEmail() {
        const subject = encodeURIComponent('IPTV Support Request');
        const body = encodeURIComponent('Hello,\n\nI need assistance with your IPTV service.\n\nPlease describe your issue or question here.\n\nThank you!');
        const emailUrl = `mailto:${this.config.businessEmail}?subject=${subject}&body=${body}`;
        window.location.href = emailUrl;
        
        this.addMessage('Opening your email client... You can also contact us directly at: ' + this.config.businessEmail, 'bot');
    }

    showTypingIndicator() {
        const indicator = document.getElementById('typing-indicator');
        const messagesContainer = document.getElementById('chat-messages');
        
        indicator.classList.remove('hidden');
        messagesContainer.appendChild(indicator);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    hideTypingIndicator() {
        const indicator = document.getElementById('typing-indicator');
        indicator.classList.add('hidden');
    }

    formatMessage(text) {
        // Convert line breaks to HTML
        return text.replace(/\n/g, '<br>');
    }

    formatTime(date) {
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }

    displayWelcomeMessage() {
        // Add welcome message if no chat history
        if (this.messages.length === 0) {
            setTimeout(() => {
                this.addMessage('Hi! I\'m your IPTV assistant. How can I help you today?', 'bot');
            }, 1000);
        }
    }

    saveChatHistory() {
        try {
            localStorage.setItem('iptv_chat_history', JSON.stringify(this.messages));
        } catch (error) {
            console.error('Failed to save chat history:', error);
        }
    }

    loadChatHistory() {
        try {
            const history = localStorage.getItem('iptv_chat_history');
            if (history) {
                this.messages = JSON.parse(history);
                this.restoreChatMessages();
            }
        } catch (error) {
            console.error('Failed to load chat history:', error);
            this.messages = [];
        }
    }

    restoreChatMessages() {
        const messagesContainer = document.getElementById('chat-messages');
        messagesContainer.innerHTML = '';
        
        this.messages.forEach(message => {
            this.addMessageToDOM(message.text, message.sender, message.data, new Date(message.timestamp));
        });
    }

    addMessageToDOM(text, sender, data, timestamp) {
        const messagesContainer = document.getElementById('chat-messages');
        const messageElement = document.createElement('div');
        messageElement.className = `message ${sender}-message`;
        
        const avatarSVG = '<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle>';

        messageElement.innerHTML = `
            <div class="message-avatar">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    ${avatarSVG}
                </svg>
            </div>
            <div class="message-content">
                <div class="message-text">${this.formatMessage(text)}</div>
                <div class="message-time">${this.formatTime(timestamp)}</div>
            </div>
        `;

        messagesContainer.appendChild(messageElement);

        // Handle special actions for restored messages
        if (data && data.action && sender === 'bot') {
            this.handleMessageAction(data.action, messageElement);
        }
    }

    getDefaultFAQs() {
        return {
            "what_is_iptv": {
                "keywords": ["what is iptv", "iptv meaning", "define iptv", "iptv definition"],
                "answer": "IPTV (Internet Protocol Television) is a system where television content is delivered using Internet Protocol over a network infrastructure, which may include delivery by a broadband connection. Unlike traditional terrestrial, satellite, and cable TV, IPTV gives you the ability to stream content continuously, offering features like video on demand, live TV, and time-shifted media."
            },
            "how_to_subscribe": {
                "keywords": ["how to subscribe", "subscription process", "how to sign up", "how to join"],
                "answer": "Subscribing to our IPTV service is easy! Simply choose your preferred plan, provide your contact details, and we'll set up your account within 24 hours. You'll receive login credentials and setup instructions via email.",
                "action": "show_subscription_form"
            },
            "channels_offered": {
                "keywords": ["what channels", "channel list", "available channels", "channel packages"],
                "answer": "We offer a comprehensive range of channels including:\n\n• Premium sports channels (ESPN, Fox Sports, Sky Sports)\n• International channels from 50+ countries\n• Movie and entertainment channels (HBO, Netflix content, Hulu)\n• News channels (CNN, BBC, Fox News)\n• Kids channels (Disney, Cartoon Network)\n• Music channels and radio stations\n\nThe exact channel lineup depends on your subscription plan."
            },
            "renewal_process": {
                "keywords": ["renew subscription", "renewal", "extend subscription", "reactivate"],
                "answer": "To renew your IPTV subscription:\n\n1. Contact our support team via WhatsApp or email\n2. Choose your renewal period (monthly, quarterly, or yearly)\n3. Complete the payment process\n4. Your service will be extended automatically\n\nWe'll send you renewal reminders before your subscription expires."
            },
            "troubleshooting": {
                "keywords": ["not working", "buffering", "connection issues", "streaming problems", "troubleshoot"],
                "answer": "Common streaming issues and solutions:\n\n• **Buffering**: Check your internet speed (minimum 10 Mbps recommended)\n• **Connection problems**: Restart your device and router\n• **App crashes**: Clear app cache or reinstall the IPTV app\n• **No sound/video**: Check audio/video settings in the app\n\nIf problems persist, please contact our technical support team."
            }
        };
    }

    getDefaultPricing() {
        return {
            "plans": [
                {
                    "id": "basic",
                    "name": "Basic Plan",
                    "price": "$9.99/month",
                    "features": [
                        "1000+ Live TV Channels",
                        "Basic Sports Packages",
                        "Standard Definition (SD)",
                        "2 Device Connections",
                        "Email Support"
                    ],
                    "popular": false
                },
                {
                    "id": "premium",
                    "name": "Premium Plan",
                    "price": "$19.99/month",
                    "features": [
                        "5000+ Live TV Channels",
                        "Premium Sports & Movies",
                        "High Definition (HD)",
                        "5 Device Connections",
                        "VOD Library Access",
                        "24/7 Support"
                    ],
                    "popular": true
                },
                {
                    "id": "ultimate",
                    "name": "Ultimate Plan", 
                    "price": "$29.99/month",
                    "features": [
                        "8000+ Live TV Channels",
                        "All Sports & Premium Content",
                        "4K Ultra HD Support",
                        "Unlimited Device Connections",
                        "Full VOD Library",
                        "Priority 24/7 Support",
                        "EPG & Catch-up TV"
                    ],
                    "popular": false
                }
            ]
        };
    }
}

// Initialize chatbot when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.chatbot = new IPTVChatbot();
});

// Global function to select plan (needed for pricing cards)
window.selectPlan = function(planId) {
    if (window.chatbot) {
        window.chatbot.selectPlan(planId);
    }
};
