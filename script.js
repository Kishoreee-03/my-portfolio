/**
 * Nandu Parasa — Professional Data Analyst Portfolio
 * Features: Scroll Progress · Theme Toggle · Typing Effect · Three.js BG
 *           Stats Counter · Active Nav · Fade-in · Hamburger · Contact Form
 */

'use strict';

/* ═══════════════════════════════════════════════════════════════════
   1. SCROLL PROGRESS BAR
═══════════════════════════════════════════════════════════════════ */
const scrollProgressBar = document.getElementById('scrollProgress');

function updateScrollProgress() {
    const scrollTop    = window.scrollY;
    const docHeight    = document.documentElement.scrollHeight - window.innerHeight;
    const scrolled     = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    if (scrollProgressBar) scrollProgressBar.style.width = scrolled + '%';
}
window.addEventListener('scroll', updateScrollProgress, { passive: true });

/* ═══════════════════════════════════════════════════════════════════
   2. THEME TOGGLE (Light / Dark)
═══════════════════════════════════════════════════════════════════ */
const themeToggle = document.getElementById('themeToggle');
const themeIcon   = document.getElementById('themeIcon');
const htmlEl      = document.documentElement;

// Persist preference
const savedTheme = localStorage.getItem('portfolio-theme') || 'light';
htmlEl.setAttribute('data-theme', savedTheme);
applyThemeIcon(savedTheme);

if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        const current = htmlEl.getAttribute('data-theme');
        const next    = current === 'dark' ? 'light' : 'dark';
        htmlEl.setAttribute('data-theme', next);
        localStorage.setItem('portfolio-theme', next);
        applyThemeIcon(next);
        // Update Three.js background color
        updateThreeBackground(next);
    });
}

function applyThemeIcon(theme) {
    if (!themeIcon) return;
    if (theme === 'dark') {
        themeIcon.classList.remove('fa-moon');
        themeIcon.classList.add('fa-sun');
    } else {
        themeIcon.classList.remove('fa-sun');
        themeIcon.classList.add('fa-moon');
    }
}

/* ═══════════════════════════════════════════════════════════════════
   3. THREE.JS ANIMATED PARTICLE BACKGROUND
═══════════════════════════════════════════════════════════════════ */
let threeScene, threeCamera, threeRenderer, particles, particlePositions;

function initThree() {
    const canvas = document.getElementById('bg-canvas');
    if (!canvas || typeof THREE === 'undefined') return;

    const W = window.innerWidth;
    const H = window.innerHeight;

    threeScene    = new THREE.Scene();
    threeCamera   = new THREE.PerspectiveCamera(60, W / H, 0.1, 1000);
    threeCamera.position.z = 20;

    threeRenderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    threeRenderer.setSize(W, H);
    threeRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    threeRenderer.setClearColor(0x000000, 0);

    // Create particle cloud
    const count  = 180;
    const geometry = new THREE.BufferGeometry();
    particlePositions = new Float32Array(count * 3);

    for (let i = 0; i < count * 3; i++) {
        particlePositions[i] = (Math.random() - 0.5) * 50;
    }
    geometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));

    const material = new THREE.PointsMaterial({
        color: getParticleColor(),
        size: 0.22,
        transparent: true,
        opacity: 0.7,
        sizeAttenuation: true,
    });

    particles = new THREE.Points(geometry, material);
    threeScene.add(particles);

    // Ambient glow sphere
    const sphereGeo = new THREE.SphereGeometry(3, 32, 32);
    const sphereMat = new THREE.MeshBasicMaterial({
        color: 0x4f46e5,
        transparent: true,
        opacity: 0.04,
        wireframe: false,
    });
    const glowSphere = new THREE.Mesh(sphereGeo, sphereMat);
    glowSphere.position.set(8, -2, -5);
    threeScene.add(glowSphere);

    // Wireframe torus knot
    const knotGeo  = new THREE.TorusKnotGeometry(3, 0.8, 120, 16);
    const knotMat  = new THREE.MeshBasicMaterial({
        color: 0x6366f1,
        wireframe: true,
        transparent: true,
        opacity: 0.06,
    });
    const torusKnot = new THREE.Mesh(knotGeo, knotMat);
    torusKnot.position.set(-10, 2, -8);
    threeScene.add(torusKnot);

    window._threeKnot   = torusKnot;
    window._threeSphere = glowSphere;

    window.addEventListener('resize', onThreeResize);
    animateThree();
}

