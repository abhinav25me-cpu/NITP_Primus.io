// ===== MAIN INITIALIZATION =====
document.addEventListener('DOMContentLoaded', function () {
    console.log('Initializing Robotics Club Website...');

    // Initialize Quick Navigation if section exists
    const quickNavSection = document.querySelector('#quick-navigation');
    if (quickNavSection) {
        console.log('Initializing Quick Navigation...');
        const quickNavigation = new QuickNavigation();
    }

    // Initialize Highlights Section if exists
    const highlightsSection = document.querySelector('#highlights');
    if (highlightsSection) {
        console.log('Initializing Highlights Section...');
        const highlights = new HighlightsSection();
    }

    // Initialize Simple Image Slider if exists
    const imageSliderSection = document.querySelector('#image-slider');
    if (imageSliderSection) {
        console.log('Initializing Simple Image Slider...');
        const simpleSlider = new SimpleImageSlider();
        window.simpleSlider = simpleSlider;
    }

    console.log('Website initialization complete!');
});










// ============================================
// HERO SECTION SPECIFIC JAVASCRIPT
// ============================================

document.addEventListener('DOMContentLoaded', function () {
    console.log('Hero section loaded successfully');

    // ========== CREATE ANIMATED PARTICLES ==========
    function createParticles() {
        const container = document.getElementById('particles-container');
        const particleCount = 20; // Number of particles

        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';

            // Random properties for each particle
            const size = Math.random() * 20 + 5; // 5-25px
            const left = Math.random() * 100; // 0-100%
            const delay = Math.random() * 10; // 0-10s
            const duration = Math.random() * 10 + 10; // 10-20s

            // Apply styles
            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;
            particle.style.left = `${left}%`;
            particle.style.animationDelay = `${delay}s`;
            particle.style.animationDuration = `${duration}s`;

            // Add particle to container
            container.appendChild(particle);
        }
    }

    // Initialize particles
    createParticles();



    // ========== ANIMATED STATISTICS COUNTER ==========
    window.addEventListener('DOMContentLoaded', () => {
        const statItems = document.querySelectorAll('.stat-item');

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
    });



    // ========== GLITCH EFFECT TRIGGER ==========
    const glitchText = document.querySelector('.glitch-text');

    // Trigger glitch effect on hover
    if (glitchText) {
        glitchText.addEventListener('mouseenter', function () {
            this.style.animation = 'glitch 0.3s linear infinite';
            setTimeout(() => {
                this.style.animation = '';
            }, 1000);
        });

        // Random glitch effect every 10-20 seconds
        setInterval(() => {
            if (Math.random() > 0.7) { // 30% chance
                glitchText.style.animation = 'glitch 0.3s linear';
                setTimeout(() => {
                    glitchText.style.animation = '';
                }, 300);
            }
        }, Math.random() * 10000 + 10000); // 10-20 seconds
    }

    // ========== PARALLAX EFFECT ==========
    let mouseX = 0;
    let mouseY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = (e.clientX / window.innerWidth - 0.5) * 20;
        mouseY = (e.clientY / window.innerHeight - 0.5) * 20;

        // Apply parallax to background layers
        const bg1 = document.querySelector('.background-main');
        const bg2 = document.querySelector('.background-secondary');

        if (bg1) bg1.style.transform = `translate(${mouseX * 0.5}px, ${mouseY * 0.5}px) scale(1.1)`;
        if (bg2) bg2.style.transform = `translate(${mouseX * 0.3}px, ${mouseY * 0.3}px) scale(1.05)`;
    });

    // ========== TYPEWRITER EFFECT FOR TAGLINE ==========
    const tagline = document.querySelector('.tagline');
    if (tagline) {
        const originalText = tagline.textContent;
        tagline.textContent = '';
        let i = 0;

        function typeWriter() {
            if (i < originalText.length) {
                tagline.textContent += originalText.charAt(i);
                i++;
                setTimeout(typeWriter, 5); // Typing speed
            }
        }

        // Start typing when tagline is in view
        const taglineObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    typeWriter();
                    taglineObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        taglineObserver.observe(tagline);
    }

    // ========== CTA BUTTON HOVER EFFECTS ==========
    const ctaButtons = document.querySelectorAll('.cta-button');

    ctaButtons.forEach(button => {
        button.addEventListener('mouseenter', function () {
            const ripple = document.createElement('span');
            ripple.className = 'ripple-effect';
            ripple.style.position = 'absolute';
            ripple.style.borderRadius = '50%';
            ripple.style.backgroundColor = 'rgba(255, 255, 255, 0.3)';
            ripple.style.transform = 'scale(0)';
            ripple.style.animation = 'ripple 0.6s linear';
            ripple.style.pointerEvents = 'none';

            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = event.clientX - rect.left - size / 2;
            const y = event.clientY - rect.top - size / 2;

            ripple.style.width = ripple.style.height = `${size}px`;
            ripple.style.left = `${x}px`;
            ripple.style.top = `${y}px`;

            this.appendChild(ripple);

            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });

    // ========== SMOOTH SCROLL FOR NAVIGATION ==========
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 100,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ========== REDUCED MOTION PREFERENCE ==========
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

    if (prefersReducedMotion.matches) {
        // Disable all animations
        document.querySelectorAll('*').forEach(el => {
            el.style.animation = 'none !important';
            el.style.transition = 'none !important';
        });

        // Show all content immediately
        document.querySelectorAll('.animate-fade-in-up').forEach(el => {
            el.style.opacity = '1';
            el.style.transform = 'none';
        });
    }

    // ========== PERFORMANCE OPTIMIZATIONS ==========
    // Debounce scroll events
    let scrollTimeout;
    window.addEventListener('scroll', () => {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            // Performance optimization logic here
        }, 100);
    });

    // ========== ADD RIPPLE ANIMATION ==========
    const style = document.createElement('style');
    style.textContent = `
                @keyframes ripple {
                    to {
                        transform: scale(4);
                        opacity: 0;
                    }
                }
            `;
    document.head.appendChild(style);

    console.log('Hero section animations initialized');
});

