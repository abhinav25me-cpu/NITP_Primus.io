/**
 * Robotics Club NIT Patna - Achievements Page JavaScript
 * Handles dynamic loading of achievements data, filtering, modals, and timeline
 */

// Global variables
let achievementsData = [];
let filteredAchievements = [];
let currentFilter = 'all';

// DOM Elements
const achievementsGrid = document.getElementById('achievements-grid');
const filterButtons = document.querySelectorAll('.filter-btn');
const statsNumbers = document.querySelectorAll('.stats-number');
const timelineContainer = document.getElementById('timeline-container');
const achievementModal = document.getElementById('achievement-modal');
const modalContent = document.querySelector('.modal-content');
const modalClose = document.querySelector('.modal-close');

/**
 * Initialize the achievements page
 */
document.addEventListener('DOMContentLoaded', async function () {

    try {
        // Load achievements data from JSON file
        await loadAchievementsData();

        // Initialize page components
        initializeFilterButtons();
        renderAchievementsGrid();
        initStatsCounters();
        initializeTimeline();

        // Add scroll event listener for timeline animation
        window.addEventListener('scroll', animateTimelineItems);

        // Trigger initial animation
        animateTimelineItems();

    } catch (error) {
        showErrorMessage('Failed to load achievements data. Please try again later.');
    }
});

/**
 * Load achievements data from JSON file
 */
async function loadAchievementsData() {
    const response = await fetch('./data/achievements.json');
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    achievementsData = data.achievements;
    filteredAchievements = [...achievementsData];
}

/**
 * Create sample data if JSON file is not available
 */
function createSampleData() {

    achievementsData = [
        {
            id: 1,
            category: 'competition',
            name: 'National Robotics Championship 2023',
            year: 2023,
            achievement: '1st Place Overall',
            description: 'Secured first position in autonomous robotics category.',
            brief_description: 'Won national robotics championship',
            thumbnail: '',
            team_members: ['Rahul Sharma', 'Priya Singh', 'Amit Kumar'],
            details: {
                competition_name: 'National Robotics Championship 2023',
                organizer: 'IIT Bombay',
                location: 'Mumbai, India',
                prize: '₹1,00,000 + Trophy',
                highlights: ['Built autonomous robot', 'Implemented computer vision'],
                technologies: ['ROS', 'Python', 'OpenCV']
            }
        },
        {
            id: 2,
            category: 'research',
            name: 'AI-Powered Agricultural Robot',
            year: 2022,
            achievement: 'Research Paper Published',
            description: 'Published research paper in IEEE Journal.',
            brief_description: 'Published IEEE paper on agricultural robotics',
            thumbnail: '',
            team_members: ['Dr. A. K. Sharma', 'Vikram Reddy'],
            details: {
                journal_name: 'IEEE Transactions on Robotics',
                impact_factor: 6.8,
                highlights: ['Developed ML model', 'Created autonomous navigation'],
                technologies: ['TensorFlow', 'ROS', 'Python']
            }
        }
    ];

    filteredAchievements = [...achievementsData];
}

/**
 * Initialize filter buttons with click handlers
 */
function initializeFilterButtons() {
    filterButtons.forEach(button => {
        button.addEventListener('click', function () {
            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');

            // Update filter
            currentFilter = this.dataset.filter;

            // Filter achievements
            if (currentFilter === 'all') {
                filteredAchievements = [...achievementsData];
            } else {
                filteredAchievements = achievementsData.filter(
                    achievement => achievement.category === currentFilter
                );
            }

            // Re-render grid
            renderAchievementsGrid();
        });
    });
}

/**
 * Render achievements grid based on current filter
 */
