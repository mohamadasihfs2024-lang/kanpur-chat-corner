/* ============================================================
   KANPUR CHAAT CORNER — MAIN JAVASCRIPT
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

    /* ---- Loading Screen Particles ---- */
    const loaderParticles = document.getElementById('loaderParticles');
    if (loaderParticles) {
        for (let i = 0; i < 18; i++) {
            const p = document.createElement('div');
            p.className = 'loader-particle';
            const size = 6 + Math.random() * 14;
            p.style.cssText = `
                width: ${size}px;
                height: ${size}px;
                left: ${Math.random() * 100}%;
                top: ${30 + Math.random() * 60}%;
                animation-delay: ${Math.random() * 2.5}s;
                animation-duration: ${2.5 + Math.random() * 2}s;
            `;
            loaderParticles.appendChild(p);
        }
    }

    /* ---- Hide Loader After Animation ---- */
    const loader = document.getElementById('loader');
    const loaderBar = document.getElementById('loaderBar');
    setTimeout(() => {
        if (loader) loader.classList.add('loaded');
        document.body.style.overflow = '';
        initHeroAnimations();
    }, 3200);

    /* Prevent scroll during loading */
    document.body.style.overflow = 'hidden';

    /* ---- Hero Content Animation (GSAP) ---- */
    function initHeroAnimations() {
        if (typeof gsap === 'undefined') return;

        const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

        tl.to('.hero-badge', { opacity: 1, y: 0, duration: 0.8 }, 0.2)
          .to('.title-line', { opacity: 1, y: 0, duration: 0.9, stagger: 0.15 }, 0.4)
          .to('.hero-subtitle', { opacity: 1, y: 0, duration: 0.8 }, 0.9)
          .to('.hero-buttons', { opacity: 1, y: 0, duration: 0.8 }, 1.1)
          .to('.hero-scroll', { opacity: 1, duration: 0.8 }, 1.5);
    }

    /* ---- Mouse Follower ---- */
    const mouseFollower = document.getElementById('mouseFollower');
    let followerX = 0, followerY = 0;
    let currentX = 0, currentY = 0;

    if (mouseFollower && window.innerWidth > 768) {
        document.addEventListener('mousemove', (e) => {
            followerX = e.clientX;
            followerY = e.clientY;
        });

        function updateFollower() {
            currentX += (followerX - currentX) * 0.08;
            currentY += (followerY - currentY) * 0.08;
            mouseFollower.style.left = currentX + 'px';
            mouseFollower.style.top = currentY + 'px';
            requestAnimationFrame(updateFollower);
        }
        updateFollower();
    } else if (mouseFollower) {
        mouseFollower.style.display = 'none';
    }

    /* ---- Scroll Progress Bar ---- */
    const scrollProgress = document.getElementById('scrollProgress');
    window.addEventListener('scroll', () => {
        if (!scrollProgress) return;
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
        scrollProgress.style.width = progress + '%';
    }, { passive: true });

    /* ---- Navbar Scroll Behavior ---- */
    const navbar = document.getElementById('navbar');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id]');

    window.addEventListener('scroll', () => {
        if (!navbar) return;

        /* Add scrolled class */
        if (window.scrollY > 80) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        /* Active link based on scroll position */
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 150;
            if (window.scrollY >= sectionTop) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + current) {
                link.classList.add('active');
            }
        });
    }, { passive: true });

    /* ---- Mobile Menu ---- */
    const navToggle = document.getElementById('navToggle');
    const navLinksContainer = document.getElementById('navLinks');

    if (navToggle && navLinksContainer) {
        navToggle.addEventListener('click', () => {
            navToggle.classList.toggle('active');
            navLinksContainer.classList.toggle('mobile-open');
            document.body.style.overflow = navLinksContainer.classList.contains('mobile-open') ? 'hidden' : '';
        });

        /* Close mobile menu on link click */
        navLinksContainer.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                navToggle.classList.remove('active');
                navLinksContainer.classList.remove('mobile-open');
                document.body.style.overflow = '';
            });
        });
    }

    /* ---- AOS Init ---- */
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 700,
            easing: 'ease-out-cubic',
            once: true,
            offset: 80,
            disable: window.innerWidth < 768 ? 'phone' : false
        });
    }

    /* ---- Vanilla Tilt Init ---- */
    if (typeof VanillaTilt !== 'undefined') {
        document.querySelectorAll('[data-tilt]').forEach(el => {
            VanillaTilt.init(el, {
                max: 8,
                speed: 600,
                glare: true,
                'max-glare': 0.15,
                perspective: 1200,
                scale: 1.02
            });
        });
    }

    /* ---- Stats Counter ---- */
    const statNumbers = document.querySelectorAll('.stat-number');
    let statsCounted = false;

    function countUp(el) {
        const target = parseFloat(el.getAttribute('data-target'));
        const isDecimal = el.hasAttribute('data-decimal');
        const duration = 2000;
        const startTime = performance.now();

        function update(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            /* Ease out cubic */
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = eased * target;

            if (isDecimal) {
                el.textContent = current.toFixed(1);
            } else {
                el.textContent = Math.floor(current).toLocaleString('en-IN');
            }

            if (progress < 1) {
                requestAnimationFrame(update);
            } else {
                if (isDecimal) {
                    el.textContent = target.toFixed(1);
                } else {
                    el.textContent = target.toLocaleString('en-IN');
                }
            }
        }

        requestAnimationFrame(update);
    }

    if (statNumbers.length > 0) {
        const statsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !statsCounted) {
                    statsCounted = true;
                    statNumbers.forEach(el => countUp(el));
                }
            });
        }, { threshold: 0.3 });

        const statsSection = document.getElementById('stats');
        if (statsSection) statsObserver.observe(statsSection);
    }

    /* ---- Countdown Timer ---- */
    function initCountdown() {
        /* Set deadline 15 days from now at midnight */
        const now = new Date();
        const deadline = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 15, 23, 59, 59);

        function updateCountdown() {
            const now = new Date();
            let diff = deadline - now;

            if (diff <= 0) {
                /* Reset to another 15 days */
                deadline.setTime(deadline.getTime() + 15 * 24 * 60 * 60 * 1000);
                diff = deadline - now;
            }

            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const secs = Math.floor((diff % (1000 * 60)) / 1000);

            const dEl = document.getElementById('cdDays');
            const hEl = document.getElementById('cdHours');
            const mEl = document.getElementById('cdMins');
            const sEl = document.getElementById('cdSecs');

            if (dEl) dEl.textContent = String(days).padStart(2, '0');
            if (hEl) hEl.textContent = String(hours).padStart(2, '0');
            if (mEl) mEl.textContent = String(mins).padStart(2, '0');
            if (sEl) sEl.textContent = String(secs).padStart(2, '0');
        }

        updateCountdown();
        setInterval(updateCountdown, 1000);
    }

    initCountdown();

    /* ---- Gallery Lightbox ---- */
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightboxImg');
    const lightboxClose = document.querySelector('.lightbox-close');

    if (lightbox && lightboxImg) {
        document.querySelectorAll('.gallery-item').forEach(item => {
            item.addEventListener('click', () => {
                const img = item.querySelector('img');
                if (img) {
                    lightboxImg.src = img.src;
                    lightboxImg.alt = img.alt;
                    lightbox.classList.add('active');
                    document.body.style.overflow = 'hidden';
                }
            });
        });

        function closeLightbox() {
            lightbox.classList.remove('active');
            document.body.style.overflow = '';
            setTimeout(() => { lightboxImg.src = ''; }, 400);
        }

        if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);

        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) closeLightbox();
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && lightbox.classList.contains('active')) {
                closeLightbox();
            }
        });
    }

    /* ---- Swiper Testimonials ---- */
    if (typeof Swiper !== 'undefined') {
        new Swiper('.testimonial-swiper', {
            slidesPerView: 1,
            spaceBetween: 24,
            loop: true,
            autoplay: {
                delay: 4000,
                disableOnInteraction: false,
                pauseOnMouseEnter: true
            },
            pagination: {
                el: '.swiper-pagination',
                clickable: true
            },
            breakpoints: {
                640: { slidesPerView: 2 },
                1024: { slidesPerView: 3 }
            },
            grabCursor: true
        });
    }

    /* ---- GSAP ScrollTrigger Effects ---- */
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);

        /* Parallax effect on section backgrounds */
        gsap.utils.toArray('.section-dark').forEach(section => {
            gsap.fromTo(section, {
                backgroundPositionY: '0%'
            }, {
                backgroundPositionY: '30%',
                ease: 'none',
                scrollTrigger: {
                    trigger: section,
                    start: 'top bottom',
                    end: 'bottom top',
                    scrub: 1
                }
            });
        });

        /* Feature cards stagger reveal */
        gsap.fromTo('.feature-card', {
            y: 40,
            opacity: 0
        }, {
            y: 0,
            opacity: 1,
            duration: 0.7,
            stagger: 0.12,
            ease: 'power2.out',
            scrollTrigger: {
                trigger: '.features-grid',
                start: 'top 80%'
            }
        });

        /* Stat items scale in */
        gsap.fromTo('.stat-item', {
            scale: 0.8,
            opacity: 0
        }, {
            scale: 1,
            opacity: 1,
            duration: 0.6,
            stagger: 0.15,
            ease: 'back.out(1.5)',
            scrollTrigger: {
                trigger: '.stats-grid',
                start: 'top 80%'
            }
        });
    }

    /* ---- Hero Floating Ingredients (CSS) ---- */
    const heroFloats = document.getElementById('heroFloats');
    if (heroFloats) {
        const floatColors = [
            'radial-gradient(circle, rgba(255,140,0,0.6), transparent 70%)',
            'radial-gradient(circle, rgba(212,160,23,0.5), transparent 70%)',
            'radial-gradient(circle, rgba(185,28,28,0.4), transparent 70%)',
            'radial-gradient(circle, rgba(240,208,96,0.5), transparent 70%)'
        ];

        for (let i = 0; i < 15; i++) {
            const item = document.createElement('div');
            item.className = 'float-item';
            const size = 8 + Math.random() * 20;
            item.style.cssText = `
                width: ${size}px;
                height: ${size}px;
                left: ${Math.random() * 100}%;
                background: ${floatColors[Math.floor(Math.random() * floatColors.length)]};
                animation-duration: ${8 + Math.random() * 12}s;
                animation-delay: ${Math.random() * 10}s;
            `;
            heroFloats.appendChild(item);
        }
    }

    /* ---- Back To Top Button ---- */
    const fabTop = document.getElementById('fabTop');
    if (fabTop) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 600) {
                fabTop.classList.add('visible');
            } else {
                fabTop.classList.remove('visible');
            }
        }, { passive: true });

        fabTop.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    /* ---- Smooth Scroll for Anchor Links ---- */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                const offset = 80;
                const targetPos = target.getBoundingClientRect().top + window.scrollY - offset;
                window.scrollTo({ top: targetPos, behavior: 'smooth' });
            }
        });
    });

});
