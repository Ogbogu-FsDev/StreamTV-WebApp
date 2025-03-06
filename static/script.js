var registerModal = document.getElementById("register-modal");
var registerLink = document.getElementById("registerLink");
var closeRegisterModal = document.getElementById("closeRegisterModal");

registerLink.onclick = function(event) {
    event.preventDefault();
    registerModal.style.display = "block";
}

closeRegisterModal.onclick = function() {
    registerModal.style.display = "none";
}

window.onclick = function(event) {
    if (event.target == registerModal) {
        registerModal.style.display = "none";
    }
}

function register() {
    $.ajax({
        url: '/register',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({
            username: $('#register-username').val(),
            email: $('#register-email').val(),
            password: $('#register-password').val()
        }),
        success: function(response) {
            alert(response.status === 'success' ? 'Registered successfully!' : response.message);
            if (response.status === 'success') registerModal.style.display = "none";
        }
    });
}

function login() {
    $.ajax({
        url: '/login',
        type: 'POST',
        contentType: 'application/json',  // Make sure this is set to 'application/json'
        data: JSON.stringify({
            username: $('#login-username').val(),
            password: $('#login-password').val()
        }),  // Ensure that data is properly stringified
        success: function(response) {
            if (response.status === 'success') {
                // Redirect to the page after login
                window.location.href = response.redirect;  // Handle the redirect URL from the server
            } else {
                alert(response.message);  // Display error message if credentials are invalid
            }
        },
        error: function(xhr, status, error) {
            console.error('Error:', error);
            alert('An error occurred during login.');
        }
    });
}



// Get the modal elements
var forgotPasswordModal = document.getElementById("forgotPasswordModal");
var registerModal = document.getElementById("registerModal");
var forgotPasswordLink = document.getElementById("forgotPasswordLink");
var closeModal = document.getElementById("closeModal");
var closeRegisterModal = document.getElementById("closeRegisterModal");
var registerLink = document.getElementById("registerLink");
var passwordStrengthNotification = document.getElementById("passwordStrengthNotification");

// When the user clicks the "Forgot Password?" link, open the forgot password modal
forgotPasswordLink.onclick = function(event) {
    event.preventDefault();
    forgotPasswordModal.style.display = "block";
}

// When the user clicks the "Register here" link, open the register modal
registerLink.onclick = function(event) {
    event.preventDefault();
    registerModal.style.display = "block";
}

// When the user clicks the close button (x) in the forgot password modal, close it
closeModal.onclick = function() {
    forgotPasswordModal.style.display = "none";
}

// When the user clicks the close button (x) in the register modal, close it
closeRegisterModal.onclick = function() {
    registerModal.style.display = "none";
}

// When the user clicks anywhere outside the modal, close it
window.onclick = function(event) {
    if (event.target == forgotPasswordModal) {
        forgotPasswordModal.style.display = "none";
    } else if (event.target == registerModal) {
        registerModal.style.display = "none";
    }
}

// Handle password recovery form submission
function submitRecovery() {
    var email = document.getElementById("recoverEmail").value;
    if (email) {
        alert("Password recovery request sent to " + email);
        forgotPasswordModal.style.display = "none"; // Close the modal after submission
    } else {
        alert("Please enter a valid email address.");
    }
}

// Function to validate registration form
function validateRegisterForm(event) {
    // Prevent the form from submitting
    event.preventDefault();

    // Get the form data
    var form = document.getElementById('registerForm');
    var formData = new FormData(form);
    var email = document.getElementById("registerEmail").value;
    var password = document.getElementById("registerPassword").value;

    // Simulate email existence check (in reality, this should be done via server-side validation)
    if (email === "test@example.com") {
        alert("Email is already in use. Please try another one.");
        return false;
    }

    // Check password strength
    var passwordStrength = checkPasswordStrength(password);
    if (!passwordStrength.isValid) {
        passwordStrengthNotification.innerText = "Password must be at least 8 characters long, contain uppercase letters, numbers, and special characters.";
        return false;
    }

    // Send the form data to Flask via AJAX (using fetch)
    fetch('/register', {
        method: 'POST',
        body: formData,
    })
    .then(response => {
        if (response.ok) {  // Check if status is 200-299
            return response.json();
        } else {
            throw new Error('Network response was not ok.');
        }
    })
    .then(data => {
        if (data.success) {
            // Registration successful
            alert("Registration successful! Please log in.");
            registerModal.style.display = "none"; // Close the modal
        } else {
            // Registration failed (like email already exists)
            alert(data.message); // Show the error message
        }
    })
    .catch(error => {
        console.error("Error during registration:", error);
        alert("An error occurred during registration.");
    });


    return false;  // Prevent default form submission
}

// Function to check password strength
function checkPasswordStrength(password) {
    var regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return { isValid: regex.test(password) };
}
