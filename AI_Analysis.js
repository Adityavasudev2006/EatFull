
const GEMINI_API_KEY = "AIzaSyAcPjcrfZmDrxN92qAvvws7C-hj7IHu4gI"; 

const FIREBASE_CONFIG = {
    apiKey: "AIzaSyAFj0bzxZePc8yhcl-hRbTfYT2zr3VSAT4",
        authDomain: "eatfull-a637b.firebaseapp.com",
        projectId: "eatfull-a637b",
        storageBucket: "eatfull-a637b.firebasestorage.app",
        messagingSenderId: "62197464037",
        appId: "1:62197464037:web:8d7b19cdcbdd7573374d0c",
        measurementId: "G-MX9XXLXTVS"
};

// --- Default Ranking (Fallback) ---
const defaultItemRanking = [
    'pizza', 'chicken-biryani', 'momos', 'vada-pav', 'meals', 'dosa', // Make sure 'dosa' matches your data-id case
    'paneer-tikka', 'grilled-chicken', 'japanese-noodles', 'italian-prawn-fry',
    'vada', 'murukku', 'puffs', 'pulka-rotti', 'veggie-salad', 'blue-lagoon',
    'butter-scotch', 'strawberry-pie', 'sweets-jumbo', 'mango-pickle',
];

// --- Firebase Initialization ---
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getFirestore, collection, getDocs, query, orderBy, limit } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

let firebaseApp;
let firestoreDb;
try {
    firebaseApp = initializeApp(FIREBASE_CONFIG);
    firestoreDb = getFirestore(firebaseApp);
    console.log("Firestore Initialized");
} catch (error) {
    console.error("Firebase/Firestore initialization failed:", error);
    // Apply default ranking immediately if Firebase fails
    applyRankingDOM(defaultItemRanking, 'default (Firebase init failed)');
}


/**
 * Fetches recent purchase history from Firestore.
 * Limits the fetch to avoid pulling massive amounts of data client-side.
 * @returns {Promise<Array<Object>|null>} A promise that resolves with an array of purchase objects or null on error.
 */
async function fetchPurchaseData() {
    if (!firestoreDb) {
        console.error("Firestore database is not initialized.");
        return null;
    }
    try {
        // Query the 'purchaseHistory' collection
        // Order by timestamp descending to get recent purchases first
        // Limit the results (e.g., last 1000 purchases) - ADJUST AS NEEDED
        // Fetching ALL history client-side is inefficient and costly.
        const q = query(collection(firestoreDb, "purchaseHistory"), orderBy("timestamp", "desc"), limit(1000));

        const querySnapshot = await getDocs(q);
        const purchaseList = [];
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            // Convert Firestore timestamp to milliseconds for consistency if needed, or keep as object
            const timestampMillis = data.timestamp ? data.timestamp.toMillis() : Date.now(); // Fallback if timestamp missing
            purchaseList.push({
                itemId: data.itemId,
                timestamp: timestampMillis,
                // location: data.userLocation // Include location if available and needed
            });
        });

        if (purchaseList.length === 0) {
            console.log("No recent purchase history found in Firestore.");
        }
        return purchaseList; // Return array (empty if no data)

    } catch (error) {
        console.error("Error fetching purchase data from Firestore:", error);
        return null; // Return null on error
    }
}


/**
 * @param {Array<Object>} purchaseData - Array of purchase history objects.
 * @param {Array<String>} allItemIds - Array of all possible item IDs available.
 * @returns {Promise<Array<String>|null>} A promise that resolves with a ranked array of item IDs or null on error.
 */