function getParticleColor() {
    return htmlEl.getAttribute('data-theme') === 'dark' ? 0x818cf8 : 0x6366f1;
}

function updateThreeBackground(theme) {
    if (particles) {
        particles.material.color.setHex(theme === 'dark' ? 0x818cf8 : 0x6366f1);
        particles.material.opacity = theme === 'dark' ? 0.9 : 0.7;
    }
}

function onThreeResize() {
    const W = window.innerWidth;
    const H = window.innerHeight;
    threeCamera.aspect = W / H;
    threeCamera.updateProjectionMatrix();
    threeRenderer.setSize(W, H);
}

let clock = { t: 0 };
function animateThree() {
    requestAnimationFrame(animateThree);
    clock.t += 0.004;

    if (particles) {
        particles.rotation.y += 0.0008;
        particles.rotation.x += 0.0003;
    }
    if (window._threeKnot) {
        window._threeKnot.rotation.x += 0.003;
        window._threeKnot.rotation.y += 0.002;
    }
    if (window._threeSphere) {
        window._threeSphere.position.y = -2 + Math.sin(clock.t * 0.6) * 1.5;
    }

    threeRenderer.render(threeScene, threeCamera);
}

initThree();

/* ═══════════════════════════════════════════════════════════════════
   4. NAVBAR — Scroll Shadow + Active Link
═══════════════════════════════════════════════════════════════════ */
const header = document.getElementById('header');

window.addEventListener('scroll', () => {
    if (header) header.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });

// Active nav highlight on scroll
const sections = document.querySelectorAll('section[id]');
const navLinks  = document.querySelectorAll('.nav-link');

function setActiveNav() {
    let current = '';
    sections.forEach(section => {
        if (window.scrollY >= section.offsetTop - 130) {
            current = section.id;
        }
    });
    navLinks.forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
    });
}
window.addEventListener('scroll', setActiveNav, { passive: true });

/* ═══════════════════════════════════════════════════════════════════
   5. HAMBURGER MENU
═══════════════════════════════════════════════════════════════════ */
const hamburger = document.getElementById('hamburger');
const navMenu   = document.getElementById('navMenu');

if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
        const open = navMenu.classList.toggle('open');
        hamburger.classList.toggle('open', open);
        hamburger.setAttribute('aria-expanded', open);
    });
}

// Close on nav link click
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        navMenu && navMenu.classList.remove('open');
        hamburger && hamburger.classList.remove('open');
    });
});

// Close on outside click
document.addEventListener('click', (e) => {
    if (navMenu && hamburger && !navMenu.contains(e.target) && !hamburger.contains(e.target)) {
        navMenu.classList.remove('open');
        hamburger.classList.remove('open');
    }
});

/* ═══════════════════════════════════════════════════════════════════
   6. TYPING EFFECT
═══════════════════════════════════════════════════════════════════ */
const typingEl  = document.getElementById('typingText');
const roles     = [
    'Data Analyst',
    'AI Enthusiast',
    'Data Science Associate',
    'Machine Learning Engineer',
    'Problem Solver',
];
let   roleIndex  = 0;
let   charIndex  = 0;
let   isDeleting = false;
const TYPE_SPEED   = 85;
const DELETE_SPEED = 45;
const PAUSE_TIME   = 1800;

function typeEffect() {
    if (!typingEl) return;
    const current = roles[roleIndex];

    if (isDeleting) {
        typingEl.textContent = current.slice(0, --charIndex);
    } else {
        typingEl.textContent = current.slice(0, ++charIndex);
    }

    let delay = isDeleting ? DELETE_SPEED : TYPE_SPEED;

    if (!isDeleting && charIndex === current.length) {
        delay = PAUSE_TIME;
        isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
        isDeleting  = false;
        roleIndex   = (roleIndex + 1) % roles.length;
        delay       = 300;
    }

    setTimeout(typeEffect, delay);
}

// Start typing after a short delay
setTimeout(typeEffect, 600);

