/* =========================================================
   MY-FITNESS — AUTH INTEGRATION FIX
   Keeps the existing final script.js intact while adapting
   the login page to Username + Password.
   ========================================================= */

(function () {
    function prepareControls() {
        // Signup field IDs in the existing HTML
        const confirmPassword = document.getElementById("confirmPassword");
        if (confirmPassword) confirmPassword.id = "signupConfirmPassword";

        const terms = document.getElementById("terms");
        if (terms) terms.id = "signupTerms";

        // Profile activity checkboxes need the name expected by script.js
        document.querySelectorAll('.activity-option input[type="checkbox"]').forEach(input => {
            input.name = "activities";
        });

        // Profile fitness level is represented by radio cards in HTML.
        // Create a hidden value field that the final script can read.
        const fitnessRadios = document.querySelectorAll('input[name="fitnessLevel"]');

        if (fitnessRadios.length && !document.getElementById("profileFitnessLevel")) {
            const hidden = document.createElement("input");
            hidden.type = "hidden";
            hidden.id = "profileFitnessLevel";
            hidden.value = "";
            document.getElementById("profileForm")?.appendChild(hidden);

            fitnessRadios.forEach(radio => {
                radio.addEventListener("change", () => {
                    hidden.value = radio.value;
                });
            });
        }

        // Goals HTML uses fitnessGoal; script.js expects goals.
        document.querySelectorAll('input[name="fitnessGoal"]').forEach(input => {
            input.name = "goals";
        });
    }

    function setupPasswordToggle() {
        const toggle = document.getElementById("toggleLoginPassword");
        const password = document.getElementById("loginPassword");

        if (!toggle || !password) return;

        toggle.addEventListener("click", () => {
            const showing = password.type === "text";
            password.type = showing ? "password" : "text";
            toggle.textContent = showing ? "👁" : "🙈";
            toggle.setAttribute(
                "aria-label",
                showing ? "Show password" : "Hide password"
            );
        });
    }

    function setupUsernameLogin() {
        const form = document.getElementById("loginForm");
        const usernameInput = document.getElementById("loginUsername");
        const passwordInput = document.getElementById("loginPassword");
        const message = document.getElementById("loginMessage");

        if (!form || !usernameInput || !passwordInput) return;

        // Capture the submit before script.js's old email-based handler.
        form.addEventListener("submit", event => {
            event.preventDefault();
            event.stopImmediatePropagation();

            const username = usernameInput.value.trim().toLowerCase();
            const password = passwordInput.value;

            if (!username || !password) {
                showLoginMessage("Please enter your username and password.", "error");
                return;
            }

            let user = null;
            try {
                user = JSON.parse(localStorage.getItem("myFitnessUser")) || null;
            } catch (error) {
                user = null;
            }

            if (!user) {
                showLoginMessage(
                    "No MY-FITNESS account found. Please create your student account first.",
                    "error"
                );
                return;
            }

            // Username is supported directly when available. For existing demo
            // accounts, the person's name is also accepted as the username.
            const storedUsername = String(user.username || "").trim().toLowerCase();
            const storedName = String(user.name || "").trim().toLowerCase();
            const storedEmailName = String(user.email || "")
                .split("@")[0]
                .trim()
                .toLowerCase();

            const usernameMatches =
                username === storedUsername ||
                username === storedName ||
                username === storedEmailName;

            if (!usernameMatches || user.password !== password) {
                showLoginMessage("Incorrect username or password.", "error");
                return;
            }

            localStorage.setItem("myFitnessLoggedIn", "true");

            const remember = document.getElementById("rememberMe");
            if (remember?.checked) {
                localStorage.setItem("myFitnessRemembered", "true");
            } else {
                localStorage.removeItem("myFitnessRemembered");
            }

            showLoginMessage("Login successful! Opening your dashboard...", "success");

            setTimeout(() => {
                if (!user.profileCompleted) {
                    window.location.href = "profile.html";
                } else if (!user.goalsCompleted) {
                    window.location.href = "goals.html";
                } else {
                    window.location.href = "dashboard.html";
                }
            }, 700);
        }, true);

        function showLoginMessage(text, type) {
            if (!message) return;
            message.textContent = text;
            message.className = "form-message " + type;
            message.style.display = "block";
        }
    }

    // This script is loaded before script.js, so the login capture handler is
    // registered before script.js's older email-based submit handler.
    prepareControls();
    document.addEventListener("DOMContentLoaded", () => {
        setupPasswordToggle();
        setupUsernameLogin();
    });
})();
