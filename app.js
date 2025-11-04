/**
 * InnerChess Landing Page SPA Router
 * Handles client-side navigation without page reloads
 */

// Router functionality
class Router {
    constructor() {
        this.routes = {};
        this.currentPage = null;
        this.init();
    }

    init() {
        // Set up route listeners
        this.setupRoutes();
        
        // Handle browser back/forward buttons
        window.addEventListener('popstate', (e) => {
            const page = e.state?.page || 'home';
            this.navigateTo(page, false);
        });

        // Handle initial page load
        const initialPage = this.getPageFromHash() || 'home';
        this.navigateTo(initialPage, true);
    }

    setupRoutes() {
        // Get all navigation links
        const navLinks = document.querySelectorAll('[data-page]');
        
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const page = link.dataset.page;
                this.navigateTo(page, true);
            });
        });
    }

    getPageFromHash() {
        const hash = window.location.hash.substring(1);
        return hash || null;
    }

    navigateTo(pageId, addToHistory = true) {
        // Don't navigate if already on this page
        if (this.currentPage === pageId) return;

        // Hide all pages
        const pages = document.querySelectorAll('.page');
        pages.forEach(page => page.classList.remove('active'));

        // Show target page
        const targetPage = document.getElementById(pageId);
        if (targetPage) {
            targetPage.classList.add('active');
            this.currentPage = pageId;
        }

        // Update active nav link
        this.updateActiveNavLink(pageId);

        // Update URL and browser history
        if (addToHistory) {
            const url = pageId === 'home' ? '#' : `#${pageId}`;
            window.history.pushState({ page: pageId }, '', url);
        }

        // Scroll to top smoothly
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    updateActiveNavLink(pageId) {
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            if (link.dataset.page === pageId) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }
}

// Initialize router when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    const router = new Router();
    
    // Add smooth scroll behavior to all anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        if (!anchor.dataset.page) {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth' });
                }
            });
        }
    });

    // Add intersection observer for fade-in animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe feature cards for animation
    document.querySelectorAll('.feature-card, .feature-detail').forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        observer.observe(card);
    });

    // Easter egg: Konami code for fun animation
    let konamiCode = [];
    const konamiPattern = [
        'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
        'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
        'b', 'a'
    ];

    document.addEventListener('keydown', (e) => {
        konamiCode.push(e.key);
        konamiCode = konamiCode.slice(-10);

        if (JSON.stringify(konamiCode) === JSON.stringify(konamiPattern)) {
            triggerEasterEgg();
        }
    });

    function triggerEasterEgg() {
        const pieces = document.querySelectorAll('.piece');
        pieces.forEach((piece, index) => {
            setTimeout(() => {
                piece.style.transform = `rotate(720deg) scale(1.5)`;
                piece.style.transition = 'transform 1s ease';
                setTimeout(() => {
                    piece.style.transform = '';
                }, 1000);
            }, index * 200);
        });
    }

    console.log('%c♔ InnerChess ♛', 'font-size: 24px; color: #FF1493; font-weight: bold;');
    console.log('%cMaster chess through inner focus', 'font-size: 14px; color: #9C27B0;');
});