/* ═══════════════════════════════════════════════════════════════════
   7. SCROLL FADE-IN (IntersectionObserver)
═══════════════════════════════════════════════════════════════════ */
const fadeSelectors = [
    '.section-label', '.section-title', '.section-sub',
    '.about-text', '.about-image',
    '.timeline-item', '.skill-category',
    '.project-card', '.cert-card',
    '.contact-info', '.contact-form',
    '.stat-item', '.hero-text',
];

const fadeEls = document.querySelectorAll(fadeSelectors.join(', '));
fadeEls.forEach(el => el.classList.add('fade-up'));

const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
        }
    });
}, { threshold: 0.10, rootMargin: '0px 0px -40px 0px' });

fadeEls.forEach(el => observer.observe(el));

/* ═══════════════════════════════════════════════════════════════════
   8. STATS COUNTER ANIMATION
═══════════════════════════════════════════════════════════════════ */
function animateCounter(el, target, duration = 1800) {
    let start     = null;
    const startVal = 0;

    function step(timestamp) {
        if (!start) start = timestamp;
        const progress = Math.min((timestamp - start) / duration, 1);
        // Ease-out cubic
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.floor(eased * target);
        if (progress < 1) requestAnimationFrame(step);
        else el.textContent = target;
    }
    requestAnimationFrame(step);
}

const statsSection = document.getElementById('stats');
let countersTriggered = false;

const statsObserver = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting && !countersTriggered) {
        countersTriggered = true;
        // Animate each stat item
        const items = document.querySelectorAll('.stat-item');
        items.forEach((item, i) => {
            const target  = parseInt(item.getAttribute('data-target'), 10);
            const numEl   = item.querySelector('.counter');
            if (numEl && !isNaN(target)) {
                setTimeout(() => animateCounter(numEl, target), i * 150);
            }
        });
    }
}, { threshold: 0.3 });

if (statsSection) statsObserver.observe(statsSection);

/* ═══════════════════════════════════════════════════════════════════
   9. SMOOTH SCROLL FOR ANCHOR LINKS
═══════════════════════════════════════════════════════════════════ */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            e.preventDefault();
            const offset = 80; // navbar height
            const top = target.getBoundingClientRect().top + window.scrollY - offset;
            window.scrollTo({ top, behavior: 'smooth' });
        }
    });
});

/* ═══════════════════════════════════════════════════════════════════
   10. CONTACT FORM — Real Submit via Formspree
═══════════════════════════════════════════════════════════════════ */
const contactForm = document.getElementById('contactForm');
const submitBtn   = document.getElementById('submitBtn');

if (contactForm) {
    contactForm.addEventListener('submit', e => {
        e.preventDefault();

        const name    = document.getElementById('name').value.trim();
        const email   = document.getElementById('email').value.trim();
        const message = document.getElementById('message').value.trim();

        if (!name || !email || !message) return;

        // Loading state
        submitBtn.disabled = true;
        submitBtn.innerHTML = 'Sending <i class="fas fa-spinner fa-spin"></i>';
        submitBtn.style.opacity = '0.85';

        // Prepare form data
        const formData = new FormData(contactForm);

        // Reset helper
        const resetSubmitBtn = () => {
            setTimeout(() => {
                submitBtn.disabled = false;
                submitBtn.innerHTML = 'Send Message <i class="fas fa-paper-plane"></i>';
                submitBtn.style.background = '';
                submitBtn.style.opacity    = '';
            }, 3500);
        };

        // Real submission
        fetch(contactForm.action, {
            method: 'POST',
            body: formData,
            headers: {
                'Accept': 'application/json'
            }
        })
        .then(response => {
            if (response.ok) {
                submitBtn.innerHTML = 'Message Sent! <i class="fas fa-check-circle"></i>';
                submitBtn.style.background = 'linear-gradient(135deg, #10b981, #059669)';
                submitBtn.style.opacity    = '1';
                contactForm.reset();
                resetSubmitBtn();
            } else {
                submitBtn.innerHTML = 'Failed to Send <i class="fas fa-exclamation-circle"></i>';
                submitBtn.style.background = 'linear-gradient(135deg, #ef4444, #dc2626)';
                submitBtn.style.opacity    = '1';
                resetSubmitBtn();
            }
        })
        .catch(error => {
            console.error('Error submitting form:', error);
            submitBtn.innerHTML = 'Connection Error <i class="fas fa-wifi"></i>';
            submitBtn.style.background = 'linear-gradient(135deg, #f59e0b, #d97706)';
            submitBtn.style.opacity    = '1';
            resetSubmitBtn();
        });
    });
}

