document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle functionality
    const menuToggle = document.querySelector('.menu-toggle');
    if (menuToggle) {
        menuToggle.addEventListener('click', function() {
            const menu = document.querySelector('.navbar-menu');
            menu.classList.toggle('active');
        });
    }

    // Logout functionality
    document.getElementById('logoutBtn').addEventListener('click', function() {
        auth.signOut().then(() => {
            window.location.href = './index.html';
        }).catch((error) => {
            console.error('Logout error:', error);
            alert('Error logging out. Please try again.');
        });
    });

    // Check if user is logged in
    auth.onAuthStateChanged(user => {
        if (user) {
            const userDocRef = db.collection("users").doc(user.uid);
            
            userDocRef.get().then(doc => {
                if (doc.exists) {
                    const userData = doc.data();
                    
                    // Update profile display
                    document.getElementById('profileName').textContent = `${userData.firstName} ${userData.lastName}`;
                    document.getElementById('profileFullName').textContent = `${userData.firstName} ${userData.lastName}`;
                    document.getElementById('profileEmail').textContent = userData.email;
                    document.getElementById('profilePhone').textContent = userData.phoneNumber;
                    document.getElementById('profileOccupation').textContent = userData.occupation || 'Not specified';
                    
                    // Populate edit form
                    document.getElementById('editFirstName').value = userData.firstName;
                    document.getElementById('editLastName').value = userData.lastName;
                    document.getElementById('editEmail').value = userData.email;
                    document.getElementById('editPhone').value = userData.phoneNumber;
                    document.getElementById('editOccupation').value = userData.occupation || '';
                    
                    // Set up real-time listener
                    userDocRef.onSnapshot(doc => {
                        if (doc.exists) {
                            const updatedData = doc.data();
                            // Dispatch event for portfolio.js to listen to
                            document.dispatchEvent(new CustomEvent('profileUpdated', {
                                detail: updatedData
                            }));
                        }
                    });
                }
            }).catch(error => {
                console.log("Error getting document:", error);
            });
        } else {
            window.location.href = 'login.html';
        }
    });

    // Save profile changes
    document.getElementById('saveChangesBtn').addEventListener('click', function() {
        const user = auth.currentUser;
        if (!user) return;
        
        const firstName = document.getElementById('editFirstName').value;
        const lastName = document.getElementById('editLastName').value;
        const phone = document.getElementById('editPhone').value;
        const occupation = document.getElementById('editOccupation').value;
        
        if (!firstName || !lastName || !phone) {
            alert('First Name, Last Name, and Phone Number are required fields.');
            return;
        }
        
        // Update Firestore
        db.collection("users").doc(user.uid).update({
            firstName: firstName,
            lastName: lastName,
            phoneNumber: phone,
            occupation: occupation || null
        }).then(() => {
            // Close modal
            const modal = bootstrap.Modal.getInstance(document.getElementById('editProfileModal'));
            modal.hide();
        }).catch(error => {
            console.error("Error updating profile:", error);
            alert('Error updating profile. Please try again.');
        });
    });

    // Handle profile image upload
    const fileInput = document.getElementById('editProfileImage');
    if (fileInput) {
        fileInput.addEventListener('change', function() {
            if (this.files && this.files[0]) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    document.getElementById('profileImageDisplay').src = e.target.result;
                };
                reader.readAsDataURL(this.files[0]);
            }
        });
    }
});