function renderAchievementsGrid() {
    if (!achievementsGrid) return;

    // Show loading state
    achievementsGrid.innerHTML = `
        <div class="col-span-full flex justify-center py-10">
            <div class="loading-spinner"></div>
        </div>
    `;

    // Simulate loading delay for better UX
    setTimeout(() => {
        if (filteredAchievements.length === 0) {
            achievementsGrid.innerHTML = `
                <div class="col-span-full text-center py-16">
                    <i class="fas fa-trophy text-5xl text-gray-600 mb-6"></i>
                    <h3 class="text-2xl font-orbitron text-white mb-3">No Achievements Found</h3>
                    <p class="text-gray-400">No achievements match the selected filter.</p>
                </div>
            `;
            return;
        }

        // Group achievements by category
        const achievementsByCategory = groupAchievementsByCategory(filteredAchievements);

        // Generate HTML for each category section
        let gridHTML = '';

        // Competition Section
        gridHTML += renderCategorySection('competition', 'Competition Wins', achievementsByCategory.competition || []);

        // Research Section
        gridHTML += renderCategorySection('research', 'Research Publications', achievementsByCategory.research || []);

        // Innovation Section
        gridHTML += renderCategorySection('innovation', 'Innovations & Patents', achievementsByCategory.innovation || []);

        // Grants & Awards Section
        gridHTML += renderCategorySection('grants_awards', 'Grants & Awards', achievementsByCategory.grants_awards || []);

        achievementsGrid.innerHTML = gridHTML;

        // Add click handlers to achievement cards
        addAchievementCardClickHandlers();

    }, 300); // Small delay for better UX
}

/**
 * Group achievements by category
 */
function groupAchievementsByCategory(achievements) {
    return achievements.reduce((groups, achievement) => {
        const category = achievement.category;
        if (!groups[category]) {
            groups[category] = [];
        }
        groups[category].push(achievement);
        return groups;
    }, {});
}

/**
 * Render HTML for a category section
 */
function renderCategorySection(category, title, achievements) {
    if (achievements.length === 0) return '';

    return `
        <div class="col-span-full mb-16" id="${category}-section">
            <!-- Section Header -->
            <div class="flex items-center gap-4 mb-10">
                <div class="w-16 h-1 bg-gradient-to-r from-${getCategoryColor(category)} to-${getCategoryColor(category)}/50 rounded-full"></div>
                <h2 class="text-3xl font-orbitron font-bold text-white">
                    ${title}
                </h2>
                <div class="flex-1 h-1 bg-gradient-to-r from-${getCategoryColor(category)}/50 to-transparent rounded-full"></div>
                <div class="text-${getCategoryColor(category)} font-orbitron font-bold text-lg">
                    ${achievements.length} Achievements
                </div>
            </div>
            
            <!-- Achievements Grid -->
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                ${achievements.map(achievement => renderAchievementCard(achievement)).join('')}
            </div>
        </div>
    `;
}

/**
 * Get color class for category
 */
function getCategoryColor(category) {
    const colors = {
        competition: 'robotics-light-blue',
        research: 'green-500',
        innovation: 'robotics-light-blue',
        grants_awards: 'robotics-gold'
    };
    return colors[category] || 'robotics-gold';
}

/**
 * Render individual achievement card
 */
