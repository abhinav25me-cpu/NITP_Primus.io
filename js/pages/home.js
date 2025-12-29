// ===== MAIN INITIALIZATION =====
/* ============================================================
   - Initializes components only if their sections exist
============================================================ */

(function () {
    'use strict';

    /**
     * Utility: Run callback only if selector exists
     */
    function ifExists(selector, callback) {
        const el = document.querySelector(selector);
        if (el && typeof callback === 'function') {
            callback(el);
        }
    }

    /**
     * Utility: Run callback only if elements exist
     */
    function ifExistsAll(selector, callback) {
        const els = document.querySelectorAll(selector);
        if (els.length && typeof callback === 'function') {
            callback(els);
        }
    }

    /**
     * Global App Init
     */
    function initApp() {

        /* ===============================
           HIGHLIGHTS SECTION
        =============================== */
        ifExists('#highlights', () => {
            window.highlightsSection = new HighlightsSection();
        });

        /* ===============================
           IMAGE SLIDER
        =============================== */
        ifExists('#image-slider', () => {
            window.simpleSlider = new SimpleImageSlider();
        });

        /* ===============================
           EVENTS TEASER (Homepage only)
        =============================== */
        const isHome =
            document.body.classList.contains('homepage') ||
            location.pathname.endsWith('/') ||
            location.pathname.includes('index.html');

        if (isHome) {
            window.eventsTeaser = new EventsTeaser();
        }

        /* ===============================
           RECENT ACHIEVEMENTS
        =============================== */
        ifExists('#recent-achievements', () => {
            setTimeout(() => {
                initRecentAchievements();
            }, 300);
        });

        /* ===============================
           HERO / VISUAL EFFECTS
        =============================== */
        initHeroEffects();
        initStatsCounters();

        /* ===============================
           GLOBAL UX ENHANCEMENTS
        =============================== */
        initSmoothScroll();
        applyReducedMotion();
    }

    /* ============================================================
       GLOBAL HELPERS (Used by multiple sections)
    ============================================================ */

    /**
     * Smooth scroll for internal anchor links
     */
    function initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                const targetId = this.getAttribute('href');
                if (!targetId || targetId === '#') return;

                const target = document.querySelector(targetId);
                if (!target) return;

                e.preventDefault();
                window.scrollTo({
                    top: target.offsetTop - 100,
                    behavior: 'smooth'
                });
            });
        });
    }

    /**
     * Respect prefers-reduced-motion
     */
    function applyReducedMotion() {
        if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

        document.documentElement.classList.add('reduce-motion');

        document.querySelectorAll('*').forEach(el => {
            el.style.animation = 'none';
            el.style.transition = 'none';
        });
    }

    /**
     * Initialize app when DOM is ready
     */
    document.addEventListener('DOMContentLoaded', initApp);

})();


/* ============================================================
   HERO SECTION EFFECTS
   - Particles
   - Glitch Text
   - Typewriter Tagline
============================================================ */

function initHeroEffects() {

    /* ===============================
       PARTICLE BACKGROUND
    =============================== */
    const particleContainer = document.getElementById('particles-container');

    if (particleContainer) {
        const PARTICLE_COUNT = 30;

        for (let i = 0; i < PARTICLE_COUNT; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';

            const size = Math.random() * 20 + 5;
            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;
            particle.style.left = `${Math.random() * 100}%`;
            particle.style.animationDelay = `${Math.random() * 10}s`;
            particle.style.animationDuration = `${Math.random() * 10 + 10}s`;

            particleContainer.appendChild(particle);
        }
    }

    const wrapper = document.querySelector('.background-wrapper');

    if (wrapper && window.matchMedia('(pointer: fine)').matches) {
        let x = 0, y = 0, raf = null;

        const update = () => {
            wrapper.style.transform = `translate3d(${x}px, ${y}px, 0)`;
            raf = null;
        };

        document.addEventListener('mousemove', (e) => {
            x = (e.clientX / window.innerWidth - 0.5) * 8;
            y = (e.clientY / window.innerHeight - 0.5) * 8;

            if (!raf) raf = requestAnimationFrame(update);
        });
    }


    /* ===============================
       TYPEWRITER TAGLINE
    =============================== */
    const tagline = document.querySelector('.tagline');

    if (tagline) {
        const text = tagline.textContent.trim();
        tagline.textContent = '';
        let index = 0;

        function type() {
            if (index < text.length) {
                tagline.textContent += text.charAt(index++);
                setTimeout(type, 5);
            }
        }

        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    type();
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        observer.observe(tagline);
    }
}

