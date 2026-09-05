/* =========================================================
   MY-FITNESS — AUTH INTEGRATION FIX
   Normalizes the existing HTML controls for the final script.
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

    // This script is loaded before script.js, so these changes exist
    // before script.js registers its DOMContentLoaded handler.
    prepareControls();

    document.addEventListener("DOMContentLoaded", setupPasswordToggle);
})();