function renderAchievementCard(achievement) {
    const categoryClass = `category-${achievement.category}`;
    const categoryLabels = {
        competition: 'Competition',
        research: 'Research',
        innovation: 'Innovation',
        grants_awards: 'Grant/Award'
    };

    return `
        <div class="achievement-card group cursor-pointer" data-id="${achievement.id}">
            <!-- Category Badge -->
            <div class="${categoryClass} category-badge">
                ${categoryLabels[achievement.category]}
            </div>
            
            <!-- Thumbnail -->
            <div class="mb-4 overflow-hidden rounded-lg">
                <img 
                    src="${achievement.thumbnail}" 
                    alt="${achievement.name}"
                    class="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                >
            </div>
            
            <!-- Year Badge -->
            <div class="absolute top-4 right-4 bg-robotics-blue/90 backdrop-blur-sm px-3 py-1 rounded-full">
                <span class="text-robotics-gold font-bold font-orbitron">${achievement.year}</span>
            </div>
            
            <!-- Achievement Details -->
            <h3 class="text-xl font-orbitron font-bold text-white mb-3 group-hover:text-robotics-gold transition-colors">
                ${achievement.name}
            </h3>
            
            <div class="text-robotics-gold font-semibold mb-3">
                <i class="fas fa-trophy mr-2"></i>
                ${achievement.achievement}
            </div>
            
            <p class="text-gray-300 text-sm mb-4 line-clamp-2">
                ${achievement.brief_description || achievement.description}
            </p>
            
            <!-- Team Members (Truncated) -->
            <div class="mt-4 pt-4 border-t border-gray-700/50">
                <div class="flex items-center text-sm text-gray-400">
                    <i class="fas fa-users mr-2"></i>
                    <span class="truncate">
                        ${achievement.team_members.slice(0, 2).join(', ')}
                        ${achievement.team_members.length > 2 ? ` +${achievement.team_members.length - 2} more` : ''}
                    </span>
                </div>
            </div>
            
            <!-- View Details Button -->
            <div class="mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div class="inline-flex items-center text-robotics-gold text-sm font-semibold">
                    View Details
                    <i class="fas fa-arrow-right ml-2 transform group-hover:translate-x-2 transition-transform"></i>
                </div>
            </div>
        </div>
    `;
}

/**
 * Add click handlers to achievement cards
 */
function addAchievementCardClickHandlers() {
    document.querySelectorAll('.achievement-card').forEach(card => {
        card.addEventListener('click', function () {
            const achievementId = parseInt(this.dataset.id);
            const achievement = achievementsData.find(a => a.id === achievementId);

            if (achievement) {
                openAchievementModal(achievement);
            }
        });
    });
}

/**
 * Animate counter from 0 to target value
 */
function animateCounter(element, target) {
    if (!element) return;

    let current = 0;
    const increment = target / 50; // 50 steps
    const duration = 1500; // 1.5 seconds

    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        element.textContent = Math.floor(current).toLocaleString();
    }, duration / 50);
}

/**
 * Initialize timeline with ALL FEATURED achievements for every year
 */