/* ============================================================
   ANIMATED STATISTICS COUNTERS
   - Triggered when stat items enter viewport
   - Runs once per item
============================================================ */

function initStatsCounters() {
    const statItems = document.querySelectorAll('.stat-item');
    if (!statItems.length) return;

    /**
     * Animate a single counter
     */
    function animateCounter(statItem) {
        const numberEl = statItem.querySelector('.stat-number');
        const target = parseInt(numberEl.getAttribute('data-count'));
        if (isNaN(target)) return;

        const duration = 2000;
        const fps = 60;
        const totalFrames = (duration / 1000) * fps;
        const increment = target / totalFrames;

        let frame = 0;
        numberEl.textContent = '0';

        function update() {
            frame++;
            const value = Math.min(Math.round(increment * frame), target);
            numberEl.textContent = value;

            if (value < target) {
                requestAnimationFrame(update);
            }
        }

        requestAnimationFrame(update);
    }

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.3,
        rootMargin: '100px'
    });

    statItems.forEach(item => observer.observe(item));
}

/* ============================================================
   HIGHLIGHTS SECTION
   - Card hover & click effects
   - Scroll-triggered animations
   - Animated statistics
============================================================ */

class HighlightsSection {
    constructor() {
        this.init();
    }

    init() {
        this.cache();
        if (!this.section) return;

        this.bindEvents();
        this.setupRevealAnimation();
        this.setupCounterObserver();
    }

    cache() {
        this.section = document.getElementById('highlights');
        this.cards = Array.from(document.querySelectorAll('.highlight-card'));
        this.statNumbers = Array.from(document.querySelectorAll('.stat-number'));
        this.statBoxes = Array.from(document.querySelectorAll('.stat-box'));
    }

    /* ===============================
       INTERACTIONS
    =============================== */
    bindEvents() {
        this.cards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-10px) scale(1.02)';
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = 'translateY(-10px)';
            });

            card.addEventListener('click', e => {
                if (e.target.closest('a')) return;

                card.style.transform = 'translateY(-10px) scale(0.98)';
                setTimeout(() => {
                    card.style.transform = 'translateY(-10px) scale(1.02)';
                }, 150);
            });
        });

        this.statBoxes.forEach(box => {
            box.addEventListener('mouseenter', () => {
                box.style.transform = 'translateY(-5px)';
            });

            box.addEventListener('mouseleave', () => {
                box.style.transform = '';
            });
        });
    }

    /* ===============================
       CARD REVEAL ANIMATION
    =============================== */
    setupRevealAnimation() {
        this.cards.forEach(card => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(30px)';
            card.style.transition =
                'opacity 0.8s cubic-bezier(0.4,0,0.2,1), transform 0.8s cubic-bezier(0.4,0,0.2,1)';
        });

        const observer = new IntersectionObserver(entries => {
            if (!entries[0].isIntersecting) return;

            this.cards.forEach((card, i) => {
                setTimeout(() => {
                    card.classList.add('fade-in-up');
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                }, i * 200);
            });

            observer.disconnect();
        }, { threshold: 0.2 });

        observer.observe(this.section);
    }

    /* ===============================
       COUNTER ANIMATION
    =============================== */
    setupCounterObserver() {
        const observer = new IntersectionObserver(entries => {
            if (!entries[0].isIntersecting) return;

            this.animateCounters();
            observer.disconnect();
        }, { threshold: 0.3 });

        observer.observe(this.section);
    }

    animateCounters() {
        this.statNumbers.forEach(stat => {
            if (stat.dataset.animated) return;

            const target = parseInt(stat.getAttribute('data-count'), 10) || 0;
            stat.dataset.animated = 'true';

            const duration = 2000;
            const start = performance.now();

            function update(now) {
                const progress = Math.min((now - start) / duration, 1);
                stat.textContent = Math.floor(progress * target);

                stat.style.transform = 'scale(1.1)';
                setTimeout(() => (stat.style.transform = 'scale(1)'), 50);

                if (progress < 1) {
                    requestAnimationFrame(update);
                }
            }

            requestAnimationFrame(update);
        });
    }
}

/* Events Teaser Component
  Displays featured upcoming events on the homepage
  Fetches data from events.json and shows 3 featured events  */

class EventsTeaser {
    constructor() {
        // Configuration
        this.config = {
            eventsDataUrl: './data/events.json',
            autoRotate: true,
            rotateInterval: 8000, // Rotate every 8 seconds
            skeletonDuration: 1500 // Skeleton loader duration
        };

        // State
        this.state = {
            events: [],
            featuredEvents: [],
            currentIndex: 0,
            isLoading: true,
            isAutoRotating: true
        };

        // DOM Elements
        this.elements = {
            container: null,
            eventsGrid: null,
            skeletonContainer: null,
            prevBtn: null,
            nextBtn: null,
            emptyState: null
        };

        // Initialize component
        this.init();
    }

