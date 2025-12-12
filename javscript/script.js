// Single clean canonical JS used by the pages
// Keeps functions global where needed (e.g. toggleDarkMode)

// PAGE LOADER
window.addEventListener("load", () => {
    const loader = document.getElementById("loader");
    if (!loader) return;
    setTimeout(() => {
        loader.style.opacity = "0";
        setTimeout(() => loader.style.display = "none", 500);
    }, 300);
});

// DARK MODE
function toggleDarkMode() {
    // toggle class
    document.body.classList.toggle('dark-mode');
    // derive current theme and persist
    const theme = document.body.classList.contains('dark-mode') ? 'dark' : 'light';
    localStorage.setItem('theme', theme);
    // sync navbar toggle icon
    syncDarkToggleIcon();
    // runtime test: confirm function is invoked
    console.log('toggleDarkMode invoked — theme:', theme);
}

// Apply stored theme on DOM ready
document.addEventListener('DOMContentLoaded', () => {
    if (localStorage.getItem('theme') === 'dark') document.body.classList.add('dark-mode');
    // set icon based on stored theme
    syncDarkToggleIcon();
});

// Update the navbar toggle icon to reflect current theme
function syncDarkToggleIcon() {
    try {
        const btn = document.getElementById('navDarkToggle');
        if (!btn) return;
        const isDark = document.body.classList.contains('dark-mode');
        btn.textContent = isDark ? '☀️' : '🌙';
        btn.setAttribute('aria-label', isDark ? 'Switch to light mode' : 'Switch to dark mode');
    } catch (e) { /* no-op */ }
}

// SKILLS PROGRESS
function animateSkills() {
    const htmlBar = document.getElementById('htmlBar');
    const jsBar = document.getElementById('jsBar');
    const ciscoBar = document.getElementById('ciscoBar');
    const pythonBar = document.getElementById('pythonBar');
    const m365Bar = document.getElementById('m365Bar');
    const vscodeBar = document.getElementById('vscodeBar');
    if (!htmlBar && !jsBar && !ciscoBar && !pythonBar && !m365Bar && !vscodeBar) return;

    // only animate once (use htmlBar as sentinel if present, otherwise first available)
    const sentinel = htmlBar || jsBar || ciscoBar || pythonBar || m365Bar || vscodeBar;
    if (!sentinel.classList.contains('animated')) {
        if (htmlBar) {
            htmlBar.style.width = '90%';
            htmlBar.classList.add('animated');
            htmlBar.setAttribute('aria-valuenow', '90');
            let pv = htmlBar.querySelector('.progress-value');
            if (!pv) { pv = document.createElement('span'); pv.className = 'progress-value'; htmlBar.appendChild(pv); }
            pv.textContent = '90%';
        }
        if (jsBar) {
            jsBar.style.width = '75%';
            jsBar.classList.add('animated');
            jsBar.setAttribute('aria-valuenow', '75');
            let pv = jsBar.querySelector('.progress-value');
            if (!pv) { pv = document.createElement('span'); pv.className = 'progress-value'; jsBar.appendChild(pv); }
            pv.textContent = '75%';
        }
        if (ciscoBar) {
            ciscoBar.style.width = '65%';
            ciscoBar.classList.add('animated');
            ciscoBar.setAttribute('aria-valuenow', '65');
            let pv = ciscoBar.querySelector('.progress-value');
            if (!pv) { pv = document.createElement('span'); pv.className = 'progress-value'; ciscoBar.appendChild(pv); }
            pv.textContent = '65%';
        }
        if (pythonBar) {
            pythonBar.style.width = '80%';
            pythonBar.classList.add('animated');
            pythonBar.setAttribute('aria-valuenow', '80');
            let pv = pythonBar.querySelector('.progress-value');
            if (!pv) { pv = document.createElement('span'); pv.className = 'progress-value'; pythonBar.appendChild(pv); }
            pv.textContent = '80%';
        }
        if (m365Bar) {
            m365Bar.style.width = '70%';
            m365Bar.classList.add('animated');
            m365Bar.setAttribute('aria-valuenow', '70');
            let pv = m365Bar.querySelector('.progress-value');
            if (!pv) { pv = document.createElement('span'); pv.className = 'progress-value'; m365Bar.appendChild(pv); }
            pv.textContent = '70%';
        }
        if (vscodeBar) {
            vscodeBar.style.width = '85%';
            vscodeBar.classList.add('animated');
            vscodeBar.setAttribute('aria-valuenow', '85');
            let pv = vscodeBar.querySelector('.progress-value');
            if (!pv) { pv = document.createElement('span'); pv.className = 'progress-value'; vscodeBar.appendChild(pv); }
            pv.textContent = '85%';
        }
    }
}

