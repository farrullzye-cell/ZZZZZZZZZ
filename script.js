/* ============================================
   RULLZYE STORE - Main JavaScript
   Includes: GSAP Animations, Typing Effect,
   Counter Animation, Portfolio Filter,
   Testimonial Slider, FAQ Toggle, etc.
============================================ */

// ===== LOADING SCREEN =====
document.body.style.overflow = 'hidden';
function hideLoading() {
    const ls = document.getElementById('loadingScreen');
    if (ls) {
        ls.classList.add('hidden');
        document.body.style.overflow = '';
    }
}
window.addEventListener('load', () => setTimeout(hideLoading, 1500));
setTimeout(hideLoading, 3000);

// ===== NAVBAR =====
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');
const navOverlay = document.getElementById('navOverlay');

function toggleNav(open) {
    navToggle.classList.toggle('active', open);
    navLinks.classList.toggle('open', open);
    if (navOverlay) navOverlay.classList.toggle('open', open);
    document.body.classList.toggle('nav-open', open);
}

function closeNav() {
    navToggle.classList.remove('active');
    navLinks.classList.remove('open');
    if (navOverlay) navOverlay.classList.remove('open');
    document.body.classList.remove('nav-open');
}

if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
        const isOpen = navLinks.classList.contains('open');
        toggleNav(!isOpen);
    });
    if (navOverlay) {
        navOverlay.addEventListener('click', closeNav);
    }
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', closeNav);
    });
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768) closeNav();
    });
}

// ===== BACK TO TOP =====
const backToTop = document.getElementById('backToTop');
window.addEventListener('scroll', () => {
    backToTop.classList.toggle('visible', window.scrollY > 400);
}, { passive: true });

backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ===== HERO PARTICLES =====
const particlesContainer = document.getElementById('heroParticles');
if (particlesContainer) {
    for (let i = 0; i < 20; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 20 + 's';
        particle.style.animationDuration = (15 + Math.random() * 15) + 's';
        particle.style.width = (2 + Math.random() * 3) + 'px';
        particle.style.height = particle.style.width;
        particlesContainer.appendChild(particle);
    }
}

