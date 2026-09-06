/* =========================================================
   MY-FITNESS — BUTTON SUPPORT
   Adds missing interactive behavior without replacing script.js.
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
    setupExerciseInstructionButtons();
    setupGenericNavigationButtons();
});

function setupExerciseInstructionButtons() {
    const buttons = document.querySelectorAll(".exercise-details");
    if (!buttons.length) return;

    const instructions = {
        "Push-Ups": {
            focus: "Chest, shoulders and triceps",
            steps: [
                "Start in a high-plank position with hands slightly wider than your shoulders.",
                "Keep your body in a straight line and brace your core.",
                "Lower your chest under control while keeping elbows comfortably angled.",
                "Press through your hands to return to the starting position."
            ],
            tip: "Keep your hips from dropping or rising. Use a wall or elevated surface if needed."
        },
        "Bodyweight Squats": {
            focus: "Legs and glutes",
            steps: [
                "Stand with feet around shoulder-width apart.",
                "Push your hips back and bend your knees to lower into a comfortable squat.",
                "Keep your chest lifted and knees tracking in the same direction as your toes.",
                "Drive through your feet to stand tall."
            ],
            tip: "Use a comfortable range of motion and keep the movement controlled."
        },
        "Plank": {
            focus: "Core and shoulders",
            steps: [
                "Place your forearms under your shoulders.",
                "Extend your legs and keep your body in a straight line.",
                "Brace your core and breathe normally.",
                "Hold for the planned time without letting your lower back sag."
            ],
            tip: "Stop if you feel pain in your back or shoulders."
        },
        "Forward Lunges": {
            focus: "Legs, glutes and balance",
            steps: [
                "Stand tall with feet hip-width apart.",
                "Step one foot forward and lower your body with control.",
                "Keep the front knee aligned with the foot.",
                "Push through the front foot to return to standing and switch sides."
            ],
            tip: "Take a stable step and use a smaller range of motion if balance is difficult."
        },
        "Jumping Jacks": {
            focus: "Full body and cardiovascular fitness",
            steps: [
                "Stand tall with feet together and arms by your sides.",
                "Jump your feet apart while raising your arms overhead.",
                "Jump back to the starting position.",
                "Repeat at a comfortable pace."
            ],
            tip: "Use a low-impact step-out version if jumping is uncomfortable."
        },
        "Mountain Climbers": {
            focus: "Core, shoulders and cardiovascular fitness",
            steps: [
                "Start in a strong high-plank position.",
                "Bring one knee toward your chest while keeping your hips controlled.",
                "Return that foot and switch legs.",
                "Continue alternating smoothly."
            ],
            tip: "Prioritize stable form over speed."
        },
        "Glute Bridge": {
            focus: "Glutes and hips",
            steps: [
                "Lie on your back with knees bent and feet flat.",
                "Keep your feet about hip-width apart.",
                "Squeeze your glutes and lift your hips until your body forms a comfortable line.",
                "Lower slowly and repeat."
            ],
            tip: "Avoid over-arching your lower back at the top."
        },
        "Bicycle Crunches": {
            focus: "Abdominals and core",
            steps: [
                "Lie on your back with knees bent and hands lightly behind your head.",
                "Lift your shoulders slightly from the floor.",
                "Bring one knee in while rotating your torso toward it.",
                "Switch sides with controlled movement."
            ],
            tip: "Rotate through your torso rather than pulling on your neck."
        },
        "Burpees": {
            focus: "Full body conditioning",
            steps: [
                "Stand tall with feet comfortable apart.",
                "Lower into a squat and place your hands on the floor.",
                "Step or jump your feet back into a strong plank.",
                "Return to a squat and stand or perform a small jump."
            ],
            tip: "Use step-back and step-forward variations to reduce impact."
        },
        "Shoulder Taps": {
            focus: "Shoulders and core",
            steps: [
                "Start in a stable high-plank position.",
                "Brace your core and minimize hip movement.",
                "Lift one hand and gently tap the opposite shoulder.",
                "Return the hand and alternate sides."
            ],
            tip: "Widen your feet slightly for extra stability."
        },
        "High Knees": {
            focus: "Cardiovascular fitness, legs and coordination",
            steps: [
                "Stand tall with your core gently braced.",
                "Drive one knee upward while moving the opposite arm naturally.",
                "Switch legs and continue alternating.",
                "Build speed only while you can maintain control."
            ],
            tip: "Choose a marching version for a lower-impact option."
        },
        "Hamstring Stretch": {
            focus: "Hamstrings and lower-body mobility",
            steps: [
                "Stand or sit in a comfortable position with one leg extended.",
                "Keep your back relaxed and lengthen through the spine.",
                "Gently lean toward the extended leg until you feel a mild stretch.",
                "Hold comfortably and switch sides."
            ],
            tip: "Stretch gently; never force or bounce into the position."
        }
    };

    buttons.forEach(button => {
        button.addEventListener("click", () => {
            const card = button.closest(".exercise-card");
            const title = card?.querySelector("h3")?.textContent.trim() || "Exercise";
            const data = instructions[title];

            if (!data) return;

            openExerciseModal(title, data);
        });
    });
}

function openExerciseModal(title, data) {
    const existing = document.getElementById("exerciseInstructionModal");
    if (existing) existing.remove();

    const modal = document.createElement("div");
    modal.id = "exerciseInstructionModal";
    modal.setAttribute("role", "dialog");
    modal.setAttribute("aria-modal", "true");
    modal.innerHTML = `
        <div class="button-fix-overlay">
            <div class="button-fix-modal">
                <button type="button" class="button-fix-close" aria-label="Close">×</button>
                <span class="section-badge">EXERCISE GUIDE</span>
                <h2>${escapeHtml(title)}</h2>
                <p class="button-fix-focus"><strong>Focus:</strong> ${escapeHtml(data.focus)}</p>
                <h3>How to do it</h3>
                <ol>${data.steps.map(step => `<li>${escapeHtml(step)}</li>`).join("")}</ol>
                <div class="button-fix-tip"><strong>Training tip:</strong> ${escapeHtml(data.tip)}</div>
                <button type="button" class="primary-btn button-fix-done">Got It</button>
            </div>
        </div>
    `;

    document.body.appendChild(modal);

    const close = () => modal.remove();
    modal.querySelector(".button-fix-close")?.addEventListener("click", close);
    modal.querySelector(".button-fix-done")?.addEventListener("click", close);
    modal.querySelector(".button-fix-overlay")?.addEventListener("click", event => {
        if (event.target.classList.contains("button-fix-overlay")) close();
    });

    document.addEventListener("keydown", function escapeHandler(event) {
        if (event.key === "Escape") {
            close();
            document.removeEventListener("keydown", escapeHandler);
        }
    });
}

function setupGenericNavigationButtons() {
    document.querySelectorAll("button[data-href]").forEach(button => {
        button.addEventListener("click", () => {
            const href = button.getAttribute("data-href");
            if (href) window.location.href = href;
        });
    });
}

function escapeHtml(value) {
    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}