    /**
     * Initialize the component
     */
    async init() {
        try {
            // Create DOM structure
            this.createDOM();

            // Load events data
            await this.loadEvents();

            // Filter featured events
            this.filterFeaturedEvents();

            // Render events
            this.renderEvents();

            // Setup event listeners
            this.setupEventListeners();

            // Start auto rotation if enabled
            if (this.config.autoRotate) {
                this.startAutoRotation();
            }

        } catch (error) {
            console.error('Error initializing events teaser:', error);
            this.showErrorState();
        }
    }

    /**
     * Create the DOM structure for the component
     */
    createDOM() {
        // Create container
        const container = document.createElement('div');

        // Create inner container
        const innerContainer = document.createElement('div');
        innerContainer.className = 'container mx-auto px-4 relative z-10';

        // Create skeleton loader container
        this.elements.skeletonContainer = document.createElement('div');
        this.elements.skeletonContainer.className = 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-10';
        this.elements.skeletonContainer.id = 'events-teaser-skeleton';

        // Create 3 skeleton cards
        for (let i = 0; i < 3; i++) {
            const skeletonCard = document.createElement('div');
            skeletonCard.className = 'skeleton-card';
            this.elements.skeletonContainer.appendChild(skeletonCard);
        }

        innerContainer.appendChild(this.elements.skeletonContainer);

        // Create events grid (hidden initially)
        this.elements.eventsGrid = document.createElement('div');
        this.elements.eventsGrid.className = 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-10 hidden';
        this.elements.eventsGrid.id = 'events-teaser-grid';
        innerContainer.appendChild(this.elements.eventsGrid);

        // Create empty state (hidden initially)
        this.elements.emptyState = this.createEmptyState();
        this.elements.emptyState.className += ' hidden';
        innerContainer.appendChild(this.elements.emptyState);

        // Create navigation buttons
        const navContainer = document.createElement('div');
        navContainer.className = 'relative mt-12';

        this.elements.prevBtn = document.createElement('button');
        this.elements.prevBtn.className = 'teaser-nav-btn teaser-nav-prev';
        this.elements.prevBtn.innerHTML = '<i class="fas fa-chevron-left"></i>';
        this.elements.prevBtn.setAttribute('aria-label', 'Previous events');

        this.elements.nextBtn = document.createElement('button');
        this.elements.nextBtn.className = 'teaser-nav-btn teaser-nav-next';
        this.elements.nextBtn.innerHTML = '<i class="fas fa-chevron-right"></i>';
        this.elements.nextBtn.setAttribute('aria-label', 'Next events');

        navContainer.appendChild(this.elements.prevBtn);
        navContainer.appendChild(this.elements.nextBtn);

        innerContainer.appendChild(navContainer);
        container.appendChild(innerContainer);

        // Add to page
        const targetElement = document.getElementById('homepage-events-teaser') ||
            document.querySelector('main') ||
            document.body;

        if (targetElement) {
            targetElement.appendChild(container);
        } else {
            document.body.appendChild(container);
        }

        this.elements.container = container;
    }

    /**
     * Create empty state
     */
    createEmptyState() {
        const emptyState = document.createElement('div');
        emptyState.className = 'text-center py-12';

        emptyState.innerHTML = `
            <div class="w-20 h-20 bg-robotics-gold/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <i class="fas fa-calendar-times text-3xl text-robotics-gold"></i>
            </div>
            <h3 class="text-xl font-orbitron font-bold text-white mb-3">No Featured Events</h3>
            <p class="text-gray-300 mb-6 max-w-md mx-auto">
                There are no featured events scheduled at the moment. Check back soon for updates!
            </p>
            <a href="./events.html" class="cta-button secondary">
                <span>View Past Events</span>
                <i class="fas fa-history"></i>
            </a>
        `;

        return emptyState;
    }

    /**
     * Load events data from JSON file
     */
    async loadEvents() {
        try {
            const response = await fetch(this.config.eventsDataUrl);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            this.state.events = data.events || [];

        } catch (error) {
            console.error('Error loading events data:', error);
            throw error;
        }
    }

    /**
     * Filter featured upcoming events
     */
    filterFeaturedEvents() {
        const now = new Date();

        this.state.featuredEvents = this.state.events.filter(event => {
            // Check if event is featured
            if (!event.featured) return false;

            // Check if event is upcoming or ongoing
            const eventDate = new Date(`${event.date}T${event.time}`);
            const eventEndDate = new Date(`${event.endDate}T${event.endTime}`);

            // Include events that are upcoming or currently ongoing
            return eventDate > now || (now >= eventDate && now <= eventEndDate);
        })
            .sort((a, b) => {
                // Sort by date (soonest first)
                return new Date(a.date) - new Date(b.date);
            })
    }

