/**
 * MADHAV PAINULY PORTFOLIO - MAIN JAVASCRIPT
 */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize functions
    initCustomCursor();
    initHeroParticles();
    initScrollEffects();
    initScrollReveal();
    initGlitchEffect();
    initSkillHighlighting();
    initContactForm();
});

/* ==========================================================================
   CONSTELLATION PARTICLES (HERO BACKGROUND)
   ========================================================================== */
function initHeroParticles() {
    const canvas = document.getElementById('hero-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let particles = [];
    let mouse = { x: null, y: null, radius: 150 };

    // Particle settings
    const particleCount = getParticleCountByScreen();
    const connectionDistance = 110;
    const particleSpeed = 0.4;
    const accentColor = '0, 229, 117'; // RGB matching CSS --accent-color (#00e575)

    // Resize handler
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        initParticles();
    }

    function getParticleCountByScreen() {
        if (window.innerWidth < 768) return 40;
        if (window.innerWidth < 1024) return 70;
        return 100;
    }

    // Particle Class
    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.vx = (Math.random() - 0.5) * particleSpeed;
            this.vy = (Math.random() - 0.5) * particleSpeed;
            this.radius = Math.random() * 2 + 1;
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;

            // Bounce off boundaries
            if (this.x < 0 || this.x > canvas.width) this.vx = -this.vx;
            if (this.y < 0 || this.y > canvas.height) this.vy = -this.vy;

            // Mouse repulsion (gentle push)
            if (mouse.x !== null && mouse.y !== null) {
                const dx = this.x - mouse.x;
                const dy = this.y - mouse.y;
                const dist = Math.hypot(dx, dy);
                if (dist < mouse.radius) {
                    const force = (mouse.radius - dist) / mouse.radius;
                    const angle = Math.atan2(dy, dx);
                    // Gentle push out
                    this.x += Math.cos(angle) * force * 1.5;
                    this.y += Math.sin(angle) * force * 1.5;
                }
            }
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${accentColor}, 0.65)`;
            ctx.fill();
        }
    }

    // Populate particles
    function initParticles() {
        particles = [];
        const count = getParticleCountByScreen();
        for (let i = 0; i < count; i++) {
            particles.push(new Particle());
        }
    }

    // Connect particles with lines
    function drawConnections() {
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const distance = Math.hypot(dx, dy);

                if (distance < connectionDistance) {
                    // Alpha fade out as they separate
                    const alpha = (1 - distance / connectionDistance) * 0.18;
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = `rgba(${accentColor}, ${alpha})`;
                    ctx.lineWidth = 0.8;
                    ctx.stroke();
                }
            }

            // Draw connection to mouse
            if (mouse.x !== null && mouse.y !== null) {
                const dx = particles[i].x - mouse.x;
                const dy = particles[i].y - mouse.y;
                const distance = Math.hypot(dx, dy);
                if (distance < mouse.radius) {
                    const alpha = (1 - distance / mouse.radius) * 0.35;
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(mouse.x, mouse.y);
                    ctx.strokeStyle = `rgba(${accentColor}, ${alpha})`;
                    ctx.lineWidth = 1;
                    ctx.stroke();
                }
            }
        }
    }

    // Animation Loop
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        particles.forEach(particle => {
            particle.update();
            particle.draw();
        });
        
        drawConnections();
        requestAnimationFrame(animate);
    }

    // Track Mouse
    window.addEventListener('mousemove', (e) => {
        // Only track mouse inside/near hero region
        if (window.scrollY < window.innerHeight) {
            mouse.x = e.clientX;
            mouse.y = e.clientY + window.scrollY;
        } else {
            mouse.x = null;
            mouse.y = null;
        }
    });

    window.addEventListener('mouseleave', () => {
        mouse.x = null;
        mouse.y = null;
    });

    // Resize listener
    window.addEventListener('resize', () => {
        clearTimeout(window.resizeTimer);
        window.resizeTimer = setTimeout(resizeCanvas, 200);
    });

    // Init & Start
    resizeCanvas();
    animate();
}

/* ==========================================================================
   SCROLL EFFECTS: NAVIGATION HIGHLIGHT & HEADER BG
   ========================================================================== */
function initScrollEffects() {
    const header = document.querySelector('.header');
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    // Header scroll background toggle
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.style.backgroundColor = 'rgba(8, 8, 10, 0.9)';
            header.style.height = '70px';
        } else {
            header.style.backgroundColor = 'rgba(8, 8, 10, 0.7)';
            header.style.height = '80px';
        }
    });

    // Highlight menu links on scroll
    const observerOptions = {
        root: null,
        rootMargin: '-30% 0px -60% 0px', // Trigger when section occupies the middle center viewport
        threshold: 0
    };

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const activeId = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    // Add styling class matching active section
                    if (link.getAttribute('href') === `#${activeId}`) {
                        link.classList.add('active');
                        link.style.color = 'var(--text-color)';
                    } else {
                        link.style.color = 'var(--text-muted)';
                    }
                });
            }
        });
    }, observerOptions);

    sections.forEach(section => sectionObserver.observe(section));

    // Custom smooth scroll click overrides for custom animations
    const ctaTalk = document.getElementById('lets-talk-btn');
    if (ctaTalk) {
        ctaTalk.addEventListener('click', (e) => {
            e.preventDefault();
            const contactSection = document.getElementById('contact');
            if (contactSection) {
                contactSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }

    const scrollBtn = document.getElementById('scroll-btn');
    if (scrollBtn) {
        scrollBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const aboutSection = document.getElementById('about');
            if (aboutSection) {
                aboutSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }
}

/* ==========================================================================
   CONTACT FORM & SUCCESS MODAL
   ========================================================================== */
function initContactForm() {
    const form = document.getElementById('contact-form');
    const modal = document.getElementById('success-modal');
    const modalClose = document.getElementById('modal-close');
    const submitBtn = document.getElementById('submit-form-btn');

    if (!form || !modal || !modalClose || !submitBtn) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // 1. Visual feedback on submit button
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = 'TRANSMITTING...';
        submitBtn.disabled = true;
        submitBtn.style.opacity = '0.7';

        // 2. Actually send data to Formspree
        try {
            const response = await fetch(form.action, {
                method: 'POST',
                body: new FormData(form),
                headers: { 'Accept': 'application/json' }
            });

            if (response.ok) {
                // Success — show modal and reset form
                modal.classList.add('active');
                form.reset();
            } else {
                alert('Oops! Something went wrong. Please email directly at madhavpainuly4@gmail.com');
            }
        } catch (error) {
            alert('Network error. Please email directly at madhavpainuly4@gmail.com');
        }

        // 3. Restore submit button
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        submitBtn.style.opacity = '1';
    });

    // Close Modal event listeners
    modalClose.addEventListener('click', () => {
        modal.classList.remove('active');
    });

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('active');
        }
    });

    // Acknowledge closing via Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            modal.classList.remove('active');
        }
    });
}