function initializeTimeline() {
    // Show loading state
    timelineContainer.innerHTML = `
        <div class="flex justify-center py-10">
            <div class="loading-spinner"></div>
        </div>
    `;

    // Get ONLY FEATURED achievements
    const featuredAchievements = achievementsData.filter(achievement =>
        achievement.timeline === true
    );

    // Check if we have any featured achievements
    if (featuredAchievements.length === 0) {
        timelineContainer.innerHTML = `
            <div class="text-center py-16">
                <i class="fas fa-star text-5xl text-gray-600 mb-6"></i>
                <h3 class="text-2xl font-orbitron text-white mb-3">No Featured Timeline Achievements</h3>
                <p class="text-gray-400">Mark achievements as "timeline: true" in the JSON to display them here.</p>
                <div class="mt-6 inline-block bg-robotics-blue/30 border border-robotics-gold/20 rounded-xl p-4">
                    <code class="text-sm text-gray-300">"timeline": true</code>
                </div>
            </div>
        `;
        return;
    }

    // Group featured timeline achievements by year
    const achievementsByYear = {};
    featuredAchievements.forEach(achievement => {
        if (!achievementsByYear[achievement.year]) {
            achievementsByYear[achievement.year] = [];
        }
        achievementsByYear[achievement.year].push(achievement);
    });

    // Sort years in descending order (newest first)
    const sortedYears = Object.keys(achievementsByYear).sort((a, b) => b - a);

    // Generate timeline HTML
    let timelineHTML = '<div class="timeline-line"></div>';

    let itemIndex = 0;
    sortedYears.forEach((year, yearIndex) => {
        const yearAchievements = achievementsByYear[year];
        const achievementCount = yearAchievements.length;

        // For EACH featured achievement in this year, create a timeline item
        yearAchievements.forEach((achievement, achievementIndex) => {
            const isLeft = itemIndex % 2 === 0;
            const positionClass = isLeft ? 'left' : 'right';

            // Calculate position offset for multiple achievements in same year
            const offsetClass = achievementIndex > 0 ? `mt-${Math.min(achievementIndex * 4, 12)}` : '';

            timelineHTML += `
                <div class="timeline-item ${positionClass} ${offsetClass}" data-year="${achievement.year}" data-index="${itemIndex}">
                    <div class="timeline-dot ${achievementIndex === 0 ? 'featured-main' : 'featured-secondary'}"></div>
                    <div class="bg-robotics-blue/50 backdrop-blur-sm border border-robotics-gold/20 rounded-xl p-6 hover:border-robotics-gold/40 transition-all duration-300 hover:shadow-lg hover:shadow-orange-500/10">
                        <!-- Year Header (only show for first achievement of the year) -->
                        ${achievementIndex === 0 ? `
                            <div class="flex items-center justify-between mb-4 pb-4 border-b border-gray-700/50">
                                <div class="flex items-center gap-3">
                                    <div class="text-3xl font-orbitron font-bold text-robotics-gold">
                                        ${year}
                                    </div>
                                </div>
                                ${yearIndex === 0 ? `
                                    <div class="flex items-center gap-1 bg-gradient-to-r from-orange-500/20 to-red-500/20 border border-orange-500/30 rounded-full px-3 py-1">
                                        <i class="fas fa-fire text-xs text-orange-500"></i>
                                        <span class="text-orange-500 text-xs font-orbitron font-bold">LATEST</span>
                                    </div>
                                ` : ''}
                            </div>
                        ` : ''}
                        
                        <!-- Achievement Index Badge -->
                        <div class="flex items-center justify-between mb-3">
                            <div class="${`category-${achievement.category}`} category-badge">
                                ${achievement.category.charAt(0).toUpperCase() + achievement.category.slice(1)}
                            </div>
                            <div class="text-xs text-gray-400">
                                #${achievementIndex + 1} of ${achievementCount}
                            </div>
                        </div>
                        
                        <!-- Achievement Name -->
                        <h3 class="text-xl font-orbitron font-bold text-white mb-2 hover:text-robotics-gold transition-colors">
                            ${achievement.name}
                        </h3>
                        
                        <!-- Achievement Type -->
                        <div class="flex items-center gap-2 text-robotics-gold font-semibold mb-3">
                            <i class="fas fa-${getAchievementIcon(achievement.category)}"></i>
                            <span>${achievement.achievement}</span>
                        </div>
                        
                        <!-- Brief Description -->
                        <p class="text-gray-300 text-sm mb-4">
                            ${achievement.brief_description || achievement.description}
                        </p>
                        
                        <!-- Quick Stats -->
                        <div class="grid grid-cols-2 gap-3 mb-4">
                            <div class="flex items-center gap-2">
                                <div class="w-8 h-8 bg-robotics-gold/10 rounded-lg flex items-center justify-center">
                                    <i class="fas fa-users text-sm text-robotics-gold"></i>
                                </div>
                                <div>
                                    <div class="text-xs text-gray-400">Team Size</div>
                                    <div class="text-white font-bold">${achievement.team_members.length}</div>
                                </div>
                            </div>
                            <div class="flex items-center gap-2">
                                <div class="w-8 h-8 bg-robotics-light-blue/10 rounded-lg flex items-center justify-center">
                                    <i class="fas fa-trophy text-sm text-robotics-light-blue"></i>
                                </div>
                                <div>
                                    <div class="text-xs text-gray-400">Type</div>
                                    <div class="text-white font-bold">${getAchievementType(achievement.category)}</div>
                                </div>
                            </div>
                        </div>
                        
                        <!-- View Details Button -->
                        <button class="view-timeline-detail w-full mt-4 px-4 py-3 bg-gradient-to-r from-robotics-gold/10 to-${getCategoryGradient(achievement.category)}/10 hover:from-robotics-gold/20 hover:to-${getCategoryGradient(achievement.category)}/20 border border-robotics-gold/30 rounded-lg text-robotics-gold text-sm font-orbitron font-bold hover:text-white transition-all duration-300 hover:shadow-lg hover:shadow-${getCategoryGradient(achievement.category)}/20 group"
                                data-id="${achievement.id}">
                            <div class="flex items-center justify-center gap-2">
                                <span>View Full Details</span>
                                <i class="fas fa-arrow-right group-hover:translate-x-2 transition-transform"></i>
                            </div>
                        </button>
                    </div>
                </div>
            `;

            itemIndex++;
        });

        // Add year separator if there are multiple years and this isn't the last year
        if (yearIndex < sortedYears.length - 1 && yearAchievements.length > 0) {
            timelineHTML += `
                <div class="col-span-full flex justify-center my-8">
                    <div class="h-1 w-32 bg-gradient-to-r from-transparent via-robotics-gold/30 to-transparent rounded-full"></div>
                </div>
            `;
        }
    });

    timelineContainer.innerHTML = timelineHTML;

    // Add click handlers to timeline detail buttons
    setTimeout(() => {
        document.querySelectorAll('.view-timeline-detail').forEach(button => {
            button.addEventListener('click', function (e) {
                e.stopPropagation();
                const achievementId = parseInt(this.dataset.id);
                const achievement = achievementsData.find(a => a.id === achievementId);

                if (achievement) {
                    openAchievementModal(achievement);
                }
            });
        });

        // Trigger initial animation
        setTimeout(animateTimelineItems, 50);
    }, 50);
}

