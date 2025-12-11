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
    // runtime test: confirm function is invoked
    console.log('toggleDarkMode invoked — theme:', theme);
}

// Apply stored theme on DOM ready
document.addEventListener('DOMContentLoaded', () => {
    if (localStorage.getItem('theme') === 'dark') document.body.classList.add('dark-mode');
});

// SKILLS PROGRESS
function animateSkills() {
    const htmlBar = document.getElementById('htmlBar');
    const jsBar = document.getElementById('jsBar');
    if (!htmlBar || !jsBar) return;
    if (!htmlBar.classList.contains('animated')) {
        htmlBar.style.width = '90%';
        jsBar.style.width = '75%';
        htmlBar.classList.add('animated');
        jsBar.classList.add('animated');
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

    fetch(dataPath)
        .then(r => { if (!r.ok) throw new Error('no-data'); return r.json(); })
        .then(data => populateWorkExperience(container, data, base))
        .catch(() => {
            // leave the helpful placeholder already present in HTML, but add a small note
            const note = document.createElement('div');
            note.className = 'mt-2 small text-muted';
            note.textContent = `Tip: place ${dataPath} with a JSON array of job objects to auto-fill this section.`;
            container.appendChild(note);
        });

    function populateWorkExperience(container, data, base) {
        if (!Array.isArray(data) || data.length === 0) {
            container.innerHTML = '<div class="alert alert-warning">Work experience file present but empty.</div>';
            return;
        }
        const list = document.createElement('div');
        list.className = 'list-group work-list';
        data.forEach(job => {
            const logoUrl = job.logo ? (job.logo.startsWith('http') ? job.logo : base + job.logo) : base + 'images/logos/placeholder.png';
            const item = document.createElement('div');
            item.className = 'list-group-item work-item';
            const safeEmployer = escapeHtml(job.employer || '');
            const safeRole = escapeHtml(job.role || '');
            const safeDates = escapeHtml(job.dates || '');
            const safeDetails = escapeHtml(job.details || '');
            // Render role + employer with logo at the end of the title line
            item.innerHTML = `\
                <div class="d-flex align-items-center justify-content-between">\
                    <div>\
                        <h5 class=\"mb-1\">${safeRole} <small class=\"text-muted\">— ${safeEmployer}</small></h5>\
                    </div>\
                    <div class=\"ms-3\">\
                        <img src=\"${logoUrl}\" class=\"work-logo rounded\" alt=\"${safeEmployer}\" onerror=\"this.style.display='none'\">\
                    </div>\
                </div>\
                <div class=\"text-muted small mb-2\">${safeDates}</div>\
                <div>${safeDetails}</div>`;
            list.appendChild(item);
        });
        container.innerHTML = '';
        container.appendChild(list);
    }

    function escapeHtml(s) {
        return String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
    }
});


