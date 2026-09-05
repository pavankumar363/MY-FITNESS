/* =========================================================
   MY-FITNESS — FINAL JAVASCRIPT
   Phase 1: LocalStorage / Demo Authentication
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
    initializeSite();
});

/* =========================================================
   MAIN INITIALIZER
   ========================================================= */

function initializeSite() {
    setCurrentYear();
    setActiveNavigation();
    setupMobileNavigation();

    setupSignup();
    setupLogin();
    setupProfile();
    setupGoals();

    setupWorkoutFilters();
    setupExerciseFilters();
    setupFoodSearch();

    setupWaterTracker();
    setupWorkoutTimer();
    setupDashboardTimer();

    setupCalculators();
    setupDashboard();
    setupSettings();

    setupWorkoutCompletion();
    setupExerciseCompletion();

    protectDashboardPages();
    personalizeUser();

    updateDateTime();
}

/* =========================================================
   GLOBAL HELPERS
   ========================================================= */

function getUser() {
    try {
        return JSON.parse(localStorage.getItem("myFitnessUser")) || null;
    } catch (error) {
        return null;
    }
}

function saveUser(user) {
    localStorage.setItem("myFitnessUser", JSON.stringify(user));
}

function getPageName() {
    return window.location.pathname.split("/").pop().toLowerCase() || "index.html";
}

function showMessage(element, message, type = "success") {
    if (!element) return;

    element.textContent = message;
    element.className = "form-message " + type;
    element.style.display = "block";
}

function setCurrentYear() {
    document.querySelectorAll("[data-year], #currentYear").forEach(element => {
        element.textContent = new Date().getFullYear();
    });
}

/* =========================================================
   NAVIGATION
   ========================================================= */

function setActiveNavigation() {
    const page = getPageName();

    document.querySelectorAll("nav a, .main-nav a").forEach(link => {
        const href = link.getAttribute("href");

        if (!href) return;

        const cleanHref = href.split("?")[0].split("#")[0].toLowerCase();

        if (cleanHref === page) {
            link.classList.add("active");
        }
    });
}

function setupMobileNavigation() {
    const menuButton = document.querySelector(".mobile-menu-btn");
    const nav = document.querySelector(".main-nav");

    if (!menuButton || !nav) return;

    menuButton.addEventListener("click", () => {
        nav.classList.toggle("mobile-open");
        menuButton.classList.toggle("active");
    });
}

/* =========================================================
   SIGNUP
   ========================================================= */

function setupSignup() {
    const form = document.getElementById("signupForm");

    if (!form) return;

    form.addEventListener("submit", event => {
        event.preventDefault();

        const name = document.getElementById("signupName")?.value.trim();
        const email = document.getElementById("signupEmail")?.value.trim();
        const password = document.getElementById("signupPassword")?.value;
        const confirmPassword = document.getElementById("signupConfirmPassword")?.value;
        const terms = document.getElementById("signupTerms");
        const message = document.getElementById("signupMessage");

        if (!name || !email || !password || !confirmPassword) {
            showMessage(message, "Please fill in all required fields.", "error");
            return;
        }

        if (!validateEmail(email)) {
            showMessage(message, "Please enter a valid email address.", "error");
            return;
        }

        if (password.length < 6) {
            showMessage(message, "Password must contain at least 6 characters.", "error");
            return;
        }

        if (password !== confirmPassword) {
            showMessage(message, "Passwords do not match.", "error");
            return;
        }

        if (terms && !terms.checked) {
            showMessage(message, "Please accept the terms to continue.", "error");
            return;
        }

        const existingUser = getUser();

        if (existingUser && existingUser.email === email) {
            showMessage(message, "An account with this email already exists. Please login.", "error");
            return;
        }

        const user = {
            name: name,
            email: email,
            password: password,
            profileCompleted: false,
            goalsCompleted: false,
            profile: {},
            goals: [],
            stats: {
                workoutsCompleted: 0,
                activeDays: 0,
                streak: 0,
                xp: 0
            },
            achievements: [],
            water: 0,
            createdAt: new Date().toISOString()
        };

        saveUser(user);
        localStorage.setItem("myFitnessLoggedIn", "true");

        showMessage(message, "Account created successfully! Opening profile setup...", "success");

        setTimeout(() => {
            window.location.href = "profile.html";
        }, 800);
    });
}

