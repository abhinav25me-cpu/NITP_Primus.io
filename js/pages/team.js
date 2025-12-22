// Main Team Data Loader and Renderer
document.addEventListener('DOMContentLoaded', function () {
    // Load team data from JSON file
    loadTeamData();
});

// Global variables for filtering
let allTeamMembers = [];
let activeSpecialization = 'all';
let searchQuery = '';
let teamMembersData = {};

/**
 * Load team data from JSON file and render all sections
 */
async function loadTeamData() {
    try {
        // Fetch team data from JSON file
        const response = await fetch('./data/team.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const teamData = await response.json();

        // Render all sections with the loaded data
        renderFacultyAdvisors(teamData.facultyAdvisors);
        renderCoreTeam(teamData.coreTeam);
        renderTeamMembers(teamData.teamMembers);
        renderAlumni(teamData.alumni);

    } catch (error) {
        console.error('Error loading team data:', error);
        showErrorMessages();
    }
}

/**
 * Display error messages if data fails to load
 */
function showErrorMessages() {
    const errorHtml = `
        <div class="text-center py-10">
            <i class="fas fa-exclamation-triangle text-robotics-gold text-4xl mb-4"></i>
            <h3 class="text-xl font-bold text-white mb-2">Unable to Load Team Data</h3>
            <p class="text-gray-300">Please check your internet connection or try again later.</p>
        </div>
    `;

    document.getElementById('faculty-container').innerHTML = errorHtml;
    document.getElementById('core-team-container').innerHTML = errorHtml;
    document.getElementById('team-members-container').innerHTML = errorHtml;
    document.getElementById('alumni-container').innerHTML = errorHtml;
}

/**
 * Render Faculty Advisors Section
 */
function renderFacultyAdvisors(facultyAdvisors) {
    const container = document.getElementById('faculty-container');

    if (!facultyAdvisors || facultyAdvisors.length === 0) {
        container.innerHTML = '<p class="text-center text-gray-300 col-span-full">No faculty advisors data available.</p>';
        return;
    }

    let facultyHtml = '';

    facultyAdvisors.forEach(faculty => {
        facultyHtml += `
            <div class="faculty-card team-card p-8 animate-fade-in-up">
                <div class="flex flex-col items-center text-center mb-6">
                    <img src="${faculty.photo}" alt="${faculty.name}" class="profile-img mb-6">
                    <h3 class="text-2xl font-orbitron font-bold text-white mb-2">${faculty.name}</h3>
                    <p class="text-robotics-gold font-semibold mb-1">${faculty.designation}</p>
                    <p class="text-gray-300 text-sm">${faculty.department}</p>
                </div>
                
                <div class="mb-6">
                    <div class="flex items-center gap-2 mb-3">
                        <i class="fas fa-quote-left text-robotics-gold/50"></i>
                        <h4 class="text-lg font-bold text-white">Message</h4>
                    </div>
                    <p class="text-gray-300 text-sm leading-relaxed">${faculty.message}</p>
                </div>
                
                <div class="mb-6 p-4 bg-robotics-blue/30 rounded-lg border border-robotics-gold/10">
                    <div class="flex items-center gap-2 mb-2">
                        <i class="fas fa-star text-robotics-gold"></i>
                        <h4 class="text-md font-bold text-white">Favorite Quote</h4>
                    </div>
                    <p class="text-gray-300 italic text-sm">"${faculty.quote}"</p>
                </div>
                
                <div class="flex justify-center gap-4">
                    <a href="mailto:${faculty.email}" class="social-icon" title="Email">
                        <i class="fas fa-envelope"></i>
                    </a>
                    <a href="${faculty.linkedin}" target="_blank" class="social-icon" title="LinkedIn">
                        <i class="fab fa-linkedin-in"></i>
                    </a>
                    <a href="${faculty.researchGate}" target="_blank" class="social-icon" title="ResearchGate">
                        <i class="fab fa-researchgate"></i>
                    </a>
                </div>
            </div>
        `;
    });

    container.innerHTML = facultyHtml;
}

/**
 * Render Core Team Section
 */
function renderCoreTeam(coreTeamData) {
    const container = document.getElementById('core-team-container');

    if (!coreTeamData || !coreTeamData.members || coreTeamData.members.length === 0) {
        container.innerHTML = '<p class="text-center text-gray-300 col-span-full">No core team data available.</p>';
        return;
    }

    let coreTeamHtml = '';
    const members = coreTeamData.members;

    // Sort members by role importance (President first, then VP, etc.)
    const roleOrder = {
        'President': 1,
        'Vice President': 2,
        'Technical Coordinator': 3,
        'Treasurer': 4,
        'PR & Outreach Coordinator': 5,
        'Events Coordinator': 6
    };

    members.sort((a, b) => {
        const orderA = roleOrder[a.role] || 999;
        const orderB = roleOrder[b.role] || 999;
        return orderA - orderB;
    });

    members.forEach((member, index) => {
        // Determine role badge class based on role
        let roleBadgeClass = 'role-badge ';
        if (member.role.includes('President')) roleBadgeClass += 'role-president';
        else if (member.role.includes('Vice')) roleBadgeClass += 'role-vice-president';
        else if (member.role.includes('Coordinator')) roleBadgeClass += 'role-coordinator';
        else if (member.role.includes('Treasurer')) roleBadgeClass += 'role-treasurer';
        else roleBadgeClass += 'role-coordinator';

        coreTeamHtml += `
            <div class="team-card p-6 animate-fade-in-up" style="animation-delay: ${0.1 + (index * 0.1)}s">
                <div class="text-center mb-6">
                    <img src="${member.photo}" alt="${member.name}" class="w-32 h-32 object-cover rounded-full mx-auto mb-4 border-2 border-robotics-gold/30">
                    <span class="${roleBadgeClass} mb-3">${member.role}</span>
                    <h3 class="text-xl font-orbitron font-bold text-white mb-2">${member.name}</h3>
                    <p class="text-gray-300 text-sm">${member.department} • ${member.year}</p>
                </div>
                
                <div class="mb-6">
                    <h4 class="text-md font-bold text-white mb-3 flex items-center gap-2">
                        <i class="fas fa-tasks text-robotics-gold"></i>
                        Responsibilities
                    </h4>
                    <ul class="space-y-2">
                        ${member.responsibilities.map(resp => `<li class="text-gray-300 text-sm flex items-start gap-2"><i class="fas fa-check text-robotics-gold text-xs mt-1"></i>${resp}</li>`).join('')}
                    </ul>
                </div>
                
                <div class="flex justify-center gap-4 pt-4 border-t border-gray-700">
                    <a href="mailto:${member.email}" class="social-icon" title="Email">
                        <i class="fas fa-envelope"></i>
                    </a>
                    <a href="${member.linkedin}" target="_blank" class="social-icon" title="LinkedIn">
                        <i class="fab fa-linkedin-in"></i>
                    </a>
                    <a href="${member.github}" target="_blank" class="social-icon" title="GitHub">
                        <i class="fab fa-github"></i>
                    </a>
                </div>
            </div>
        `;
    });

    container.innerHTML = coreTeamHtml;
}

/**
 * Render Team Members Section with improved filtering
 */
function renderTeamMembers(teamMembersData) {
    const container = document.getElementById('team-members-container');

    // Store globally for filtering
    window.teamMembersData = teamMembersData;

    if (!teamMembersData) {
        container.innerHTML = '<p class="text-center text-gray-300 col-span-full">No team members data available.</p>';
        return;
    }

    // Flatten all members into one array
    allTeamMembers = [];
    let specializationCounts = {};

    // Initialize counts
    specializationCounts['all'] = 0;

    for (const [specialization, members] of Object.entries(teamMembersData)) {
        if (specialization === 'all') continue;

        // Convert specialization key to readable format
        const readableSpec = getReadableSpecialization(specialization);

        // Add specialization property to each member
        members.forEach(member => {
            member.specialization = specialization;
            member.readableSpecialization = readableSpec;
            // Ensure skills array exists
            member.skills = member.skills || [];
            allTeamMembers.push(member);
        });

        // Update counts
        specializationCounts['all'] += members.length;
        specializationCounts[specialization] = members.length;
    }

    // Add "All Members" to the data object
    teamMembersData.all = allTeamMembers;

    // Create tabs
    renderSpecializationTabs(specializationCounts);

    // Initialize search functionality
    initSearchFunctionality();

    // Initially render all members
    filterAndRenderMembers();
}

/**
 * Get readable specialization name
 */
function getReadableSpecialization(specialization) {
    const specMap = {
        'hardware': 'Hardware',
        'software': 'Software',
        'aiMl': 'AI & ML',
        'web': 'Web Development',
        'design': 'Design'
    };

    return specMap[specialization] ||
        specialization.charAt(0).toUpperCase() +
        specialization.slice(1).replace(/([A-Z])/g, ' $1');
}

/**
 * Render specialization tabs with count badges
 */
function renderSpecializationTabs(specializationCounts) {
    const tabsContainer = document.getElementById('specialization-tabs');

    // Define tab order and icons
    const tabConfig = [
        { key: 'all', label: 'All Members', icon: 'fa-users' },
        { key: 'hardware', label: 'Hardware', icon: 'fa-microchip' },
        { key: 'software', label: 'Software', icon: 'fa-code' },
        { key: 'aiMl', label: 'AI & ML', icon: 'fa-brain' },
        { key: 'web', label: 'Web Dev', icon: 'fa-globe' },
        { key: 'design', label: 'Design', icon: 'fa-palette' }
    ];

    // Start with an opening div tag
    let tabsHtml = '<div class="tabs-wrapper flex flex-wrap justify-center gap-3 md:gap-3">';

    tabConfig.forEach(tab => {
        if (specializationCounts[tab.key] !== undefined) {
            const isActive = tab.key === activeSpecialization;
            tabsHtml += `
                <button class="specialization-tab ${isActive ? 'active' : ''}" 
                        data-specialization="${tab.key}"
                        onclick="setActiveSpecialization('${tab.key}')">
                    <i class="fas ${tab.icon} mr-2"></i>
                    <span>${tab.label}</span>
                    <span class="ml-2 px-2 py-1 text-xs bg-robotics-gold/20 text-robotics-gold rounded-full">
                        ${specializationCounts[tab.key]}
                    </span>
                </button>
            `;
        }
    });

     // Close the div tag
    tabsHtml += '</div>';

    tabsContainer.innerHTML = tabsHtml;
}

/**
 * Set active specialization and re-render
 */
function setActiveSpecialization(specialization) {
    activeSpecialization = specialization;

    // Update active tab
    document.querySelectorAll('.specialization-tab').forEach(tab => {
        tab.classList.remove('active');
        if (tab.getAttribute('data-specialization') === specialization) {
            tab.classList.add('active');
        }
    });

    // Filter and render members
    filterAndRenderMembers();
}

/**
 * Initialize search functionality
 */
function initSearchFunctionality() {
    const searchInput = document.getElementById('member-search');
    const clearSearchBtn = document.getElementById('clear-search');
    const clearAllFiltersBtn = document.getElementById('clear-all-filters');
    const resetFiltersBtn = document.getElementById('reset-filters');

    // Search input handler
    searchInput.addEventListener('input', function (e) {
        searchQuery = e.target.value.toLowerCase().trim();

        // Show/hide clear button
        if (searchQuery.length > 0) {
            clearSearchBtn.classList.remove('hidden');
        } else {
            clearSearchBtn.classList.add('hidden');
        }

        // Filter and render members
        filterAndRenderMembers();
    });

    // Clear search button
    clearSearchBtn.addEventListener('click', function () {
        searchInput.value = '';
        searchQuery = '';
        clearSearchBtn.classList.add('hidden');
        filterAndRenderMembers();
    });

    // Clear all filters button
    if (clearAllFiltersBtn) {
        clearAllFiltersBtn.addEventListener('click', resetFilters);
    }

    // Reset filters button
    if (resetFiltersBtn) {
        resetFiltersBtn.addEventListener('click', resetFilters);
    }

    // Enter key support
    searchInput.addEventListener('keyup', function (e) {
        if (e.key === 'Enter') {
            filterAndRenderMembers();
        }
    });
}

/**
 * Filter and render members based on active filters
 */
function filterAndRenderMembers() {
    const container = document.getElementById('team-members-container');
    const noResultsDiv = document.getElementById('no-results-message');
    const activeFiltersDiv = document.getElementById('active-filters');
    const filterChipsDiv = document.getElementById('filter-chips');

    // Get members based on specialization
    let filteredMembers = [];

    if (activeSpecialization === 'all') {
        filteredMembers = [...allTeamMembers];
    } else {
        filteredMembers = window.teamMembersData[activeSpecialization] || [];
    }

    // Apply search filter
    if (searchQuery) {
        filteredMembers = filteredMembers.filter(member => {
            // Search in name
            if (member.name.toLowerCase().includes(searchQuery)) return true;

            // Search in role
            if (member.role.toLowerCase().includes(searchQuery)) return true;

            // Search in department
            if (member.department.toLowerCase().includes(searchQuery)) return true;

            // Search in skills
            if (member.skills && member.skills.some(skill =>
                skill.toLowerCase().includes(searchQuery))) return true;

            // Search in specialization
            if (member.readableSpecialization &&
                member.readableSpecialization.toLowerCase().includes(searchQuery)) return true;

            return false;
        });
    }

    // Update active filters display
    updateActiveFiltersDisplay(filteredMembers.length);

    // Render filtered members or show no results message
    if (filteredMembers.length === 0) {
        container.classList.add('hidden');
        noResultsDiv.classList.remove('hidden');
    } else {
        container.classList.remove('hidden');
        noResultsDiv.classList.add('hidden');
        renderMembersGrid(filteredMembers, container);
    }
}

/**
 * Update active filters display
 */
function updateActiveFiltersDisplay(filteredCount) {
    const activeFiltersDiv = document.getElementById('active-filters');
    const filterChipsDiv = document.getElementById('filter-chips');
    const totalCount = allTeamMembers.length;

    // Build filter chips
    let chipsHtml = '';

    if (activeSpecialization !== 'all') {
        const readableSpec = getReadableSpecialization(activeSpecialization);
        chipsHtml += `
            <div class="filter-chip">
                <span>${readableSpec}</span>
                <button onclick="setActiveSpecialization('all')" class="ml-1 hover:text-robotics-gold">
                    <i class="fas fa-times text-xs"></i>
                </button>
            </div>
        `;
    }

    if (searchQuery) {
        chipsHtml += `
            <div class="filter-chip">
                <span>"${searchQuery}"</span>
                <button onclick="clearSearch()" class="ml-1 hover:text-robotics-gold">
                    <i class="fas fa-times text-xs"></i>
                </button>
            </div>
        `;
    }

    filterChipsDiv.innerHTML = chipsHtml;

    // Show/hide active filters div
    if (chipsHtml || activeSpecialization !== 'all') {
        activeFiltersDiv.classList.remove('hidden');
    } else {
        activeFiltersDiv.classList.add('hidden');
    }

    // Update ALL tab counts based on current search
    updateAllTabCounts();
}


/**
 * Calculate and update member counts for ALL specialization tabs
 */
function updateAllTabCounts() {
    const tabs = document.querySelectorAll('.specialization-tab');
    
    tabs.forEach(tab => {
        const specialization = tab.getAttribute('data-specialization');
        const countSpan = tab.querySelector('.text-xs');
        
        if (countSpan) {
            // Calculate filtered count for this specific tab
            const tabFilteredCount = calculateFilteredCountForSpecialization(specialization);
            countSpan.textContent = tabFilteredCount;
            
            // Optional: Add visual feedback for empty tabs
            if (tabFilteredCount === 0 && specialization !== 'all') {
                tab.style.opacity = '0.6';
                tab.title = 'No members match current search';
            } else {
                tab.style.opacity = '1';
                tab.title = '';
            }
        }
    });
}

/**
 * Calculate filtered count for a specific specialization
 */
function calculateFilteredCountForSpecialization(specialization) {
    // Get members for this specialization
    let membersForSpec = [];
    
    if (specialization === 'all') {
        membersForSpec = [...allTeamMembers];
    } else {
        membersForSpec = window.teamMembersData[specialization] || [];
    }
    
    // If no search query, return total count
    if (!searchQuery) {
        return membersForSpec.length;
    }
    
    // Apply search filter to calculate filtered count
    const filteredMembers = membersForSpec.filter(member => {
        // Search in name
        if (member.name.toLowerCase().includes(searchQuery)) return true;
        
        // Search in role
        if (member.role.toLowerCase().includes(searchQuery)) return true;
        
        // Search in department
        if (member.department.toLowerCase().includes(searchQuery)) return true;
        
        // Search in skills
        if (member.skills && member.skills.some(skill => 
            skill.toLowerCase().includes(searchQuery))) return true;
        
        // Search in specialization
        if (member.readableSpecialization && 
            member.readableSpecialization.toLowerCase().includes(searchQuery)) return true;
        
        return false;
    });
    
    return filteredMembers.length;
}

/**
 * Clear search function
 */
function clearSearch() {
    const searchInput = document.getElementById('member-search');
    const clearSearchBtn = document.getElementById('clear-search');

    searchInput.value = '';
    searchQuery = '';
    clearSearchBtn.classList.add('hidden');
    filterAndRenderMembers();
}

/**
 * Reset all filters
 */
function resetFilters() {
    activeSpecialization = 'all';
    searchQuery = '';

    // Reset UI
    document.getElementById('member-search').value = '';
    document.getElementById('clear-search').classList.add('hidden');

    // Update tabs
    document.querySelectorAll('.specialization-tab').forEach(tab => {
        tab.classList.remove('active');
        if (tab.getAttribute('data-specialization') === 'all') {
            tab.classList.add('active');
        }
    });

    // Re-render
    filterAndRenderMembers();
}

/**
 * Render members grid
 */
function renderMembersGrid(members, container) {
    let membersHtml = '';

    members.forEach((member, index) => {
        // Get skills as HTML
        const skillsHtml = member.skills && member.skills.length > 0 ?
            member.skills.map(skill =>
                `<span class="skill-badge">${skill}</span>`
            ).join('') : '<span class="text-gray-500 text-sm">No skills listed</span>';

        membersHtml += `
            <div class="team-card p-6 animate-fade-in-up" style="animation-delay: ${index * 0.05}s">
                <div class="flex items-start gap-4">
                    <!-- Profile Image/Icon -->
                    <div class="flex-shrink-0">
                        <div class="member-avatar">
                            ${member.photo ?
                `<img src="${member.photo}" alt="${member.name}" class="w-16 h-16 rounded-full object-cover border-2 border-robotics-gold/30">` :
                `<div class="w-16 h-16 rounded-full bg-gradient-to-r from-robotics-gold/20 to-robotics-light-blue/20 flex items-center justify-center">
                                    <i class="fas fa-user text-robotics-gold text-xl"></i>
                                </div>`
            }
                        </div>
                    </div>
                    
                    <!-- Member Details -->
                    <div class="flex-grow">
                        <!-- Name and Role -->
                        <div class="mb-3">
                            <h3 class="text-lg font-orbitron font-bold text-white mb-1">${member.name}</h3>
                            <p class="text-robotics-gold text-sm font-semibold mb-2">${member.role}</p>
                        </div>
                        
                        <!-- Department and Year -->
                        <div class="flex flex-wrap gap-2 mb-3">
                            <span class="department-badge">
                                <i class="fas fa-graduation-cap mr-1"></i>
                                ${member.department}
                            </span>
                            <span class="year-badge">
                                <i class="fas fa-calendar-alt mr-1"></i>
                                ${member.year}
                            </span>
                            <span class="specialization-badge">
                                <i class="fas fa-tag mr-1"></i>
                                ${member.readableSpecialization}
                            </span>
                        </div>
                        
                        <!-- Skills -->
                        <div class="mb-4">
                            <div class="flex flex-wrap gap-2 skills-container">
                                ${skillsHtml}
                            </div>
                        </div>
                        
                        <!-- Social Links -->
                        <div class="flex gap-3 social-links">
                            ${member.github ?
                `<a href="${member.github}" target="_blank" class="social-link" title="GitHub">
                                    <i class="fab fa-github"></i>
                                </a>` : ''
            }
                            ${member.linkedin ?
                `<a href="${member.linkedin}" target="_blank" class="social-link" title="LinkedIn">
                                    <i class="fab fa-linkedin"></i>
                                </a>` : ''
            }
                            ${member.email ?
                `<a href="mailto:${member.email}" class="social-link" title="Email">
                                    <i class="fas fa-envelope"></i>
                                </a>` : ''
            }
                        </div>
                    </div>
                </div>
            </div>
        `;
    });

    container.innerHTML = membersHtml;
}

/**
 * Render Alumni Section
 */
function renderAlumni(alumniData) {
    const container = document.getElementById('alumni-container');

    if (!alumniData || alumniData.length === 0) {
        container.innerHTML = '<p class="text-center text-gray-300 col-span-full">No alumni data available.</p>';
        return;
    }

    let alumniHtml = '';

    alumniData.forEach((alumni, index) => {
        alumniHtml += `
            <div class="alumni-card team-card p-8 animate-fade-in-up" style="animation-delay: ${index * 0.1}s">
                <div class="flex flex-col md:flex-row items-center md:items-start gap-6 mb-6">
                    <img src="${alumni.photo}" alt="${alumni.name}" class="w-24 h-24 object-cover rounded-full border-2 border-robotics-gold/30">
                    <div class="text-center md:text-left">
                        <h3 class="text-2xl font-orbitron font-bold text-white mb-2">${alumni.name}</h3>
                        <p class="text-robotics-light-blue font-semibold mb-1">${alumni.currentPosition}</p>
                        <p class="text-gray-300 text-sm">Batch of ${alumni.batch}</p>
                    </div>
                </div>
                
                <div class="mb-6">
                    <h4 class="text-lg font-bold text-white mb-4 flex items-center gap-2">
                        <i class="fas fa-trophy text-robotics-gold"></i>
                        Key Achievements
                    </h4>
                    <ul class="achievement-list">
                        ${alumni.achievements.map(achievement => `<li class="text-gray-300 text-sm mb-2">${achievement}</li>`).join('')}
                    </ul>
                </div>
                
                <div class="mb-6 p-4 bg-robotics-blue/30 rounded-lg">
                    <div class="flex items-center gap-2 mb-2">
                        <i class="fas fa-quote-right text-robotics-gold"></i>
                        <h4 class="text-md font-bold text-white">Testimonial</h4>
                    </div>
                    <p class="text-gray-300 text-sm italic">"${alumni.testimonial}"</p>
                </div>
                
                <div class="flex justify-center">
                    <a href="${alumni.linkedin}" target="_blank" class="cta-button secondary flex items-center gap-2 text-robotics-light-blue hover:text-robotics-gold transition-colors">
                        <i class="fab fa-linkedin"></i>
                        <span>Connect on LinkedIn</span>
                    </a>
                </div>
            </div>
        `;
    });

    container.innerHTML = alumniHtml;
}