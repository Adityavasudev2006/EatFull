const GEMINI_API_KEY = "AIzaSyD0QWnkS7PiYNGV9aKvdF_1ckzVV56A2z8"; // Replace with your actual key
const GEMINI_MODEL_NAME = "gemini-1.5-flash"; // Or "gemini-pro"

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

// --- Embedded CSS (with Image Upload Support & TTS Button) ---
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

/* Header Title */
.chatbot-header-title {
    flex-grow: 1; /* Allow title to take available space */
    margin-right: 10px; /* Space between title and buttons */
}

/* Header Buttons Container */
.chatbot-header-buttons {
    display: flex;
    align-items: center;
    gap: 8px; /* Space between buttons */
}

/* TTS Toggle Button */
#chatbot-tts-button {
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
    transition: background 0.2s ease, color 0.2s ease;
    font-size: 14px; /* Adjust icon size if needed */
}

#chatbot-tts-button:hover {
    background: rgba(255, 255, 255, 0.3);
}

#chatbot-tts-button.tts-on {
    background: rgba(255, 255, 255, 0.4); /* Slightly different background when ON */
    color: #f0f0f0; /* Slightly different color when ON */
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
    flex-shrink: 0; /* Prevent shrinking */
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
    flex-shrink: 0; /* Prevent shrinking */
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
    bottom: 70px; /* Adjusted based on typical input area height */
    left: 16px; /* Align with input area padding */
    right: 16px; /* Align with input area padding */
    background: white;
    padding: 10px;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    display: none; /* Hidden by default */
    z-index: 10; /* Ensure it's above messages but below input */
    border: 1px solid #e2e8f0;
    max-width: calc(100% - 32px); /* Account for padding */
}

.image-preview-content {
    display: flex;
    align-items: center;
    gap: 10px;
}

.image-preview {
    max-width: 80px; /* Smaller preview */
    max-height: 80px;
    border-radius: 6px;
    object-fit: cover;
}

.image-preview-filename {
    flex-grow: 1;
    font-size: 13px;
    color: #4a5568;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.remove-image-button {
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
    flex-shrink: 0;
    font-size: 14px;
    line-height: 1;
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
        bottom: 60px; /* Adjust for smaller screens if needed */
    }

    .chatbot-header-title {
        font-size: 15px;
    }

    #chatbot-tts-button,
    #chatbot-close-button {
        width: 26px;
        height: 26px;
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
    chatbotInputArea, chatbotImageInput, imagePreviewContainer, chatbotHeader,
    ttsToggleButton; // <<< Added TTS Button reference

// --- Global State ---
let conversationHistory = [];
let isChatbotOpen = false;
let domReady = false;
let recognition; // SpeechRecognition instance
let isRecording = false; // Track recording state
let currentImageFile = null; // To store the current image file
let isTTSEnabled = false; // <<< Added TTS state
let currentUtterance = null; // To hold the current speech utterance

// --- Web Speech API Setup ---
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const speechApiSupported = SpeechRecognition ? true : false;
const synthesisApiSupported = 'speechSynthesis' in window; // <<< Check for TTS support

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
        messageElement.appendChild(document.createElement('br')); // Add space if both text and image
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
        const filenameSpan = imagePreviewContainer.querySelector('.image-preview-filename');
        previewImg.src = e.target.result;
        filenameSpan.textContent = file.name;
        imagePreviewContainer.style.display = 'block'; // Show the preview container
        chatbotInputArea.style.paddingBottom = `${imagePreviewContainer.offsetHeight + 10}px`; // Adjust input area padding
    };
    reader.readAsDataURL(file);
}

/**
 * Removes the currently selected image
 */
function removeCurrentImage() {
    currentImageFile = null;
    if (chatbotImageInput) chatbotImageInput.value = ''; // Clear file input
    imagePreviewContainer.style.display = 'none'; // Hide preview
    chatbotInputArea.style.paddingBottom = ''; // Reset input area padding
}