/**
 * Helper function to get icon for achievement category
 */
function getAchievementIcon(category) {
    const icons = {
        competition: 'flag-checkered',
        research: 'book',
        innovation: 'lightbulb',
        grants_awards: 'award'
    };
    return icons[category] || 'trophy';
}

/**
 * Helper function to get display type for achievement category
 */
function getAchievementType(category) {
    const types = {
        competition: 'Competition',
        research: 'Research',
        innovation: 'Innovation',
        grants_awards: 'Award'
    };
    return types[category] || 'Achievement';
}

/**
 * Helper function to get gradient color for category
 */
function getCategoryGradient(category) {
    const gradients = {
        competition: 'robotics-light-blue',
        research: 'green-500',
        innovation: 'robotics-light-blue',
        grants_awards: 'orange-500'
    };
    return gradients[category] || 'robotics-gold';
}


/**
 * Animate timeline items on scroll
 */
function animateTimelineItems() {
    const timelineItems = document.querySelectorAll('.timeline-item');

    if (timelineItems.length === 0) return;

    timelineItems.forEach(item => {
        const rect = item.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight * 0.85;

        if (isVisible) {
            item.classList.add('visible');
        }
    });
}

/**
 * Open achievement modal with detailed view
 */
function openAchievementModal(achievement) {
    if (!achievementModal || !modalContent) return;

    // Generate modal content
    modalContent.innerHTML = generateModalContent(achievement);

    // Show modal
    achievementModal.classList.add('active');
    document.body.style.overflow = 'hidden'; // Prevent scrolling

    // Add click handler to close button
    document.querySelector('.modal-close').addEventListener('click', closeAchievementModal);
}

/**
 * Generate modal content HTML
 */
