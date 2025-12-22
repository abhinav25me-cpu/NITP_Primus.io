/**
 * Events Page JavaScript
 * Handles event data loading, filtering, and display logic
 */

// DOM Elements
const DOM = {
    featuredEvents: document.getElementById('featured-events'),
    upcomingEvents: document.getElementById('upcoming-events'),
    ongoingEvents: document.getElementById('ongoing-events'),
    pastEvents: document.getElementById('past-events'),
    categoryFilter: document.getElementById('category-filter'),
    dateFilter: document.getElementById('date-filter'),
    pastCategoryFilter: document.getElementById('past-category-filter'),
    loadingSpinner: document.getElementById('loading-spinner'),
    eventsContent: document.getElementById('events-content')
};

// State Management
const State = {
    events: [],
    filteredUpcoming: [],
    filteredPast: [],
    selectedCategory: 'all',
    selectedDate: 'all',
    selectedPastCategory: 'all'
};

// Utility Functions
const Utils = {
    // Format date to readable format
    formatDate: (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    },

    // Format time
    formatTime: (timeString) => {
        return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit'
        });
    },

    // Get month name from date
    getMonthName: (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { month: 'short' }).toUpperCase();
    },

    // Get day from date
    getDay: (dateString) => {
        const date = new Date(dateString);
        return date.getDate();
    },

    // Check if event is upcoming
    isUpcoming: (event) => {
        const now = new Date();
        const eventDate = new Date(`${event.date}T${event.time}`);
        return eventDate > now && event.status !== 'past';
    },

    // Check if event is ongoing
    isOngoing: (event) => {
        const now = new Date();
        const startDate = new Date(`${event.date}T${event.time}`);
        const endDate = new Date(`${event.endDate}T${event.endTime}`);
        return now >= startDate && now <= endDate;
    },

    // Check if event is past
    isPast: (event) => {
        const now = new Date();
        const endDate = new Date(`${event.endDate}T${event.endTime}`);
        return endDate < now || event.status === 'past';
    }
};