/* =========================================================
   LOGIN
   ========================================================= */

function setupLogin() {
    const form = document.getElementById("loginForm");

    if (!form) return;

    form.addEventListener("submit", event => {
        event.preventDefault();

        const email = document.getElementById("loginEmail")?.value.trim();
        const password = document.getElementById("loginPassword")?.value;
        const message = document.getElementById("loginMessage");

        if (!email || !password) {
            showMessage(message, "Please enter your email and password.", "error");
            return;
        }

        const user = getUser();

        if (!user) {
            showMessage(
                message,
                "No demo account found. Please create an account first.",
                "error"
            );
            return;
        }

        if (user.email !== email || user.password !== password) {
            showMessage(message, "Incorrect email or password.", "error");
            return;
        }

        localStorage.setItem("myFitnessLoggedIn", "true");

        showMessage(message, "Login successful! Opening your dashboard...", "success");

        setTimeout(() => {
            if (!user.profileCompleted) {
                window.location.href = "profile.html";
            } else if (!user.goalsCompleted) {
                window.location.href = "goals.html";
            } else {
                window.location.href = "dashboard.html";
            }
        }, 700);
    });

    const forgotPassword = document.getElementById("forgotPassword");

    if (forgotPassword) {
        forgotPassword.addEventListener("click", () => {
            alert(
                "Phase 1 Demo:\n\nPassword recovery will be connected to secure email authentication in the future."
            );
        });
    }
}

/* =========================================================
   PROFILE SETUP
   ========================================================= */

function setupProfile() {
    const form = document.getElementById("profileForm");

    if (!form) return;

    const user = getUser();

    if (!user) {
        window.location.href = "signup.html";
        return;
    }

    const profile = user.profile || {};

    setValue("profileName", profile.name || user.name);
    setValue("profileAge", profile.age || "");
    setValue("profileGender", profile.gender || "");
    setValue("profileHeight", profile.height || "");
    setValue("profileWeight", profile.weight || "");
    setValue("profileFitnessLevel", profile.fitnessLevel || "");

    if (profile.activities && Array.isArray(profile.activities)) {
        document.querySelectorAll('input[name="activities"]').forEach(input => {
            input.checked = profile.activities.includes(input.value);
        });
    }

    form.addEventListener("submit", event => {
        event.preventDefault();

        const name = document.getElementById("profileName")?.value.trim();
        const age = Number(document.getElementById("profileAge")?.value);
        const gender = document.getElementById("profileGender")?.value;
        const height = Number(document.getElementById("profileHeight")?.value);
        const weight = Number(document.getElementById("profileWeight")?.value);
        const fitnessLevel = document.getElementById("profileFitnessLevel")?.value;

        const activities = [...document.querySelectorAll('input[name="activities"]:checked')]
            .map(input => input.value);

        const message =
            document.getElementById("profileMessage") ||
            document.getElementById("profileError");

        if (!name || !age || !gender || !height || !weight || !fitnessLevel) {
            showMessage(message, "Please complete all required profile fields.", "error");
            return;
        }

        if (age < 10 || age > 100) {
            showMessage(message, "Please enter a valid age.", "error");
            return;
        }

        if (height < 80 || height > 250) {
            showMessage(message, "Please enter a valid height.", "error");
            return;
        }

        if (weight < 20 || weight > 300) {
            showMessage(message, "Please enter a valid weight.", "error");
            return;
        }

        user.name = name;

        user.profile = {
            name,
            age,
            gender,
            height,
            weight,
            fitnessLevel,
            activities
        };

        user.profileCompleted = true;

        saveUser(user);

        showMessage(message, "Profile saved! Let's choose your goals.", "success");

        setTimeout(() => {
            window.location.href = "goals.html";
        }, 700);
    });
}

