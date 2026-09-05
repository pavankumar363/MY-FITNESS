// =========================================
// MY-FITNESS
// Main JavaScript
// =========================================

document.addEventListener("DOMContentLoaded", () => {

    // =====================================
    // CURRENT YEAR
    // =====================================

    const copyright = document.querySelector(".copyright");

    if (copyright) {
        copyright.textContent =
            `© ${new Date().getFullYear()} MY-FITNESS. All Rights Reserved.`;
    }


    // =====================================
    // NAVIGATION
    // =====================================

    const navLinks = document.querySelectorAll(".navbar nav a");

    navLinks.forEach(link => {

        link.addEventListener("click", () => {

            navLinks.forEach(item => {
                item.classList.remove("active");
            });

            link.classList.add("active");

        });

    });


    // =====================================
    // SIGNUP SYSTEM
    // =====================================

    const signupForm = document.getElementById("signupForm");

    if (signupForm) {

        signupForm.addEventListener("submit", function(event) {

            event.preventDefault();

            const name =
                document.getElementById("signupName").value.trim();

            const email =
                document.getElementById("signupEmail").value.trim();

            const password =
                document.getElementById("signupPassword").value;

            const confirmPassword =
                document.getElementById("confirmPassword").value;

            const terms =
                document.getElementById("terms").checked;

            const message =
                document.getElementById("signupMessage");


            // Password check
            if (password !== confirmPassword) {

                message.textContent =
                    "Passwords do not match.";

                message.style.color = "#d93025";

                return;
            }


            // Terms check
            if (!terms) {

                message.textContent =
                    "Please accept the terms and privacy policy.";

                message.style.color = "#d93025";

                return;
            }


            // Check existing account
            const existingUser =
                localStorage.getItem("myFitnessUser");

            if (existingUser) {

                const user =
                    JSON.parse(existingUser);

                if (user.email === email) {

                    message.textContent =
                        "An account with this email already exists.";

                    message.style.color = "#d93025";

                    return;
                }
            }


            // Create user
            const user = {

                name: name,

                email: email,

                password: password,

                profileCompleted: false,

                goals: [],

                createdAt: new Date().toISOString()

            };


            // Save account
            localStorage.setItem(
                "myFitnessUser",
                JSON.stringify(user)
            );


            // Success message
            message.textContent =
                "Account created successfully! Redirecting...";

            message.style.color = "#0b63ce";


            // Go to profile setup
            setTimeout(() => {

                window.location.href = "profile.html";

            }, 1000);

        });

    }

});

