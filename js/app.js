// ===== React-like State Management =====
class Component {
    constructor() {
        this.state = {};
        this.init();
    }

    setState(newState) {
        this.state = { ...this.state, ...newState };
        this.render();
    }

    init() {}
    render() {}
}

// ===== Main App =====
class App {
    constructor() {
        this.state = {
            isLoading: true,
            activeSection: 'home',
            activeSkillTab: 'web',
            activeFilter: 'all',
            scrollY: 0,
            mouseX: 0,
            mouseY: 0
        };

        this.init();
    }

    init() {
        this.cacheDOM();
        this.bindEvents();
        this.initLoader();
        this.initTypewriter();
        this.initCursor();
        this.initScrollAnimations();
        this.initNavigation();
        this.initSkillTabs();
        this.initProjectFilters();
        this.initContactForm();
        this.initCounters();
    }

    cacheDOM() {
        this.loader = document.getElementById('loader');
        this.navbar = document.getElementById('navbar');
        this.navToggle = document.getElementById('navToggle');
        this.navMenu = document.getElementById('navMenu');
        this.navLinks = document.querySelectorAll('.nav-link');
        this.sections = document.querySelectorAll('section');
        this.skillTabs = document.querySelectorAll('.tab-btn');
        this.skillPanels = document.querySelectorAll('.skills-panel');
        this.filterBtns = document.querySelectorAll('.filter-btn');
        this.projectCards = document.querySelectorAll('.project-card');
        this.contactForm = document.getElementById('contactForm');
        this.cursorFollower = document.querySelector('.cursor-follower');
        this.cursorDot = document.querySelector('.cursor-dot');
        this.typewriter = document.getElementById('typewriter');
        this.statNumbers = document.querySelectorAll('.stat-number');
        this.skillCards = document.querySelectorAll('.skill-card');
    }

    bindEvents() {
        // Window events
        window.addEventListener('scroll', this.throttle(this.handleScroll.bind(this), 16));
        window.addEventListener('resize', this.debounce(this.handleResize.bind(this), 250));
        window.addEventListener('mousemove', this.handleMouseMove.bind(this));

        // Navigation
        this.navToggle.addEventListener('click', this.toggleMobileNav.bind(this));
        this.navLinks.forEach(link => {
            link.addEventListener('click', this.handleNavClick.bind(this));
        });

        // Skill tabs
        this.skillTabs.forEach(tab => {
            tab.addEventListener('click', this.handleSkillTabClick.bind(this));
        });

        // Project filters
        this.filterBtns.forEach(btn => {
            btn.addEventListener('click', this.handleFilterClick.bind(this));
        });

        // Interactive elements cursor effect
        document.querySelectorAll('a, button, .project-card, .skill-card').forEach(el => {
            el.addEventListener('mouseenter', () => this.cursorFollower?.classList.add('hover'));
            el.addEventListener('mouseleave', () => this.cursorFollower?.classList.remove('hover'));
        });
    }

    // ===== Loader =====
    initLoader() {
        document.body.classList.add('loading');
        
        window.addEventListener('load', () => {
            setTimeout(() => {
                this.loader.classList.add('hidden');
                document.body.classList.remove('loading');
                this.state.isLoading = false;
                this.animateHeroElements();
            }, 2000);
        });
    }

    animateHeroElements() {
        const elements = document.querySelectorAll('.animate-fade-in, .animate-fade-in-up, .animate-fade-in-left');
        elements.forEach((el, index) => {
            setTimeout(() => {
                el.style.animationPlayState = 'running';
            }, index * 100);
        });
    }

    // ===== Typewriter Effect =====
    initTypewriter() {
        const roles = [
            'Full Stack Developer',
            'Embedded Systems Engineer',
            'IT Systems Specialist',
            'Automation Expert',
            'Problem Solver'
        ];

        let roleIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        let typingSpeed = 100;

        const type = () => {
            const currentRole = roles[roleIndex];

            if (isDeleting) {
                this.typewriter.textContent = currentRole.substring(0, charIndex - 1);
                charIndex--;
                typingSpeed = 50;
            } else {
                this.typewriter.textContent = currentRole.substring(0, charIndex + 1);
                charIndex++;
                typingSpeed = 100;
            }

            if (!isDeleting && charIndex === currentRole.length) {
                typingSpeed = 2000;
                isDeleting = true;
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                roleIndex = (roleIndex + 1) % roles.length;
                typingSpeed = 500;
            }

            setTimeout(type, typingSpeed);
        };

        setTimeout(type, 1000);
    }

