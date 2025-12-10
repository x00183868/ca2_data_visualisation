// =========================================================
// DARK MODE TOGGLE
// =========================================================

// PAGE LOADER: fade out the loader overlay once the page has loaded
window.addEventListener("load", () => {
    const loader = document.getElementById("loader");
    if (!loader) return;

    setTimeout(() => {
        loader.style.opacity = "0";
        setTimeout(() => {
            loader.style.display = "none";
        }, 500);
    }, 300);
});


function toggleDarkMode() {
    document.body.classList.toggle("dark-mode");

    // Save preference to localStorage
    if (document.body.classList.contains("dark-mode")) {
        localStorage.setItem("theme", "dark");
    } else {
        localStorage.setItem("theme", "light");
    }
}

// Apply saved preference on page load
window.onload = function() {
    let savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
        document.body.classList.add("dark-mode");
    }
};

// =========================================================
// SKILLS PROGRESS BAR ANIMATION
// =========================================================

function animateSkills() {
    const htmlBar = document.getElementById("htmlBar");
    const jsBar = document.getElementById("jsBar");

    // Only animate once
    if (!htmlBar.classList.contains("animated")) {
        htmlBar.style.width = "90%";
        jsBar.style.width = "75%";

        htmlBar.classList.add("animated");
        jsBar.classList.add("animated");
    }
}

// Detect when the skills section is in view
function isElementInView(el) {
    const rect = el.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight)
    );
}

window.addEventListener("scroll", function () {
    const skillsSection = document.getElementById("skills");
    if (isElementInView(skillsSection)) {
        animateSkills();
    }
});

// =========================================================
// PROJECT FILTERING
// =========================================================

const filterButtons = document.querySelectorAll(".filter-btn");
const projectCards = document.querySelectorAll(".project-card");

filterButtons.forEach(button => {
    button.addEventListener("click", () => {
        const year = button.getAttribute("data-year");

        projectCards.forEach(card => {
            if (year === "all") {
                card.style.display = "block";
            } else if (card.getAttribute("data-year") === year) {
                card.style.display = "block";
            } else {
                card.style.display = "none";
            }
        });

        // Highlight active button
        filterButtons.forEach(btn => btn.classList.remove("active"));
        button.classList.add("active");
    });
});


// =========================================================
// GPA inputs: load/save per year to localStorage
// =========================================================