// ===== GSAP ANIMATIONS =====
document.addEventListener('DOMContentLoaded', () => {
    if (typeof gsap === 'undefined') return;

    // Register ScrollTrigger
    gsap.registerPlugin(ScrollTrigger, TextPlugin);

    // Hero animation
    const heroTl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    heroTl
        .from('.hero-badge', { opacity: 0, y: 20, duration: 0.6 })
        .from('.hero h1', { opacity: 0, y: 30, duration: 0.8 }, '-=0.3')
        .from('.hero-desc', { opacity: 0, y: 20, duration: 0.6 }, '-=0.5')
        .from('.hero-cta', { opacity: 0, y: 20, duration: 0.6 }, '-=0.3')
        .from('.hero-stat', { opacity: 0, y: 20, duration: 0.5, stagger: 0.1 }, '-=0.3')
        .from('.hero-glass-card', { opacity: 0, x: 40, duration: 0.8, ease: 'power2.out' }, '-=0.8');

    // Animate stat numbers
    document.querySelectorAll('.hero-stat-value[data-target]').forEach(el => {
        const target = parseFloat(el.dataset.target);
        const suffix = el.dataset.suffix || '';
        const duration = 2;
        const obj = { val: 0 };
        gsap.to(obj, {
            val: target,
            duration: duration,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: el,
                start: 'top 85%',
            },
            onUpdate: () => {
                el.textContent = Math.round(obj.val) + suffix;
            }
        });
    });

    // Layanan cards stagger
    gsap.utils.toArray('.layanan-card').forEach((card, i) => {
        gsap.from(card, {
            opacity: 0,
            y: 30,
            duration: 0.5,
            delay: i * 0.08,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: card,
                start: 'top 88%',
            }
        });
    });

    // Portfolio cards stagger
    gsap.utils.toArray('.portfolio-card').forEach((card, i) => {
        gsap.from(card, {
            opacity: 0,
            y: 30,
            duration: 0.5,
            delay: i * 0.1,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: card,
                start: 'top 88%',
            }
        });
    });

    // Pricing cards stagger
    gsap.utils.toArray('.pricing-card').forEach((card, i) => {
        gsap.from(card, {
            opacity: 0,
            y: 30,
            duration: 0.5,
            delay: i * 0.1,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: card,
                start: 'top 88%',
            }
        });
    });

    // Timeline items stagger
    const isMobile = window.innerWidth < 768;
    gsap.utils.toArray('.timeline-item').forEach((item, i) => {
        gsap.from(item, {
            opacity: 0,
            x: isMobile ? 0 : (i % 2 === 0 ? -30 : 30),
            duration: 0.5,
            delay: i * 0.15,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: item,
                start: 'top 85%',
            }
        });
    });

    // Keunggulan cards stagger
    gsap.utils.toArray('.keunggulan-card').forEach((card, i) => {
        gsap.from(card, {
            opacity: 0,
            y: 20,
            duration: 0.4,
            delay: i * 0.05,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: card,
                start: 'top 88%',
            }
        });
    });

    // Testimoni card
    gsap.from('.testimoni-card', {
        opacity: 0,
        y: 30,
        duration: 0.6,
        ease: 'power3.out',
        scrollTrigger: {
            trigger: '.testimoni-slider',
            start: 'top 85%',
        }
    });

    // FAQ items stagger
    gsap.utils.toArray('.faq-item').forEach((item, i) => {
        gsap.from(item, {
            opacity: 0,
            y: 20,
            duration: 0.4,
            delay: i * 0.08,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: item,
                start: 'top 88%',
            }
        });
    });

    // CTA section
    gsap.from('.cta-inner', {
        opacity: 0,
        y: 30,
        duration: 0.7,
        ease: 'power3.out',
        scrollTrigger: {
            trigger: '.cta-section',
            start: 'top 85%',
        }
    });

    // Blog cards stagger
    gsap.utils.toArray('.blog-card').forEach((card, i) => {
        gsap.from(card, {
            opacity: 0,
            y: 30,
            duration: 0.5,
            delay: i * 0.1,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: card,
                start: 'top 88%',
            }
        });
    });

    // Glass card chart animation
    const chartPath = document.querySelector('.hgc-svg path:last-child');
    if (chartPath) {
        const pathLength = chartPath.getTotalLength();
        chartPath.style.strokeDasharray = pathLength;
        chartPath.style.strokeDashoffset = pathLength;
        gsap.to(chartPath, {
            strokeDashoffset: 0,
            duration: 1.5,
            ease: 'power2.inOut',
            delay: 1.2,
        });
    }

    // Section headers
    gsap.utils.toArray('.section-header').forEach(header => {
        gsap.from(header, {
            opacity: 0,
            y: 30,
            duration: 0.6,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: header,
                start: 'top 85%',
            }
        });
    });

    // Typing effect (hero)
    const typingEl = document.getElementById('typingText');
    if (typingEl && typeof TextPlugin !== 'undefined') {
        const words = ['Bisnis Anda', 'Startup', 'Toko Online', 'Perusahaan', 'Organisasi'];
        let wordIndex = 0;

        function typeWord() {
            const word = words[wordIndex % words.length];
            gsap.to(typingEl, {
                duration: 1.5,
                text: word,
                ease: 'none',
                onComplete: () => {
                    gsap.delayedCall(2, () => {
                        wordIndex++;
                        typeWord();
                    });
                }
            });
        }
        setTimeout(typeWord, 2000);
    }
});

// ===== SCROLL REVEAL (non-GSAP fallback) =====
let revealObserver = null;

