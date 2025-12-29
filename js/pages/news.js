/**
 * Robotics Club News System
 * Comprehensive JavaScript file for news page functionality
 * Combines all page-specific JS into one file for better management
 */

// Configuration
const CONFIG = {
    jsonPath: './data/news.json', // Path to JSON data file
    itemsPerPage: 6, // Items per section
    defaultFilters: {
        club: 'all',
        industry: 'all'
    }
};

// State management
let appState = {
    clubNews: [],
    industryNews: [],
    activeFilters: {
        club: 'all',
        industry: 'all'
    },
    newsletterSubscribers: JSON.parse(localStorage.getItem('newsletterSubscribers') || '[]')
};

// DOM Elements - will be initialized when DOM is loaded
let elements = {};

/**
 * Main initialization function
 */
function initNewsPage() {
    // Wait for DOM to be fully loaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        // DOM already loaded
        initialize();
    }
}

/**
 * Initialize all page functionality
 */
async function initialize() {
    try {
      
        // Initialize DOM element references
        initializeDOMElements();
        
        // Load news data
        await loadNewsData();
        
        // Initialize filters
        initializeFilters();
        
        // Render initial news
        renderClubNews();
        renderIndustryNews();
        
        // Setup newsletter subscription
        setupNewsletter();
        
        // Hide loading indicators
        hideLoadingIndicators();
        
        // Add CSS animations for newly loaded content
        addContentAnimations();
    } catch (error) {
        showError('Failed to load news. Please refresh the page.');
    }
}

/**
 * Initialize all DOM element references
 */
function initializeDOMElements() {
    elements = {
        clubNewsContainer: document.getElementById('club-news-container'),
        industryNewsContainer: document.getElementById('industry-news-container'),
        clubFilters: document.getElementById('club-filters'),
        industryFilters: document.getElementById('industry-filters'),
        newsletterForm: document.getElementById('newsletter-form'),
        loadingIndicators: {
            club: document.getElementById('club-news-loading'),
            industry: document.getElementById('industry-news-loading')
        },
        noResults: {
            club: document.getElementById('club-no-results'),
            industry: document.getElementById('industry-no-results')
        }
    }
}

/**
 * Load news data from JSON file
 */
async function loadNewsData() {
    try {
        // For development: Load from local JSON file
        const response = await fetch(CONFIG.jsonPath);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Store data in state
        appState.clubNews = data.clubNews || [];
        appState.industryNews = data.industryNews || [];
    
    }
    catch (error) {
    }
}

/**
 * Use fallback data when JSON file is not available
 */
function useFallbackData() {
    appState.clubNews = [
        {
            id: 1,
            title: "Welcome to Robotics Club News",
            type: "announcement",
            date: "2024-01-15",
            summary: "Welcome to our new news portal! This is sample data. Place your actual news in data/news.json",
            content: "This is sample club news data. In production, this will load from your JSON file or backend API.",
            author: "Admin",
            important: true,
            tags: ["welcome", "announcement"]
        },
        {
            id: 2,
            title: "Weekly Meeting Summary",
            type: "meeting",
            date: "2024-01-14",
            summary: "Discussed upcoming projects and assigned team leads for ROBOCON 2024 preparations.",
            content: "Meeting covered project timelines, resource allocation, and training schedules.",
            author: "Secretary",
            important: false,
            tags: ["meeting", "robocon", "planning"]
        }
    ];
    
    appState.industryNews = [
        {
            id: 101,
            title: "Latest Advancements in Robotics AI",
            source: "Robotics Today",
            date: "2024-01-12",
            summary: "New AI algorithms are making robots more autonomous and capable than ever before.",
            content: "Recent breakthroughs in machine learning are enabling robots to perform complex tasks with minimal human intervention.",
            readMoreLink: "#",
            category: "ai-ml",
            tags: ["ai", "machine-learning", "autonomous"]
        },
        {
            id: 102,
            title: "Open Source Robotics Tools",
            source: "Open Robotics",
            date: "2024-01-10",
            summary: "New open-source tools are making robotics more accessible to students and researchers.",
            content: "Community-driven projects are lowering the barrier to entry for robotics development.",
            readMoreLink: "#",
            category: "software",
            tags: ["open-source", "tools", "development"]
        }
    ];
}

