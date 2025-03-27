// --- START CONFIGURATION ---
// !!! SECURITY WARNING: DO NOT PUT YOUR REAL API KEY HERE FOR A PUBLIC WEBSITE !!!
const GEMINI_API_KEY = "AIzaSyD0QWnkS7PiYNGV9aKvdF_1ckzVV56A2z8"; // Replace with your actual key
const GEMINI_MODEL_NAME = "gemini-1.5-flash"; // Or "gemini-pro"

// --- Website Context ---
// Carefully placed within backticks (template literal)
const WEBSITE_CONTEXT = `
You are a helpful AI assistant for a website that sells homemade food. Your goal is to answer user questions based *only* on the following information about the website. If the user asks something not covered here, politely state that you don't have that information or suggest they check the relevant page or contact support. Do not make up information.

Website Information:
- Service: Provides homemade food delivery from nearby home chefs. Healthier alternative to restaurants. Ideal for sick, elderly, or busy people.
- Availability: 24/7.
- Delivery Only: No pickup option available.
- Website Structure:
    - Header: Contains Logo (left), Home button, Outlets button, Cart button, Profile button, Search bar (top right corner). Clicking logo or Home button goes to the home page.
    - Home Page: Contains company info and 'Contact Us' details (including email for technical issues).
    - Outlets Page: Lists available outlets (home chefs) and their menus with prices. Users can filter for vegetarian and non-vegetarian options. Food spiciness is mentioned in the description if applicable. No specific kids' section, but users can browse for suitable dishes.
    - Cart Page: Shows selected items, total price (including taxes/delivery), and available payment options. Users can change delivery address here *before* placing the order.
    - Profile Page: Contains user details (full name, email, phone, location, occupation).
- Search Bar: Located in the top right corner of the page.
- Food Quality: Home-cooked by local chefs, ensuring high quality, health, and taste. Ingredients are fresh. Some dishes use organic ingredients. Food is packed securely, sometimes using eco-friendly packaging.
- Customization & Special Diets: No food customization allowed. Filtering for vegetarian/non-vegetarian is available on the Outlets page. No specific kids' menu. No nutritional information or detailed allergen list currently provided.
- Offers & Pricing: No offers or discounts currently available. No hidden charges; the final price is shown at checkout. Prices are on the Outlets page.
- Ordering & Scheduling: Orders cannot be scheduled for later; they are prepared fresh when ordered. Order modifications or cancellations are NOT possible after placement. Cannot add items to an existing order; place a new one.
- Payment: Accepts Credit/Debit cards and UPI. Cash-on-delivery (COD) is NOT available. Only one payment method per order. No loyalty program currently.
- Delivery:
    - Time: Depends on location and chef availability. Estimated time shown before ordering.
    - Charges: Vary by location and order value; shown at checkout.
    - Area: Only shows chefs/outlets delivering to the user's current location. If none show, delivery isn't available there.
    - Tracking: Real-time tracking available in the 'Cart' section after ordering.
    - Address Changes: Cannot be changed after order placement. Change in Cart *before* ordering.
    - Pickup: No curbside or other pickup options; delivery only.
- Issues & Support:
    - Technical Issues: Email support via 'Contact Us' on the home page.
    - Order Issues (Delay, Bad/Spoiled/Damaged Food, etc.): Contact support via email or phone (details on home page).
    - Refunds: No cancellations, so refunds are generally not available. Contact support for issues with received food.
- App & Feedback: No mobile app currently; use the website. Feedback can be mailed to the support email ID.
-Products we have (Outlets page): Chicken Biriyani,vada,pizza,italian prawn fry,momos,grilled chicken,japanese noodles,veggie salad,meals,paneer tikka,pulka rotti,dosa.
`; // End of the template literal

