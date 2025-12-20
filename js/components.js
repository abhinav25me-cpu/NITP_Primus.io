// js/components.js - Component loader and initialization

// Function to load HTML components
function loadComponent(id, file, callback) {
    fetch(file)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Failed to load ${file}: ${response.status}`);
            }
            return response.text();
        })
        .then(data => {
            const element = document.getElementById(id);
            if (element) {
                element.innerHTML = data;
                
                // Execute callback if provided
                if (callback) callback();
                
                // Initialize component-specific functionality
                if (id === 'navbar-placeholder') {
                    initNavbar();
                } else if (id === 'footer-placeholder') {
                    initFooter();
                }
            }
        })
        .catch(error => {
            console.error(error);
            document.getElementById(id).innerHTML = 
                `<div class="error-loading p-4 text-center">
                    <p class="text-red-400">Error loading component: ${file}</p>
                    <p class="text-sm text-gray-400">Please check if the file exists and try again.</p>
                </div>`;
        });
}

// Initialize navbar functionality
function initNavbar() {
    // Mobile menu toggle
    const mobileMenuBtn = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', function() {
            this.classList.toggle('active');
            mobileMenu.classList.toggle('active');
        });
    }
    
    // Close mobile menu when clicking a link
    const mobileLinks = document.querySelectorAll('#mobile-menu .mobile-nav-link');
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileMenuBtn.classList.remove('active');
            mobileMenu.classList.remove('active');
        });
    });
    
    // Set active page in navbar
    setActiveNavLink();
    
    // Navbar scroll effect
    window.addEventListener('scroll', handleNavbarScroll);
    handleNavbarScroll(); // Initialize on load
}

// Initialize footer functionality
function initFooter() {
    // Update current year in footer
    const yearElement = document.getElementById('current-year');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
}

// Set active navigation link based on current page
function setActiveNavLink() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const pageMap = {
        'index.html': 'home',
        'about.html': 'about',
        'projects.html': 'projects',
        'events.html': 'events',
        'team.html': 'team',
        'news.html': 'news',
        'achievements.html': 'achievements',
        'contact.html': 'contact'
    };
    
    const currentPageKey = pageMap[currentPage] || 'home';
    
    // Set active state for desktop nav links
    const desktopLinks = document.querySelectorAll('.nav-link');
    desktopLinks.forEach(link => {
        if (link.dataset.page === currentPageKey) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
    
    // Set active state for mobile nav links
    const mobileLinks = document.querySelectorAll('.mobile-nav-link');
    mobileLinks.forEach(link => {
        if (link.dataset.page === currentPageKey) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

// Handle navbar scroll effect
function handleNavbarScroll() {
    const navbar = document.querySelector('.robotics-navbar');
    if (navbar) {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }
}

// Load all components when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    // Load navbar
    loadComponent('navbar-placeholder', './components/navbar.html', function() {
        console.log('Navbar loaded successfully');
    });
    
    // Load footer
    loadComponent('footer-placeholder', './components/footer.html', function() {
        console.log('Footer loaded successfully');
    });
    
    // Add smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href.startsWith('#') && href.length > 1) {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });
});

// Export functions for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        loadComponent,
        initNavbar,
        initFooter,
        setActiveNavLink
    };
}