function initRevealObserver() {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
        document.querySelectorAll('.fade-up').forEach(el => el.classList.add('visible'));
        document.querySelectorAll('.stat-number[data-target]').forEach(el => {
            const t = parseFloat(el.dataset.target);
            const s = el.dataset.suffix || '';
            const p = el.dataset.prefix || '';
            const d = parseInt(el.dataset.decimal) || 0;
            let v = d > 0 ? t.toFixed(d) : t;
            if (el.dataset.comma === 'true') v = Number(v).toLocaleString();
            el.textContent = p + v + s;
        });
        return;
    }
    if (revealObserver) revealObserver.disconnect();
    revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const siblings = entry.target.parentElement.querySelectorAll('.fade-up:not(.visible)');
                const idx = Array.from(siblings).indexOf(entry.target);
                setTimeout(() => entry.target.classList.add('visible'), Math.max(0, idx) * 100);
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15, rootMargin: '0px 0px -30px 0px' });
    document.querySelectorAll('.fade-up').forEach(el => revealObserver.observe(el));
}

window.refreshReveal = initRevealObserver;
initRevealObserver();

// Counter observer (for stats that GSAP doesn't cover)
const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateCounter(entry.target);
            counterObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

document.querySelectorAll('.stat-number[data-target]').forEach(el => counterObserver.observe(el));

// ===== COUNTER ANIMATION =====
function animateCounter(el) {
    const target = parseFloat(el.dataset.target);
    const suffix = el.dataset.suffix || '';
    const prefix = el.dataset.prefix || '';
    const decimals = parseInt(el.dataset.decimal) || 0;
    const useComma = el.dataset.comma === 'true';
    const duration = 1800;
    const start = performance.now();

    function tick(now) {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        let val = eased * target;
        val = decimals > 0 ? val.toFixed(decimals) : Math.round(val);
        if (useComma) val = Number(val).toLocaleString();
        el.textContent = prefix + val + suffix;
        if (progress < 1) requestAnimationFrame(tick);
    }

    requestAnimationFrame(tick);
}

// ===== PORTFOLIO FILTER =====
const filterBtns = document.querySelectorAll('.filter-btn');
const portfolioGrid = document.getElementById('portfolioGrid');