/* ═══════════════════════════════════════════════════════════════════
   12. MOUSE PARALLAX ON HERO
═══════════════════════════════════════════════════════════════════ */
const heroSection = document.querySelector('.hero-section');
if (heroSection) {
    heroSection.addEventListener('mousemove', e => {
        const rect  = heroSection.getBoundingClientRect();
        const xPct  = ((e.clientX - rect.left) / rect.width  - 0.5) * 2;
        const yPct  = ((e.clientY - rect.top)  / rect.height - 0.5) * 2;

        const avatar = document.querySelector('.hero-image-wrap');
        if (avatar) {
            avatar.style.transform = `translate(${xPct * 8}px, ${yPct * 6}px)`;
        }
        const blobs = document.querySelectorAll('.hero-badge');
        blobs.forEach((b, i) => {
            const d = i === 0 ? 1 : -1;
            b.style.transform = `translate(${xPct * 12 * d}px, ${yPct * 8}px)`;
        });
    });

    heroSection.addEventListener('mouseleave', () => {
        const avatar = document.querySelector('.hero-image-wrap');
        if (avatar) avatar.style.transform = '';
        document.querySelectorAll('.hero-badge').forEach(b => b.style.transform = '');
    });
}

/* ═══════════════════════════════════════════════════════════════════
   13. PROJECT CARD TILT EFFECT
═══════════════════════════════════════════════════════════════════ */
document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('mousemove', e => {
        const rect   = card.getBoundingClientRect();
        const x      = ((e.clientX - rect.left) / rect.width  - 0.5) * 16;
        const y      = ((e.clientY - rect.top)  / rect.height - 0.5) * -16;
        card.style.transform = `perspective(800px) rotateY(${x}deg) rotateX(${y}deg) translateY(-8px)`;
    });

    card.addEventListener('mouseleave', () => {
        card.style.transform = '';
        card.style.transition = 'all 0.5s cubic-bezier(0.4,0,0.2,1)';
        setTimeout(() => { card.style.transition = ''; }, 500);
    });
});

/* ═══════════════════════════════════════════════════════════════════
   14. PRELOADER
═══════════════════════════════════════════════════════════════════ */
const preloader = document.getElementById('preloader');

function hidePreloader() {
    if (preloader) {
        preloader.classList.add('hidden');
        setTimeout(() => { if (preloader.parentNode) preloader.remove(); }, 700);
    }
}

if (document.readyState === 'complete') {
    setTimeout(hidePreloader, 1600);
} else {
    window.addEventListener('load', () => setTimeout(hidePreloader, 1600));
}

/* ═══════════════════════════════════════════════════════════════════
   15. BACK TO TOP BUTTON
═══════════════════════════════════════════════════════════════════ */
const backToTopBtn = document.getElementById('backToTop');

window.addEventListener('scroll', () => {
    if (backToTopBtn) {
        backToTopBtn.classList.toggle('visible', window.scrollY > 400);
    }
}, { passive: true });

if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

/* ═══════════════════════════════════════════════════════════════════
   16. CERT CARD — Gold sparkle on hover
═══════════════════════════════════════════════════════════════════ */
(function injectSparkleStyle() {
    const style = document.createElement('style');
    style.textContent = [
        '@keyframes sparkleAnim {',
        '  0%   { transform: translate(-50%,-50%) scale(0); opacity: 1; }',
        '  60%  { transform: translate(-50%,-50%) scale(3); opacity: 0.7; }',
        '  100% { transform: translate(-50%,-50%) scale(7); opacity: 0; }',
        '}'
    ].join('');
    document.head.appendChild(style);
})();

document.querySelectorAll('.cert-card').forEach(card => {
    card.addEventListener('mouseenter', function(e) {
        const rect = this.getBoundingClientRect();
        const dot  = document.createElement('span');
        dot.style.cssText =
            'position:absolute;width:6px;height:6px;border-radius:50%;' +
            'background:#f59e0b;pointer-events:none;' +
            'top:' + (e.clientY - rect.top)  + 'px;' +
            'left:'+ (e.clientX - rect.left) + 'px;' +
            'transform:translate(-50%,-50%) scale(0);' +
            'animation:sparkleAnim 0.65s ease forwards;z-index:10;';
        this.style.position = 'relative';
        this.appendChild(dot);
        setTimeout(() => dot.remove(), 700);
    });
});