/**
 * Initialize filter UI components
 */
function initializeFilters() {
    // Club News Filters
    if (elements.clubFilters) {
        const clubFilterTypes = ['all', 'announcement', 'meeting', 'update'];
        const clubFilterLabels = {
            'all': 'All News',
            'announcement': 'Announcements',
            'meeting': 'Meetings',
            'update': 'Updates'
        };
        
        clubFilterTypes.forEach(type => {
            const chip = createFilterChip(type, clubFilterLabels[type], 'club');
            elements.clubFilters.appendChild(chip);
        });
    }
    
    // Industry News Filters
    if (elements.industryFilters) {
        // Get unique sources from industry news
        const industrySources = ['all'];
        appState.industryNews.forEach(item => {
            if (item.source && !industrySources.includes(item.source)) {
                industrySources.push(item.source);
            }
        });
        
        industrySources.forEach(source => {
            const label = source === 'all' ? 'All Sources' : source;
            const chip = createFilterChip(source, label, 'industry');
            elements.industryFilters.appendChild(chip);
        });
    }
}

/**
 * Create a filter chip element
 */
function createFilterChip(value, label, type) {
    const chip = document.createElement('div');
    chip.className = `filter-chip ${value === 'all' ? 'active' : ''}`;
    chip.textContent = label;
    chip.dataset.value = value;
    chip.dataset.type = type;
    
    chip.addEventListener('click', () => {
        // Update active state
        document.querySelectorAll(`[data-type="${type}"]`).forEach(c => {
            c.classList.remove('active');
        });
        chip.classList.add('active');
        
        // Update filter state
        if (type === 'club') {
            appState.activeFilters.club = value;
            renderClubNews();
        } else {
            appState.activeFilters.industry = value;
            renderIndustryNews();
        }
    });
    
    return chip;
}

/**
 * Render club news based on current filter
 */
function renderClubNews() {
    if (!elements.clubNewsContainer) return;
    
    const filter = appState.activeFilters.club;
    
    // Filter news
    let filteredNews = appState.clubNews;
    if (filter !== 'all') {
        filteredNews = appState.clubNews.filter(item => item.type === filter);
    }
    
    // Sort by date (newest first)
    filteredNews.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    // Clear container
    elements.clubNewsContainer.innerHTML = '';
    
    // Show/hide no results message
    if (filteredNews.length === 0) {
        if (elements.noResults.club) {
            elements.noResults.club.classList.remove('hidden');
        }
        return;
    } else {
        if (elements.noResults.club) {
            elements.noResults.club.classList.add('hidden');
        }
    }
    
    // Render news cards
    filteredNews.forEach((newsItem, index) => {
        const card = createClubNewsCard(newsItem);
        // Add animation delay for staggered effect
        card.style.animationDelay = `${index * 0.1}s`;
        card.classList.add('animate-fade-in-up');
        elements.clubNewsContainer.appendChild(card);
    });
}

/**
 * Render industry news based on current filter
 */
function renderIndustryNews() {
    if (!elements.industryNewsContainer) return;
    
    const filter = appState.activeFilters.industry;
    
    // Filter news
    let filteredNews = appState.industryNews;
    if (filter !== 'all') {
        filteredNews = appState.industryNews.filter(item => item.source === filter);
    }
    
    // Sort by date (newest first)
    filteredNews.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    // Clear container
    elements.industryNewsContainer.innerHTML = '';
    
    // Show/hide no results message
    if (filteredNews.length === 0) {
        if (elements.noResults.industry) {
            elements.noResults.industry.classList.remove('hidden');
        }
        return;
    } else {
        if (elements.noResults.industry) {
            elements.noResults.industry.classList.add('hidden');
        }
    }
    
    // Render news cards
    filteredNews.forEach((newsItem, index) => {
        const card = createIndustryNewsCard(newsItem);
        // Add animation delay for staggered effect
        card.style.animationDelay = `${index * 0.1}s`;
        card.classList.add('animate-fade-in-up');
        elements.industryNewsContainer.appendChild(card);
    });
}

/**
 * Create a club news card element
 */
