document.addEventListener("DOMContentLoaded", () => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const counters = document.querySelectorAll(".count-up");

    const animateCounter = (element) => {
        const target = Number(element.dataset.target || 0);
        const suffix = element.dataset.suffix || "";
        const duration = 1500;
        const start = performance.now();
        const tick = (now) => {
            const progress = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 4);
            element.textContent = Math.floor(target * eased) + suffix;
            if (progress < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
    };

    const counterObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.7 });
    counters.forEach(counter => counterObserver.observe(counter));

    const revealItems = document.querySelectorAll(".reveal-card, .reveal-cta, .section-heading");
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
        });
    }, { threshold: 0.12 });
    revealItems.forEach(item => revealObserver.observe(item));

    if (!prefersReducedMotion) {
        document.querySelectorAll(".feature-card").forEach(card => {
            card.addEventListener("pointermove", event => {
                const rect = card.getBoundingClientRect();
                const x = ((event.clientX - rect.left) / rect.width - 0.5) * 10;
                const y = ((event.clientY - rect.top) / rect.height - 0.5) * -10;
                card.style.setProperty("--tilt-x", x + "deg");
                card.style.setProperty("--tilt-y", y + "deg");
                card.style.setProperty("--shine-x", ((event.clientX - rect.left) / rect.width) * 100 + "%");
                card.style.setProperty("--shine-y", ((event.clientY - rect.top) / rect.height) * 100 + "%");
            });
            card.addEventListener("pointerleave", () => {
                card.style.setProperty("--tilt-x", "0deg");
                card.style.setProperty("--tilt-y", "0deg");
            });
        });
    }

    const hero = document.querySelector(".cinematic-hero");
    const heroVisual = document.querySelector(".hero-visual");
    const bodybuilder = document.querySelector(".bodybuilder-hero");
    const floatingCards = document.querySelectorAll(".floating-card");

    if (hero && !prefersReducedMotion && window.matchMedia("(pointer:fine)").matches) {
        let targetX = 0, targetY = 0, currentX = 0, currentY = 0;

        const animateHero = () => {
            currentX += (targetX - currentX) * 0.08;
            currentY += (targetY - currentY) * 0.08;

            hero.style.setProperty("--mouse-x", currentX);
            hero.style.setProperty("--mouse-y", currentY);

            if (heroVisual) heroVisual.style.transform = `translate(${currentX * 10}px, ${currentY * 8}px)`;
            if (bodybuilder) bodybuilder.style.transform = `translate(${currentX * -7}px, ${currentY * -5}px) scale(1.025)`;

            floatingCards.forEach(card => {
                const depth = Number(card.dataset.depth || 1);
                card.style.transform = `translate(${currentX * depth * 18}px, ${currentY * depth * 14}px)`;
            });

            requestAnimationFrame(animateHero);
        };

        hero.addEventListener("pointermove", event => {
            const rect = hero.getBoundingClientRect();
            targetX = (event.clientX - rect.left) / rect.width - 0.5;
            targetY = (event.clientY - rect.top) / rect.height - 0.5;
        });
        hero.addEventListener("pointerleave", () => { targetX = 0; targetY = 0; });
        animateHero();
    }

    if (!prefersReducedMotion) {
        document.querySelectorAll(".primary-btn").forEach(button => {
            button.addEventListener("pointermove", event => {
                const rect = button.getBoundingClientRect();
                const x = (event.clientX - rect.left - rect.width / 2) * 0.12;
                const y = (event.clientY - rect.top - rect.height / 2) * 0.12;
                button.style.transform = `translate(${x}px, ${y}px) scale(1.025)`;
            });
            button.addEventListener("pointerleave", () => { button.style.transform = ""; });
        });
    }

    document.querySelectorAll(".primary-btn, .secondary-btn").forEach(button => {
        button.addEventListener("pointerdown", event => {
            button.classList.add("button-pressed");
            const rect = button.getBoundingClientRect();
            const ripple = document.createElement("span");
            ripple.className = "button-ripple";
            ripple.style.left = (event.clientX - rect.left) + "px";
            ripple.style.top = (event.clientY - rect.top) + "px";
            button.appendChild(ripple);
            setTimeout(() => ripple.remove(), 650);
        });
        ["pointerup", "pointerleave"].forEach(type => {
            button.addEventListener(type, () => button.classList.remove("button-pressed"));
        });
    });

    const particleLayer = document.querySelector(".hero-particles");
    if (particleLayer && !prefersReducedMotion) {
        for (let i = 0; i < 28; i++) {
            const particle = document.createElement("span");
            particle.className = "fitness-particle";
            particle.style.setProperty("--x", Math.random() * 100 + "%");
            particle.style.setProperty("--delay", (Math.random() * 7) + "s");
            particle.style.setProperty("--duration", (5 + Math.random() * 7) + "s");
            particle.style.setProperty("--size", (2 + Math.random() * 4) + "px");
            particleLayer.appendChild(particle);
        }
    }
});