document.addEventListener('DOMContentLoaded', function() {
    const auth = firebase.auth();
    const db = firebase.firestore();

    // --- DOM Element References ---
    const loadingOverlay = document.getElementById('loading-overlay');
    const mainContent = document.getElementById('main-content');
    const logoutBtn = document.getElementById('logoutBtn');
    const saveChangesBtn = document.getElementById('saveChangesBtn');
    const profileImageInput = document.getElementById('editProfileImage');
    const profileImageDisplay = document.getElementById('profileImageDisplay'); // Added reference for image update

    // --- Mobile Menu Toggle Functionality (If needed in JS) ---
    const menuToggle = document.querySelector('.menu-toggle');
    if (menuToggle) {
        menuToggle.addEventListener('click', function() {
            const menu = document.querySelector('.navbar-menu');
            if (menu) {
                menu.classList.toggle('active');
            }
        });
    }

    // --- Logout Functionality ---
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            auth.signOut().then(() => {
                // Don't hide loader here, just redirect
                window.location.href = './index.html';
            }).catch((error) => {
                console.error('Logout error:', error);
                alert('Error logging out. Please try again.');
                // Keep loader visible on error
            });
        });
    }

    // --- Function to Hide Loader and Remove Blur ---
    function hideLoader() {
        if (loadingOverlay) {
            loadingOverlay.style.opacity = '0'; // Start fade out
            // Remove overlay from layout after transition
            setTimeout(() => {
                if (loadingOverlay) { 
                   loadingOverlay.style.display = 'none';
                }
            }, 500); // Must match CSS transition duration (0.5s)
        }
        if (mainContent) {
            mainContent.classList.remove('blurred');
        }
    }

    // --- Check User Authentication State and Fetch Data ---
    auth.onAuthStateChanged(user => {
        if (user) {
            // User is signed in
            const userDocRef = db.collection("users").doc(user.uid);

            userDocRef.get().then(doc => {
                if (doc.exists) {
                    const userData = doc.data();

                    document.getElementById('profileName').textContent = `${userData.firstName} ${userData.lastName}`;
                    document.getElementById('profileFullName').textContent = `${userData.firstName} ${userData.lastName}`;
                    document.getElementById('profileEmail').textContent = userData.email; // Email usually doesn't change here
                    document.getElementById('profilePhone').textContent = userData.phoneNumber || 'Not specified';
                    document.getElementById('profileOccupation').textContent = userData.occupation || 'Not specified';
                    document.getElementById('editFirstName').value = userData.firstName || '';
                    document.getElementById('editLastName').value = userData.lastName || '';
                    document.getElementById('editEmail').value = userData.email || ''; // Email is readonly
                    document.getElementById('editPhone').value = userData.phoneNumber || '';
                    document.getElementById('editOccupation').value = userData.occupation || '';

                    // --- Data fetched successfully - Hide Loader ---
                    hideLoader();

                    userDocRef.onSnapshot(snapshot => {
                        if (snapshot.exists) {
                            const updatedData = snapshot.data();
                            console.log("Profile data updated in real-time.");
                            // Update display elements again if needed based on snapshot data
                            document.getElementById('profileName').textContent = `${updatedData.firstName} ${updatedData.lastName}`;
                            document.getElementById('profileFullName').textContent = `${updatedData.firstName} ${updatedData.lastName}`;
                            document.getElementById('profilePhone').textContent = updatedData.phoneNumber || 'Not specified';
                            document.getElementById('profileOccupation').textContent = updatedData.occupation || 'Not specified';
                            // Dispatch event if other components need to know (like portfolio.js example)
                            document.dispatchEvent(new CustomEvent('profileUpdated', {
                                detail: updatedData
                            }));
                        }
                    }, err => {
                         console.error("Error listening to profile updates:", err);
                    });

                } else {
                    // Document doesn't exist (User authenticated but no profile data)
                    console.error("User document not found in Firestore!");
                    // Keep loader visible or show specific error message
                     if (loadingOverlay) {
                        loadingOverlay.innerHTML = '<div style="text-align: center; color: #555;">Profile data not found.<br/>Please contact support.</div>';
                     }
                     // Don't remove blur
                }
            }).catch(error => {
                // Error fetching document
                console.error("Error getting user document:", error);
                // Keep loader visible and show an error message
                if (loadingOverlay) {
                    loadingOverlay.innerHTML = '<div style="text-align: center; color: red;">Error loading profile.<br/>Please refresh the page.</div>';
                }
                // Don't remove blur
            });
        } else {
            // User is not logged in
            console.log("User not logged in. Redirecting...");
            // Keep loader visible during redirect
            window.location.href = 'login.html';
        }
    });

    // --- Save Profile Changes ---
    if (saveChangesBtn) {
        saveChangesBtn.addEventListener('click', function() {
            const user = auth.currentUser;
            if (!user) {
                alert('You must be logged in to save changes.');
                return;
            }

            // Get values from the edit form
            const firstName = document.getElementById('editFirstName').value.trim();
            const lastName = document.getElementById('editLastName').value.trim();
            const phone = document.getElementById('editPhone').value.trim();
            const occupation = document.getElementById('editOccupation').value.trim();

            // Basic validation
            if (!firstName || !lastName || !phone) {
                alert('First Name, Last Name, and Phone Number are required.');
                return; // Prevent saving
            }

            // Data to update
            const dataToUpdate = {
                firstName: firstName,
                lastName: lastName,
                phoneNumber: phone,
                // Use null if occupation is empty, consistent with original logic
                occupation: occupation || null 
            };



            // Update Firestore document
            db.collection("users").doc(user.uid).update(dataToUpdate).then(() => {
                console.log("Profile updated successfully!");

                // Close the modal
                const modalElement = document.getElementById('editProfileModal');
                if (modalElement) {
                    const modalInstance = bootstrap.Modal.getInstance(modalElement);
                    if (modalInstance) {
                       modalInstance.hide();
                    } else {
                        // Fallback if instance isn't found (might happen during fast reloads)
                        const newModalInstance = new bootstrap.Modal(modalElement);
                        newModalInstance.hide();
                    }
                }


            }).catch(error => {
                console.error("Error updating profile:", error);
                alert('Error updating profile. Please try again.');
            });
        });
    }

    // --- Handle Profile Image Preview (Optional, for edit modal) ---
    if (profileImageInput && profileImageDisplay) {
        profileImageInput.addEventListener('change', function() {
            if (this.files && this.files[0]) {
                const reader = new FileReader();
                reader.onload = function(e) {
                     
                     console.log("Image selected for upload preview (implement display if needed)");
                };
                reader.readAsDataURL(this.files[0]);
            }
        });
    }

}); // End DOMContentLoaded