/* ==========================================================================
   CUSTOM CYBERPUNK CURSOR
   ========================================================================== */
function initCustomCursor() {
    // Check if device supports hover (typically desktop) to avoid issues on mobile
    if (window.matchMedia('(hover: none)').matches) return;

    const dot = document.createElement('div');
    const ring = document.createElement('div');
    dot.className = 'custom-cursor-dot';
    ring.className = 'custom-cursor-ring';
    document.body.appendChild(dot);
    document.body.appendChild(ring);

    let mouseX = 0, mouseY = 0;
    let ringX = 0, ringY = 0;

    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        // Immediate position for center dot
        dot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
    });

    // Smooth delay interpolation for outer ring
    function updateRing() {
        ringX += (mouseX - ringX) * 0.15;
        ringY += (mouseY - ringY) * 0.15;
        ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0)`;
        requestAnimationFrame(updateRing);
    }
    updateRing();

    // Hover state selectors
    const hoverElements = 'a, button, input, textarea, .project-card, .skills-list li, #logo-link';
    document.addEventListener('mouseover', (e) => {
        if (e.target.closest(hoverElements)) {
            ring.classList.add('hover');
            dot.classList.add('hover');
        }
    });

    document.addEventListener('mouseout', (e) => {
        if (!e.target.closest(hoverElements)) {
            ring.classList.remove('hover');
            dot.classList.remove('hover');
        }
    });

    // Press states
    document.addEventListener('mousedown', () => {
        ring.classList.add('active');
        dot.classList.add('active');
    });

    document.addEventListener('mouseup', () => {
        ring.classList.remove('active');
        dot.classList.remove('active');
    });

    // Hide default cursor
    document.documentElement.classList.add('hide-default-cursor');
}

/* ==========================================================================
   SCROLL REVEAL (TIMELINE & SECTION REVEAL EFFECTS)
   ========================================================================== */
function initScrollReveal() {
    const revealElements = document.querySelectorAll('.project-card, .timeline-item, .skills-card, .about-column');
    
    const revealOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('reveal-active');
                observer.unobserve(entry.target); // Trigger only once
            }
        });
    }, revealOptions);

    revealElements.forEach(el => {
        el.classList.add('reveal-item'); // Add initial hidden state class
        revealObserver.observe(el);
    });
}

/* ==========================================================================
   GLITCH TEXT TEXT EFFECT (LOGO & HEADINGS)
   ========================================================================== */
function initGlitchEffect() {
    const glitchTarget = document.getElementById('logo-link');
    if (!glitchTarget) return;

    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ//';
    const originalText = glitchTarget.innerHTML; // Contains "M<span>/</span>P"

    glitchTarget.addEventListener('mouseover', () => {
        let iterations = 0;
        const interval = setInterval(() => {
            glitchTarget.innerHTML = originalText
                .split('')
                .map((char, index) => {
                    // Skip span tags to keep the styling intact
                    if (char === '<' || char === '>' || char === 's' || char === 'p' || char === 'a' || char === 'n' || char === '/' || char === 'm') {
                        return char;
                    }
                    if (index < iterations) {
                        return originalText[index];
                    }
                    return chars[Math.floor(Math.random() * chars.length)];
                })
                .join('');

            if (iterations >= originalText.length) {
                clearInterval(interval);
                glitchTarget.innerHTML = originalText; // Reset to original
            }

            iterations += 1/3;
        }, 30);
    });
}

/* ==========================================================================
   DYNAMIC SKILL TO PROJECT HIGHLIGHTING
   ========================================================================== */
function initSkillHighlighting() {
    const skills = document.querySelectorAll('[data-skill]');
    const projects = document.querySelectorAll('.project-card[data-skills]');

    if (!skills.length || !projects.length) return;

    skills.forEach(skillEl => {
        skillEl.addEventListener('mouseenter', () => {
            const skillName = skillEl.getAttribute('data-skill').toLowerCase();

            projects.forEach(projectEl => {
                const projectSkills = projectEl.getAttribute('data-skills').toLowerCase().split(',');
                
                if (projectSkills.includes(skillName)) {
                    projectEl.classList.add('highlight-glow');
                    projectEl.classList.remove('fade-out');
                } else {
                    projectEl.classList.add('fade-out');
                    projectEl.classList.remove('highlight-glow');
                }
            });
        });

        skillEl.addEventListener('mouseleave', () => {
            projects.forEach(projectEl => {
                projectEl.classList.remove('highlight-glow');
                projectEl.classList.remove('fade-out');
            });
        });
    });
}