function isElementInView(el) {
    if (!el) return false;
    const r = el.getBoundingClientRect();
    return r.top >= 0 && r.bottom <= (window.innerHeight || document.documentElement.clientHeight);
}

window.addEventListener('scroll', () => {
    const skills = document.getElementById('skills');
    if (isElementInView(skills)) animateSkills();
});

// PROJECT FILTERS
document.addEventListener('DOMContentLoaded', () => {
    const buttons = document.querySelectorAll('.filter-btn');
    const cards = document.querySelectorAll('.project-card');
    if (!buttons.length || !cards.length) return;
    buttons.forEach(btn => btn.addEventListener('click', () => {
        const year = btn.getAttribute('data-year');
        cards.forEach(c => c.style.display = (year === 'all' || c.getAttribute('data-year') === year) ? 'block' : 'none');
        buttons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
    }));
});

// GPA displays
function initGPADisplays() {
    try {
        for (let y = 1; y <= 4; y++) {
            const el = document.getElementById(`gpa-year-${y}-display`);
            if (!el) continue;
            const key = `gpa-year-${y}`;
            const saved = localStorage.getItem(key);
            if (saved !== null && !isNaN(Number(saved))) {
                el.textContent = Number(saved).toFixed(2);
                el.classList.remove('placeholder');
            } else {
                el.textContent = '-';
                el.classList.add('placeholder');
            }
            el.addEventListener('click', () => {
                const cur = el.textContent === '-' ? '' : el.textContent;
                const val = prompt(`Enter GPA for year ${y} (0.00 - 4.00):`, cur);
                if (val === null) return;
                const n = parseFloat(val);
                if (isNaN(n) || n < 0 || n > 4) return alert('Please enter a number between 0.00 and 4.00');
                const out = n.toFixed(2);
                localStorage.setItem(key, out);
                el.textContent = out;
                el.classList.remove('placeholder');
            });
        }
    } catch (e) { console.warn('initGPADisplays failed', e); }
}
document.addEventListener('DOMContentLoaded', initGPADisplays);

// EMAIL CHOOSER
document.addEventListener('DOMContentLoaded', () => {
    const emailBtn = document.getElementById('emailChooserBtn');
    const chooserEl = document.getElementById('emailChooserModal');
    if (!emailBtn || !chooserEl) return;
    const modal = new bootstrap.Modal(chooserEl);
    emailBtn.addEventListener('click', () => modal.show());
    const recipient = 'x00183868@mytudublin.ie';
    const btns = {
        gmail: document.getElementById('btn-gmail'),
        outlook: document.getElementById('btn-outlook'),
        yahoo: document.getElementById('btn-yahoo'),
        mailto: document.getElementById('btn-mailto')
    };
    function openNew(u){ window.open(u, '_blank', 'noopener'); modal.hide(); }
    if (btns.gmail) btns.gmail.addEventListener('click', () => openNew(`https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(recipient)}`));
    if (btns.outlook) btns.outlook.addEventListener('click', () => openNew(`https://outlook.live.com/owa/?path=/mail/action/compose&to=${encodeURIComponent(recipient)}`));
    if (btns.yahoo) btns.yahoo.addEventListener('click', () => openNew(`https://compose.mail.yahoo.com/?to=${encodeURIComponent(recipient)}`));
    if (btns.mailto) btns.mailto.addEventListener('click', () => { window.location.href = `mailto:${recipient}`; modal.hide(); });
});

