document.addEventListener("DOMContentLoaded", () => {
    // Handle registration
    const registrationForm = document.getElementById("registrationForm");
    if (registrationForm) {
        registrationForm.addEventListener("submit", function (event) {
            event.preventDefault();

            const regUsername = document.getElementById("regUsername").value;
            const regPassword = document.getElementById("regPassword").value;

            // Check if username already exists
            if (localStorage.getItem(regUsername)) {
                alert("Username already exists. Please choose another one.");
            } else {
                // Store the new user's credentials
                localStorage.setItem(regUsername, regPassword);
                alert("Registration successful! You can now log in.");
                registrationForm.reset(); // Reset registration form
            }
        });
    }

    // Handle login
    document.getElementById("loginForm").addEventListener("submit", function (event) {
        event.preventDefault();

        const username = document.getElementById("username").value;
        const password = document.getElementById("password").value;

        const adminUsername = "admin";
        const adminPassword = "admin123";

        // Admin login check
        if (username === adminUsername && password === adminPassword) {
            window.location.href = "admin.html";
        } else {
            const storedPassword = localStorage.getItem(username);

            if (storedPassword && storedPassword === password) {
                // Redirect to student dashboard
                localStorage.setItem("loggedInUser", JSON.stringify(username)); // Store logged-in user
                window.location.href = "student.html";
            } else {
                alert("Invalid username or password.");
            }
        }
    });
});