/**
 * Stops any ongoing speech synthesis.
 */
function stopSpeech() {
    if (synthesisApiSupported && window.speechSynthesis.speaking) {
        window.speechSynthesis.cancel();
        console.log("Speech synthesis cancelled.");
    }
    currentUtterance = null;
}

/**
 * Speaks the given text using the browser's TTS engine.
 * @param {string} text - The text to speak.
 */
function speakText(text) {
    if (!isTTSEnabled || !synthesisApiSupported || !text) {
        return; // Exit if TTS is off, not supported, or no text
    }

    stopSpeech(); // Stop any previous speech before starting new

    currentUtterance = new SpeechSynthesisUtterance(text);
    currentUtterance.lang = 'en-US'; // Optional: set language
    currentUtterance.rate = 1.0;    // Optional: set speed (0.1 to 10)
    currentUtterance.pitch = 1.0;   // Optional: set pitch (0 to 2)

    currentUtterance.onerror = (event) => {
        console.error('SpeechSynthesisUtterance.onerror', event);
        displayMessage(`Speech synthesis error: ${event.error}`, 'error');
        currentUtterance = null;
    };

    currentUtterance.onend = () => {
        console.log("Speech synthesis finished.");
        currentUtterance = null;
    };

    // Delay slightly to ensure the message appears visually first
    setTimeout(() => {
        window.speechSynthesis.speak(currentUtterance);
        console.log("Speaking:", text.substring(0, 50) + "...");
    }, 100); // Small delay
}

/**
 * Sends the user's message to the Gemini API with optional image
 */