// --- Embedded CSS (with Image Upload Support) ---
const chatbotCSS = `
/* Chatbot Container Styles */
#chatbot-container {
    position: relative;
    font-family: 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
}

/* Chat Toggle Button - Modern Floating Button */
#chatbot-toggle-button {
    position: fixed;
    bottom: 25px;
    right: 25px;
    width: 64px;
    height: 64px;
    background: linear-gradient(135deg, #FF5F6D 0%, #FFC371 100%);
    color: white;
    border: none;
    border-radius: 50%;
    font-size: 24px;
    cursor: pointer;
    box-shadow: 0 6px 16px rgba(255, 95, 109, 0.3);
    z-index: 1000;
    display: flex;
    justify-content: center;
    align-items: center;
    transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
}

#chatbot-toggle-button:hover {
    transform: scale(1.1);
    box-shadow: 0 8px 20px rgba(255, 95, 109, 0.4);
}

/* Chat Window - Modern Card Design */
#chatbot-window {
    position: fixed;
    bottom: 100px;
    right: 25px;
    width: 380px;
    max-width: 90vw;
    height: 500px;
    max-height: 70vh;
    background: white;
    border-radius: 16px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
    z-index: 999;
    display: none;
    flex-direction: column;
    overflow: hidden;
    font-family: inherit;
    border: 1px solid rgba(255, 255, 255, 0.2);
    backdrop-filter: blur(10px);
}

#chatbot-window.open {
    display: flex;
    animation: fadeInUp 0.3s ease-out;
}

@keyframes fadeInUp {
    from {
        opacity: 0;
        transform: translateY(20px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

/* Chat Header - Sleek Gradient */
.chatbot-header {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    padding: 14px 20px;
    color: white;
    font-weight: 600;
    font-size: 16px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-shrink: 0;
}

#chatbot-close-button {
    background: rgba(255, 255, 255, 0.2);
    border: none;
    width: 28px;
    height: 28px;
    border-radius: 50%;
    color: white;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background 0.2s ease;
}

#chatbot-close-button:hover {
    background: rgba(255, 255, 255, 0.3);
}

/* Messages Area - Clean Scrollable Space */
#chatbot-messages {
    flex-grow: 1;
    overflow-y: auto;
    padding: 20px;
    display: flex;
    flex-direction: column;
    gap: 12px;
    background-color: #f9fafb;
}

/* Custom Scrollbar */
#chatbot-messages::-webkit-scrollbar {
    width: 6px;
}

#chatbot-messages::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, 0.05);
    border-radius: 3px;
}

#chatbot-messages::-webkit-scrollbar-thumb {
    background: rgba(0, 0, 0, 0.2);
    border-radius: 3px;
}

/* Message Bubbles - Modern Gradient Styles */
.message {
    padding: 12px 16px;
    border-radius: 18px;
    max-width: 85%;
    word-wrap: break-word;
    line-height: 1.5;
    font-size: 14px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
    position: relative;
    animation: messageAppear 0.2s ease-out;
}

@keyframes messageAppear {
    from {
        opacity: 0;
        transform: translateY(5px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

/* User Message - Vibrant Gradient */
.user-message {
    background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
    color: white;
    align-self: flex-end;
    border-bottom-right-radius: 4px;
    margin-left: 15%;
}

/* Bot Message - Subtle Professional Gradient */
.bot-message {
    background: linear-gradient(135deg, #f5f7fa 0%, #e4e8eb 100%);
    color: #2d3748;
    align-self: flex-start;
    border-bottom-left-radius: 4px;
    margin-right: 15%;
}

/* Error Message */
.error-message {
    background-color: #fff5f5;
    color: #e53e3e;
    border: 1px solid #fed7d7;
    align-self: center;
    border-radius: 8px;
    padding: 10px 15px;
    font-size: 13px;
    max-width: 90%;
}

.typing-indicator {
    font-style: italic;
    color: #718096;
    align-self: flex-start;
    background-color: #edf2f7;
    border-radius: 18px;
    padding: 10px 16px;
    display: inline-flex;
    align-items: center;
    gap: 6px;
}

.typing-indicator::after {
    content: '...';
    display: inline-block;
    width: 20px;
    animation: typingDots 1.5s infinite;
}

@keyframes typingDots {
    0%, 20% { content: '.'; }
    40% { content: '..'; }
    60%, 100% { content: '...'; }
}

/* Input Area - Modern Sticky Footer */
.chatbot-input-area {
    display: flex;
    align-items: center;
    padding: 12px 16px;
    background: white;
    border-top: 1px solid #e2e8f0;
    flex-shrink: 0;
    gap: 8px;
    position: relative;
}

#chatbot-input {
    flex-grow: 1;
    padding: 12px 16px;
    border: 1px solid #e2e8f0;
    border-radius: 24px;
    font-size: 14px;
    outline: none;
    transition: all 0.2s ease;
    background: #f8fafc;
}

#chatbot-input:focus {
    border-color: #a0aec0;
    background: white;
    box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.1);
}

/* Send Button - Matching Gradient */
#chatbot-send-button {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border: none;
    border-radius: 50%;
    width: 44px;
    height: 44px;
    font-size: 18px;
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
    transition: all 0.2s ease;
    box-shadow: 0 2px 6px rgba(102, 126, 234, 0.3);
}

#chatbot-send-button:hover {
    transform: scale(1.05);
    box-shadow: 0 4px 8px rgba(102, 126, 234, 0.4);
}

/* Microphone Button - Modern Style */
#chatbot-mic-button {
    background: #f8fafc;
    border: none;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    color: #4a5568;
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
    transition: all 0.2s ease;
}

#chatbot-mic-button:hover {
    background: #edf2f7;
    color: #2d3748;
}

#chatbot-mic-button.recording {
    color: white;
    background: linear-gradient(135deg, #f56565 0%, #e53e3e 100%);
    animation: pulse 1.5s infinite ease-in-out;
}

/* Image Upload Button */
#chatbot-image-button {
    background: #f8fafc;
    border: none;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    color: #4a5568;
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
    transition: all 0.2s ease;
    flex-shrink: 0;
}

#chatbot-image-button:hover {
    background: #edf2f7;
    color: #2d3748;
}

#chatbot-image-input {
    display: none;
}

/* Image Preview in Chat */
.message-image {
    max-width: 100%;
    max-height: 200px;
    border-radius: 12px;
    margin-top: 8px;
    object-fit: contain;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

/* Image Upload Preview */
.image-preview-container {
    position: absolute;
    bottom: 70px;
    right: 0;
    width: 100%;
    background: white;
    padding: 10px;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    display: none;
}

.image-preview {
    max-width: 100%;
    max-height: 150px;
    border-radius: 6px;
}

.remove-image-button {
    position: absolute;
    top: 5px;
    right: 5px;
    background: rgba(0,0,0,0.5);
    color: white;
    border: none;
    border-radius: 50%;
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
}

/* Disclaimer Text */
.chatbot-disclaimer {
    font-size: 11px;
    text-align: center;
    padding: 8px;
    color: #a0aec0;
    background: white;
    border-top: 1px solid #e2e8f0;
}

/* Pulse Animation for Recording */
@keyframes pulse {
    0% {
        box-shadow: 0 0 0 0 rgba(229, 62, 62, 0.5);
    }
    70% {
        box-shadow: 0 0 0 10px rgba(229, 62, 62, 0);
    }
    100% {
        box-shadow: 0 0 0 0 rgba(229, 62, 62, 0);
    }
}

/* Responsive Adjustments */
@media (max-width: 480px) {
    #chatbot-window {
        width: 90vw;
        right: 5vw;
        bottom: 80px;
    }
    
    .message {
        max-width: 80%;
    }
    
    .image-preview-container {
        bottom: 60px;
    }
}
`;
// --- END CONFIGURATION & CSS ---

