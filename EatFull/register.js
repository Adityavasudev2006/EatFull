// Import Firebase SDK modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";
import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

// Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyAFj0bzxZePc8yhcl-hRbTfYT2zr3VSAT4",
  authDomain: "eatfull-a637b.firebaseapp.com",
  projectId: "eatfull-a637b",
  storageBucket: "eatfull-a637b.firebasestorage.app",
  messagingSenderId: "62197464037",
  appId: "1:62197464037:web:8d7b19cdcbdd7573374d0c",
  measurementId: "G-MX9XXLXTVS"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

document.getElementById('registerBtn').addEventListener('click', async function (e) {
  e.preventDefault();

  // Get form inputs
  const firstName = document.getElementById('firstName').value.trim();
  const lastName = document.getElementById('lastName').value.trim();
  const email = document.getElementById('floatingInput').value.trim();
  const phoneNumber = document.getElementById('phoneNumber').value.trim();
  const password = document.getElementById('floatingPassword').value;
  const confirmPassword = document.getElementById('confirmPassword').value;

  // Clear previous error messages
  clearErrors();

  let isValid = true;

  // First Name validation
  if (!firstName) {
      showError('firstNameError', 'First Name is required.');
      isValid = false;
  } else if (firstName.length < 3) {
      showError('firstNameError', 'First Name must be at least 3 characters.');
      isValid = false;
  }

  // Last Name validation
  if (!lastName) {
      showError('lastNameError', 'Last Name is required.');
      isValid = false;
  }

  // Email validation
  if (!email) {
      showError('emailError', 'Email is required.');
      isValid = false;
  }

  // Phone Number validation
  const phoneRegex = /^[0-9]{10}$/;
  if (!phoneNumber) {
      showError('phoneNumberError', 'Phone Number is required.');
      isValid = false;
  } else if (!phoneRegex.test(phoneNumber)) {
      showError('phoneNumberError', 'Phone Number must be exactly 10 digits.');
      isValid = false;
  }

  // Password validation
  if (!password) {
      showError('passwordError', 'Password is required.');
      isValid = false;
  }

  // Confirm Password validation
  if (!confirmPassword) {
      showError('confirmPasswordError', 'Confirm Password is required.');
      isValid = false;
  } else if (password !== confirmPassword) {
      showError('confirmPasswordError', 'Passwords do not match.');
      isValid = false;
  }

  if (!isValid) {
      return; // Stop if validation fails
  }

  try {
      // Firebase signup
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Store additional user data in Firestore
      await setDoc(doc(db, "users", user.uid), {
          firstName: firstName,
          lastName: lastName,
          email: email,
          phoneNumber: phoneNumber,
          numberOfCartItems: 0,  // Initially 0
          itemsBought: 0,        // Initially 0
          itemsInCart: [],        // Initially empty array
          items_bought_name: [],  // Initially empty array
          time_of_buy: [],        // List to store purchase times (Initially empty)
          location: ""        // Empty string initially
      });

      console.log("User registered and data stored in Firestore");
      window.location.href = 'home.html'; // Redirect to home page
  } catch (error) {
      console.error("Error registering:", error);
      showError('emailError', error.message); // Show Firebase error under email
  }
});

// Helper to clear all errors
function clearErrors() {
  const errorFields = [
      'firstNameError',
      'lastNameError',
      'emailError',
      'phoneNumberError',
      'passwordError',
      'confirmPasswordError'
  ];

  errorFields.forEach(id => {
      document.getElementById(id).innerText = '';
  });
}

// Helper to show error
function showError(elementId, message) {
  document.getElementById(elementId).innerText = message;
}