/* ═══════════════════════════════════════════════════════════════════
   17. STAGGERED CHILDREN REVEAL
═══════════════════════════════════════════════════════════════════ */
const staggerObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            Array.from(entry.target.children).forEach((child, i) => {
                setTimeout(() => child.classList.add('fade-up', 'visible'), i * 90);
            });
            staggerObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.08 });

document.querySelectorAll('.projects-grid, .cert-grid, .stats-grid').forEach(grid => {
    staggerObserver.observe(grid);
});

/* ═══════════════════════════════════════════════════════════════════
   18. KEYBOARD — ESC closes mobile menu
═══════════════════════════════════════════════════════════════════ */
document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && navMenu && navMenu.classList.contains('open')) {
        navMenu.classList.remove('open');
        hamburger && hamburger.classList.remove('open');
    }
});

/* ═══════════════════════════════════════════════════════════════════
   19. CERTIFICATE LIGHTBOX MODAL
 ═══════════════════════════════════════════════════════════════════ */
const certModal = document.getElementById('certModal');
const certModalFrame = document.getElementById('certModalFrame');
const certModalClose = document.querySelector('.cert-modal-close');
const certModalOverlay = document.querySelector('.cert-modal-overlay');

function openCertModal(pdfPath) {
    if (!certModal || !certModalFrame) return;
    certModalFrame.src = pdfPath;
    certModal.classList.add('active');
    certModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden'; // prevent scrolling background
}

function closeCertModal() {
    if (!certModal || !certModalFrame) return;
    certModal.classList.remove('active');
    certModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    // delay clearing source to prevent white flash while closing transition completes
    setTimeout(() => {
        if (!certModal.classList.contains('active')) {
            certModalFrame.src = '';
        }
    }, 400);
}

document.querySelectorAll('.cert-card[data-cert], .view-offer-btn[data-cert]').forEach(card => {
    card.addEventListener('click', () => {
        const certPath = card.getAttribute('data-cert');
        if (certPath) {
            openCertModal(certPath);
        }
    });
});

if (certModalClose) certModalClose.addEventListener('click', closeCertModal);
if (certModalOverlay) certModalOverlay.addEventListener('click', closeCertModal);

document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && certModal && certModal.classList.contains('active')) {
        closeCertModal();
    }
});

/* ═══════════════════════════════════════════════════════════════════
   20. INTERACTIVE MOCK BI DASHBOARD LOGIC
═══════════════════════════════════════════════════════════════════ */
const salesData = [
    { region: 'North', category: 'Technology', month: 'Jan', sales: 4200, quantity: 24, profit: 840 },
    { region: 'North', category: 'Furniture', month: 'Feb', sales: 3100, quantity: 18, profit: 465 },
    { region: 'North', category: 'Office Supplies', month: 'Mar', sales: 1800, quantity: 30, profit: 360 },
    { region: 'South', category: 'Technology', month: 'Apr', sales: 5500, quantity: 32, profit: 1210 },
    { region: 'South', category: 'Furniture', month: 'May', sales: 2900, quantity: 15, profit: 290 },
    { region: 'South', category: 'Office Supplies', month: 'Jan', sales: 1200, quantity: 20, profit: 180 },
    { region: 'East', category: 'Technology', month: 'Feb', sales: 6100, quantity: 38, profit: 1464 },
    { region: 'East', category: 'Furniture', month: 'Mar', sales: 4000, quantity: 22, profit: 600 },
    { region: 'East', category: 'Office Supplies', month: 'Apr', sales: 2200, quantity: 35, profit: 440 },
    { region: 'West', category: 'Technology', month: 'May', sales: 4800, quantity: 28, profit: 1056 },
    { region: 'West', category: 'Furniture', month: 'Jan', sales: 3500, quantity: 21, profit: 525 },
    { region: 'West', category: 'Office Supplies', month: 'Feb', sales: 1900, quantity: 25, profit: 285 },
    { region: 'North', category: 'Technology', month: 'Mar', sales: 5000, quantity: 29, profit: 1100 },
    { region: 'South', category: 'Furniture', month: 'Apr', sales: 3200, quantity: 16, profit: 480 },
    { region: 'East', category: 'Office Supplies', month: 'May', sales: 2500, quantity: 40, profit: 500 },
    { region: 'West', category: 'Technology', month: 'Jan', sales: 5200, quantity: 30, profit: 1196 }
];

