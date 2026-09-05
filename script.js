// =========================================
// MY-FITNESS
// Main JavaScript
// =========================================

document.addEventListener("DOMContentLoaded", () => {

    // Current year in footer
    const copyright = document.querySelector(".copyright");

    if (copyright) {
        copyright.textContent =
            `© ${new Date().getFullYear()} MY-FITNESS. All Rights Reserved.`;
    }

    // Navigation active state
    const navLinks = document.querySelectorAll(".navbar nav a");

    navLinks.forEach(link => {
        link.addEventListener("click", () => {

            navLinks.forEach(item => {
                item.classList.remove("active");
            });

            link.classList.add("active");
        });
    });

    // Simple button feedback
    const journeyButton = document.querySelector(
        'a[href="signup.html"]'
    );

    if (journeyButton) {
        journeyButton.addEventListener("click", () => {
            console.log("Welcome to MY-FITNESS!");
        });
    }

});