function createClubNewsCard(newsItem) {
    const card = document.createElement('div');
    card.className = 'news-card rounded-2xl p-6 flex flex-col h-full';
    
    // Format date
    const date = new Date(newsItem.date);
    const formattedDate = date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
    
    // Determine badge class based on type
    let badgeClass = '';
    let badgeText = '';
    switch(newsItem.type) {
        case 'announcement':
            badgeClass = 'badge-announcement';
            badgeText = 'Announcement';
            break;
        case 'meeting':
            badgeClass = 'badge-meeting';
            badgeText = 'Meeting';
            break;
        case 'update':
            badgeClass = 'badge-update';
            badgeText = 'Update';
            break;
        default:
            badgeClass = 'badge-club';
            badgeText = 'Club News';
    }
    
    card.innerHTML = `
        <!-- Header -->
        <div class="mb-4">
            <div class="flex justify-between items-start mb-3">
                <span class="badge ${badgeClass}">
                    ${badgeText}
                </span>
                ${newsItem.important ? '<span class="text-red-400 text-sm"><i class="fas fa-exclamation-circle mr-1"></i>Important</span>' : ''}
            </div>
            <h3 class="text-xl font-orbitron font-bold text-white mb-2">
                ${escapeHTML(newsItem.title)}
            </h3>
            <div class="flex items-center text-gray-400 text-sm mb-4">
                <i class="far fa-calendar mr-2"></i>
                <span class="mr-4">${formattedDate}</span>
                <i class="far fa-user mr-2"></i>
                <span>${escapeHTML(newsItem.author)}</span>
            </div>
        </div>
        
        <!-- Content -->
        <div class="flex-grow">
            <p class="text-gray-300 mb-4">
                ${escapeHTML(newsItem.summary)}
            </p>
            ${newsItem.tags && newsItem.tags.length > 0 ? `
                <div class="flex flex-wrap gap-2 mb-4">
                    ${newsItem.tags.map(tag => `
                        <span class="px-3 py-1 bg-gray-800 rounded-full text-xs text-gray-300">
                            ${escapeHTML(tag)}
                        </span>
                    `).join('')}
                </div>
            ` : ''}
        </div>
        
        <!-- Footer -->
        <div class="pt-4 border-t border-gray-800 mt-auto">
            <button class="text-robotics-gold hover:text-robotics-light-blue transition font-medium text-sm flex items-center read-more-btn"
                data-id="${newsItem.id}"
                data-type="club">
                Read More <i class="fas fa-chevron-right ml-2 text-xs"></i>
            </button>
        </div>
    `;
    
    return card;
}

/**
 * Create an industry news card element
 */
function createIndustryNewsCard(newsItem) {
    const card = document.createElement('div');
    card.className = 'news-card rounded-2xl p-6 flex flex-col h-full';
    
    // Format date
    const date = new Date(newsItem.date);
    const formattedDate = date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
    
    card.innerHTML = `
        <!-- Header -->
        <div class="mb-4">
            <div class="flex justify-between items-start mb-3">
                <span class="badge badge-industry">
                    ${escapeHTML(newsItem.source)}
                </span>
                <span class="text-gray-400 text-sm">${formattedDate}</span>
            </div>
            <h3 class="text-xl font-orbitron font-bold text-white mb-2">
                ${escapeHTML(newsItem.title)}
            </h3>
            <div class="text-gray-400 text-sm mb-4">
                <i class="fas fa-tag mr-2"></i>
                <span>${newsItem.category ? escapeHTML(newsItem.category.charAt(0).toUpperCase() + newsItem.category.slice(1)) : 'General'}</span>
            </div>
        </div>
        
        <!-- Content -->
        <div class="flex-grow">
            <p class="text-gray-300 mb-4">
                ${escapeHTML(newsItem.summary)}
            </p>
            ${newsItem.tags && newsItem.tags.length > 0 ? `
                <div class="flex flex-wrap gap-2 mb-4">
                    ${newsItem.tags.map(tag => `
                        <span class="px-3 py-1 bg-gray-800 rounded-full text-xs text-gray-300">
                            ${escapeHTML(tag)}
                        </span>
                    `).join('')}
                </div>
            ` : ''}
        </div>
        
        <!-- Footer -->
        <div class="pt-4 border-t border-gray-800 mt-auto">
            <a href="${escapeHTML(newsItem.readMoreLink)}" 
               target="_blank" 
               rel="noopener noreferrer"
               class="text-robotics-light-blue hover:text-robotics-gold transition font-medium text-sm flex items-center">
                Read Full Article <i class="fas fa-external-link-alt ml-2 text-xs"></i>
            </a>
        </div>
    `;
    
    return card;
}