    /**
     * Calculate countdown for an event
     */
    calculateCountdown(eventDate) {
        const now = new Date();
        const target = new Date(eventDate);
        const diff = target - now;

        if (diff <= 0) return null;

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        return { days, hours, minutes, seconds };
    }

    /**
     * Format date for display
     */
    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    }

    /**
     * Format time for display
     */
    formatTime(timeString) {
        return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    /**
     * Get category styling
     */
    getCategoryStyle(category) {
        const styles = {
            workshop: 'bg-blue-500/10 text-blue-300 border-blue-500/30',
            competition: 'bg-red-500/10 text-red-300 border-red-500/30',
            hackathon: 'bg-purple-500/10 text-purple-300 border-purple-500/30',
            seminar: 'bg-green-500/10 text-green-300 border-green-500/30',
            bootcamp: 'bg-yellow-500/10 text-yellow-300 border-yellow-500/30'
        };

        return styles[category] || 'bg-gray-500/10 text-gray-300 border-gray-500/30';
    }

    /**
     * Create event card HTML
     */
    createEventCard(event) {
        const countdown = this.calculateCountdown(`${event.date}T${event.time}`);
        const categoryStyle = this.getCategoryStyle(event.category);

        return `
            <div class="teaser-event-card animate-fade-in-up" data-event-id="${event.id}">
                <div class="featured-badge">
                    <i class="fas fa-fire mr-1"></i> Featured
                </div>
                
                <div class="teaser-image-container">
                    <img src="${event.image}" 
                         alt="${event.title}" 
                         class="teaser-image" 
                         loading="lazy">
                    <div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-robotics-blue/90 to-transparent p-4">
                        <span class="category-tag ${categoryStyle} border">
                            <i class="fas fa-tag"></i>
                            ${event.category.charAt(0).toUpperCase() + event.category.slice(1)}
                        </span>
                    </div>
                </div>
                
                <div class="p-5">
                    <h3 class="text-lg font-orbitron font-bold text-white mb-2 line-clamp-2" 
                        style="min-height: 3rem;">
                        ${event.title}
                    </h3>
                    
                    <p class="text-gray-300 text-sm mb-4 line-clamp-2" style="min-height: 2.5rem;">
                        ${event.brief}
                    </p>
                    
                    <div class="flex items-center justify-between mb-4">
                        <div class="flex items-center gap-2">
                            <i class="fas fa-calendar text-robotics-gold text-sm"></i>
                            <span class="text-gray-300 text-sm">
                                ${this.formatDate(event.date)}
                            </span>
                        </div>
                        <div class="flex items-center gap-2">
                            <i class="fas fa-clock text-robotics-gold text-sm"></i>
                            <span class="text-gray-300 text-sm">
                                ${this.formatTime(event.time)}
                            </span>
                        </div>
                    </div>
                    
                    <div class="flex items-center gap-2 mb-4">
                        <i class="fas fa-map-marker-alt text-robotics-gold text-sm"></i>
                        <span class="text-gray-300 text-sm truncate">${event.venue}</span>
                    </div>
                    
                    ${countdown ? `
                        <div class="mb-4">
                            <p class="text-gray-300 text-xs mb-2 text-center">Starts in:</p>
                            <div class="countdown-timer">
                                <div class="countdown-item">
                                    <span class="countdown-value">${countdown.days}</span>
                                    <span class="countdown-label">Days</span>
                                </div>
                                <div class="countdown-item">
                                    <span class="countdown-value">${countdown.hours}</span>
                                    <span class="countdown-label">Hours</span>
                                </div>
                                <div class="countdown-item">
                                    <span class="countdown-value">${countdown.minutes}</span>
                                    <span class="countdown-label">Mins</span>
                                </div>
                            </div>
                        </div>
                    ` : ''}
                    </br>
                    <button class="register-btn cta-button secondary w-full py-2.5 text-sm" 
                            data-event-id="${event.id}"
                            ${event.registered >= event.capacity ? 'disabled' : ''}>
                        <i class="fas fa-user-plus mr-2"></i>
                        ${event.registered >= event.capacity ? 'Fully Booked' : 'Register Now'}
                    </button>
                </div>
            </div>
        `;
    }

    /**
     * Render events to the grid
     */
    renderEvents() {
        // Hide skeleton, show events grid
        setTimeout(() => {
            this.elements.skeletonContainer.classList.add('hidden');

            if (this.state.featuredEvents.length > 0) {
                this.elements.eventsGrid.classList.remove('hidden');

                // Create event cards
                this.elements.eventsGrid.innerHTML = this.state.featuredEvents
                    .map(event => this.createEventCard(event))
                    .join('');

                // Add stagger animation
                const cards = this.elements.eventsGrid.querySelectorAll('.animate-fade-in-up');
                cards.forEach((card, index) => {
                    card.style.animationDelay = `${index * 0.15}s`;
                });

            } else {
                this.elements.emptyState.classList.remove('hidden');
            }

            this.state.isLoading = false;

        }, this.config.skeletonDuration);
    }

    /**
     * Setup event listeners
     */
    setupEventListeners() {
        // Previous button
        this.elements.prevBtn.addEventListener('click', () => {
            this.navigate(-1);
            this.resetAutoRotation();
        });

        // Next button
        this.elements.nextBtn.addEventListener('click', () => {
            this.navigate(1);
            this.resetAutoRotation();
        });

        // Register button clicks (event delegation)
        this.elements.eventsGrid.addEventListener('click', (e) => {
            const registerBtn = e.target.closest('.register-btn');
            if (registerBtn && !registerBtn.disabled) {
                this.handleRegistration(registerBtn.dataset.eventId);
            }

            const eventCard = e.target.closest('.teaser-event-card');
            if (eventCard && !e.target.closest('.register-btn')) {
                this.handleCardClick(eventCard.dataset.eventId);
            }
        });

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') {
                this.navigate(-1);
                this.resetAutoRotation();
            } else if (e.key === 'ArrowRight') {
                this.navigate(1);
                this.resetAutoRotation();
            }
        });

        // Pause auto-rotation on hover
        this.elements.container.addEventListener('mouseenter', () => {
            this.pauseAutoRotation();
        });

        this.elements.container.addEventListener('mouseleave', () => {
            if (this.state.isAutoRotating) {
                this.startAutoRotation();
            }
        });
    }

    /**
     * Navigate between events (for future carousel implementation)
     */
    navigate(direction) {
        if (this.state.featuredEvents.length <= 1) return;

        this.state.currentIndex += direction;

        if (this.state.currentIndex < 0) {
            this.state.currentIndex = this.state.featuredEvents.length - 1;
        } else if (this.state.currentIndex >= this.state.featuredEvents.length) {
            this.state.currentIndex = 0;
        }

        // For now, just update active state
        this.updateActiveState();
    }

    /**
     * Update active state of events
     */
    updateActiveState() {
        const cards = this.elements.eventsGrid.querySelectorAll('.teaser-event-card');
        cards.forEach((card, index) => {
            if (index === this.state.currentIndex) {
                card.classList.add('ring-2', 'ring-robotics-gold');
            } else {
                card.classList.remove('ring-2', 'ring-robotics-gold');
            }
        });
    }

    /**
     * Handle registration button click
     */
    handleRegistration(eventId) {
        const event = this.state.featuredEvents.find(e => e.id == eventId);
        if (!event) return;

        // In a real implementation, this would redirect to registration page
        // For demo, we'll show a toast message
        this.showToast(`Redirecting to registration for "${event.title}"`);

        // Simulate API call
        setTimeout(() => {
            window.location.href = event.registrationLink || './events.html';
        }, 500);
    }

    /**
     * Handle event card click
     */
    handleCardClick(eventId) {
        // Navigate to event details page
        window.location.href = `./events.html#event-${eventId}`;
    }

    /**
     * Start auto rotation of events
     */
    startAutoRotation() {
        if (this.rotationTimer) clearInterval(this.rotationTimer);

        this.rotationTimer = setInterval(() => {
            this.navigate(1);
        }, this.config.rotateInterval);

        this.state.isAutoRotating = true;
    }

    /**
     * Pause auto rotation
     */
    pauseAutoRotation() {
        if (this.rotationTimer) {
            clearInterval(this.rotationTimer);
            this.state.isAutoRotating = false;
        }
    }

    /**
     * Reset auto rotation timer
     */
    resetAutoRotation() {
        this.pauseAutoRotation();
        if (this.config.autoRotate) {
            setTimeout(() => this.startAutoRotation(), 2000);
        }
    }

    /**
     * Show toast notification
     */
    showToast(message) {
        // Create toast element
        const toast = document.createElement('div');
        toast.className = 'fixed top-4 right-4 bg-robotics-blue border border-robotics-gold/30 text-white px-4 py-3 rounded-lg shadow-lg z-50 animate-fade-in-up';
        toast.innerHTML = `
            <div class="flex items-center gap-3">
                <i class="fas fa-info-circle text-robotics-gold"></i>
                <span>${message}</span>
            </div>
        `;

        document.body.appendChild(toast);

        // Remove toast after 3 seconds
        setTimeout(() => {
            toast.classList.add('opacity-0', 'transition-opacity', 'duration-300');
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    /**
     * Show error state
     */
    showErrorState() {
        this.elements.skeletonContainer.classList.add('hidden');

        const errorState = document.createElement('div');
        errorState.className = 'text-center py-12';
        errorState.innerHTML = `
            <div class="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <i class="fas fa-exclamation-triangle text-3xl text-red-400"></i>
            </div>
            <h3 class="text-xl font-orbitron font-bold text-white mb-3">Unable to Load Events</h3>
            <p class="text-gray-300 mb-6 max-w-md mx-auto">
                There was an error loading the featured events. Please try refreshing the page.
            </p>
            <button class="cta-button secondary" onclick="window.location.reload()">
                <span>Refresh Page</span>
                <i class="fas fa-redo"></i>
            </button>
        `;

        this.elements.container.querySelector('.container').appendChild(errorState);
    }

    /**
     * Clean up component
     */
    destroy() {
        if (this.rotationTimer) clearInterval(this.rotationTimer);

        // Remove event listeners
        this.elements.prevBtn?.removeEventListener('click', () => { });
        this.elements.nextBtn?.removeEventListener('click', () => { });

        // Remove container from DOM
        this.elements.container?.remove();
    }
}

// ===== SIMPLE & MODULAR IMAGE SLIDER =====
class SimpleImageSlider {
    constructor() {
        this.currentIndex = 1;
        this.images = [];
        this.totalImages = 1;
        this.isAnimating = false;
        this.autoPlayInterval = null;
        this.isAutoPlaying = true;
        this.autoPlayDelay = 3000; // 3 seconds

        this.init();
    }

    async init() {
        this.cacheElements();
        await this.loadImages();
        this.setupEventListeners();
        this.startAutoPlay();
        this.updateUI();
    }

    cacheElements() {
        // Containers
        this.slidesContainer = document.getElementById('slides-container');
        this.dotsContainer = document.getElementById('slider-dots');

        // Controls
        this.prevBtn = document.querySelector('.slider-prev');
        this.nextBtn = document.querySelector('.slider-next');

        // Display elements
        this.currentSlideEl = document.getElementById('current-slide');
        this.totalSlidesEl = document.getElementById('total-slides');
        this.imageTitleEl = document.getElementById('image-title');
        this.imageDescEl = document.getElementById('image-description');

        // Loading indicator
        this.loadingIndicator = document.querySelector('.loading-indicator');
    }

    async loadImages() {
        try {
            // Show loading
            if (this.loadingIndicator) {
                this.loadingIndicator.classList.remove('hidden');
            }

            // In production, fetch from API/JSON
            // For now, we'll use the images from HTML or load from JSON
            await this.loadFromJSON();

        } catch (error) {
            console.error('Error loading images:', error);
        } finally {
            // Hide loading
            if (this.loadingIndicator) {
                this.loadingIndicator.classList.add('hidden');
            }
        }
    }

    async loadFromJSON() {
        // API INTEGRATION POINT: Replace with your API endpoint
        // Example: const response = await fetch('/api/slider-images');

        // For now, we'll create images from data
        const imageData = [
            {
                "id": 1,
                "title": "Robotics Club",
                "description": "Our club activities",
                "url": "./images/background/1.webp",
                "alt": "Robotics club",
                "category": "Club"
            },
            {
                "id": 2,
                "title": "Technical Workshop",
                "description": "Hands-on learning sessions",
                "url": "./images/background/2.webp",
                "alt": "Technical workshop",
                "category": "Workshop"
            },
            {
                "id": 3,
                "title": "Coding Event",
                "description": "Competitive programming and hackathons",
                "url": "./images/background/3.webp",
                "alt": "Coding event",
                "category": "Event"
            },
            {
                "id": 4,
                "title": "Mechanical Lab",
                "description": "Practical mechanical engineering experiments",
                "url": "./images/background/4.webp",
                "alt": "Mechanical engineering lab",
                "category": "Laboratory"
            },
            {
                "id": 5,
                "title": "Electronics Project",
                "description": "Innovative electronics and PCB design",
                "url": "./images/background/5.webp",
                "alt": "Electronics project",
                "category": "Project"
            }
        ]
            ;

        this.images = imageData;
        this.totalImages = this.images.length;
        this.renderSlides();
    }

    renderSlides() {
        if (!this.slidesContainer || this.images.length === 0) return;

        // Clear container
        this.slidesContainer.innerHTML = '';

        // Create slides
        this.images.forEach((image, index) => {
            const slide = this.createSlide(image, index);
            this.slidesContainer.appendChild(slide);

            // Lazy load images
            this.lazyLoadImage(slide.querySelector('img'));
        });

        // Create dots
        this.renderDots();

        // Set first slide as active
        this.showSlide(0);
    }

    createSlide(image, index) {
        const slide = document.createElement('div');
        slide.className = 'slide';
        slide.dataset.index = index;

        slide.innerHTML = `
            <img src="${image.url}" 
                 alt="${image.alt}" 
                 loading="lazy">
            <div class="slide-overlay">
                <span class="slide-category">${image.category}</span>
                <h3 class="slide-title">${image.title}</h3>
                <p class="slide-description">${image.description}</p>
            </div>
        `;

        return slide;
    }

    renderDots() {
        if (!this.dotsContainer) return;

        this.dotsContainer.innerHTML = '';

        for (let i = 0; i < this.totalImages; i++) {
            const dot = document.createElement('button');
            dot.className = 'slider-dot';
            dot.dataset.index = i;
            dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
            this.dotsContainer.appendChild(dot);
        }
    }

    lazyLoadImage(imgElement) {
        // Simple lazy loading
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.classList.add('loaded');
                    observer.unobserve(img);
                }
            });
        }, { threshold: 0.1 });

        observer.observe(imgElement);
    }

    setupEventListeners() {
        // Navigation buttons
        if (this.prevBtn) {
            this.prevBtn.addEventListener('click', () => this.prev());
        }

        if (this.nextBtn) {
            this.nextBtn.addEventListener('click', () => this.next());
        }

        // Dot navigation
        this.dotsContainer?.addEventListener('click', (e) => {
            if (e.target.classList.contains('slider-dot')) {
                const index = parseInt(e.target.dataset.index);
                this.goToSlide(index);
            }
        });

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') this.prev();
            if (e.key === 'ArrowRight') this.next();
            if (e.key === ' ') {
                e.preventDefault();
                this.toggleAutoPlay();
            }
        });

        // Pause on hover
        this.slidesContainer?.addEventListener('mouseenter', () => this.pauseAutoPlay());
        this.slidesContainer?.addEventListener('mouseleave', () => this.resumeAutoPlay());
    }

    showSlide(index) {
        if (this.isAnimating || index === this.currentIndex) return;

        this.isAnimating = true;
        const slides = document.querySelectorAll('.slide');
        const dots = document.querySelectorAll('.slider-dot');

        // Hide current slide
        if (slides[this.currentIndex]) {
            slides[this.currentIndex].classList.remove('active');
        }
        if (dots[this.currentIndex]) {
            dots[this.currentIndex].classList.remove('active');
        }

        // Update index
        this.currentIndex = index;

        // Show new slide
        if (slides[this.currentIndex]) {
            slides[this.currentIndex].classList.add('active');
        }
        if (dots[this.currentIndex]) {
            dots[this.currentIndex].classList.add('active');
        }

        // Update UI
        this.updateUI();

        // Reset animation flag
        setTimeout(() => {
            this.isAnimating = false;
        }, 500);
    }

    goToSlide(index) {
        this.showSlide(index);
        this.resetAutoPlay();
    }

    next() {
        const nextIndex = (this.currentIndex + 1) % this.totalImages;
        this.goToSlide(nextIndex);
    }

    prev() {
        const prevIndex = (this.currentIndex - 1 + this.totalImages) % this.totalImages;
        this.goToSlide(prevIndex);
    }

    updateUI() {
        // Update counter
        if (this.currentSlideEl) {
            this.currentSlideEl.textContent = this.currentIndex + 1;
        }
        if (this.totalSlidesEl) {
            this.totalSlidesEl.textContent = this.totalImages;
        }

        // Update image info
        if (this.images[this.currentIndex]) {
            const currentImage = this.images[this.currentIndex];
            if (this.imageTitleEl) {
                this.imageTitleEl.textContent = currentImage.title;
            }
            if (this.imageDescEl) {
                this.imageDescEl.textContent = currentImage.description;
            }
        }
    }

    startAutoPlay() {
        if (this.autoPlayInterval) {
            clearInterval(this.autoPlayInterval);
        }

        this.autoPlayInterval = setInterval(() => {
            this.next();
        }, this.autoPlayDelay);

        this.isAutoPlaying = true;
    }

    pauseAutoPlay() {
        if (this.autoPlayInterval) {
            clearInterval(this.autoPlayInterval);
            this.autoPlayInterval = null;
        }
        this.isAutoPlaying = false;
    }

    resumeAutoPlay() {
        if (!this.isAutoPlaying) {
            this.startAutoPlay();
        }
    }

    toggleAutoPlay() {
        if (this.isAutoPlaying) {
            this.pauseAutoPlay();
        } else {
            this.startAutoPlay();
        }
    }

    resetAutoPlay() {
        if (this.isAutoPlaying) {
            this.pauseAutoPlay();
            this.startAutoPlay();
        }
    }

    // Cleanup method
    destroy() {
        this.pauseAutoPlay();
        // Remove event listeners if needed
    }
}