/* =========================================================
   GOALS
   ========================================================= */

function setupGoals() {
    const continueButton = document.getElementById("continueGoals");

    if (!continueButton) return;

    const user = getUser();

    if (!user) {
        window.location.href = "signup.html";
        return;
    }

    if (Array.isArray(user.goals)) {
        document.querySelectorAll('input[name="goals"]').forEach(input => {
            input.checked = user.goals.includes(input.value);
        });
    }

    continueButton.addEventListener("click", () => {
        const selectedGoals = [
            ...document.querySelectorAll('input[name="goals"]:checked')
        ].map(input => input.value);

        const message = document.getElementById("goalsMessage");

        if (selectedGoals.length === 0) {
            showMessage(message, "Please select at least one fitness goal.", "error");
            return;
        }

        user.goals = selectedGoals;
        user.goalsCompleted = true;

        if (!user.stats) {
            user.stats = {
                workoutsCompleted: 0,
                activeDays: 0,
                streak: 0,
                xp: 0
            };
        }

        saveUser(user);

        localStorage.setItem("myFitnessLoggedIn", "true");

        showMessage(
            message,
            "Goals saved! Your fitness dashboard is ready.",
            "success"
        );

        setTimeout(() => {
            window.location.href = "dashboard.html";
        }, 800);
    });
}

/* =========================================================
   WORKOUT FILTERS
   ========================================================= */

function setupWorkoutFilters() {
    const search = document.getElementById("workoutSearch");
    const cards = document.querySelectorAll(".workout-card");
    const filterButtons = document.querySelectorAll("[data-workout-filter]");
    const noResults = document.getElementById("noWorkouts");

    if (!cards.length) return;

    let activeFilter = "all";

    function filterWorkouts() {
        const searchText = search ? search.value.toLowerCase().trim() : "";
        let visibleCount = 0;

        cards.forEach(card => {
            const text = card.textContent.toLowerCase();
            const category = (
                card.dataset.category ||
                card.getAttribute("data-category") ||
                ""
            ).toLowerCase();

            const matchesSearch = !searchText || text.includes(searchText);
            const matchesFilter =
                activeFilter === "all" || category === activeFilter;

            if (matchesSearch && matchesFilter) {
                card.style.display = "";
                visibleCount++;
            } else {
                card.style.display = "none";
            }
        });

        if (noResults) {
            noResults.style.display = visibleCount === 0 ? "block" : "none";
        }
    }

    if (search) {
        search.addEventListener("input", filterWorkouts);
    }

    filterButtons.forEach(button => {
        button.addEventListener("click", () => {
            filterButtons.forEach(btn => btn.classList.remove("active"));
            button.classList.add("active");

            activeFilter =
                button.dataset.workoutFilter ||
                button.dataset.filter ||
                "all";

            filterWorkouts();
        });
    });

    filterWorkouts();
}

/* =========================================================
   EXERCISE FILTERS
   ========================================================= */

function setupExerciseFilters() {
    const search = document.getElementById("exerciseSearch");
    const cards = document.querySelectorAll(".exercise-card");
    const filterButtons = document.querySelectorAll("[data-exercise-filter]");
    const noResults = document.getElementById("noExercises");

    if (!cards.length) return;

    let activeFilter = "all";

    function filterExercises() {
        const searchText = search ? search.value.toLowerCase().trim() : "";
        let visibleCount = 0;

        cards.forEach(card => {
            const text = card.textContent.toLowerCase();
            const category = (
                card.dataset.category ||
                card.getAttribute("data-category") ||
                ""
            ).toLowerCase();

            const matchesSearch = !searchText || text.includes(searchText);
            const matchesFilter =
                activeFilter === "all" || category === activeFilter;

            if (matchesSearch && matchesFilter) {
                card.style.display = "";
                visibleCount++;
            } else {
                card.style.display = "none";
            }
        });

        if (noResults) {
            noResults.style.display = visibleCount === 0 ? "block" : "none";
        }
    }

    if (search) {
        search.addEventListener("input", filterExercises);
    }

    filterButtons.forEach(button => {
        button.addEventListener("click", () => {
            filterButtons.forEach(btn => btn.classList.remove("active"));
            button.classList.add("active");

            activeFilter =
                button.dataset.exerciseFilter ||
                button.dataset.filter ||
                "all";

            filterExercises();
        });
    });

    filterExercises();
}