function generateModalContent(achievement) {
    const categoryLabels = {
        competition: 'Competition Win',
        research: 'Research Publication',
        innovation: 'Innovation & Patent',
        grants_awards: 'Grant & Award'
    };

    return `
        <div class="modal-close">
            <i class="fas fa-times"></i>
        </div>
        
        <div class="mb-8">
            <div class="flex items-center gap-4 mb-6">
                <div class="${`category-${achievement.category}`} category-badge text-lg px-4 py-2">
                    ${categoryLabels[achievement.category]}
                </div>
                <div class="text-3xl font-orbitron font-bold text-robotics-gold">
                    ${achievement.year}
                </div>
            </div>
            
            <h2 class="text-3xl md:text-4xl font-orbitron font-bold text-white mb-6">
                ${achievement.name}
            </h2>
            
            <div class="text-2xl font-bold text-robotics-gold mb-8">
                <i class="fas fa-trophy mr-3"></i>
                ${achievement.achievement}
            </div>
        </div>
        
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <!-- Left Column: Image & Basic Info -->
            <div>
                <div class="mb-6 overflow-hidden rounded-xl">
                    <img 
                        src="${achievement.thumbnail}" 
                        alt="${achievement.name}"
                        class="w-full h-64 object-cover"
                        loading="lazy"
                    >
                </div>
                
                <div class="mb-6">
                    <h3 class="text-xl font-orbitron font-bold text-white mb-4">
                        <i class="fas fa-info-circle text-robotics-light-blue mr-2"></i>
                        Description
                    </h3>
                    <p class="text-gray-300">
                        ${achievement.description}
                    </p>
                </div>
                
                <!-- Team Members -->
                <div>
                    <h3 class="text-xl font-orbitron font-bold text-white mb-4">
                        <i class="fas fa-users text-robotics-gold mr-2"></i>
                        Team Members
                    </h3>
                    <div class="team-members">
                        ${achievement.team_members.map(member => `
                            <div class="team-member">${member}</div>
                        `).join('')}
                    </div>
                </div>
            </div>
            
            <!-- Right Column: Detailed Information -->
            <div>
                ${generateDetailedInfo(achievement)}
            </div>
        </div>
    `;
}

/**
 * Generate detailed information based on category
 */
function generateDetailedInfo(achievement) {
    const details = achievement.details;

    switch (achievement.category) {
        case 'competition':
            return `
                <div class="mb-6">
                    <h3 class="text-xl font-orbitron font-bold text-white mb-4">
                        <i class="fas fa-flag-checkered text-robotics-light-blue mr-2"></i>
                        Competition Details
                    </h3>
                    <div class="space-y-3">
                        <div class="flex justify-between">
                            <span class="text-gray-400">Competition:</span>
                            <span class="text-white font-semibold">${details.competition_name}</span>
                        </div>
                        <div class="flex justify-between">
                            <span class="text-gray-400">Organizer:</span>
                            <span class="text-white">${details.organizer}</span>
                        </div>
                        <div class="flex justify-between">
                            <span class="text-gray-400">Location:</span>
                            <span class="text-white">${details.location}</span>
                        </div>
                        <div class="flex justify-between">
                            <span class="text-gray-400">Prize:</span>
                            <span class="text-robotics-gold font-bold">${details.prize}</span>
                        </div>
                    </div>
                </div>
                
                <div class="mb-6">
                    <h3 class="text-xl font-orbitron font-bold text-white mb-4">
                        <i class="fas fa-star text-robotics-gold mr-2"></i>
                        Key Highlights
                    </h3>
                    <ul class="space-y-2">
                        ${details.highlights.map(highlight => `
                            <li class="flex items-start gap-2">
                                <i class="fas fa-check text-green-400 mt-1"></i>
                                <span class="text-gray-300">${highlight}</span>
                            </li>
                        `).join('')}
                    </ul>
                </div>
                
                <div>
                    <h3 class="text-xl font-orbitron font-bold text-white mb-4">
                        <i class="fas fa-code text-robotics-light-blue mr-2"></i>
                        Technologies Used
                    </h3>
                    <div class="flex flex-wrap gap-2">
                        ${details.technologies.map(tech => `
                            <span class="tech-tag">${tech}</span>
                        `).join('')}
                    </div>
                </div>
            `;

        case 'research':
            return `
                <div class="mb-6">
                    <h3 class="text-xl font-orbitron font-bold text-white mb-4">
                        <i class="fas fa-book text-green-500 mr-2"></i>
                        Publication Details
                    </h3>
                    <div class="space-y-3">
                        <div class="flex justify-between">
                            <span class="text-gray-400">Journal/Conference:</span>
                            <span class="text-white font-semibold">${details.journal_name}</span>
                        </div>
                        ${details.impact_factor ? `
                            <div class="flex justify-between">
                                <span class="text-gray-400">Impact Factor:</span>
                                <span class="text-white">${details.impact_factor}</span>
                            </div>
                        ` : ''}
                        ${details.doi ? `
                            <div class="flex justify-between">
                                <span class="text-gray-400">DOI:</span>
                                <span class="text-white">${details.doi}</span>
                            </div>
                        ` : ''}
                        ${details.citation_count ? `
                            <div class="flex justify-between">
                                <span class="text-gray-400">Citations:</span>
                                <span class="text-white">${details.citation_count}</span>
                            </div>
                        ` : ''}
                    </div>
                </div>
                
                <div class="mb-6">
                    <h3 class="text-xl font-orbitron font-bold text-white mb-4">
                        <i class="fas fa-star text-robotics-gold mr-2"></i>
                        Research Highlights
                    </h3>
                    <ul class="space-y-2">
                        ${details.highlights.map(highlight => `
                            <li class="flex items-start gap-2">
                                <i class="fas fa-check text-green-400 mt-1"></i>
                                <span class="text-gray-300">${highlight}</span>
                            </li>
                        `).join('')}
                    </ul>
                </div>
                
                <div>
                    <h3 class="text-xl font-orbitron font-bold text-white mb-4">
                        <i class="fas fa-code text-robotics-light-blue mr-2"></i>
                        Technologies & Methods
                    </h3>
                    <div class="flex flex-wrap gap-2">
                        ${details.technologies.map(tech => `
                            <span class="tech-tag">${tech}</span>
                        `).join('')}
                    </div>
                </div>
            `;

        // Similar blocks for innovation and grants_awards categories
        default:
            return `
                <div class="mb-6">
                    <h3 class="text-xl font-orbitron font-bold text-white mb-4">
                        <i class="fas fa-info-circle text-robotics-light-blue mr-2"></i>
                        Details
                    </h3>
                    <div class="space-y-3">
                        ${Object.entries(details).map(([key, value]) => {
                if (Array.isArray(value)) {
                    return `
                                    <div>
                                        <div class="text-gray-400 mb-1">${formatKey(key)}:</div>
                                        <ul class="space-y-1">
                                            ${value.map(item => `
                                                <li class="flex items-start gap-2">
                                                    <i class="fas fa-check text-green-400 mt-1 text-xs"></i>
                                                    <span class="text-gray-300 text-sm">${item}</span>
                                                </li>
                                            `).join('')}
                                        </ul>
                                    </div>
                                `;
                } else {
                    return `
                                    <div class="flex justify-between">
                                        <span class="text-gray-400">${formatKey(key)}:</span>
                                        <span class="text-white">${value}</span>
                                    </div>
                                `;
                }
            }).join('')}
                    </div>
                </div>
            `;
    }
}