async function getRankedListFromGemini(purchaseData, allItemIds) {
    if (!GEMINI_API_KEY || GEMINI_API_KEY === "YOUR_GEMINI_API_KEY") {
        console.error("Gemini API Key is not set.");
        return null;
    }
    const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`;

    // --- Construct the Prompt for Gemini ---
    const now = new Date();
    const currentHour = now.getHours();
    const currentDay = now.getDay();
    const timeOfDay = currentHour < 6 ? 'late night' : currentHour < 12 ? 'morning' : currentHour < 17 ? 'afternoon' : currentHour < 21 ? 'evening' : 'night';
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const dayOfWeek = days[currentDay];

    // Prepare data snippet (limited size)
    const dataSnippet = purchaseData.map(p => `Item: ${p.itemId}, Time: ${new Date(p.timestamp).toISOString()}`).join('\n');

    const prompt = `
        You are a food item ranking engine for an online delivery service.
        Your task is to rank the following food items based on recent purchase data.

        Available Item IDs: ${allItemIds.join(', ')}

        Current Context:
        - Time: ${timeOfDay} (${currentHour}:00)
        - Day: ${dayOfWeek}

        Ranking Criteria:
        1. Overall Popularity within the recent data provided.
        2. Time-of-Day Popularity: Items particularly popular during the current time (${timeOfDay}) in the recent data. Give this higher weight.
        3. Recency: Items bought more recently in the data might be slightly preferred.
        4. Include ALL available items in the ranking, even if they have no purchase data in the recent set (place them lower).

        Recent Purchase Data Sample (itemId, timestamp):
        ${dataSnippet || "No recent purchase data available."}

        Based on the criteria and data, provide a ranked list of ALL available item IDs.
        Output ONLY a valid JSON array of strings, ordered from highest rank to lowest rank. Do not include any other text, explanations, or markdown formatting.

        Example Output: ["item1", "item2", "item3", ...]
    `;

    // --- Make the API Call ---
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
        });

        if (!response.ok) {
             const errorData = await response.json(); console.error(`Gemini API Error (${response.status}):`, errorData); return null;
        }
        const data = await response.json();

        // --- Process the Response ---
         if (data.candidates && data.candidates[0]?.content?.parts?.[0]) {
            let rawResponse = data.candidates[0].content.parts[0].text;
            rawResponse = rawResponse.replace(/^```json\s*/, '').replace(/\s*```$/, ''); // Clean markdown
            try {
                const rankedList = JSON.parse(rawResponse);
                if (Array.isArray(rankedList) && rankedList.every(item => typeof item === 'string')) {
                    console.log("Gemini ranking successful:", rankedList.slice(0, 5).join(', ') + '...');
                    return rankedList; // Success!
                } else { console.error("Gemini response is not a valid JSON array of strings:", rawResponse); return null; }
            } catch (parseError) { console.error("Failed to parse Gemini JSON response:", parseError, "\nRaw response:", rawResponse); return null; }
        } else { console.error("Unexpected Gemini API response structure:", data); return null; }
    } catch (error) { console.error("Error calling Gemini API:", error); return null; }
}


function applyRankingDOM(rankedItemIds, source = 'unknown') {
    console.log(`Applying ranking based on: ${source}`);
    const container = document.getElementById('itemContainer');
     if (!container) { console.error('Container "itemContainer" not found.'); return; }

    const allCards = Array.from(container.querySelectorAll('.item-card'));
     if (allCards.length === 0) { console.warn('No item cards found in DOM.'); return; }

    const cardMap = new Map();
    allCards.forEach(card => { const id = card.dataset.id; if (id) cardMap.set(id, card); });

    const fragment = document.createDocumentFragment();
    const rankedIdsInDOM = new Set();

    rankedItemIds.forEach(rankedId => {
        const card = cardMap.get(rankedId);
        if (card) { fragment.appendChild(card); rankedIdsInDOM.add(rankedId); }
    });

    cardMap.forEach((card, id) => {
        if (!rankedIdsInDOM.has(id)) { console.warn(`Item "${id}" in DOM but not ranking list. Appending.`); fragment.appendChild(card); }
    });

    container.appendChild(fragment);
    console.log('DOM ranking updated.');
}

// --- Main Execution Logic ---
// (This function remains largely the same - calls fetchPurchaseData, getRankedListFromGemini, applyRankingDOM)
async function initializeAndRankItems() {
    console.log("Initializing item ranking (Firestore)...");
     if (!firestoreDb) { // Check again in case init failed but script continued
         console.log("Firestore not available, using default ranking.");
         applyRankingDOM(defaultItemRanking, 'default (Firestore unavailable)');
         return;
     }

    const allPossibleItemIds = defaultItemRanking;
    const purchaseData = await fetchPurchaseData(); // Uses Firestore fetch now
    let finalRanking = defaultItemRanking;
    let rankingSource = 'default (initial)';

     if (purchaseData && purchaseData.length > 0) {
        console.log(`Fetched ${purchaseData.length} recent purchase records. Requesting Gemini ranking...`);
        rankingSource = 'default (Gemini call failed or API key missing)';
        const geminiRanking = await getRankedListFromGemini(purchaseData, allPossibleItemIds);

        if (geminiRanking) {
            finalRanking = geminiRanking; rankingSource = 'Gemini AI';
            const returnedIds = new Set(geminiRanking);
            const missingFromGemini = allPossibleItemIds.filter(id => !returnedIds.has(id));
            if (missingFromGemini.length > 0) {
                console.warn("Gemini ranking omitted items:", missingFromGemini.join(', '));
                finalRanking = [...geminiRanking, ...missingFromGemini]; // Append missing
            }
        } else { console.log("Gemini ranking failed/skipped. Using default."); rankingSource = 'default (Gemini failed)'; }
    } else if (purchaseData === null) { rankingSource = 'default (Firestore fetch error)'; console.log("Failed to fetch purchase data. Using default."); }
      else { rankingSource = 'default (no recent purchase data)'; console.log("No recent purchase history. Using default."); }

    applyRankingDOM(finalRanking, rankingSource);
}

// --- Run when DOM is ready ---
// Use standard DOMContentLoaded
document.addEventListener('DOMContentLoaded', initializeAndRankItems);