/* =========================================================
   NUTRITION SEARCH
   ========================================================= */

function setupFoodSearch() {
    const search = document.getElementById("foodSearch");
    const cards = document.querySelectorAll(".food-card");
    const noResults = document.getElementById("noFoods");

    if (!cards.length || !search) return;

    search.addEventListener("input", () => {
        const searchText = search.value.toLowerCase().trim();
        let visibleCount = 0;

        cards.forEach(card => {
            if (card.textContent.toLowerCase().includes(searchText)) {
                card.style.display = "";
                visibleCount++;
            } else {
                card.style.display = "none";
            }
        });

        if (noResults) {
            noResults.style.display = visibleCount === 0 ? "block" : "none";
        }
    });
}

/* =========================================================
   WATER TRACKER
   ========================================================= */

function setupWaterTracker() {
    const addButton = document.getElementById("addWater");
    const removeButton = document.getElementById("removeWater");
    const countElement = document.getElementById("waterCount");
    const progressElement = document.getElementById("waterProgress");

    if (!addButton && !removeButton) return;

    const user = getUser();

    let waterCount = user?.water || 4;

    function updateWater() {
        waterCount = Math.max(0, Math.min(8, waterCount));

        if (countElement) {
            countElement.textContent = `${waterCount}/8`;
        }

        if (progressElement) {
            progressElement.style.width = `${(waterCount / 8) * 100}%`;
        }

        if (user) {
            user.water = waterCount;
            saveUser(user);
        }
    }

    addButton?.addEventListener("click", () => {
        waterCount++;
        updateWater();
    });

    removeButton?.addEventListener("click", () => {
        waterCount--;
        updateWater();
    });

    updateWater();
}

/* =========================================================
   WORKOUT TIMER
   ========================================================= */

function createTimer(startButton, pauseButton, resetButton, display) {
    if (!startButton && !pauseButton && !resetButton) return;

    let seconds = 0;
    let interval = null;

    function render() {
        if (!display) return;

        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;

        display.textContent =
            `${String(minutes).padStart(2, "0")}:` +
            `${String(remainingSeconds).padStart(2, "0")}`;
    }

    startButton?.addEventListener("click", () => {
        if (interval) return;

        interval = setInterval(() => {
            seconds++;
            render();
        }, 1000);
    });

    pauseButton?.addEventListener("click", () => {
        clearInterval(interval);
        interval = null;
    });

    resetButton?.addEventListener("click", () => {
        clearInterval(interval);
        interval = null;
        seconds = 0;
        render();
    });

    render();
}

function setupWorkoutTimer() {
    createTimer(
        document.getElementById("startTimer"),
        document.getElementById("pauseTimer"),
        document.getElementById("resetTimer"),
        document.getElementById("workoutTimer")
    );
}

/* =========================================================
   DASHBOARD TIMER
   ========================================================= */

function setupDashboardTimer() {
    createTimer(
        document.getElementById("timerStart"),
        document.getElementById("timerPause"),
        document.getElementById("timerReset"),
        document.getElementById("dashboardTimer")
    );
}

/* =========================================================
   CALCULATORS
   ========================================================= */

function setupCalculators() {
    setupBMI();
    setupBMR();
    setupWaterCalculator();
    setupWorkoutRecommendation();
}