/**
 * Format key for display (convert snake_case to Title Case)
 */
function formatKey(key) {
    return key.split('_')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}

/**
 * Close achievement modal
 */
function closeAchievementModal() {
    if (achievementModal) {
        achievementModal.classList.remove('active');
        document.body.style.overflow = ''; // Restore scrolling
    }
}

/**
 * Show error message
 */
function showErrorMessage(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'col-span-full text-center py-16';
    errorDiv.innerHTML = `
        <i class="fas fa-exclamation-triangle text-5xl text-red-500 mb-6"></i>
        <h3 class="text-2xl font-orbitron text-white mb-3">Error Loading Data</h3>
        <p class="text-gray-400">${message}</p>
        <button onclick="location.reload()" class="mt-6 px-6 py-3 bg-robotics-gold text-robotics-blue font-bold rounded-lg hover:bg-robotics-light-blue transition-colors">
            <i class="fas fa-redo mr-2"></i> Try Again
        </button>
    `;

    if (achievementsGrid) {
        achievementsGrid.innerHTML = '';
        achievementsGrid.appendChild(errorDiv);
    }
}

// Export functions for potential module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        loadAchievementsData,
        initializeFilterButtons,
        renderAchievementsGrid,
        initStatsCounters,
        initializeTimeline,
        openAchievementModal,
        closeAchievementModal
    };
}