// ========== WINDOW LOAD EVENT ==========
window.addEventListener('load', function () {
    // Ensure all images are loaded before starting animations
    const images = document.querySelectorAll('img');
    let imagesLoaded = 0;
    const totalImages = images.length;

    images.forEach(img => {
        if (img.complete) {
            imagesLoaded++;
        } else {
            img.addEventListener('load', () => {
                imagesLoaded++;
                if (imagesLoaded === totalImages) {
                    console.log('All hero images loaded successfully');
                }
            });
        }
    });

    // Fallback for when all images are already loaded
    if (imagesLoaded === totalImages) {
        console.log('All hero images pre-loaded');
    }
});










// ===== QUICK NAVIGATION FUNCTIONALITY (UPDATED) =====
class QuickNavigation {
    constructor() {
        this.init();
    }

    init() {
        this.cacheElements();
        if (this.section) {
            this.setupEventListeners();
            this.setupScrollAnimation();
        }
    }

    cacheElements() {
        this.cards = document.querySelectorAll('.card-hover, .card');
        this.section = document.getElementById('quick-navigation');
        this.ctaButtons = document.querySelectorAll('.btn');
    }

    setupEventListeners() {
        // Card click animation
        this.cards.forEach(card => {
            card.addEventListener('click', (e) => {
                // Add click feedback
                card.style.transform = 'translateY(-5px) scale(0.98)';
                setTimeout(() => {
                    card.style.transform = '';
                }, 150);
            });

            // Add keyboard navigation
            card.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    card.click();
                }
            });
        });

        // Button hover effects
        this.ctaButtons.forEach(button => {
            button.addEventListener('mouseenter', () => {
                button.style.transform = 'translateY(-3px)';
            });

            button.addEventListener('mouseleave', () => {
                button.style.transform = '';
            });
        });
    }

    setupScrollAnimation() {
        // Don't hide cards initially - wait until they enter viewport
        const cardObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    // Get the actual index of this card in the node list
                    const cardsArray = Array.from(this.cards);
                    const cardIndex = cardsArray.indexOf(entry.target);

                    setTimeout(() => {
                        // Add animation classes
                        entry.target.classList.add('fade-in-up');
                        entry.target.classList.add(`stagger-delay-${(cardIndex % 5) + 1}`);

                        // Make card visible with animation
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';

                    }, (cardIndex % 8) * 100); // Stagger based on actual index

                    // Stop observing this card
                    cardObserver.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.2, // 20% visible
            rootMargin: '0px 0px -50px 0px' // Triggers 50px before entering viewport
        });

        // Set initial state and start observing
        this.cards.forEach((card, index) => {
            // Check if card is already in viewport
            const rect = card.getBoundingClientRect();
            const windowHeight = window.innerHeight || document.documentElement.clientHeight;

            if (rect.top <= windowHeight * 0.8) {
                // Card is already near viewport, animate immediately
                setTimeout(() => {
                    card.classList.add('fade-in-up');
                    card.classList.add(`stagger-delay-${(index % 5) + 1}`);
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                }, index * 50);
            } else {
                // Card is not in viewport, hide and observe
                card.style.opacity = '0';
                card.style.transform = 'translateY(20px)';
                card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
                cardObserver.observe(card);
            }
        });
    }
}