let selectedRegion = 'all';
let selectedCategory = 'all';

function initDashboard() {
    const regionButtons = document.querySelectorAll('#regionFilters .filter-btn');
    const categoryButtons = document.querySelectorAll('#categoryFilters .filter-btn');

    if (!regionButtons.length || !categoryButtons.length) return;

    regionButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            regionButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            selectedRegion = btn.getAttribute('data-filter');
            updateDashboard();
        });
    });

    categoryButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            categoryButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            selectedCategory = btn.getAttribute('data-filter');
            updateDashboard();
        });
    });

    updateDashboard();
}

function updateDashboard() {
    // Filter data
    const filtered = salesData.filter(d => {
        const matchReg = selectedRegion === 'all' || d.region === selectedRegion;
        const matchCat = selectedCategory === 'all' || d.category === selectedCategory;
        return matchReg && matchCat;
    });

    // Calculate KPIs
    let totalSales = 0;
    let totalQuantity = 0;
    let totalProfit = 0;

    filtered.forEach(d => {
        totalSales += d.sales;
        totalQuantity += d.quantity;
        totalProfit += d.profit;
    });

    const avgMargin = totalSales > 0 ? (totalProfit / totalSales) * 100 : 0;

    // Update KPI Displays
    const kpiSalesEl = document.getElementById('kpiSales');
    const kpiQtyEl = document.getElementById('kpiQuantity');
    const kpiMarginEl = document.getElementById('kpiMargin');

    if (kpiSalesEl) kpiSalesEl.textContent = `$${totalSales.toLocaleString()}`;
    if (kpiQtyEl) kpiQtyEl.textContent = totalQuantity.toLocaleString();
    if (kpiMarginEl) kpiMarginEl.textContent = `${avgMargin.toFixed(1)}%`;

    // Monthly Chart Math
    const monthlyMap = { 'Jan': 0, 'Feb': 0, 'Mar': 0, 'Apr': 0, 'May': 0 };
    filtered.forEach(d => {
        if (monthlyMap[d.month] !== undefined) {
            monthlyMap[d.month] += d.sales;
        }
    });

    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May'];
    const maxSales = Math.max(...months.map(m => monthlyMap[m]), 1);

    const chartContainer = document.getElementById('barChartContainer');
    if (chartContainer) {
        chartContainer.innerHTML = '';
        months.forEach(m => {
            const val = monthlyMap[m];
            const pct = (val / maxSales) * 100;

            const barWrap = document.createElement('div');
            barWrap.className = 'chart-bar-wrap';
            barWrap.innerHTML = `
                <div class="chart-bar-fill" style="height: ${pct}%" data-value="$${val.toLocaleString()}"></div>
                <span class="chart-label">${m}</span>
            `;
            chartContainer.appendChild(barWrap);
        });
    }

    // Dynamic Insights Injections
    const insightList = document.getElementById('insightList');
    if (insightList) {
        insightList.innerHTML = '';
        
        let highestMonth = 'Jan';
        let highestSales = 0;
        months.forEach(m => {
            if (monthlyMap[m] > highestSales) {
                highestSales = monthlyMap[m];
                highestMonth = m;
            }
        });

        const insights = [];
        
        if (filtered.length === 0) {
            insights.push('No transactions match the selected filter combination.');
        } else {
            insights.push(`Highest performing month under current filters is <strong>${highestMonth}</strong> with sales of <strong>$${highestSales.toLocaleString()}</strong>.`);
            
            const marginText = avgMargin > 20 
                ? `Average profit margin is exceptionally strong at <strong>${avgMargin.toFixed(1)}%</strong>.`
                : `Average profit margin is stable at <strong>${avgMargin.toFixed(1)}%</strong>.`;
            insights.push(marginText);

            if (selectedRegion !== 'all') {
                insights.push(`The <strong>${selectedRegion}</strong> region generated a total of <strong>$${totalSales.toLocaleString()}</strong> across <strong>${filtered.length}</strong> core categories.`);
            } else {
                // Find top region
                const regMap = {};
                filtered.forEach(d => { regMap[d.region] = (regMap[d.region] || 0) + d.sales; });
                let topReg = 'East';
                let topRegSales = 0;
                Object.keys(regMap).forEach(r => {
                    if (regMap[r] > topRegSales) {
                        topRegSales = regMap[r];
                        topReg = r;
                    }
                });
                insights.push(`The <strong>${topReg}</strong> region is leading in sales performance under selected filters.`);
            }

            if (selectedCategory !== 'all') {
                insights.push(`Selected category <strong>${selectedCategory}</strong> units sold: <strong>${totalQuantity} items</strong>.`);
            }
        }

        insights.forEach(ins => {
            const li = document.createElement('li');
            li.innerHTML = ins;
            insightList.appendChild(li);
        });
    }
}