function setupBMI() {
    const button = document.getElementById("calculateBMI");

    if (!button) return;

    button.addEventListener("click", () => {
        const height = Number(document.getElementById("bmiHeight")?.value);
        const weight = Number(document.getElementById("bmiWeight")?.value);
        const result = document.getElementById("bmiResult");

        if (!height || !weight || height <= 0 || weight <= 0) {
            if (result) result.textContent = "Please enter valid height and weight.";
            return;
        }

        const heightMeters = height / 100;
        const bmi = weight / (heightMeters * heightMeters);

        let category = "";

        if (bmi < 18.5) {
            category = "Below the general adult reference range";
        } else if (bmi < 25) {
            category = "Within the general adult reference range";
        } else if (bmi < 30) {
            category = "Above the general adult reference range";
        } else {
            category = "Higher than the general adult reference range";
        }

        if (result) {
            result.innerHTML =
                `<strong>BMI: ${bmi.toFixed(1)}</strong><br>` +
                `${category}.`;
        }
    });
}

function setupBMR() {
    const button = document.getElementById("calculateBMR");

    if (!button) return;

    button.addEventListener("click", () => {
        const age = Number(document.getElementById("bmrAge")?.value);
        const weight = Number(document.getElementById("bmrWeight")?.value);
        const height = Number(document.getElementById("bmrHeight")?.value);
        const result = document.getElementById("bmrResult");

        if (!age || !weight || !height) {
            if (result) result.textContent = "Please enter all values.";
            return;
        }

        const user = getUser();
        const gender = user?.profile?.gender;

        let bmr;

        if (gender === "Female") {
            bmr = (10 * weight) + (6.25 * height) - (5 * age) - 161;
        } else {
            bmr = (10 * weight) + (6.25 * height) - (5 * age) + 5;
        }

        if (result) {
            result.innerHTML =
                `<strong>Estimated BMR: ${Math.round(bmr)} kcal/day</strong><br>` +
                `This is an educational estimate, not a medical target.`;
        }
    });
}

function setupWaterCalculator() {
    const button = document.getElementById("calculateWater");

    if (!button) return;

    button.addEventListener("click", () => {
        const weight = Number(document.getElementById("waterWeight")?.value);
        const result = document.getElementById("waterResult");

        if (!weight || weight <= 0) {
            if (result) result.textContent = "Please enter a valid weight.";
            return;
        }

        const liters = weight * 0.033;

        if (result) {
            result.innerHTML =
                `<strong>General hydration estimate: ${liters.toFixed(1)} L/day</strong><br>` +
                `Actual needs vary with activity, weather and individual factors.`;
        }
    });
}

function setupWorkoutRecommendation() {
    const button = document.getElementById("recommendWorkout");

    if (!button) return;

    button.addEventListener("click", () => {
        const level = document.getElementById("fitnessLevel")?.value;
        const goal = document.getElementById("workoutGoal")?.value;
        const result = document.getElementById("workoutResult");

        if (!level || !goal) {
            if (result) result.textContent = "Please select your fitness level and goal.";
            return;
        }

        const recommendations = {
            strength: {
                beginner: "Start with Full Body Strength.",
                intermediate: "Try Upper Body Power or Lower Body Strength.",
                advanced: "Try a progressive strength workout."
            },
            stamina: {
                beginner: "Start with Cardio Stamina.",
                intermediate: "Try Endurance Challenge.",
                advanced: "Try a structured endurance session."
            },
            "healthy-weight": {
                beginner: "Start with Active Fitness.",
                intermediate: "Try Cardio Stamina + Strength sessions.",
                advanced: "Combine strength and endurance sessions."
            },
            flexibility: {
                beginner: "Start with Mobility Flow.",
                intermediate: "Try Recovery Stretch + Mobility Flow.",
                advanced: "Use a structured mobility routine."
            },
            sports: {
                beginner: "Start with Speed & Agility basics.",
                intermediate: "Try Sports Performance.",
                advanced: "Use Sports Performance + agility sessions."
            }
        };

        const recommendation =
            recommendations[goal]?.[level] ||
            "Choose a balanced workout that matches your current ability.";

        if (result) {
            result.innerHTML = `<strong>${recommendation}</strong>`;
        }
    });
}