async function handleSendMessage() {
    if (!domReady) return;

    const userInput = chatbotInput.value.trim();
    if (!userInput && !currentImageFile) return;

    stopSpeech(); // Stop any currently playing speech when user sends a new message

    // Display user message with image if available
    let imageUrl = null;
    let displayedUserText = userInput || "📷 Image Uploaded";
    if (currentImageFile) {
        // Create a temporary URL for display purposes ONLY
        imageUrl = URL.createObjectURL(currentImageFile);
    }
    displayMessage(userInput, 'user', imageUrl); // Pass actual user text for display

    // Prepare message for history
    const userMessage = {
        role: "user",
        parts: []
    };

    if (userInput) {
        userMessage.parts.push({ text: userInput });
    }

    // Handle image for API
    let base64Image = null;
    let imageMimeType = null;
    if (currentImageFile) {
        imageMimeType = currentImageFile.type;
        // Convert image to base64 for API
        base64Image = await new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result.split(',')[1]);
            reader.onerror = (error) => reject(error);
            reader.readAsDataURL(currentImageFile);
        });

        userMessage.parts.push({
            inlineData: {
                mimeType: imageMimeType,
                data: base64Image
            }
        });
    }

    conversationHistory.push(userMessage);
    chatbotInput.value = '';
    const typingIndicator = displayMessage("Thinking", 'typing');
    removeCurrentImage(); // Clear image preview *after* processing it for the API

    // --- API Call Logic (mostly unchanged) ---
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
            ...conversationHistory.slice(-20) // Keep context, adjust history size if needed
        ],
        safetySettings: [
            { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
            { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
            { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
            { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
        ],
        generationConfig: {
            temperature: 0.7, topK: 1, topP: 1, maxOutputTokens: 256, // Adjust tokens if needed
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
            conversationHistory.pop(); // Remove the failed user message from history
            return;
        }

        const data = await response.json();

        let botResponse = "Sorry, I couldn't get a response.";
        if (data.candidates && data.candidates.length > 0 && data.candidates[0].content && data.candidates[0].content.parts && data.candidates[0].content.parts.length > 0) {
            // Check for valid text response part
            const textPart = data.candidates[0].content.parts.find(part => part.text);
            if (textPart) {
                botResponse = textPart.text;

                if (data.candidates[0].finishReason && data.candidates[0].finishReason !== "STOP") {
                    botResponse = `Response stopped: ${data.candidates[0].finishReason}. I cannot provide a complete answer due to safety settings or other limitations.`;
                    console.warn("Gemini Response Finish Reason:", data.candidates[0].finishReason, data.candidates[0].safetyRatings);
                }
            } else {
                console.warn("Received candidate but no text part found:", data.candidates[0]);
                botResponse = "Received a response format I couldn't process.";
            }

        } else if (data.promptFeedback && data.promptFeedback.blockReason) {
            botResponse = `I cannot process that request due to safety guidelines (Reason: ${data.promptFeedback.blockReason}).`;
            console.warn("Gemini Prompt Blocked:", data.promptFeedback.blockReason, data.promptFeedback.safetyRatings);
            // Display the block reason, but don't add user message to history if it was blocked
            displayMessage(botResponse, 'bot');
            conversationHistory.pop(); // Remove the blocked user message
            return; // Don't proceed to speak or add bot response to history
        } else {
            console.error("Unexpected API response structure:", data);
            botResponse = "Received an unexpected response format from the API.";
        }

        displayMessage(botResponse, 'bot');
        conversationHistory.push({ role: "model", parts: [{ text: botResponse }] });

        // >>>>> TTS Integration Point <<<<<
        speakText(botResponse);
        // >>>>> End TTS Integration Point <<<<<


        // Simple history management: keep last N turns (1 user + 1 bot = 1 turn)
        // Max 20 items = 10 turns approx.
        if (conversationHistory.length > 20) {
            // Keep the system prompt + the last 18 messages (9 turns)
             conversationHistory = [
                conversationHistory[0], // System user prompt
                conversationHistory[1], // System model response
                ...conversationHistory.slice(-18)
            ];
        }


    } catch (error) {
        console.error("Network or other error during API call:", error);
        if(typingIndicator) chatbotMessages.removeChild(typingIndicator);
        displayMessage(`Error communicating with the AI service: ${error.message}`, 'error');
        conversationHistory.pop(); // Remove the failed user message
    } finally {
         // Clean up the temporary object URL for the displayed image
        if (imageUrl) {
            URL.revokeObjectURL(imageUrl);
        }
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
        stopSpeech(); // Stop speech when closing the chat
        // Stop recognition if window is closed while recording
        if (isRecording && recognition) {
            recognition.abort(); // Use abort to prevent 'no-speech' error potentially
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
        // Optionally hide or disable the mic button if not supported
        return;
    }

    // Create and append the microphone button
    chatbotMicButton = document.createElement('button');
    chatbotMicButton.id = 'chatbot-mic-button';
    chatbotMicButton.type = 'button';
    chatbotMicButton.setAttribute('aria-label', 'Start voice input');
    chatbotMicButton.innerHTML = '<i class="fas fa-microphone"></i>'; // Ensure Font Awesome is loaded

    // Insert mic button in the input area (before send button)
    if (chatbotInputArea && chatbotSendButton) {
         // Insert before the send button
        chatbotInputArea.insertBefore(chatbotMicButton, chatbotSendButton);
        chatbotMicButton.style.display = 'inline-flex'; // Make sure it's visible
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
        // Optional: Automatically send after recognition?
        // handleSendMessage();
    };

    recognition.onspeechend = () => {
        // No need to explicitly stop here if continuous is false
        console.log('Speech end detected.');
    };

    recognition.onstart = () => {
        isRecording = true;
        chatbotMicButton.classList.add('recording');
        chatbotMicButton.setAttribute('aria-label', 'Stop voice input');
        console.log('Voice recognition started.');
    };

    recognition.onend = () => {
        // This fires naturally after speech stops or if stop()/abort() is called
        if (isRecording) { // Only update UI if it was actively recording
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
            case 'aborted': errorMessage = 'Voice recognition cancelled.'; break; // Don't show error for manual stop/abort
            case 'service-not-allowed': errorMessage = 'Browser or OS blocked speech service.'; break;
            default: errorMessage = `Error: ${event.error}`;
        }
        // Only display error if it wasn't an intentional abort
        if (event.error !== 'aborted') {
            displayMessage(errorMessage, 'error');
        }
         // Ensure UI resets correctly on error
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
            recognition.stop(); // User manually stops recording
        } else {
            // Request microphone permission explicitly if possible/needed
            navigator.mediaDevices.getUserMedia({ audio: true })
                .then(stream => {
                     // Permission granted, start recognition
                    try {
                        recognition.start();
                         // Important: Stop the tracks immediately after permission check if not needed continuously
                        stream.getTracks().forEach(track => track.stop());
                    } catch(err) {
                        console.error("Error starting recognition after getUserMedia:", err);
                        displayMessage(`Could not start voice recognition: ${err.message}`, 'error');
                         // Clean up tracks even if start fails
                         stream.getTracks().forEach(track => track.stop());
                    }
                })
                .catch(err => {
                    console.error("Microphone access denied or error:", err);
                    // Map common errors to user-friendly messages
                    let permErrorMessage = 'Could not access microphone.';
                    if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
                        permErrorMessage = 'Microphone access denied. Please allow access in browser settings.';
                    } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
                        permErrorMessage = 'No microphone found. Please ensure it is connected.';
                    } else if (err.name === 'NotReadableError' || err.name === 'TrackStartError') {
                         permErrorMessage = 'Microphone is already in use or cannot be accessed.';
                    }
                    displayMessage(permErrorMessage, 'error');
                     // Ensure UI state is correct
                    isRecording = false;
                    if(chatbotMicButton) {
                        chatbotMicButton.classList.remove('recording');
                        chatbotMicButton.setAttribute('aria-label', 'Start voice input');
                    }
                });
        }
    });

    console.log("Voice input setup complete.");
}