// Initialise on load
initDashboard();

/* ═══════════════════════════════════════════════════════════════════
   21. INTERACTIVE PROJECT DETAILS MODAL
═══════════════════════════════════════════════════════════════════ */
const projectsDetails = {
    '1': {
        title: 'Sales Data Analysis Dashboard',
        icon: 'fa-chart-line',
        role: 'Lead Data Analyst',
        date: 'Jan 2026',
        tags: ['Power BI', 'SQL', 'Python'],
        problem: 'Stakeholders struggled with slow, manual reporting, taking up to 5 days to consolidate global sales data, delaying critical strategic decisions.',
        solution: 'Developed an end-to-end automated BI pipeline. Extracted and cleaned transaction data using SQL CTEs and window functions. Engineered a star-schema data model and built a highly interactive Power BI dashboard featuring drill-downs, dynamic filtering, and predictive sales forecasting.',
        results: [
            'Reduced management reporting time by 40%.',
            'Identified $45K in underperforming inventory within the first 30 days.',
            'Enabled self-service analysis for 12+ stakeholders.'
        ],
        github: 'https://github.com/Kishoreee-03/my-portfolio',
        demo: 'https://kishoreee-03.github.io/my-portfolio'
    },
    '2': {
        title: 'Supply Chain Replenishment System',
        icon: 'fa-boxes',
        role: 'Data Scientist & ML Developer',
        date: 'Nov 2025',
        tags: ['Python', 'Pandas', 'Scikit-Learn'],
        problem: 'An e-commerce partner faced frequent stockouts of high-demand goods alongside excessive waste in perishables due to rule-of-thumb ordering patterns.',
        solution: 'Built a predictive forecasting engine using Random Forest Regressors and XGBoost models trained on 2+ years of weekly inventory and sales data. Automated alert thresholds based on safety stock calculations and lead times.',
        results: [
            'Decreased critical stockout instances by 28%.',
            'Improved inventory turnover rate by 14%.',
            'Saved approximately 18 hours/week in manual replenishment scheduling.'
        ],
        github: 'https://github.com/Kishoreee-03',
        demo: '#'
    },
    '3': {
        title: 'Rice Variety Classification AI',
        icon: 'fa-seedling',
        role: 'Deep Learning Engineer',
        date: 'Aug 2025',
        tags: ['TensorFlow', 'Deep Learning', 'Computer Vision'],
        problem: 'Manual identification and grading of commercial rice grains is labor-intensive and prone to human classification error, impacting quality control in agriculture packaging.',
        solution: 'Engineered a Convolutional Neural Network (CNN) in TensorFlow/Keras. Applied data augmentation techniques (rotations, flips, zooming) to handle dataset imbalance and trained a custom MobileNetV2 architecture with transfer learning.',
        results: [
            'Achieved 97.4% accuracy across 5 distinct rice varieties.',
            'Reduced sorting quality control throughput times from minutes to milliseconds per batch.',
            'Published visual confusion matrix and feature maps showcasing deep layer activation.'
        ],
        github: 'https://github.com/Kishoreee-03',
        demo: '#'
    }
};

const projectModal = document.getElementById('projectModal');
const projectModalBody = document.getElementById('projectModalBody');
const projectModalClose = document.getElementById('projectModalClose');