    // ===== Custom Cursor =====
    initCursor() {
        if (!this.cursorFollower || !this.cursorDot) return;

        let mouseX = 0, mouseY = 0;
        let followerX = 0, followerY = 0;
        let dotX = 0, dotY = 0;

        const animate = () => {
            // Smooth follow for outer circle
            followerX += (mouseX - followerX) * 0.15;
            followerY += (mouseY - followerY) * 0.15;
            this.cursorFollower.style.left = followerX + 'px';
            this.cursorFollower.style.top = followerY + 'px';

            // Faster follow for dot
            dotX += (mouseX - dotX) * 0.3;
            dotY += (mouseY - dotY) * 0.3;
            this.cursorDot.style.left = dotX + 'px';
            this.cursorDot.style.top = dotY + 'px';

            requestAnimationFrame(animate);
        };

        animate();

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });
    }

    handleMouseMove(e) {
        this.state.mouseX = e.clientX;
        this.state.mouseY = e.clientY;
    }

    // ===== Scroll Handling =====
    handleScroll() {
        this.state.scrollY = window.scrollY;
        this.updateNavbar();
        this.updateActiveSection();
        this.revealElements();
        this.animateSkillBars();
    }

    updateNavbar() {
        if (this.state.scrollY > 50) {
            this.navbar.classList.add('scrolled');
        } else {
            this.navbar.classList.remove('scrolled');
        }
    }

    updateActiveSection() {
        let current = '';

        this.sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.offsetHeight;

            if (this.state.scrollY >= sectionTop && this.state.scrollY < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });

        this.navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('data-section') === current) {
                link.classList.add('active');
            }
        });

        this.state.activeSection = current;
    }

    // ===== Scroll Reveal =====
    initScrollAnimations() {
        // Add reveal class to elements
        const revealElements = document.querySelectorAll(
            '.about-card, .skill-card, .project-card, .timeline-item, .cert-card, .contact-item'
        );
        
        revealElements.forEach(el => {
            el.classList.add('reveal');
        });
    }

    revealElements() {
        const reveals = document.querySelectorAll('.reveal');
        const windowHeight = window.innerHeight;

        reveals.forEach(el => {
            const elementTop = el.getBoundingClientRect().top;
            const revealPoint = 150;

            if (elementTop < windowHeight - revealPoint) {
                el.classList.add('active');
            }
        });
    }

    animateSkillBars() {
        this.skillCards.forEach(card => {
            const cardTop = card.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;

            if (cardTop < windowHeight - 100) {
                card.classList.add('visible');
            }
        });
    }

    // ===== Navigation =====
    initNavigation() {
        // Smooth scroll for anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = anchor.getAttribute('href');
                const targetElement = document.querySelector(targetId);

                if (targetElement) {
                    targetElement.scrollIntoView({
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    handleNavClick(e) {
        this.navLinks.forEach(link => link.classList.remove('active'));
        e.target.classList.add('active');
        this.closeMobileNav();
    }

    toggleMobileNav() {
        this.navToggle.classList.toggle('active');
        this.navMenu.classList.toggle('active');
    }

    closeMobileNav() {
        this.navToggle.classList.remove('active');
        this.navMenu.classList.remove('active');
    }

    handleResize() {
        if (window.innerWidth > 768) {
            this.closeMobileNav();
        }
    }

    // ===== Skill Tabs =====
    initSkillTabs() {
        // Set initial state
        this.showSkillPanel('web');
    }

    handleSkillTabClick(e) {
        const tab = e.currentTarget;
        const tabId = tab.getAttribute('data-tab');

        this.skillTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');

        this.showSkillPanel(tabId);
        this.state.activeSkillTab = tabId;
    }

    showSkillPanel(tabId) {
        this.skillPanels.forEach(panel => {
            panel.classList.remove('active');
            if (panel.id === `panel-${tabId}`) {
                panel.classList.add('active');
                // Trigger skill bar animations
                setTimeout(() => {
                    panel.querySelectorAll('.skill-card').forEach(card => {
                        card.classList.add('visible');
                    });
                }, 100);
            }
        });
    }

    // ===== Project Filters =====
    initProjectFilters() {
        this.filterProjects('all');
    }

    handleFilterClick(e) {
        const btn = e.currentTarget;
        const filter = btn.getAttribute('data-filter');

        this.filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        this.filterProjects(filter);
        this.state.activeFilter = filter;
    }

    filterProjects(filter) {
        this.projectCards.forEach((card, index) => {
            const categories = card.getAttribute('data-category') || '';
            
            // Reset animation
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';

            setTimeout(() => {
                if (filter === 'all' || categories.includes(filter)) {
                    card.classList.remove('hidden');
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                } else {
                    card.classList.add('hidden');
                }
            }, index * 50);
        });
    }

    // ===== Contact Form =====
    initContactForm() {
        if (!this.contactForm) return;

        this.contactForm.addEventListener('submit', this.handleFormSubmit.bind(this));

        // Input animations
        const inputs = this.contactForm.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.addEventListener('focus', () => {
                input.parentElement.classList.add('focused');
            });
            input.addEventListener('blur', () => {
                if (!input.value) {
                    input.parentElement.classList.remove('focused');
                }
            });
        });
    }

    handleFormSubmit(e) {
        e.preventDefault();

        const formData = new FormData(this.contactForm);
        const data = Object.fromEntries(formData.entries());

        // Simulate form submission
        const submitBtn = this.contactForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        submitBtn.disabled = true;

        setTimeout(() => {
            this.showToast('Message sent successfully!', 'success');
            this.contactForm.reset();
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }, 2000);
    }

    // ===== Counter Animation =====
    initCounters() {
        const observerOptions = {
            threshold: 0.5
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateCounter(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        this.statNumbers.forEach(stat => observer.observe(stat));
    }

    animateCounter(element) {
        const target = parseInt(element.getAttribute('data-count'));
        const duration = 2000;
        const step = target / (duration / 16);
        let current = 0;

        const update = () => {
            current += step;
            if (current < target) {
                element.textContent = Math.floor(current);
                requestAnimationFrame(update);
            } else {
                element.textContent = target + '+';
            }
        };

        update();
    }

    // ===== Toast Notification =====
    showToast(message, type = 'success') {
        const existingToast = document.querySelector('.toast');
        if (existingToast) {
            existingToast.remove();
        }

        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.innerHTML = `
            <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
            <span>${message}</span>
        `;

        document.body.appendChild(toast);

        setTimeout(() => toast.classList.add('show'), 100);
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, 4000);
    }

    // ===== Utility Functions =====
    throttle(func, limit) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    debounce(func, wait) {
        let timeout;
        return function(...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), wait);
        };
    }
}