/**
 * Setup newsletter subscription form
 */
function setupNewsletter() {
    
    elements.newsletterForm.addEventListener('submit', handleNewsletterSubmit);
    
    // Add event listener for "Read More" buttons (event delegation)
    document.addEventListener('click', function(e) {
        if (e.target.closest('.read-more-btn')) {
            const button = e.target.closest('.read-more-btn');
            const id = button.dataset.id;
            const type = button.dataset.type;
            showNewsDetail(id, type);
        }
    });
}

/**
 * Handle newsletter form submission
 */
function handleNewsletterSubmit(e) {
    e.preventDefault();
    
    const emailInput = document.getElementById('email-input');
    if (!emailInput) return;
    
    const email = emailInput.value.trim();
    
    // Basic email validation
    if (!isValidEmail(email)) {
        showNewsletterError('Please enter a valid email address');
        return;
    }
    
    // Check if already subscribed
    if (appState.newsletterSubscribers.includes(email)) {
        showNewsletterError('This email is already subscribed');
        return;
    }
    
    try {
        // In production, this would send to a backend API
        // For now, store in localStorage
        appState.newsletterSubscribers.push(email);
        localStorage.setItem('newsletterSubscribers', JSON.stringify(appState.newsletterSubscribers));
        
        // Show success message
        showNewsletterSuccess();
        
        // Reset form
        emailInput.value = '';
        
    } catch (error) {
        showNewsletterError('Subscription failed. Please try again.');
    }
}

/**
 * Show newsletter success message
 */
function showNewsletterSuccess() {
    const successEl = document.getElementById('newsletter-success');
    const errorEl = document.getElementById('newsletter-error');
    
    if (!successEl || !errorEl) return;
    
    errorEl.classList.add('hidden');
    successEl.classList.remove('hidden');
    
    // Hide success message after 5 seconds
    setTimeout(() => {
        successEl.classList.add('hidden');
    }, 5000);
}

/**
 * Show newsletter error message
 */
function showNewsletterError(message) {
    const successEl = document.getElementById('newsletter-success');
    const errorEl = document.getElementById('newsletter-error');
    const errorMessageEl = document.getElementById('error-message');
    
    if (!successEl || !errorEl || !errorMessageEl) return;
    
    successEl.classList.add('hidden');
    errorMessageEl.textContent = message;
    errorEl.classList.remove('hidden');
    
    // Hide error message after 5 seconds
    setTimeout(() => {
        errorEl.classList.add('hidden');
    }, 5000);
}

/**
 * Validate email format
 */
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Hide loading indicators
 */
function hideLoadingIndicators() {
    if (elements.loadingIndicators) {
        Object.values(elements.loadingIndicators).forEach(el => {
            if (el) el.style.display = 'none';
        });
    }
}

/**
 * Show detailed news view
 */
