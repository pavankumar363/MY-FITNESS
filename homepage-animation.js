document.addEventListener("DOMContentLoaded", () => {
    const counters = document.querySelectorAll(".count-up");

    const animateCounter = (element) => {
        const target = Number(element.dataset.target || 0);
        const suffix = element.dataset.suffix || "";
        const duration = 1300;
        const start = performance.now();

        const tick = (now) => {
            const progress = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            element.textContent = Math.floor(target * eased) + suffix;
            if (progress < 1) requestAnimationFrame(tick);
        };

        requestAnimationFrame(tick);
    };

    const counterObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            animateCounter(entry.target);
            observer.unobserve(entry.target);
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
    }, { threshold: 0.15 });

    revealItems.forEach(item => revealObserver.observe(item));

    document.querySelectorAll(".feature-card").forEach(card => {
        card.addEventListener("pointermove", event => {
            const rect = card.getBoundingClientRect();
            const x = ((event.clientX - rect.left) / rect.width - 0.5) * 8;
            const y = ((event.clientY - rect.top) / rect.height - 0.5) * -8;
            card.style.setProperty("--tilt-x", x + "deg");
            card.style.setProperty("--tilt-y", y + "deg");
        });

        card.addEventListener("pointerleave", () => {
            card.style.setProperty("--tilt-x", "0deg");
            card.style.setProperty("--tilt-y", "0deg");
        });
    });

    const hero = document.querySelector(".hero");
    if (hero && window.matchMedia("(pointer:fine)").matches) {
        hero.addEventListener("pointermove", event => {
            const rect = hero.getBoundingClientRect();
            const x = (event.clientX - rect.left) / rect.width - 0.5;
            const y = (event.clientY - rect.top) / rect.height - 0.5;
            hero.style.setProperty("--mouse-x", x);
            hero.style.setProperty("--mouse-y", y);
        });

        hero.addEventListener("pointerleave", () => {
            hero.style.setProperty("--mouse-x", "0");
            hero.style.setProperty("--mouse-y", "0");
        });
    }

    document.querySelectorAll(".primary-btn, .secondary-btn").forEach(button => {
        button.addEventListener("pointerdown", () => button.classList.add("button-pressed"));
        button.addEventListener("pointerup", () => button.classList.remove("button-pressed"));
        button.addEventListener("pointerleave", () => button.classList.remove("button-pressed"));
    });
});