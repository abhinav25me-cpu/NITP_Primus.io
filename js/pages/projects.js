// ============================================
// PROJECTS PAGE - MAIN JAVASCRIPT
// ============================================

document.addEventListener('DOMContentLoaded', function () {

    // Global variables
    let projectsData = [];
    let filteredProjects = [];
    let currentFilters = {
        year: 'all',
        type: 'all'
    };

    // DOM Elements
    const projectsGrid = document.getElementById('projects-grid');
    const loadingState = document.getElementById('loading-state');
    const emptyState = document.getElementById('empty-state');
    const projectModal = document.getElementById('project-modal');
    const modalClose = document.getElementById('modal-close');
    const modalContent = document.getElementById('modal-content');

    // ========== INITIALIZE PAGE ==========
    initPage();

    async function initPage() {
        // Load projects data
        await loadProjectsData();

        // Initialize filters
        initFilters();

        // Render initial projects
        renderProjects();

        // Hide loading state
        loadingState.style.display = 'none';
    }

    // ========== LOAD PROJECTS DATA ==========
    async function loadProjectsData() {
        try {

            // In a real application, this would be an API call
            // For now, we'll use the JSON file we created
            const response = await fetch('./data/projects.json');

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            projectsData = data.projects;
            filteredProjects = [...projectsData]; // Initial copy

        } catch (error) {
            console.error('Error loading projects data:', error);

            // Fallback to inline data if fetch fails
            projectsData = getFallbackProjectsData();
            filteredProjects = [...projectsData];

            console.log(`Using fallback data with ${projectsData.length} projects`);
        }
    }

    // ========== FILTER FUNCTIONS ==========
    function initFilters() {
        // Year filter buttons
        document.querySelectorAll('.filter-year').forEach(button => {
            button.addEventListener('click', () => {
                // Remove active class from all year buttons
                document.querySelectorAll('.filter-year').forEach(btn => {
                    btn.classList.remove('active');
                });

                // Add active class to clicked button
                button.classList.add('active');

                // Update filter
                currentFilters.year = button.dataset.year;

                // Apply filters and re-render
                applyFilters();
                renderProjects();
            });
        });

        // Type filter buttons
        document.querySelectorAll('.filter-type').forEach(button => {
            button.addEventListener('click', () => {
                // Remove active class from all type buttons
                document.querySelectorAll('.filter-type').forEach(btn => {
                    btn.classList.remove('active');
                });

                // Add active class to clicked button
                button.classList.add('active');

                // Update filter
                currentFilters.type = button.dataset.type;

                // Apply filters and re-render
                applyFilters();
                renderProjects();
            });
        });

        // Reset filters button
        document.getElementById('reset-filters').addEventListener('click', () => {
            resetFilters();
        });
    }

    function applyFilters() {
        filteredProjects = projectsData.filter(project => {
            // Check year filter
            const yearMatch = currentFilters.year === 'all' ||
                project.year.toString() === currentFilters.year;

            // Check type filter
            const typeMatch = currentFilters.type === 'all' ||
                project.type === currentFilters.type;

            return yearMatch && typeMatch;
        });
    }

    function resetFilters() {
        // Reset active classes
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.remove('active');
        });

        // Set "all" filters as active
        document.querySelector('[data-year="all"]').classList.add('active');
        document.querySelector('[data-type="all"]').classList.add('active');

        // Reset filter state
        currentFilters.year = 'all';
        currentFilters.type = 'all';

        // Reset filtered projects
        filteredProjects = [...projectsData];

        // Re-render
        renderProjects();
    }

    // ========== RENDER PROJECTS ==========
    function renderProjects() {
        // Clear current grid
        projectsGrid.innerHTML = '';

        // Show empty state if no projects
        if (filteredProjects.length === 0) {
            emptyState.classList.remove('hidden');
            return;
        }

        // Hide empty state
        emptyState.classList.add('hidden');

        // Create project cards
        filteredProjects.forEach((project, index) => {
            const projectCard = createProjectCard(project, index);
            projectsGrid.appendChild(projectCard);
        });

        // Add animation delay to each card
        document.querySelectorAll('.project-card').forEach((card, index) => {
            card.style.animationDelay = `${index * 0.1}s`;
        });
    }

    function createProjectCard(project, index) {
        const card = document.createElement('div');
        card.className = `project-card animate-fade-in-up`;
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';

        // Add intersection observer for animation
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        observer.observe(card);

        // Status badge
        const statusClass = project.status === 'completed' ? 'status-completed' : 'status-ongoing';
        const statusText = project.status === 'completed' ? 'Completed' : 'Ongoing';

        // Tech tags (limit to 3)
        const techTags = project.technologies.slice(0, 3).map(tech =>
            `<span class="tech-tag">${tech}</span>`
        ).join('');

        card.innerHTML = `
                    <div class="project-card-image">
                        <img src="${project.thumbnail}" alt="${project.title}" loading="lazy">
                        <div class="project-card-overlay"></div>
                        <div class="project-status ${statusClass}">${statusText}</div>
                    </div>
                    
                    <div class="p-6">
                        <div class="flex justify-between items-start mb-3">
                            <h3 class="text-xl font-orbitron font-bold text-white">${project.title}</h3>
                            <span class="text-robotics-gold font-bold">${project.year}</span>
                        </div>
                        
                        <p class="text-gray-300 text-sm mb-4">${project.shortDescription}</p>
                        
                        <div class="mb-4">
                            <div class="text-gray-400 text-xs mb-2">Technologies Used:</div>
                            <div class="flex flex-wrap">${techTags}</div>
                        </div>
                        
                        <div class="flex justify-between items-center mt-6">
                            <div>
                                <div class="text-gray-400 text-xs">Team Size</div>
                                <div class="text-white font-semibold">${project.team.length} Members</div>
                            </div>
                            
                            <button class="view-details-btn px-4 py-2 bg-robotics-gold/10 border border-robotics-gold/30 text-robotics-gold rounded-lg hover:bg-robotics-gold/20 transition-colors font-semibold text-sm"
                                    data-project-id="${project.id}">
                                View Details
                            </button>
                        </div>
                    </div>
                `;

        // Add click event to view details button
        const viewBtn = card.querySelector('.view-details-btn');
        viewBtn.addEventListener('click', () => {
            openProjectModal(project.id);
        });

        return card;
    }

    // ========== MODAL FUNCTIONS ==========
    function openProjectModal(projectId) {
        const project = projectsData.find(p => p.id === projectId);
        if (!project) {
            console.error('Project not found:', projectId);
            return;
        }

        // Populate modal content
        modalContent.innerHTML = createModalContent(project);

        // Show modal
        projectModal.style.display = 'block';
        document.body.style.overflow = 'hidden'; // Prevent scrolling

        // Add event listeners for modal images
        initModalImageGallery();
    }

    function createModalContent(project) {
        // Status and duration
        const statusClass = project.status === 'completed' ? 'status-completed' : 'status-ongoing';
        const statusText = project.status === 'completed' ? 'Completed' : 'Ongoing';

        // Tech tags
        const techTags = project.technologies.map(tech =>
            `<span class="tech-tag">${tech}</span>`
        ).join('');

        // Tool tags
        const toolTags = project.tools.map(tool =>
            `<span class="tech-tag" style="background: rgba(0, 180, 216, 0.1); border-color: rgba(0, 180, 216, 0.2)">${tool}</span>`
        ).join('');

        // Team members
        const teamMembers = project.team.map(member =>
            `<span class="tech-tag" style="background: rgba(156, 39, 176, 0.1); border-color: rgba(156, 39, 176, 0.2)">${member}</span>`
        ).join('');

        // Achievements
        const achievementsList = project.achievements.map(achievement =>
            `<li class="flex items-start gap-2 mb-2">
                        <i class="fas fa-trophy text-robotics-gold mt-1"></i>
                        <span>${achievement}</span>
                    </li>`
        ).join('');

        // Links
        const githubLink = project.github ?
            `<a href="${project.github}" target="_blank" class="inline-flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors">
                        <i class="fab fa-github"></i>
                        <span>GitHub Repository</span>
                    </a>` : '';

        const demoLink = project.demo ?
            `<a href="${project.demo}" target="_blank" class="inline-flex items-center gap-2 px-4 py-2 bg-robotics-blue hover:bg-robotics-light-blue/20 rounded-lg transition-colors border border-robotics-light-blue/30">
                        <i class="fas fa-play-circle"></i>
                        <span>Watch Demo</span>
                    </a>` : '';

        return `
                    <!-- Modal Header -->
                    <div class="p-8 border-b border-gray-800">
                        <div class="flex flex-wrap justify-between items-start gap-4">
                            <div>
                                <h2 class="text-3xl md:text-4xl font-orbitron font-bold text-white mb-2">${project.title}</h2>
                                <div class="flex flex-wrap items-center gap-4">
                                    <span class="text-robotics-gold font-bold text-xl">${project.year}</span>
                                    <span class="project-status ${statusClass}">${statusText}</span>
                                    <span class="text-gray-300">Duration: ${project.duration}</span>
                                </div>
                                </br>
                                <div class="flex gap-2">
                                ${githubLink}
                                ${demoLink}
                            </div>
                            </div>
                            
                            
                        </div>
                    </div>
                    
                    <!-- Modal Body -->
                    <div class="p-8">
                        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            <!-- Left Column: Images and Description -->
                            <div class="lg:col-span-2">
                                <!-- Main Image -->
                                <div class="rounded-xl overflow-hidden mb-6 border border-robotics-gold/20">
                                    <img id="modal-main-image" src="${project.images[0] || project.thumbnail}" 
                                         alt="${project.title}" 
                                         class="w-full h-64 md:h-80 object-cover">
                                </div>
                                
                                <!-- Thumbnail Gallery -->
                                ${project.images.length > 1 ? `
                                <div class="flex gap-2 mb-8 overflow-x-auto pb-2">
                                    ${project.images.map((img, index) => `
                                        <img src="${img}" 
                                             alt="Project image ${index + 1}"
                                             class="modal-thumbnail w-20 h-20 object-cover rounded-lg cursor-pointer border-2 ${index === 0 ? 'border-robotics-gold' : 'border-transparent'}"
                                             data-image="${img}">
                                    `).join('')}
                                </div>
                                ` : ''}
                                
                                <!-- Project Description -->
                                <div class="mb-8">
                                    <h3 class="text-xl font-orbitron font-bold text-white mb-4">Project Description</h3>
                                    <p class="text-gray-300 leading-relaxed">${project.longDescription}</p>
                                </div>
                                
                                <!-- Achievements -->
                                ${project.achievements.length > 0 ? `
                                <div class="mb-8">
                                    <h3 class="text-xl font-orbitron font-bold text-white mb-4">Achievements & Awards</h3>
                                    <ul class="text-gray-300">
                                        ${achievementsList}
                                    </ul>
                                </div>
                                ` : ''}
                            </div>
                            
                            <!-- Right Column: Details -->
                            <div class="lg:col-span-1">
                                <!-- Technologies -->
                                <div class="mb-8">
                                    <h3 class="text-xl font-orbitron font-bold text-white mb-4">Technologies</h3>
                                    <div class="flex flex-wrap gap-2">
                                        ${techTags}
                                    </div>
                                </div>
                                
                                <!-- Tools -->
                                <div class="mb-8">
                                    <h3 class="text-xl font-orbitron font-bold text-white mb-4">Tools & Equipment</h3>
                                    <div class="flex flex-wrap gap-2">
                                        ${toolTags}
                                    </div>
                                </div>
                                
                                <!-- Team Members -->
                                <div class="mb-8">
                                    <h3 class="text-xl font-orbitron font-bold text-white mb-4">Team Members</h3>
                                    <div class="flex flex-wrap gap-2">
                                        ${teamMembers}
                                    </div>
                                </div>
                                
                                <!-- Project Type -->
                                <div class="mb-8">
                                    <h3 class="text-xl font-orbitron font-bold text-white mb-4">Project Type</h3>
                                    <span class="px-4 py-2 bg-robotics-gold/10 border border-robotics-gold/30 text-robotics-gold rounded-lg capitalize">
                                        ${project.type.replace('-', ' ')}
                                    </span>
                                </div>
                                
                                <!-- Project Timeline -->
                                <div class="bg-robotics-blue/50 border border-robotics-gold/20 rounded-xl p-6">
                                    <h3 class="text-xl font-orbitron font-bold text-white mb-4">Project Timeline</h3>
                                    <div class="space-y-3">
                                        <div class="flex justify-between">
                                            <span class="text-gray-300">Status</span>
                                            <span class="text-robotics-gold font-semibold capitalize">${project.status}</span>
                                        </div>
                                        <div class="flex justify-between">
                                            <span class="text-gray-300">Duration</span>
                                            <span class="text-robotics-gold font-semibold">${project.duration}</span>
                                        </div>
                                        <div class="flex justify-between">
                                            <span class="text-gray-300">Year</span>
                                            <span class="text-robotics-gold font-semibold">${project.year}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
    }

    function initModalImageGallery() {
        const mainImage = document.getElementById('modal-main-image');
        const thumbnails = document.querySelectorAll('.modal-thumbnail');

        thumbnails.forEach(thumb => {
            thumb.addEventListener('click', () => {
                // Update main image
                mainImage.src = thumb.dataset.image;

                // Update active thumbnail
                thumbnails.forEach(t => {
                    t.classList.remove('border-robotics-gold');
                    t.classList.add('border-transparent');
                });
                thumb.classList.remove('border-transparent');
                thumb.classList.add('border-robotics-gold');
            });
        });
    }

    // ========== MODAL EVENT LISTENERS ==========
    modalClose.addEventListener('click', closeModal);

    // Close modal when clicking outside content
    projectModal.addEventListener('click', (e) => {
        if (e.target === projectModal) {
            closeModal();
        }
    });

    // Close modal with Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && projectModal.style.display === 'block') {
            closeModal();
        }
    });

    function closeModal() {
        projectModal.style.display = 'none';
        document.body.style.overflow = 'auto'; // Re-enable scrolling
    }

    // ========== FALLBACK DATA (if JSON fails) ==========
    function getFallbackProjectsData() {
        return [
            {
                id: 1,
                title: "Autonomous Delivery Drone",
                year: 2024,
                type: "drone",
                shortDescription: "AI-powered autonomous drone for last-mile delivery",
                longDescription: "An autonomous delivery drone system with obstacle avoidance and real-time tracking capabilities.",
                thumbnail: "https://images.unsplash.com/photo-1473968512647-3e447244af8f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
                images: ["https://images.unsplash.com/photo-1473968512647-3e447244af8f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"],
                technologies: ["Python", "ROS", "OpenCV"],
                tools: ["DJI SDK", "Gazebo"],
                team: ["Rajesh Kumar", "Priya Sharma"],
                achievements: ["1st Prize - National Competition"],
                github: "#",
                demo: "#",
                status: "completed",
                duration: "6 months"
            },
            {
                id: 2,
                title: "Humanoid Robot",
                year: 2023,
                type: "humanoid",
                shortDescription: "Advanced humanoid robot with 20 degrees of freedom",
                longDescription: "A bipedal humanoid robot capable of walking and object recognition.",
                thumbnail: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
                images: ["https://images.unsplash.com/photo-1581094794329-c8112a89af12?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"],
                technologies: ["C++", "ROS2", "PyTorch"],
                tools: ["SolidWorks", "3D Printer"],
                team: ["Vikram Singh", "Anjali Verma"],
                achievements: ["Finalist - ROBOCON India"],
                github: "#",
                demo: "#",
                status: "completed",
                duration: "8 months"
            }
        ];
    }
});