/* =========================================================
   DASHBOARD PERSONALIZATION
   ========================================================= */

function personalizeUser() {
    const user = getUser();

    if (!user) return;

    const nameElements = document.querySelectorAll(
        "#dashboardName, #profileDisplayName, #settingsNameDisplay, [data-user-name]"
    );

    nameElements.forEach(element => {
        element.textContent = user.name || "Student";
    });

    const emailElements = document.querySelectorAll(
        "#dashboardEmail, #settingsEmailDisplay, [data-user-email]"
    );

    emailElements.forEach(element => {
        element.textContent = user.email || "";
    });
}

/* =========================================================
   DASHBOARD
   ========================================================= */

function setupDashboard() {
    const dashboard = document.querySelector(".dashboard-page");

    if (!dashboard && !document.getElementById("dashboardLogout")) {
        return;
    }

    const user = getUser();

    if (!user) return;

    const stats = user.stats || {
        workoutsCompleted: 0,
        activeDays: 0,
        streak: 0,
        xp: 0
    };

    setText("dashboardWorkouts", stats.workoutsCompleted);
    setText("dashboardActiveDays", stats.activeDays);
    setText("dashboardStreak", stats.streak);
    setText("dashboardXP", stats.xp);

    setText("workoutsCompleted", stats.workoutsCompleted);
    setText("activeDays", stats.activeDays);
    setText("currentStreak", stats.streak);
    setText("totalXP", stats.xp);

    const logout = document.getElementById("dashboardLogout");

    if (logout) {
        logout.addEventListener("click", () => {
            localStorage.removeItem("myFitnessLoggedIn");
            window.location.href = "login.html";
        });
    }

    const profileLinks = document.querySelectorAll(
        'a[href="profile.html"], a[href="goals.html"]'
    );

    profileLinks.forEach(link => {
        link.addEventListener("click", event => {
            const target = link.getAttribute("href");

            if (target === "profile.html" && !user) {
                event.preventDefault();
                window.location.href = "signup.html";
            }
        });
    });
}

/* =========================================================
   WORKOUT COMPLETION
   ========================================================= */

function setupWorkoutCompletion() {
    const button = document.getElementById("completeWorkout");

    if (!button) return;

    button.addEventListener("click", () => {
        const user = getUser();

        if (!user) {
            alert("Please login to save your workout progress.");
            window.location.href = "login.html";
            return;
        }

        if (!user.stats) {
            user.stats = {
                workoutsCompleted: 0,
                activeDays: 0,
                streak: 0,
                xp: 0
            };
        }

        user.stats.workoutsCompleted++;
        user.stats.activeDays++;
        user.stats.streak++;
        user.stats.xp += 100;

        if (!Array.isArray(user.achievements)) {
            user.achievements = [];
        }

        if (
            user.stats.workoutsCompleted >= 1 &&
            !user.achievements.includes("First Workout")
        ) {
            user.achievements.push("First Workout");
        }

        if (
            user.stats.streak >= 7 &&
            !user.achievements.includes("7 Day Streak")
        ) {
            user.achievements.push("7 Day Streak");
        }

        if (
            user.stats.xp >= 1000 &&
            !user.achievements.includes("1,000 XP Club")
        ) {
            user.achievements.push("1,000 XP Club");
        }

        saveUser(user);

        button.textContent = "✓ Workout Completed";
        button.classList.add("completed");
        button.disabled = true;

        alert("Great job! Workout completed. +100 XP 🎉");

        updateDashboardStats();
    });
}

/* =========================================================
   EXERCISE COMPLETION
   ========================================================= */