/** Sets up image upload functionality */
function setupImageUpload() {
    if (!domReady || !chatbotInputArea || !chatbotWindow) {
         console.error("DOM not ready or required elements missing for image upload setup.");
         return;
    }

    // Create image upload button
    chatbotImageButton = document.createElement('button');
    chatbotImageButton.id = 'chatbot-image-button';
    chatbotImageButton.type = 'button';
    chatbotImageButton.setAttribute('aria-label', 'Upload image');
    chatbotImageButton.innerHTML = '<i class="fas fa-image"></i>'; // Ensure Font Awesome is loaded

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
        <div class="image-preview-content">
            <img class="image-preview" src="" alt="Image preview">
            <span class="image-preview-filename"></span>
            <button class="remove-image-button" aria-label="Remove image">×</button>
        </div>
    `;

    // Insert elements into DOM
    // Order: Image Button -> Mic Button -> Send Button
    if (chatbotMicButton) {
        chatbotInputArea.insertBefore(chatbotImageButton, chatbotMicButton);
    } else if (chatbotSendButton) {
         // Fallback if mic button failed to initialize
         chatbotInputArea.insertBefore(chatbotImageButton, chatbotSendButton);
    } else {
         // Fallback if both failed (unlikely)
         chatbotInputArea.appendChild(chatbotImageButton);
    }

    chatbotInputArea.appendChild(chatbotImageInput); // Input itself can go at the end
    chatbotInputArea.appendChild(imagePreviewContainer); // Append preview inside input area

    // Event listeners
    chatbotImageButton.addEventListener('click', () => chatbotImageInput.click());
    chatbotImageInput.addEventListener('change', (e) => {
        if (e.target.files && e.target.files.length > 0) {
            handleImageUpload(e.target.files[0]);
        }
    });

    imagePreviewContainer.querySelector('.remove-image-button').addEventListener('click', removeCurrentImage);

    // Drag and drop support onto the *input area* or maybe whole window? Let's do window.
    chatbotWindow.addEventListener('dragover', (e) => {
        e.preventDefault();
        // Optional: Add a visual cue
        chatbotWindow.style.outline = '2px dashed #aaa';
    });

    chatbotWindow.addEventListener('dragleave', (e) => {
        // Make sure dragleave isn't triggered by entering a child element
        if (!chatbotWindow.contains(e.relatedTarget)) {
            chatbotWindow.style.outline = 'none';
        }
    });

    chatbotWindow.addEventListener('drop', (e) => {
        e.preventDefault();
        chatbotWindow.style.outline = 'none';
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            handleImageUpload(e.dataTransfer.files[0]);
            // Bring window to focus maybe?
            chatbotInput.focus();
        }
    });
     console.log("Image upload setup complete.");
}


/** Sets up the Text-to-Speech toggle button */
function setupTTSButton() {
    if (!synthesisApiSupported || !domReady || !chatbotHeader) {
        if (!synthesisApiSupported) console.warn("Speech Synthesis API not supported by this browser. TTS button disabled.");
        if (!domReady || !chatbotHeader) console.error("DOM not ready or header missing for TTS setup.");
        return; // Don't add the button if not supported or DOM not ready
    }

    // Create TTS Button
    ttsToggleButton = document.createElement('button');
    ttsToggleButton.id = 'chatbot-tts-button';
    ttsToggleButton.type = 'button';
    ttsToggleButton.setAttribute('aria-label', 'Enable response voice');
    ttsToggleButton.innerHTML = '<i class="fas fa-volume-mute"></i>'; // Default: OFF (Muted icon)

    // Get or create a container for header buttons
    let headerButtonsContainer = chatbotHeader.querySelector('.chatbot-header-buttons');
    if (!headerButtonsContainer) {
        headerButtonsContainer = document.createElement('div');
        headerButtonsContainer.className = 'chatbot-header-buttons';
        // Append it before the close button if it exists, otherwise at the end
        if (chatbotCloseButton) {
            chatbotHeader.insertBefore(headerButtonsContainer, chatbotCloseButton);
        } else {
            chatbotHeader.appendChild(headerButtonsContainer);
        }
    }

    // Add TTS button to the buttons container
    headerButtonsContainer.appendChild(ttsToggleButton);

    // Add event listener for toggling
    ttsToggleButton.addEventListener('click', () => {
        isTTSEnabled = !isTTSEnabled; // Toggle the state

        if (isTTSEnabled) {
            ttsToggleButton.innerHTML = '<i class="fas fa-volume-up"></i>'; // ON Icon
            ttsToggleButton.classList.add('tts-on');
            ttsToggleButton.setAttribute('aria-label', 'Disable response voice');
            console.log("TTS Enabled");
            // Optional: Speak a confirmation?
            // speakText("Voice enabled.");
        } else {
            ttsToggleButton.innerHTML = '<i class="fas fa-volume-mute"></i>'; // OFF Icon
            ttsToggleButton.classList.remove('tts-on');
            ttsToggleButton.setAttribute('aria-label', 'Enable response voice');
            stopSpeech(); // Stop speaking immediately if turned off
            console.log("TTS Disabled");
        }
    });

    console.log("TTS Button setup complete.");
}

/** Initializes the chatbot elements and event listeners. */
function initializeChatbot() {
    // Dynamically create Chatbot HTML Structure
    const chatbotContainer = document.createElement('div');
    chatbotContainer.id = 'chatbot-container';

    // Assume Font Awesome is loaded externally (e.g., via CDN in your main HTML)
    chatbotContainer.innerHTML = `
        <button id="chatbot-toggle-button" aria-label="Open Chat">
            <i class="fas fa-comment-dots"></i>
        </button>
        <div id="chatbot-window">
            <div class="chatbot-header">
                 <span class="chatbot-header-title">Chef AI Assistant</span>
                 <div class="chatbot-header-buttons">
                     <!-- TTS button will be added here by setupTTSButton -->
                 </div>
                <button id="chatbot-close-button" aria-label="Close Chat">×</button>
            </div>
            <div id="chatbot-messages">
                <!-- Messages will be appended here -->
            </div>
             <div class="chatbot-input-area">
                 <!-- Image Preview will be added here by setupImageUpload -->
                 <input type="text" id="chatbot-input" placeholder="Type message or ask...">
                 <!-- Image button will be added here by setupImageUpload -->
                 <!-- Mic button will be added here by setupVoiceInput -->
                 <button id="chatbot-send-button" aria-label="Send Message">
                     <i class="fas fa-paper-plane"></i>
                 </button>
             </div>
             <div class="chatbot-disclaimer">AI responses may be approximate.</div>
        </div>
    `;
    document.body.appendChild(chatbotContainer);


    // Find DOM Elements after creation
    chatbotToggleButton = document.getElementById('chatbot-toggle-button');
    chatbotWindow = document.getElementById('chatbot-window');
    chatbotHeader = chatbotWindow.querySelector('.chatbot-header'); // <<< Find header
    chatbotCloseButton = document.getElementById('chatbot-close-button');
    chatbotMessages = document.getElementById('chatbot-messages');
    chatbotInput = document.getElementById('chatbot-input');
    chatbotSendButton = document.getElementById('chatbot-send-button');
    chatbotInputArea = chatbotWindow.querySelector('.chatbot-input-area');


    // Check if all critical elements were found
    if (!chatbotToggleButton || !chatbotWindow || !chatbotHeader || !chatbotCloseButton || !chatbotMessages ||
        !chatbotInput || !chatbotSendButton || !chatbotInputArea) {
        console.error("Chatbot initialization failed: Required elements not found after creation.");
        if(chatbotToggleButton) chatbotToggleButton.style.display = 'none'; // Hide toggle if setup failed
        return;
    }

    domReady = true; // Mark DOM as ready

    // Setup all features IN ORDER (dependency matters for insertion point)
    setupTTSButton();      // Needs header
    setupVoiceInput();     // Needs input area & send button
    setupImageUpload();    // Needs input area, window, and potentially mic button

    // --- Event Listeners ---
    chatbotToggleButton.addEventListener('click', toggleChatbot);
    chatbotCloseButton.addEventListener('click', toggleChatbot);
    chatbotSendButton.addEventListener('click', handleSendMessage);
    chatbotInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter' && !event.shiftKey) { // Send on Enter, allow Shift+Enter for newline
            event.preventDefault();
            handleSendMessage();
        }
    });

    // Initial greeting
    const initialGreeting = "Hi there! How can I help you navigate our homemade food website today?";
    // Ensure message area is clear before adding greeting (if re-initializing)
    while (chatbotMessages.firstChild) {
        chatbotMessages.removeChild(chatbotMessages.firstChild);
    }
    displayMessage(initialGreeting, 'bot');

    // Initialize conversation history with system prompts and greeting
    conversationHistory = [
         {
            role: "user",
            parts: [{ text: `System Instruction: ${WEBSITE_CONTEXT}\n\nOkay, now answer the following user question based *only* on the information provided above.` }]
        },
        {
            role: "model",
            parts: [{ text: "Okay, I understand. I will answer questions based only on the provided website information. How can I help?" }]
        },
        { role: "model", parts: [{ text: initialGreeting }] } // Add initial greeting to history
    ];


    console.log("Chatbot initialized.");
    console.log("Speech Recognition Supported:", speechApiSupported);
    console.log("Speech Synthesis Supported:", synthesisApiSupported);
}

// --- Wait for DOM ready before initializing ---
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeChatbot);
} else {
    // DOM is already loaded
    initializeChatbot();
}