if (filterBtns.length && portfolioGrid) {
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.dataset.filter;
            const cards = portfolioGrid.querySelectorAll('.portfolio-card');

            cards.forEach(card => {
                if (filter === 'all' || card.dataset.category === filter) {
                    card.style.display = '';
                    card.style.opacity = '0';
                    setTimeout(() => { card.style.opacity = '1'; }, 50);
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
}

// ===== TESTIMONIAL SLIDER =====
let currentSlide = 0;
let autoSlideTimer = null;
let prevBtn, nextBtn, dotsContainer, track;

function initSlider() {
    track = document.getElementById('testimoniTrack');
    prevBtn = document.getElementById('prevTestimoni');
    nextBtn = document.getElementById('nextTestimoni');
    dotsContainer = document.getElementById('testimoniDots');
    if (!track || !dotsContainer) return;
    if (autoSlideTimer) clearInterval(autoSlideTimer);

    const slides = track.querySelectorAll('.testimoni-card');
    const totalSlides = slides.length;
    if (totalSlides === 0) return;

    currentSlide = 0;
    const existingDots = dotsContainer.querySelectorAll('.testimoni-dot');
    if (existingDots.length !== totalSlides) {
        dotsContainer.innerHTML = '';
        slides.forEach((_, i) => {
            const dot = document.createElement('button');
            dot.className = 'testimoni-dot' + (i === 0 ? ' active' : '');
            dot.addEventListener('click', () => goToSlide(i));
            dotsContainer.appendChild(dot);
        });
    }

    function goToSlide(index) {
        currentSlide = index;
        track.style.transform = `translateX(-${currentSlide * 100}%)`;
        dotsContainer.querySelectorAll('.testimoni-dot').forEach((d, i) => {
            d.classList.toggle('active', i === currentSlide);
        });
    }

    if (prevBtn) prevBtn.replaceWith?.(prevBtn.cloneNode(true));
    if (nextBtn) nextBtn.replaceWith?.(nextBtn.cloneNode(true));
    prevBtn = document.getElementById('prevTestimoni');
    nextBtn = document.getElementById('nextTestimoni');

    if (prevBtn) prevBtn.addEventListener('click', () => {
        currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
        track.style.transform = `translateX(-${currentSlide * 100}%)`;
        dotsContainer.querySelectorAll('.testimoni-dot').forEach((d, i) => {
            d.classList.toggle('active', i === currentSlide);
        });
    });

    if (nextBtn) nextBtn.addEventListener('click', () => {
        currentSlide = (currentSlide + 1) % totalSlides;
        track.style.transform = `translateX(-${currentSlide * 100}%)`;
        dotsContainer.querySelectorAll('.testimoni-dot').forEach((d, i) => {
            d.classList.toggle('active', i === currentSlide);
        });
    });

    autoSlideTimer = setInterval(() => {
        currentSlide = (currentSlide + 1) % totalSlides;
        track.style.transform = `translateX(-${currentSlide * 100}%)`;
        dotsContainer.querySelectorAll('.testimoni-dot').forEach((d, i) => {
            d.classList.toggle('active', i === currentSlide);
        });
    }, 5000);

    track.addEventListener('mouseenter', () => { if (autoSlideTimer) clearInterval(autoSlideTimer); });
    track.addEventListener('mouseleave', () => {
        if (autoSlideTimer) clearInterval(autoSlideTimer);
        autoSlideTimer = setInterval(() => {
            currentSlide = (currentSlide + 1) % totalSlides;
            track.style.transform = `translateX(-${currentSlide * 100}%)`;
            dotsContainer.querySelectorAll('.testimoni-dot').forEach((d, i) => {
                d.classList.toggle('active', i === currentSlide);
            });
        }, 5000);
    });
}

window.reinitSlider = initSlider;
initSlider();

// ===== FAQ TOGGLE =====
function toggleFaq(element) {
    const item = element.parentElement;
    const isActive = item.classList.contains('active');

    document.querySelectorAll('.faq-item.active').forEach(el => {
        el.classList.remove('active');
    });

    if (!isActive) {
        item.classList.add('active');
    }
}

// ===== PRICING TOGGLE =====
const pricingToggle = document.getElementById('pricingToggle');
const monthlyLabel = document.getElementById('monthlyLabel');
const annualLabel = document.getElementById('annualLabel');
let isAnnual = false;

if (pricingToggle) {
    pricingToggle.addEventListener('click', () => {
        isAnnual = !isAnnual;
        pricingToggle.classList.toggle('annual', isAnnual);
        monthlyLabel.classList.toggle('active', !isAnnual);
        annualLabel.classList.toggle('active', isAnnual);

        document.querySelectorAll('.pricing-value').forEach(el => {
            const newVal = el.dataset[isAnnual ? 'annual' : 'monthly'];
            if (newVal === 'FREE' || newVal === 'Custom') return;
            el.classList.add('changing');
            setTimeout(() => {
                el.textContent = newVal;
                el.classList.remove('changing');
            }, 180);
        });

        document.querySelectorAll('.pricing-period[data-annual-total]').forEach(el => {
            if (isAnnual) {
                const total = el.dataset.annualTotal;
                el.innerHTML = 'ribu / bulan <span class="period-yearly">(Rp' + total + ' / tahun)</span>';
            } else {
                el.innerHTML = el.dataset.monthly;
            }
        });
    });
}

// ===== SUBSCRIBE FORM =====
const subscribeForm = document.getElementById('subscribeForm');
if (subscribeForm) {
    subscribeForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const input = subscribeForm.querySelector('input');
        if (input.value) {
            alert('Terima kasih! Anda telah berlangganan newsletter kami.');
            input.value = '';
        }
    });
}

// ===== SMOOTH SCROLL for anchor links =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href && href.length > 1) {
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth' });
            }
        }
    });
});