// ===== Initialize App =====
document.addEventListener('DOMContentLoaded', () => {
    const app = new App();

    // Parallax effect for hero shapes
    window.addEventListener('mousemove', (e) => {
        const shapes = document.querySelectorAll('.shape');
        const x = e.clientX / window.innerWidth;
        const y = e.clientY / window.innerHeight;

        shapes.forEach((shape, index) => {
            const speed = (index + 1) * 20;
            const xOffset = (x - 0.5) * speed;
            const yOffset = (y - 0.5) * speed;
            shape.style.transform = `translate(${xOffset}px, ${yOffset}px)`;
        });
    });

    // Magnetic button effect
    document.querySelectorAll('.btn-primary').forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            btn.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
        });

        btn.addEventListener('mouseleave', () => {
            btn.style.transform = 'translate(0, 0)';
        });
    });

    // Image lazy loading
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                observer.unobserve(img);
            }
        });
    });

    images.forEach(img => imageObserver.observe(img));

    // Console Easter egg
    console.log(`
    %c👋 Hello there, fellow developer!
    
    %cI see you're curious about the code.
    Feel free to reach out if you'd like to collaborate!
    
    📧 mthethwaprince10@gmail.com
    🔗 linkedin.com/in/prince-mthethwa-454b95316/
    `,
    'font-size: 20px; font-weight: bold;',
    'font-size: 14px; color: #6366f1;'
    );
});

// ===== Service Worker Registration (for PWA) =====
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        // Service worker can be added here for PWA functionality
        // navigator.serviceWorker.register('/sw.js');
    });
}