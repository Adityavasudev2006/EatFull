// Your Firebase config
const firebaseConfig = {
    apiKey: "AIzaSyAFj0bzxZePc8yhcl-hRbTfYT2zr3VSAT4",
    authDomain: "eatfull-a637b.firebaseapp.com",
    projectId: "eatfull-a637b",
    storageBucket: "eatfull-a637b.firebasestorage.app",
    messagingSenderId: "62197464037",
    appId: "1:62197464037:web:8d7b19cdcbdd7573374d0c",
    measurementId: "G-MX9XXLXTVS"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

    // Firebase Auth reference
const auth = firebase.auth();

// Login button event listener
document.getElementById('registerBtn').addEventListener('click', function (e) {
    e.preventDefault();

    // Clear any previous error message
    const errorMessage = document.getElementById('errorMessage');
    errorMessage.textContent = '';

    const email = document.getElementById('floatingInput').value;
    const password = document.getElementById('floatingPassword').value;

    if (!email || !password) {
        errorMessage.textContent = 'Please enter both email and password.';
        return;
    }

    // Firebase sign-in
    auth.signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
            // SUCCESS: User logged in
            const user = userCredential.user;
            console.log('Logged in as:', user.email);

            // Redirect to home page
            window.location.href = 'home.html';
        })
        .catch((error) => {
            console.error('Login error:', error.code, error.message);

            if (error.code === 'auth/user-not-found') {
                errorMessage.textContent = 'Account does not exist, please create one.';
            } else if (error.code === 'auth/wrong-password') {
                errorMessage.textContent = 'Incorrect password. Please try again.';
            } else if (error.code === 'auth/invalid-email') {
                errorMessage.textContent = 'Invalid email format. Please enter a valid email.';
            } else {
                errorMessage.textContent = 'Login failed: ' + error.message;
            }
        });
});