// Event Card Templates
const Templates = {
    // Featured event card
    featuredEvent: (event) => `
        <div class="event-card featured animate-fade-in-up" data-id="${event.id}" data-category="${event.category}">
            
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <!-- Event Image -->
                <div class="lg:col-span-1 overflow-hidden rounded-t-lg lg:rounded-l-lg lg:rounded-tr-none">
                    <img src="${event.image}" 
                         alt="${event.title}" 
                         class="event-image w-full h-64 lg:h-full object-cover">
                </div>
                
                <!-- Event Details -->
                <div class="lg:col-span-2 p-6">
                    <div class="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 mb-4">
                        <div>
                            <span class="category-badge category-${event.category}">
                                ${event.category.toUpperCase()}
                            </span>
                            <h3 class="text-2xl font-orbitron font-bold text-white mt-2">
                                ${event.title}
                            </h3>
                        </div>
                        
                        <!-- Date Preview -->
                        <div class="calendar-preview flex-shrink-0">
                            <div class="calendar-month">${Utils.getMonthName(event.date)}</div>
                            <div class="calendar-day">${Utils.getDay(event.date)}</div>
                        </div>
                    </div>
                    
                    <p class="text-gray-300 mb-4">${event.description}</p>
                    
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        <div class="space-y-2">
                            <div class="flex items-center gap-2">
                                <i class="fas fa-calendar text-robotics-gold"></i>
                                <span class="text-gray-300">
                                    ${Utils.formatDate(event.date)}
                                </span>
                            </div>
                            <div class="flex items-center gap-2">
                                <i class="fas fa-clock text-robotics-gold"></i>
                                <span class="text-gray-300">
                                    ${Utils.formatTime(event.time)} - ${Utils.formatTime(event.endTime)}
                                </span>
                            </div>
                            <div class="flex items-center gap-2">
                                <i class="fas fa-map-marker-alt text-robotics-gold"></i>
                                <span class="text-gray-300">${event.venue}</span>
                            </div>
                        </div>
                        
                        <div class="space-y-2">
                            <div class="flex items-center gap-2">
                                <i class="fas fa-users text-robotics-gold"></i>
                                <span class="text-gray-300">Organizer: ${event.organizer}</span>
                            </div>
                            <div class="flex items-center gap-2">
                                <i class="fas fa-user-friends text-robotics-gold"></i>
                                <span class="text-gray-300">
                                    ${event.registered}/${event.capacity} Registered
                                </span>
                            </div>
                            <div class="registration-progress">
                                <div class="registration-progress-bar" 
                                     style="width: ${(event.registered / event.capacity) * 100}%"></div>
                            </div>
                        </div>
                    </div>
                    
                    <button class="register-btn ${event.registered >= event.capacity ? 'full' : ''}" 
                            data-event-id="${event.id}"
                            ${event.registered >= event.capacity ? 'disabled' : ''}>
                        <i class="fas fa-user-plus"></i>
                        ${event.registered >= event.capacity ? 'Fully Booked' : 'Register Interest'}
                    </button>
                </div>
            </div>
        </div>
    `,

    // Upcoming/Ongoing event card - Updated template
    eventCard: (event) => `
    <div class="event-card ${event.status === 'ongoing' ? 'ongoing' : ''} animate-fade-in-up" 
         data-id="${event.id}" 
         data-category="${event.category}">
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <!-- Event Image -->
            <div class="md:col-span-1 relative">
                <img src="${event.image}" 
                     alt="${event.title}" 
                     class="event-image w-full h-48 md:h-full rounded-t-lg md:rounded-l-lg md:rounded-tr-none object-cover">
            </div>
            
            <!-- Event Details -->
            <div class="md:col-span-2 p-5">
                <div class="flex flex-col md:flex-row md:justify-between md:items-start gap-3 mb-3">
                    <div class="flex-1">
                        <span class="category-badge category-${event.category}">
                            ${event.category.toUpperCase()}
                        </span>
                        <h4 class="text-xl font-orbitron font-bold text-white mt-2">
                            ${event.title}
                        </h4>
                    </div>
                    
                    <!-- Date container with better separation -->
                    <div class="event-date-container bg-robotics-blue/70 rounded-lg p-3 md:p-4">
                        <div class="text-robotics-gold font-orbitron font-bold text-center">
                            ${Utils.formatDate(event.date)}
                        </div>
                        <div class="text-gray-300 text-sm text-center">
                            ${Utils.formatTime(event.time)}
                        </div>
                    </div>
                </div>
                
                <p class="text-gray-300 text-sm mb-4">${event.brief}</p>
                
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div class="space-y-2">
                        <div class="flex items-center gap-2">
                            <i class="fas fa-map-marker-alt text-xs text-robotics-gold"></i>
                            <span class="text-gray-300 text-sm">${event.venue}</span>
                        </div>
                        <div class="flex items-center gap-2">
                            <i class="fas fa-users text-xs text-robotics-gold"></i>
                            <span class="text-gray-300 text-sm">${event.organizer}</span>
                        </div>
                    </div>
                    
                    <div class="space-y-2">
                        <div class="flex items-center gap-2">
                            <i class="fas fa-user-friends text-xs text-robotics-gold"></i>
                            <span class="text-gray-300 text-sm">
                                ${event.registered}/${event.capacity} Registered
                            </span>
                        </div>
                        <div class="registration-progress">
                            <div class="registration-progress-bar" 
                                 style="width: ${(event.registered / event.capacity) * 100}%"></div>
                        </div>
                    </div>
                </div>
                
                <button class="register-btn ${event.registered >= event.capacity ? 'full' : ''}" 
                        data-event-id="${event.id}"
                        ${event.registered >= event.capacity ? 'disabled' : ''}>
                    <i class="fas fa-user-plus"></i>
                    ${event.registered >= event.capacity ? 'Fully Booked' : 'Register Interest'}
                </button>
            </div>
        </div>
    </div>
`,

    // Past event gallery item
    pastEventCard: (event) => `
        <div class="gallery-item animate-fade-in-up" data-id="${event.id}" data-category="${event.category}">
            <img src="${event.image}" alt="${event.title}" class="w-full h-full object-cover">
            
            <div class="gallery-overlay">
                <span class="category-badge category-${event.category} mb-2">
                    ${event.category.toUpperCase()}
                </span>
                <h4 class="text-lg font-orbitron font-bold text-white mb-2">
                    ${event.title}
                </h4>
                <p class="text-gray-300 text-sm mb-2">${Utils.formatDate(event.date)}</p>
                <p class="text-gray-300 text-xs">${event.brief}</p>
            </div>
        </div>
    `,

    // Empty state template
    emptyState: (message) => `
        <div class="empty-state">
            <i class="fas fa-calendar-times"></i>
            <h3 class="text-xl font-orbitron font-bold text-white mb-2">No Events Found</h3>
            <p class="text-gray-300">${message}</p>
        </div>
    `
};