function showNewsDetail(id, type) {
    const newsItem = type === 'club' 
        ? appState.clubNews.find(item => item.id === parseInt(id))
        : appState.industryNews.find(item => item.id === parseInt(id));
    
    if (!newsItem) return;
    
    // Create modal for detailed view
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4';
    modal.innerHTML = `
        <div class="bg-robotics-blue rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div class="p-6">
                <!-- Header -->
                <div class="flex justify-between items-start mb-6">
                    <div>
                        <span class="badge ${type === 'club' ? 'badge-club' : 'badge-industry'}">
                            ${type === 'club' ? 'Club News' : newsItem.source}
                        </span>
                        <h2 class="text-2xl font-orbitron font-bold text-white mt-3">
                            ${escapeHTML(newsItem.title)}
                        </h2>
                        <div class="flex items-center text-gray-400 text-sm mt-2">
                            <i class="far fa-calendar mr-2"></i>
                            <span>${new Date(newsItem.date).toLocaleDateString()}</span>
                            ${type === 'club' ? `<i class="far fa-user ml-4 mr-2"></i><span>${escapeHTML(newsItem.author)}</span>` : ''}
                        </div>
                    </div>
                    <button class="text-gray-400 hover:text-white text-2xl close-modal">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                
                <!-- Content -->
                <div class="text-gray-300 mb-6">
                    <p class="mb-4">${escapeHTML(newsItem.summary)}</p>
                    <p>${escapeHTML(newsItem.content || 'Full content would appear here.')}</p>
                </div>
                
                ${newsItem.tags && newsItem.tags.length > 0 ? `
                    <div class="flex flex-wrap gap-2 mb-6">
                        ${newsItem.tags.map(tag => `
                            <span class="px-3 py-1 bg-gray-800 rounded-full text-xs text-gray-300">
                                ${escapeHTML(tag)}
                            </span>
                        `).join('')}
                    </div>
                ` : ''}
                
                <!-- Footer -->
                <div class="pt-6 border-t border-gray-800 flex justify-between items-center">
                    ${type === 'industry' ? `
                        <a href="${escapeHTML(newsItem.readMoreLink)}" 
                           target="_blank" 
                           rel="noopener noreferrer"
                           class="text-robotics-light-blue hover:text-robotics-gold transition font-medium">
                            <i class="fas fa-external-link-alt mr-2"></i>Read Original Article
                        </a>
                    ` : '<div></div>'}
                    <button class="px-6 py-2 cta-button secondary close-modal">
                        Close
                    </button>
                </div>
            </div>
        </div>
    `;
    
    // Add to document
    document.body.appendChild(modal);
    
    // Add event listeners for closing modal
    modal.querySelectorAll('.close-modal').forEach(button => {
        button.addEventListener('click', () => {
            document.body.removeChild(modal);
        });
    });
    
    // Close modal when clicking outside content
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            document.body.removeChild(modal);
        }
    });
    
    // Close modal with Escape key
    const closeModal = () => document.body.removeChild(modal);
    const handleEscape = (e) => {
        if (e.key === 'Escape') closeModal();
    };
    
    document.addEventListener('keydown', handleEscape);
    modal.dataset.escapeHandler = handleEscape;
}

/**
 * Add CSS animations for newly loaded content
 */
function addContentAnimations() {
    // Add animation classes to filter chips
    document.querySelectorAll('.filter-chip').forEach((chip, index) => {
        chip.classList.add('animate-fade-in-up');
        chip.style.animationDelay = `${index * 0.05}s`;
    });
}

/**
 * Escape HTML to prevent XSS
 */
function escapeHTML(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

/**
 * Show error message to user
 */
function showError(message) {
    // Remove existing error banners
    document.querySelectorAll('.error-banner').forEach(banner => banner.remove());
    
    // Create error banner
    const errorBanner = document.createElement('div');
    errorBanner.className = 'error-banner fixed top-20 left-1/2 transform -translate-x-1/2 bg-red-600 text-white px-6 py-3 rounded-lg shadow-lg z-50';
    errorBanner.innerHTML = `
        <div class="flex items-center gap-3">
            <i class="fas fa-exclamation-circle"></i>
            <span>${escapeHTML(message)}</span>
            <button class="ml-4 close-error">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
    
    document.body.appendChild(errorBanner);
    
    // Add close functionality
    errorBanner.querySelector('.close-error').addEventListener('click', () => {
        errorBanner.remove();
    });
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (errorBanner.parentNode) {
            errorBanner.remove();
        }
    }, 5000);
}

/**
 * API simulation for backend integration
 * This demonstrates how the code would work with a real backend
 */
class NewsAPI {
    static async fetchNews() {
        // Simulate API call
        return new Promise(resolve => {
            setTimeout(() => {
                resolve({
                    clubNews: appState.clubNews,
                    industryNews: appState.industryNews
                });
            }, 500);
        });
    }
    
    static async subscribeToNewsletter(email) {
        // Simulate API call
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // Simulate random failure
                if (Math.random() > 0.1) {
                    resolve({ success: true, message: 'Subscribed successfully' });
                } else {
                    reject(new Error('Subscription failed'));
                }
            }, 1000);
        });
    }
}

// Initialize the page
initNewsPage();

// Export for potential module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { initNewsPage, NewsAPI };
}