/* ============================================================
   RECENT ACHIEVEMENTS LOADER
   - Loads featured achievements from JSON
   - Fallback data if fetch fails
   - Hover glow & click navigation
============================================================ */

const ACHIEVEMENTS_CONFIG = {
    jsonPath: './data/achievements.json',
    animationDelay: 200
};

let achievementsData = [];

/* ===============================
   INITIALIZATION
=============================== */
async function initRecentAchievements() {
    try {
        await loadAchievements();
        renderAchievements();
        bindAchievementEvents();
    } catch (err) {
        console.error('Achievements init failed:', err);
        showAchievementsError();
    }
}

/* ===============================
   DATA LOADING
=============================== */
async function loadAchievements() {
    try {
        const res = await fetch(ACHIEVEMENTS_CONFIG.jsonPath);
        if (!res.ok) throw new Error('Achievements JSON failed');

        const data = await res.json();
        achievementsData = data.achievements || [];

    } catch (err) {
        console.warn('Data Loading Failed');
    }
}

/* ===============================
   RENDERING
=============================== */
function renderAchievements() {
    const container = document.getElementById('featured-achievements-container');
    if (!container) return;

    const featured = achievementsData
        .filter(a => a.featured)
        .sort((a, b) => b.year - a.year);

    if (!featured.length) {
        container.innerHTML = `
            <div class="col-span-full text-center py-16 text-gray-400">
                No featured achievements yet
            </div>
        `;
        return;
    }

    container.innerHTML = featured
        .map((a, i) => renderAchievementCard(a, i))
        .join('');

    enableAchievementGlow();
}