// --- Function to Inject CSS ---
function injectChatbotCSS() {
    const styleElement = document.createElement('style');
    styleElement.textContent = chatbotCSS;
    document.head.appendChild(styleElement);
    console.log("Chatbot CSS injected.");
}
injectChatbotCSS(); // Inject styles early

// --- DOM Element References ---
let chatbotToggleButton, chatbotWindow, chatbotCloseButton, chatbotMessages, 
    chatbotInput, chatbotSendButton, chatbotMicButton, chatbotImageButton,
    chatbotInputArea, chatbotImageInput, imagePreviewContainer;

// --- Global State ---
let conversationHistory = [];
let isChatbotOpen = false;
let domReady = false;
let recognition; // SpeechRecognition instance
let isRecording = false; // Track recording state
let currentImageFile = null; // To store the current image file

// --- Web Speech API Setup ---
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const speechApiSupported = SpeechRecognition ? true : false;

// --- Functions ---

/**
 * Appends a message to the chat window with optional image
 * @param {string} text - The message text
 * @param {'user' | 'bot' | 'error' | 'typing'} type - The type of message
 * @param {string|null} imageUrl - Optional image URL to display
 * @returns {HTMLElement | null} The created message element or null if not ready
 */
function displayMessage(text, type, imageUrl = null) {
    if (!domReady || !chatbotMessages) return null;

    const messageElement = document.createElement('div');
    messageElement.classList.add('message', `${type}-message`);
    
    if (text) {
        messageElement.textContent = text;
    }
    
    if (imageUrl) {
        const imgElement = document.createElement('img');
        imgElement.src = imageUrl;
        imgElement.classList.add('message-image');
        messageElement.appendChild(document.createElement('br'));
        messageElement.appendChild(imgElement);
    }
    
    if (type === 'typing') {
        messageElement.classList.add('typing-indicator');
    }
    
    chatbotMessages.appendChild(messageElement);
    chatbotMessages.scrollTo({ top: chatbotMessages.scrollHeight, behavior: 'smooth' });
    return messageElement;
}