// ===== HIGHLIGHTS SECTION FUNCTIONALITY =====
class HighlightsSection {
    constructor() {
        this.init();
    }

    init() {
        this.cacheElements();
        if (this.section) {
            this.setupEventListeners();
            this.setupScrollAnimation();
            this.setupCounterAnimation();
        }
    }

    cacheElements() {
        this.section = document.getElementById('highlights');
        this.highlightCards = document.querySelectorAll('.highlight-card');
        this.statNumbers = document.querySelectorAll('.stat-number');
        this.statBoxes = document.querySelectorAll('.stat-box');
    }

    setupEventListeners() {
        // Card hover effects
        this.highlightCards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                // Add subtle scale effect
                card.style.transform = 'translateY(-10px) scale(1.02)';
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = 'translateY(-10px)';
            });

            // Click animation
            card.addEventListener('click', (e) => {
                if (e.target.tagName === 'A') return; // Don't interfere with link clicks

                card.style.transform = 'translateY(-10px) scale(0.98)';
                setTimeout(() => {
                    card.style.transform = 'translateY(-10px) scale(1.02)';
                }, 150);
            });
        });

        // Stat box hover effects
        this.statBoxes.forEach(box => {
            box.addEventListener('mouseenter', () => {
                box.style.transform = 'translateY(-5px)';
            });

            box.addEventListener('mouseleave', () => {
                box.style.transform = '';
            });
        });
    }

    setupScrollAnimation() {
        // Animate cards when section enters viewport
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry, sectionIndex) => {
                if (entry.isIntersecting) {
                    // Animate cards with staggered delay
                    this.highlightCards.forEach((card, index) => {
                        setTimeout(() => {
                            card.classList.add('fade-in-up');
                            card.classList.add(`stagger-delay-${(index % 4) + 1}`);
                            card.style.opacity = '1';
                            card.style.transform = 'translateY(0)';
                        }, index * 200);
                    });

                    // Trigger counter animation
                    this.animateCounters();

                    // Stop observing
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.2 });

        if (this.section) {
            // Set initial state
            this.highlightCards.forEach((card, index) => {
                card.style.opacity = '0';
                card.style.transform = 'translateY(30px)';
                card.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
            });

            observer.observe(this.section);
        }
    }

    setupCounterAnimation() {
        // Only animate when section is in viewport
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateCounters();
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });

        if (this.section) {
            observer.observe(this.section);
        }
    }

    animateCounters() {
        this.statNumbers.forEach(stat => {
            const target = parseInt(stat.getAttribute('data-count')) || 0;
            const duration = 2000;
            const increment = target / (duration / 16);

            let current = 0;
            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    current = target;
                    clearInterval(timer);
                }
                stat.textContent = Math.floor(current);

                // Add animation for each update
                stat.style.transform = 'scale(1.1)';
                setTimeout(() => {
                    stat.style.transform = 'scale(1)';
                }, 50);
            }, 16);
        });
    }
}