// Event Handlers
const Handlers = {
    // Initialize event listeners
    initEventListeners: () => {
        // Filter change listeners
        DOM.categoryFilter.addEventListener('change', (e) => {
            State.selectedCategory = e.target.value;
            Handlers.filterUpcomingEvents();
        });

        DOM.dateFilter.addEventListener('change', (e) => {
            State.selectedDate = e.target.value;
            Handlers.filterUpcomingEvents();
        });

        DOM.pastCategoryFilter.addEventListener('change', (e) => {
            State.selectedPastCategory = e.target.value;
            Handlers.filterPastEvents();
        });

        // Register button click handler (event delegation)
        document.addEventListener('click', (e) => {
            if (e.target.closest('.register-btn') && !e.target.closest('.register-btn:disabled')) {
                const button = e.target.closest('.register-btn');
                const eventId = button.dataset.eventId;
                Handlers.handleRegistration(eventId);
            }
        });
    },

    // Handle event registration
    handleRegistration: (eventId) => {
        const event = State.events.find(e => e.id == eventId);
        if (!event) return;

        // In a real application, this would be an API call
        // For demo purposes, we'll simulate registration
        if (event.registered < event.capacity) {
            event.registered++;

            // Show success message
            const toast = document.createElement('div');
            toast.className = 'fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 animate-fade-in-up';
            toast.innerHTML = `
                <i class="fas fa-check-circle mr-2"></i>
                Successfully registered interest for "${event.title}"
            `;
            document.body.appendChild(toast);

            // Remove toast after 3 seconds
            setTimeout(() => {
                toast.remove();
            }, 3000);

            // Update the display
            Handlers.filterUpcomingEvents();

            // If event is featured, update featured section too
            if (event.featured) {
                Handlers.renderFeaturedEvents();
            }
        }
    },

    // Filter upcoming events based on selected filters
    filterUpcomingEvents: () => {
        let filtered = State.events.filter(event =>
            Utils.isUpcoming(event) || Utils.isOngoing(event)
        );

        // Apply category filter
        if (State.selectedCategory !== 'all') {
            filtered = filtered.filter(event =>
                event.category === State.selectedCategory
            );
        }

        // Apply date filter
        if (State.selectedDate !== 'all') {
            const now = new Date();
            const tomorrow = new Date(now);
            tomorrow.setDate(tomorrow.getDate() + 1);
            const nextWeek = new Date(now);
            nextWeek.setDate(nextWeek.getDate() + 7);
            const nextMonth = new Date(now);
            nextMonth.setMonth(nextMonth.getMonth() + 1);

            filtered = filtered.filter(event => {
                const eventDate = new Date(`${event.date}T${event.time}`);
                switch (State.selectedDate) {
                    case 'today':
                        return eventDate.toDateString() === now.toDateString();
                    case 'tomorrow':
                        return eventDate.toDateString() === tomorrow.toDateString();
                    case 'week':
                        return eventDate >= now && eventDate <= nextWeek;
                    case 'month':
                        return eventDate >= now && eventDate <= nextMonth;
                    default:
                        return true;
                }
            });
        }

        State.filteredUpcoming = filtered;
        Handlers.renderUpcomingEvents();
        Handlers.renderOngoingEvents();
    },

    // Filter past events based on selected category
    filterPastEvents: () => {
        let filtered = State.events.filter(event => Utils.isPast(event));

        // Apply category filter
        if (State.selectedPastCategory !== 'all') {
            filtered = filtered.filter(event =>
                event.category === State.selectedPastCategory
            );
        }

        State.filteredPast = filtered;
        Handlers.renderPastEvents();
    },

    // Render featured events
    renderFeaturedEvents: () => {
        const featured = State.events.filter(event =>
            event.featured && (Utils.isUpcoming(event) || Utils.isOngoing(event))
        ).slice(0, 3); // Show max 3 featured events

        if (featured.length === 0) {
            DOM.featuredEvents.innerHTML = Templates.emptyState(
                'No featured events scheduled at the moment. Check back soon!'
            );
            return;
        }

        DOM.featuredEvents.innerHTML = featured.map(Templates.featuredEvent).join('');
    },

    // Render upcoming events
    renderUpcomingEvents: () => {
        const upcoming = State.filteredUpcoming.filter(event => Utils.isUpcoming(event));

        if (upcoming.length === 0) {
            DOM.upcomingEvents.innerHTML = Templates.emptyState(
                'No upcoming events match your filters. Try changing your selection.'
            );
            return;
        }

        DOM.upcomingEvents.innerHTML = upcoming
            .slice(0, 6) // Show max 6 events
            .map(Templates.eventCard)
            .join('');
    },

    // Render ongoing events
    renderOngoingEvents: () => {
        const ongoing = State.filteredUpcoming.filter(event => Utils.isOngoing(event));

        if (ongoing.length === 0) {
            DOM.ongoingEvents.innerHTML = Templates.emptyState(
                'No events are currently ongoing.'
            );
            return;
        }

        DOM.ongoingEvents.innerHTML = ongoing
            .slice(0, 3) // Show max 3 ongoing events
            .map(Templates.eventCard)
            .join('');
    },

    // Render past events
    renderPastEvents: () => {
        if (State.filteredPast.length === 0) {
            DOM.pastEvents.innerHTML = Templates.emptyState(
                'No past events match your filter selection.'
            );
            return;
        }

        DOM.pastEvents.innerHTML = State.filteredPast
            .slice(0, 9) // Show max 9 past events in gallery
            .map(Templates.pastEventCard)
            .join('');
    }
};