function openProjectModal(id) {
    const details = projectsDetails[id];
    if (!details || !projectModal || !projectModalBody) return;

    const tagsHtml = details.tags.map(t => `<span>${t}</span>`).join('');
    const resultsHtml = details.results.map(r => `<li>${r}</li>`).join('');
    
    let demoBtnHtml = `<a href="${details.demo}" target="_blank" class="btn btn-primary"><i class="fas fa-external-link-alt"></i> Live Demo</a>`;
    if (details.demo === '#') {
        demoBtnHtml = `<button class="btn btn-primary" disabled style="opacity:0.3; cursor:not-allowed;"><i class="fas fa-external-link-alt"></i> Demo Unavailable</button>`;
    }

    projectModalBody.innerHTML = `
        <div class="proj-modal-header">
            <h2>${details.title}</h2>
            <div class="proj-modal-meta">
                <span><i class="fas fa-briefcase"></i> <strong>Role:</strong> ${details.role}</span>
                <span><i class="fas fa-calendar-alt"></i> <strong>Date:</strong> ${details.date}</span>
            </div>
            <div class="proj-modal-tags">
                ${tagsHtml}
            </div>
        </div>
        
        <div class="proj-modal-content-grid">
            <div class="proj-modal-sec">
                <h4><i class="fas fa-exclamation-circle"></i> The Challenge</h4>
                <p>${details.problem}</p>
            </div>
            
            <div class="proj-modal-sec">
                <h4><i class="fas fa-cogs"></i> Technical Solution</h4>
                <p>${details.solution}</p>
            </div>
            
            <div class="proj-modal-sec">
                <h4><i class="fas fa-chart-line"></i> Key Outcomes & Results</h4>
                <ul>
                    ${resultsHtml}
                </ul>
            </div>
        </div>
        
        <div class="proj-modal-actions">
            ${demoBtnHtml}
            <a href="${details.github}" target="_blank" class="btn btn-outline"><i class="fab fa-github"></i> Source Code</a>
        </div>
    `;

    projectModal.classList.add('active');
    projectModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
}

function closeProjectModal() {
    if (!projectModal) return;
    projectModal.classList.remove('active');
    projectModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
}

// Add triggers to all project cards
document.querySelectorAll('.project-card[data-project]').forEach(card => {
    card.addEventListener('click', (e) => {
        // Prevent trigger if clicking an external link inside the card
        if (e.target.closest('.proj-link-icon')) {
            return;
        }
        
        const id = card.getAttribute('data-project');
        if (id) {
            openProjectModal(id);
        }
    });
});

if (projectModalClose) projectModalClose.addEventListener('click', closeProjectModal);
if (projectModal) {
    projectModal.querySelector('.cert-modal-overlay').addEventListener('click', closeProjectModal);
}

document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && projectModal && projectModal.classList.contains('active')) {
        closeProjectModal();
    }
});

/* ═══════════════════════════════════════════════════════════════════
   22. INTERACTIVE HTML RESUME MODAL LOGIC
═══════════════════════════════════════════════════════════════════ */
const resumeModal = document.getElementById('resumeModal');
const resumeModalClose = document.getElementById('resumeModalClose');
const resumeBtn = document.getElementById('resumeBtn');
const aboutResumeBtn = document.getElementById('aboutResumeBtn');
const printResumeBtn = document.getElementById('printResumeBtn');

function openResumeModal(e) {
    if (e) e.preventDefault();
    if (!resumeModal) return;
    resumeModal.classList.add('active');
    resumeModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
}

function closeResumeModal() {
    if (!resumeModal) return;
    resumeModal.classList.remove('active');
    resumeModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
}

if (resumeBtn) resumeBtn.addEventListener('click', openResumeModal);
if (aboutResumeBtn) aboutResumeBtn.addEventListener('click', openResumeModal);
if (resumeModalClose) resumeModalClose.addEventListener('click', closeResumeModal);
if (resumeModal) {
    resumeModal.querySelector('.cert-modal-overlay').addEventListener('click', closeResumeModal);
}

document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && resumeModal && resumeModal.classList.contains('active')) {
        closeResumeModal();
    }
});

if (printResumeBtn) {
    printResumeBtn.addEventListener('click', () => {
        window.print();
    });
}