function renderAchievementCard(achievement, index) {
    return `
        <div class="featured-achievement-card animate-card-rise"
             style="animation-delay:${index * ACHIEVEMENTS_CONFIG.animationDelay}ms"
             data-id="${achievement.id}">
            
            <div class="featured-card-image">
                <img src="${achievement.thumbnail}"
                     alt="${achievement.name}"
                     loading="lazy">
            </div>

            <div class="featured-card-content">
                <h3 class="featured-card-title">
                    ${achievement.name}
                </h3>

                <div class="featured-achievement-type">
                    <i class="fas fa-${getAchievementIcon(achievement.category)}"></i>
                    ${achievement.achievement}
                </div>

                <p class="featured-card-description">
                    ${achievement.brief_description}
                </p>

                <div class="mt-6 pt-4 border-t border-gray-700/50 text-sm text-gray-400">
                    <i class="fas fa-users mr-2"></i>
                    ${achievement.team_members.slice(0, 2).join(', ')}
                </div>
            </div>
        </div>
    `;
}

/* ===============================
   UI ENHANCEMENTS
=============================== */
function enableAchievementGlow() {
    document.querySelectorAll('.featured-achievement-card').forEach(card => {
        card.addEventListener('mousemove', e => {
            const rect = card.getBoundingClientRect();
            card.style.setProperty(
                '--mouse-x',
                `${((e.clientX - rect.left) / rect.width) * 100}%`
            );
            card.style.setProperty(
                '--mouse-y',
                `${((e.clientY - rect.top) / rect.height) * 100}%`
            );
        });

        card.addEventListener('click', () => {
            window.location.href = 'achievements.html';
        });
    });
}

function bindAchievementEvents() {
    const viewMore = document.querySelector('.view-more-card');
    viewMore?.addEventListener('click', () => {
        window.location.href = 'achievements.html';
    });
}

/* ===============================
   UTILITIES
=============================== */
function getAchievementIcon(category) {
    const icons = {
        competition: 'flag-checkered',
        research: 'book',
        innovation: 'lightbulb',
        grants_awards: 'award'
    };
    return icons[category] || 'trophy';
}

function showAchievementsError() {
    const container = document.getElementById('featured-achievements-container');
    if (!container) return;

    container.innerHTML = `
        <div class="col-span-full text-center py-16 text-red-400">
            Failed to load achievements
        </div>
    `;
}