function setupExerciseCompletion() {
    const buttons = document.querySelectorAll(
        ".exercise-complete, [data-complete-exercise]"
    );

    buttons.forEach(button => {
        button.addEventListener("click", () => {
            button.classList.toggle("completed");

            if (button.classList.contains("completed")) {
                button.textContent = "✓ Completed";
            } else {
                button.textContent = "Complete";
            }
        });
    });
}

/* =========================================================
   DASHBOARD STATS UPDATE
   ========================================================= */

function updateDashboardStats() {
    const user = getUser();

    if (!user || !user.stats) return;

    setText("dashboardWorkouts", user.stats.workoutsCompleted);
    setText("dashboardActiveDays", user.stats.activeDays);
    setText("dashboardStreak", user.stats.streak);
    setText("dashboardXP", user.stats.xp);

    setText("workoutsCompleted", user.stats.workoutsCompleted);
    setText("activeDays", user.stats.activeDays);
    setText("currentStreak", user.stats.streak);
    setText("totalXP", user.stats.xp);
}

/* =========================================================
   SETTINGS
   ========================================================= */

function setupSettings() {
    setupAccountSettings();
    setupFitnessSettings();
    setupNotifications();
    setupAppearance();
    setupPasswordChange();
    setupAccountReset();
}

function setupAccountSettings() {
    const button = document.getElementById("saveAccountSettings");

    if (!button) return;

    const user = getUser();

    if (!user) return;

    setValue("settingsName", user.name || "");
    setValue("settingsEmail", user.email || "");

    button.addEventListener("click", () => {
        const name = document.getElementById("settingsName")?.value.trim();
        const email = document.getElementById("settingsEmail")?.value.trim();
        const message = document.getElementById("accountSettingsMessage");

        if (!name || !email) {
            showMessage(message, "Please enter your name and email.", "error");
            return;
        }

        if (!validateEmail(email)) {
            showMessage(message, "Please enter a valid email address.", "error");
            return;
        }

        user.name = name;
        user.email = email;

        if (user.profile) {
            user.profile.name = name;
        }

        saveUser(user);

        showMessage(message, "Account information saved successfully.", "success");

        personalizeUser();
    });
}

function setupFitnessSettings() {
    const button = document.getElementById("saveFitnessSettings");

    if (!button) return;

    const user = getUser();

    if (!user) return;

    setValue(
        "settingsFitnessLevel",
        user.profile?.fitnessLevel || "Beginner"
    );

    setValue(
        "settingsGoal",
        user.goals?.[0] || "strength"
    );

    button.addEventListener("click", () => {
        const level = document.getElementById("settingsFitnessLevel")?.value;
        const goal = document.getElementById("settingsGoal")?.value;
        const message = document.getElementById("fitnessSettingsMessage");

        user.profile = user.profile || {};
        user.profile.fitnessLevel = level;
        user.goals = [goal];

        saveUser(user);

        showMessage(message, "Fitness preferences updated.", "success");
    });
}

function setupNotifications() {
    const notificationIds = [
        "workoutNotifications",
        "motivationNotifications",
        "achievementNotifications"
    ];

    notificationIds.forEach(id => {
        const element = document.getElementById(id);

        if (!element) return;

        const saved = localStorage.getItem(`myFitness_${id}`);

        if (saved !== null) {
            element.checked = saved === "true";
        }

        element.addEventListener("change", () => {
            localStorage.setItem(
                `myFitness_${id}`,
                element.checked
            );
        });
    });
}

function setupAppearance() {
    const blueTheme = document.getElementById("blueTheme");
    const compactDashboard = document.getElementById("compactDashboard");

    if (blueTheme) {
        blueTheme.checked =
            localStorage.getItem("myFitness_blueTheme") !== "false";

        blueTheme.addEventListener("change", () => {
            localStorage.setItem(
                "myFitness_blueTheme",
                blueTheme.checked
            );
        });
    }

    if (compactDashboard) {
        compactDashboard.checked =
            localStorage.getItem("myFitness_compactDashboard") === "true";

        compactDashboard.addEventListener("change", () => {
            localStorage.setItem(
                "myFitness_compactDashboard",
                compactDashboard.checked
            );

            document.body.classList.toggle(
                "compact-dashboard",
                compactDashboard.checked
            );
        });

        document.body.classList.toggle(
            "compact-dashboard",
            compactDashboard.checked
        );
    }
}