/**
 * Handles image selection and validation
 * @param {File} file - The image file to handle
 */
function handleImageUpload(file) {
    if (!file) return;
    
    // Validate image file
    if (!file.type.match('image.*')) {
        displayMessage("Please upload an image file (JPEG, PNG, etc.)", 'error');
        return;
    }
    
    // Check file size (limit to 5MB)
    if (file.size > 5 * 1024 * 1024) {
        displayMessage("Image size should be less than 5MB", 'error');
        return;
    }
    
    currentImageFile = file;
    
    // Show preview
    const reader = new FileReader();
    reader.onload = (e) => {
        const previewImg = imagePreviewContainer.querySelector('.image-preview');
        previewImg.src = e.target.result;
        imagePreviewContainer.style.display = 'block';
    };
    reader.readAsDataURL(file);
}

/**
 * Removes the currently selected image
 */
function removeCurrentImage() {
    currentImageFile = null;
    imagePreviewContainer.style.display = 'none';
}

/**
 * Sends the user's message to the Gemini API with optional image
 */
async function handleSendMessage() {
    if (!domReady) return;

    const userInput = chatbotInput.value.trim();
    if (!userInput && !currentImageFile) return;

    // Display user message with image if available
    let imageUrl = null;
    if (currentImageFile) {
        imageUrl = URL.createObjectURL(currentImageFile);
    }
    displayMessage(userInput || "📷 Image", 'user', imageUrl);

    // Prepare message for history
    const userMessage = {
        role: "user",
        parts: []
    };

    if (userInput) {
        userMessage.parts.push({ text: userInput });
    }

    if (currentImageFile) {
        // Convert image to base64 for API
        const base64Image = await new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result.split(',')[1]);
            reader.readAsDataURL(currentImageFile);
        });
        
        userMessage.parts.push({
            inlineData: {
                mimeType: currentImageFile.type,
                data: base64Image
            }
        });
    }

    conversationHistory.push(userMessage);
    chatbotInput.value = '';
    const typingIndicator = displayMessage("Thinking", 'typing');
    removeCurrentImage(); // Clear image after sending

    // Prepare payload with image support
    const requestPayload = {
        contents: [
            {
                role: "user",
                parts: [{ text: `System Instruction: ${WEBSITE_CONTEXT}\n\nOkay, now answer the following user question based *only* on the information provided above.` }]
            },
            {
                role: "model",
                parts: [{ text: "Okay, I understand. I will answer questions based only on the provided website information. How can I help?" }]
            },
            ...conversationHistory.slice(-20)
        ],
        safetySettings: [
            { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
            { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
            { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
            { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
        ],
        generationConfig: {
            temperature: 0.7, topK: 1, topP: 1, maxOutputTokens: 256,
        },
    };

    const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL_NAME}:generateContent?key=${GEMINI_API_KEY}`;

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(requestPayload)
        });

        if(typingIndicator) chatbotMessages.removeChild(typingIndicator);

        if (!response.ok) {
            let errorMsg = `API Error: ${response.status} ${response.statusText}`;
            try {
                const errorData = await response.json();
                errorMsg = `API Error: ${errorData.error?.message || errorMsg}`;
            } catch (e) {}
            console.error("API Error Response Status:", response.status, "Body:", await response.text().catch(() => "Could not read error body"));
            displayMessage(errorMsg, 'error');
            conversationHistory.pop();
            return;
        }

        const data = await response.json();

        let botResponse = "Sorry, I couldn't get a response.";
        if (data.candidates && data.candidates.length > 0 && data.candidates[0].content && data.candidates[0].content.parts && data.candidates[0].content.parts.length > 0) {
            botResponse = data.candidates[0].content.parts[0].text;

            if (data.candidates[0].finishReason && data.candidates[0].finishReason !== "STOP") {
                botResponse = `Response stopped: ${data.candidates[0].finishReason}. I cannot provide an answer due to safety settings or other limitations.`;
                console.warn("Gemini Response Finish Reason:", data.candidates[0].finishReason, data.candidates[0].safetyRatings);
            }
        } else if (data.promptFeedback && data.promptFeedback.blockReason) {
            botResponse = `I cannot process that request due to safety guidelines (Reason: ${data.promptFeedback.blockReason}).`;
            console.warn("Gemini Prompt Blocked:", data.promptFeedback.blockReason, data.promptFeedback.safetyRatings);
            displayMessage(botResponse, 'bot');
            conversationHistory.pop();
            return;
        } else {
            console.error("Unexpected API response structure:", data);
            botResponse = "Received an unexpected response format from the API.";
        }

        displayMessage(botResponse, 'bot');
        conversationHistory.push({ role: "model", parts: [{ text: botResponse }] });

        if (conversationHistory.length > 20) {
            conversationHistory = conversationHistory.slice(-20);
        }

    } catch (error) {
        console.error("Network or other error during API call:", error);
        if(typingIndicator) chatbotMessages.removeChild(typingIndicator);
        displayMessage(`Error communicating with the AI service: ${error.message}`, 'error');
        conversationHistory.pop();
    }
}

/** Toggles the visibility of the chatbot window. */
function toggleChatbot() {
    if (!domReady) return;
    isChatbotOpen = !isChatbotOpen;
    chatbotWindow.classList.toggle('open');
    chatbotToggleButton.setAttribute('aria-label', isChatbotOpen ? 'Close Chat' : 'Open Chat');
    if (isChatbotOpen) {
        chatbotInput.focus();
    } else {
        // Stop recognition if window is closed while recording
        if (isRecording && recognition) {
            recognition.stop();
            isRecording = false;
            if (chatbotMicButton) {
                chatbotMicButton.classList.remove('recording');
                chatbotMicButton.setAttribute('aria-label', 'Start voice input');
            }
        }
        // Clear any pending image upload
        removeCurrentImage();
    }
}

/** Initializes Speech Recognition */
function setupVoiceInput() {
    if (!speechApiSupported || !domReady) {
        if (!speechApiSupported) console.warn("Speech Recognition API not supported by this browser.");
        if (!domReady) console.warn("DOM not ready for voice input setup.");
        return;
    }

    // Create and append the microphone button
    chatbotMicButton = document.createElement('button');
    chatbotMicButton.id = 'chatbot-mic-button';
    chatbotMicButton.type = 'button';
    chatbotMicButton.setAttribute('aria-label', 'Start voice input');
    chatbotMicButton.innerHTML = '<i class="fas fa-microphone"></i>';

    // Insert mic button in the input area
    if (chatbotInputArea && chatbotSendButton) {
        chatbotInputArea.insertBefore(chatbotMicButton, chatbotSendButton);
        chatbotMicButton.style.display = 'inline-flex';
    } else {
        console.error("Cannot add mic button: Input area or send button not found.");
        return;
    }

    recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    // Event Handlers for Speech Recognition
    recognition.onresult = (event) => {
        const speechResult = event.results[0][0].transcript;
        chatbotInput.value = speechResult;
        console.log('Speech recognized:', speechResult);
    };

    recognition.onspeechend = () => {
        if (isRecording) recognition.stop();
    };

    recognition.onstart = () => {
        isRecording = true;
        chatbotMicButton.classList.add('recording');
        chatbotMicButton.setAttribute('aria-label', 'Stop voice input');
        console.log('Voice recognition started.');
    };

    recognition.onend = () => {
        if (isRecording) {
            isRecording = false;
            chatbotMicButton.classList.remove('recording');
            chatbotMicButton.setAttribute('aria-label', 'Start voice input');
            console.log('Voice recognition ended.');
        }
    };

    recognition.onerror = (event) => {
        console.error('Speech Recognition Error:', event.error, event.message);
        let errorMessage = 'Voice recognition error';
        switch(event.error) {
            case 'no-speech': errorMessage = 'No speech detected. Please try again.'; break;
            case 'audio-capture': errorMessage = 'Microphone problem. Ensure it is connected and enabled.'; break;
            case 'not-allowed': errorMessage = 'Microphone access denied. Please allow access in browser settings.'; break;
            case 'network': errorMessage = 'Network error during voice recognition.'; break;
            case 'aborted': errorMessage = 'Voice recognition stopped.'; break;
            case 'service-not-allowed': errorMessage = 'Browser or OS blocked speech service.'; break;
            default: errorMessage = `Error: ${event.error}`;
        }
        if (event.error !== 'aborted') {
            displayMessage(errorMessage, 'error');
        }
        if (isRecording) {
            isRecording = false;
            chatbotMicButton.classList.remove('recording');
            chatbotMicButton.setAttribute('aria-label', 'Start voice input');
        }
    };

    // Add click listener to the mic button
    chatbotMicButton.addEventListener('click', () => {
        if (!recognition) return;

        if (isRecording) {
            recognition.stop();
        } else {
            try {
                if (navigator.permissions && navigator.permissions.query) {
                    navigator.permissions.query({ name: 'microphone' }).then((permissionStatus) => {
                        if (permissionStatus.state === 'granted' || permissionStatus.state === 'prompt') {
                            recognition.start();
                        } else if (permissionStatus.state === 'denied') {
                            displayMessage('Microphone access previously denied. Please allow access in browser settings.', 'error');
                        }
                        permissionStatus.onchange = () => {
                            console.log("Mic permission state changed to:", permissionStatus.state);
                        };
                    }).catch(err => {
                        console.warn("Microphone permission query failed, proceeding to start recognition directly.", err);
                        recognition.start();
                    });
                } else {
                    console.log("Permissions API not fully supported, starting recognition directly.");
                    recognition.start();
                }
            } catch(err) {
                console.error("Error initiating recognition:", err);
                displayMessage(`Could not start voice recognition: ${err.message}`, 'error');
                isRecording = false;
                chatbotMicButton.classList.remove('recording');
                chatbotMicButton.setAttribute('aria-label', 'Start voice input');
            }
        }
    });

    console.log("Voice input setup complete.");
}

/** Sets up image upload functionality */
function setupImageUpload() {
    // Create image upload button
    chatbotImageButton = document.createElement('button');
    chatbotImageButton.id = 'chatbot-image-button';
    chatbotImageButton.type = 'button';
    chatbotImageButton.setAttribute('aria-label', 'Upload image');
    chatbotImageButton.innerHTML = '<i class="fas fa-image"></i>';
    
    // Create hidden file input
    chatbotImageInput = document.createElement('input');
    chatbotImageInput.id = 'chatbot-image-input';
    chatbotImageInput.type = 'file';
    chatbotImageInput.accept = 'image/*';
    chatbotImageInput.style.display = 'none';
    
    // Create image preview container
    imagePreviewContainer = document.createElement('div');
    imagePreviewContainer.className = 'image-preview-container';
    imagePreviewContainer.innerHTML = `
        <button class="remove-image-button">&times;</button>
        <img class="image-preview" src="" alt="Image preview">
    `;
    
    // Insert elements into DOM
    chatbotInputArea.insertBefore(chatbotImageButton, chatbotMicButton);
    chatbotInputArea.appendChild(chatbotImageInput);
    chatbotWindow.appendChild(imagePreviewContainer);
    
    // Event listeners
    chatbotImageButton.addEventListener('click', () => chatbotImageInput.click());
    chatbotImageInput.addEventListener('change', (e) => {
        if (e.target.files.length) {
            handleImageUpload(e.target.files[0]);
        }
    });
    
    imagePreviewContainer.querySelector('.remove-image-button').addEventListener('click', removeCurrentImage);
    
    // Drag and drop support
    chatbotWindow.addEventListener('dragover', (e) => {
        e.preventDefault();
        chatbotWindow.classList.add('drag-over');
    });
    
    chatbotWindow.addEventListener('dragleave', () => {
        chatbotWindow.classList.remove('drag-over');
    });
    
    chatbotWindow.addEventListener('drop', (e) => {
        e.preventDefault();
        chatbotWindow.classList.remove('drag-over');
        if (e.dataTransfer.files.length) {
            handleImageUpload(e.dataTransfer.files[0]);
        }
    });
}

/** Initializes the chatbot elements and event listeners. */
function initializeChatbot() {
    // Find DOM Elements
    chatbotToggleButton = document.getElementById('chatbot-toggle-button');
    chatbotWindow = document.getElementById('chatbot-window');
    chatbotCloseButton = document.getElementById('chatbot-close-button');
    chatbotMessages = document.getElementById('chatbot-messages');
    chatbotInput = document.getElementById('chatbot-input');
    chatbotSendButton = document.getElementById('chatbot-send-button');
    chatbotInputArea = document.querySelector('.chatbot-input-area');

    // Check if all critical elements were found
    if (!chatbotToggleButton || !chatbotWindow || !chatbotCloseButton || !chatbotMessages || 
        !chatbotInput || !chatbotSendButton || !chatbotInputArea) {
        console.error("Chatbot initialization failed: Required elements not found.");
        if(chatbotToggleButton) chatbotToggleButton.style.display = 'none';
        return;
    }

    domReady = true;
    
    // Setup all features
    setupVoiceInput();
    setupImageUpload();

    // Event Listeners
    chatbotToggleButton.addEventListener('click', toggleChatbot);
    chatbotCloseButton.addEventListener('click', toggleChatbot);
    chatbotSendButton.addEventListener('click', handleSendMessage);
    chatbotInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            handleSendMessage();
        }
    });

    // Initial greeting
    const initialGreeting = "Hi there! How can I help you navigate our homemade food website today?";
    if (!chatbotMessages.querySelector('.bot-message')) {
        displayMessage(initialGreeting, 'bot');
    }
    conversationHistory = [{ role: "model", parts: [{ text: initialGreeting }] }];

    console.log("Chatbot initialized. Speech API Supported:", speechApiSupported);
}

// --- Wait for DOM ready before initializing ---
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeChatbot);
} else {
    initializeChatbot();
}