// ===== SIMPLE & MODULAR IMAGE SLIDER =====
class SimpleImageSlider {
    constructor() {
        this.currentIndex = 0;
        this.images = [];
        this.totalImages = 0;
        this.isAnimating = false;
        this.autoPlayInterval = null;
        this.isAutoPlaying = true;
        this.autoPlayDelay = 4000; // 4 seconds

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
        this.autoPlayToggle = document.getElementById('auto-play-toggle');

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
            // Fallback to default images
            this.useDefaultImages();
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
                id: 1,
                title: "AI powered VTOL-UAV",
                description: "2nd Prize Winner among 25000+ teams at Idea Festival 2025",
                url: "https://media.licdn.com/dms/image/v2/D4E22AQHoc3xynzIFxA/feedshare-shrink_2048_1536/B4EZlNngqpKsA0-/0/1757943872552?e=2147483647&v=beta&t=o5Ow5a43cD4FdMpeNl7LM8WaPNqy9qmoS-7xna8xyPg",
                alt: "Idea Festival 2025",
                category: "Prize Won"
            }

            // ADD MORE IMAGES DATA HERE FOR INDEX PAGE SLIDER

        ];

        this.images = imageData;
        this.totalImages = this.images.length;
        this.renderSlides();
    }

    useDefaultImages() {
        // Fallback if JSON/API fails
        this.images = [
            {
                id: 1,
                title: "Robotics Club",
                description: "Our club activities",
                url: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
                alt: "Robotics club",
                category: "Club"
            }
        ];
        this.totalImages = 1;
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
                 loading="lazy"
                 onerror="this.src='https://images.unsplash.com/photo-1555949963-aa79dcee981c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'">
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

        // Auto-play toggle
        if (this.autoPlayToggle) {
            this.autoPlayToggle.addEventListener('click', () => this.toggleAutoPlay());
        }

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
        this.updateAutoPlayToggle();
    }

    pauseAutoPlay() {
        if (this.autoPlayInterval) {
            clearInterval(this.autoPlayInterval);
            this.autoPlayInterval = null;
        }
        this.isAutoPlaying = false;
        this.updateAutoPlayToggle();
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

    updateAutoPlayToggle() {
        if (this.autoPlayToggle) {
            if (this.isAutoPlaying) {
                this.autoPlayToggle.classList.add('active');
                this.autoPlayToggle.setAttribute('aria-label', 'Pause auto-play');
            } else {
                this.autoPlayToggle.classList.remove('active');
                this.autoPlayToggle.setAttribute('aria-label', 'Start auto-play');
            }
        }
    }

    // API Integration Helper Methods
    async fetchImagesFromAPI(endpoint) {
        // API INTEGRATION POINT
        try {
            const response = await fetch(endpoint);
            if (!response.ok) throw new Error('API request failed');
            const data = await response.json();
            return data.images || [];
        } catch (error) {
            console.error('API Error:', error);
            return [];
        }
    }

    async updateImages(newImages) {
        // Method to dynamically update images
        this.images = newImages;
        this.totalImages = this.images.length;
        this.renderSlides();
        this.showSlide(0);
    }

    // Cleanup method
    destroy() {
        this.pauseAutoPlay();
        // Remove event listeners if needed
    }
}