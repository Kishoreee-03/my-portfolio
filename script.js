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
   10. CONTACT FORM — Simulated Submit
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

        // Simulate async send
        setTimeout(() => {
            submitBtn.innerHTML = 'Message Sent! <i class="fas fa-check-circle"></i>';
            submitBtn.style.background = 'linear-gradient(135deg, #10b981, #059669)';
            submitBtn.style.opacity    = '1';
            contactForm.reset();

            setTimeout(() => {
                submitBtn.disabled = false;
                submitBtn.innerHTML = 'Send Message <i class="fas fa-paper-plane"></i>';
                submitBtn.style.background = '';
                submitBtn.style.opacity    = '';
            }, 3500);
        }, 1800);
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