function setupPasswordChange() {
    const button = document.getElementById("changePassword");

    if (!button) return;

    button.addEventListener("click", () => {
        const currentPassword =
            document.getElementById("currentPassword")?.value;

        const newPassword =
            document.getElementById("newPassword")?.value;

        const confirmPassword =
            document.getElementById("confirmNewPassword")?.value;

        const message =
            document.getElementById("passwordSettingsMessage");

        const user = getUser();

        if (!user) {
            showMessage(message, "Please login first.", "error");
            return;
        }

        if (currentPassword !== user.password) {
            showMessage(message, "Current password is incorrect.", "error");
            return;
        }

        if (!newPassword || newPassword.length < 6) {
            showMessage(
                message,
                "New password must contain at least 6 characters.",
                "error"
            );
            return;
        }

        if (newPassword !== confirmPassword) {
            showMessage(message, "New passwords do not match.", "error");
            return;
        }

        user.password = newPassword;

        saveUser(user);

        showMessage(message, "Password changed successfully.", "success");

        document.getElementById("currentPassword").value = "";
        document.getElementById("newPassword").value = "";
        document.getElementById("confirmNewPassword").value = "";
    });
}

function setupAccountReset() {
    const button = document.getElementById("resetAccount");

    if (!button) return;

    button.addEventListener("click", () => {
        const confirmation = confirm(
            "Are you sure you want to reset your MY-FITNESS demo account?\n\nThis will remove your saved profile, goals and progress."
        );

        if (!confirmation) return;

        localStorage.removeItem("myFitnessUser");
        localStorage.removeItem("myFitnessLoggedIn");

        alert("Your demo account has been reset.");

        window.location.href = "signup.html";
    });
}

/* =========================================================
   PAGE PROTECTION
   ========================================================= */

function protectDashboardPages() {
    const protectedPages = [
        "dashboard.html",
        "settings.html"
    ];

    const page = getPageName();

    if (!protectedPages.includes(page)) return;

    const loggedIn =
        localStorage.getItem("myFitnessLoggedIn") === "true";

    if (!loggedIn || !getUser()) {
        window.location.href = "login.html";
    }
}

/* =========================================================
   DATE & TIME
   ========================================================= */

function updateDateTime() {
    const dateElements = document.querySelectorAll(
        "#dashboardDate, #currentDate, [data-current-date]"
    );

    const timeElements = document.querySelectorAll(
        "#dashboardTime, #currentTime, [data-current-time]"
    );

    function update() {
        const now = new Date();

        const dateText = now.toLocaleDateString("en-IN", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric"
        });

        const timeText = now.toLocaleTimeString("en-IN", {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit"
        });

        dateElements.forEach(element => {
            element.textContent = dateText;
        });

        timeElements.forEach(element => {
            element.textContent = timeText;
        });
    }

    update();
    setInterval(update, 1000);
}

/* =========================================================
   UTILITY FUNCTIONS
   ========================================================= */

function setText(id, value) {
    const element = document.getElementById(id);

    if (element) {
        element.textContent = value;
    }
}

function setValue(id, value) {
    const element = document.getElementById(id);

    if (element) {
        element.value = value;
    }
}

function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/* =========================================================
   LOGOUT — UNIVERSAL
   ========================================================= */

document.addEventListener("click", event => {
    const logoutButton = event.target.closest(
        "#logout, [data-logout]"
    );

    if (!logoutButton) return;

    event.preventDefault();

    localStorage.removeItem("myFitnessLoggedIn");

    window.location.href = "login.html";
});

/* =========================================================
   END OF MY-FITNESS JAVASCRIPT
   ========================================================= */