// NAVBAR link normalizer: makes navbar links work whether the page is in root or /html/
document.addEventListener('DOMContentLoaded', () => {
    try {
        const inHtmlFolder = window.location.pathname.split('/').includes('html');
        // normalize brand link
        const brand = document.querySelector('.navbar-brand');
        if (brand) {
            if (inHtmlFolder) brand.setAttribute('href', '../index.html');
            else brand.setAttribute('href', '#hero');
        }

        const navLinks = document.querySelectorAll('.navbar-nav a');
        navLinks.forEach(a => {
            const href = a.getAttribute('href') || '';
            // special-case old "projects.html" links (these files don't exist)
            if (href.endsWith('projects.html')) {
                // if on a subpage, point back to index anchor, else use in-page anchor
                if (inHtmlFolder) a.setAttribute('href', '../index.html#projects');
                else a.setAttribute('href', '#projects');
                return;
            }
            // anchors (#...) should point to root index when on subpages
            if (href.startsWith('#')) {
                if (inHtmlFolder) a.setAttribute('href', '../index.html' + href);
                // else leave as-is
                return;
            }
            // links already pointing into html/ should be adjusted when on subpages
            if (href.startsWith('html/')) {
                if (inHtmlFolder) {
                    // from /html/ page, remove html/ prefix
                    a.setAttribute('href', href.replace(/^html\//, ''));
                }
                return;
            }
            if (/^[A-Za-z0-9_\-]+\.html$/.test(href)) {
                if (!inHtmlFolder) a.setAttribute('href', 'html/' + href);
                // if inHtmlFolder, leave as-is (they are sibling pages)
                return;
            }
            // other hrefs (external, anchors with path) leave alone
        });
    } catch (e) {
        console.warn('Navbar normalization failed', e);
    }
});


// WORK EXPERIENCE: populate an in-page list from a JSON file when available
document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('workExperienceList');
    if (!container) return;
    const inHtmlFolder = window.location.pathname.split('/').includes('html');
    const base = inHtmlFolder ? '../' : '';
    const dataPath = base + 'data/work_experience.json';

    // If a page-included global variable exists, use it (works when opening file://)
    if (window.__workExperienceData && Array.isArray(window.__workExperienceData)) {
        populateWorkExperience(container, window.__workExperienceData, base);
        return;
    }

    fetch(dataPath)
        .then(r => { if (!r.ok) throw new Error('no-data'); return r.json(); })
        .then(data => populateWorkExperience(container, data, base))
        .catch(() => {
            // leave the helpful placeholder already present in HTML, but add a small note
            const note = document.createElement('div');
            note.className = 'mt-2 small text-muted';
            note.textContent = `Tip: place ${dataPath} with a JSON array of job objects to auto-fill this section, or run a local static server to enable fetching.`;
            container.appendChild(note);
        });

    function populateWorkExperience(container, data, base) {
        if (!Array.isArray(data) || data.length === 0) {
            container.innerHTML = '<div class="alert alert-warning">Work experience file present but empty.</div>';
            return;
        }
        // Render as a Bootstrap accordion so each company expands to show details and skills
        const accordion = document.createElement('div');
        accordion.className = 'accordion work-list';
        accordion.id = 'workExperienceAccordion';
        data.forEach((job, idx) => {
            const safeEmployer = escapeHtml(job.employer || '');
            const safeRole = escapeHtml(job.role || '');
            const safeDates = escapeHtml(job.dates || '');
            const safeDetails = escapeHtml(job.details || '');

            // choose logo: prefer explicit job.logo, otherwise try common filenames by employer
            let logoPath = job.logo || '';
            if (!logoPath) {
                if (/hse/i.test(job.employer || '')) logoPath = 'images/hse_logo.jpg';
                else if (/ladbrok/i.test(job.employer || '')) logoPath = 'images/ladbrokes.png';
            }
            const logoUrl = logoPath ? (logoPath.startsWith('http') ? logoPath : base + logoPath) : '';

            const item = document.createElement('div');
            item.className = 'accordion-item';
            const itemId = `work-item-${idx}`;
            const headerId = `heading-${idx}`;
            const collapseId = `collapse-${idx}`;

            item.innerHTML = `\
                <h2 class=\"accordion-header\" id=\"${headerId}\">\
                    <button class=\"accordion-button collapsed d-flex align-items-center justify-content-between\" type=\"button\" data-bs-toggle=\"collapse\" data-bs-target=\"#${collapseId}\" aria-expanded=\"false\" aria-controls=\"${collapseId}\">\
                        <div class=\"d-flex align-items-center gap-3\">\
                            <div>\
                                <strong>${safeRole}</strong> <small class=\"text-muted\">— ${safeEmployer}</small>\
                            </div>\
                        </div>\
                        <div class=\"ms-3\">\
                            ${logoUrl ? `<img src=\"${logoUrl}\" class=\"work-logo rounded\" alt=\"${safeEmployer}\" onerror=\"this.style.display='none'\">` : ''}\
                        </div>\
                    </button>\
                </h2>\
                <div id=\"${collapseId}\" class=\"accordion-collapse collapse\" aria-labelledby=\"${headerId}\" data-bs-parent=\"#workExperienceAccordion\">\
                    <div class=\"accordion-body\">\
                        <div class=\"text-muted small mb-2\">${safeDates}</div>\
                        <div>${safeDetails}</div>\
                        <!-- skills can be added under a skills list in the JSON as an array (optional) -->\
                        ${Array.isArray(job.skills) && job.skills.length ? `\
                            <hr>\
                            <div><strong>Roles & skills:</strong></div>\
                            <div class="mt-2 d-flex flex-wrap gap-2">\
                                ${job.skills.map(s => `<span class=\"badge bg-secondary\">${escapeHtml(s)}</span>`).join('')}\
                            </div>\
                        ` : ''}\
                    </div>\
                </div>`;

            accordion.appendChild(item);
        });
        container.innerHTML = '';
        container.appendChild(accordion);
    }

    function escapeHtml(s) {
        return String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
    }
});


