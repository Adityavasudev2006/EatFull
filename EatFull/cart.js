// Import Firebase SDK modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";
import { getFirestore, doc, getDoc, updateDoc } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

// Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyAFj0bzxZePc8yhcl-hRbTfYT2zr3VSAT4",
  authDomain: "eatfull-a637b.firebaseapp.com",
  projectId: "eatfull-a637b",
  storageBucket: "eatfull-a637b.appspot.com",
  messagingSenderId: "62197464037",
  appId: "1:62197464037:web:8d7b19cdcbdd7573374d0c",
  measurementId: "G-MX9XXLXTVS"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

let currentUser = null;
let cartItems = [];
let isInitialLoad = true;

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // First load from local storage
    loadCartFromLocalStorage();
    
    // Then check auth state to sync with Firebase
    checkAuthState();
    
    // Add event listener for remove buttons
    document.addEventListener('click', function(event) {
        if (event.target.closest('.remove-btn')) {
            const index = parseInt(event.target.closest('.remove-btn').dataset.index);
            if (!isNaN(index)) {
                removeFromCart(index);
            }
        }
    });
});

function checkAuthState() {
    onAuthStateChanged(auth, (user) => {
        if (user) {
            currentUser = user;
            if (isInitialLoad) {
                // Only sync from Firebase on first load
                loadCartFromFirebase();
                isInitialLoad = false;
            }
        }
    });
}

async function loadCartFromFirebase() {
    try {
        const userDocRef = doc(db, "users", currentUser.uid);
        const userDoc = await getDoc(userDocRef);
        
        if (userDoc.exists()) {
            const userData = userDoc.data();
            const firebaseCart = userData.itemsInCart || [];
            
            // Merge Firebase cart with local cart (prefer local changes)
            cartItems = mergeCarts(cartItems, firebaseCart);
            
            // Update local storage with merged cart
            localStorage.setItem('cartItems', JSON.stringify(cartItems));
            
            // Display the merged cart
            displayCart();
            
            // Push merged cart back to Firebase
            await updateFirebaseCart();
        }
    } catch (error) {
        console.error("Error loading cart from Firebase:", error);
        // Continue with local cart if Firebase fails
        displayCart();
    }
}

function loadCartFromLocalStorage() {
    const storedItems = localStorage.getItem('cartItems');
    cartItems = storedItems ? JSON.parse(storedItems) : [];
    displayCart();
}

// Smart cart merging - prefers local items, combines quantities
function mergeCarts(localCart, firebaseCart) {
    const mergedCart = [...localCart];
    
    firebaseCart.forEach(fbItem => {
        const existingItem = mergedCart.find(item => 
            item.id === fbItem.id && item.name === fbItem.name
        );
        
        if (!existingItem) {
            mergedCart.push(fbItem);
        }
    });
    
    return mergedCart;
}

async function updateFirebaseCart() {
    if (!currentUser) return;
    
    try {
        const userDocRef = doc(db, "users", currentUser.uid);
        await updateDoc(userDocRef, {
            itemsInCart: cartItems,
            numberOfCartItems: cartItems.reduce((total, item) => total + item.quantity, 0)
        });
    } catch (error) {
        console.error("Error updating Firebase cart:", error);
    }
}

function displayCart() {
    const cartContainer = document.getElementById('cart-items');
    const cartContainer1 = document.getElementById('cart-items1');
    const totalAmountElement = document.getElementById('total-amount');

    if (!cartContainer || !cartContainer1 || !totalAmountElement) return;

    // Clear previous content
    cartContainer.innerHTML = '';
    cartContainer1.textContent = '0';
    totalAmountElement.textContent = '₹0';

    if (cartItems.length === 0) {
        cartContainer.innerHTML = '<li class="list-group-item">Your cart is empty</li>';
        return;
    }

    let totalQuantity = 0;
    let totalAmount = 0;

    cartItems.forEach((item, index) => {
        const itemTotal = item.price * item.quantity;
        totalQuantity += item.quantity;
        totalAmount += itemTotal;

        const itemElement = document.createElement('li');
        itemElement.className = 'list-group-item d-flex justify-content-between lh-sm';
        itemElement.innerHTML = `
            <div>
                <h6 class="my-0">${item.name}</h6>
                <small class="text-body-secondary">₹${item.price} × ${item.quantity}</small>
            </div>
            <span class="text-body-secondary">₹${itemTotal.toFixed(2)}</span>
            <button type="button" class="btn btn-secondary remove-btn" data-index="${index}">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
                    <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z"/>
                    <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z"/>
                </svg>
            </button>
        `;
        cartContainer.appendChild(itemElement);
    });

    // Update counters
    cartContainer1.textContent = totalQuantity;
    totalAmountElement.textContent = `₹${totalAmount.toFixed(2)}`;

    // Add total row
    const totalElement = document.createElement('li');
    totalElement.className = 'list-group-item d-flex justify-content-between';
    totalElement.innerHTML = `
        <span>Total (INR)</span>
        <strong>₹${totalAmount.toFixed(2)}</strong>
    `;
    cartContainer.appendChild(totalElement);
}

async function removeFromCart(index) {
    if (index >= 0 && index < cartItems.length) {
        // Remove the item from the cart array
        cartItems.splice(index, 1);
        
        // Update local storage
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
        
        // Update Firebase
        await updateFirebaseCart();
        
        // Refresh the cart display
        displayCart();
    }
}

async function addToCart(item) {
    const existingItemIndex = cartItems.findIndex(
        cartItem => cartItem.id === item.id && cartItem.name === item.name
    );
    
    if (existingItemIndex >= 0) {
        cartItems[existingItemIndex].quantity += item.quantity;
    } else {
        cartItems.push(item);
    }
    
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
    await updateFirebaseCart();
    displayCart();
}

// Make functions available globally
window.removeFromCart = removeFromCart;
window.addToCart = addToCart;
window.displayCart = displayCart;