// Main Application Controller
const App = {
    // Initialize the application
    init: async () => {
        try {
            // Show loading state
            DOM.loadingSpinner.style.display = 'block';
            DOM.eventsContent.style.display = 'none';

            // Load events data
            await App.loadEventsData();

            // Initialize event listeners
            Handlers.initEventListeners();

            // Initial render
            Handlers.filterUpcomingEvents();
            Handlers.filterPastEvents();
            Handlers.renderFeaturedEvents();

            // Hide loading spinner
            DOM.loadingSpinner.style.display = 'none';
            DOM.eventsContent.style.display = 'block';

            // Add animation delay to cards
            setTimeout(() => {
                document.querySelectorAll('.animate-fade-in-up').forEach((card, index) => {
                    card.style.animationDelay = `${index * 0.1}s`;
                });
            }, 100);

        } catch (error) {
            console.error('Error initializing events page:', error);
            DOM.loadingSpinner.style.display = 'none';
            DOM.eventsContent.innerHTML = `
                <div class="text-center py-20">
                    <i class="fas fa-exclamation-triangle text-4xl text-red-500 mb-4"></i>
                    <h3 class="text-xl font-orbitron font-bold text-white mb-2">Error Loading Events</h3>
                    <p class="text-gray-300">Please try refreshing the page or contact support.</p>
                </div>
            `;
        }
    },

    // Load events data from JSON file
    loadEventsData: async () => {
        // In a real application, this would be an API call
        // For demo purposes, we'll use the static data
        const response = await fetch('./data/events.json');
        if (!response.ok) {
            throw new Error('Failed to load events data');
        }

        const data = await response.json();
        State.events = data.events;

        // Populate category filters
        App.populateCategoryFilters(data.categories);
    },

    // Populate category filter dropdowns
    populateCategoryFilters: (categories) => {
        const categoryOptions = categories.map(category => `
            <option value="${category}">
                ${category.charAt(0).toUpperCase() + category.slice(1)}
            </option>
        `).join('');

        DOM.categoryFilter.innerHTML = categoryOptions;
        DOM.pastCategoryFilter.innerHTML = categoryOptions;
    }
};

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', App.init);