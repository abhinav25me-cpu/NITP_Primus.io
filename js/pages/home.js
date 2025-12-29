function initHeroEffects() { let t = document.getElementById("particles-container"); if (t) for (let e = 0; e < 30; e++) { let s = document.createElement("div"); s.className = "particle"; let i = 20 * Math.random() + 5; s.style.width = `${i}px`, s.style.height = `${i}px`, s.style.left = `${100 * Math.random()}%`, s.style.animationDelay = `${10 * Math.random()}s`, s.style.animationDuration = `${10 * Math.random() + 10}s`, t.appendChild(s) } let a = document.querySelector(".background-wrapper"); if (a && window.matchMedia("(pointer: fine)").matches) { let n = 0, r = 0, o = null, l = () => { a.style.transform = `translate3d(${n}px, ${r}px, 0)`, o = null }; document.addEventListener("mousemove", t => { n = (t.clientX / window.innerWidth - .5) * 8, r = (t.clientY / window.innerHeight - .5) * 8, o || (o = requestAnimationFrame(l)) }) } let c = document.querySelector(".tagline"); if (c) { let d = c.textContent.trim(); c.textContent = ""; let h = 0, m = new IntersectionObserver(t => { t.forEach(t => { t.isIntersecting && (!function t() { h < d.length && (c.textContent += d.charAt(h++), setTimeout(t, 5)) }(), m.unobserve(t.target)) }) }, { threshold: .5 }); m.observe(c) } } function initStatsCounters() { let t = document.querySelectorAll(".stat-item"); if (!t.length) return; let e = new IntersectionObserver(t => { t.forEach(t => { t.isIntersecting && (!function t(e) { let s = e.querySelector(".stat-number"), i = parseInt(s.getAttribute("data-count")); if (isNaN(i)) return; let a = i / 120, n = 0; function r() { n++; let t = Math.min(Math.round(a * n), i); s.textContent = t, t < i && requestAnimationFrame(r) } s.textContent = "0", requestAnimationFrame(r) }(t.target), e.unobserve(t.target)) }) }, { threshold: .3, rootMargin: "100px" }); t.forEach(t => e.observe(t)) } !function () { "use strict"; function t(t, e) { let s = document.querySelector(t); s && "function" == typeof e && e(s) } function e(t, e) { let s = document.querySelectorAll(t); s.length && "function" == typeof e && e(s) } document.addEventListener("DOMContentLoaded", function e() { t("#highlights", () => { window.highlightsSection = new HighlightsSection }), t("#image-slider", () => { window.simpleSlider = new SimpleImageSlider }); let s = document.body.classList.contains("homepage") || location.pathname.endsWith("/") || location.pathname.includes("index.html"); s && (window.eventsTeaser = new EventsTeaser), t("#recent-achievements", () => { setTimeout(() => { initRecentAchievements() }, 300) }), initHeroEffects(), initStatsCounters(), document.querySelectorAll('a[href^="#"]').forEach(t => { t.addEventListener("click", function (t) { let e = this.getAttribute("href"); if (!e || "#" === e) return; let s = document.querySelector(e); s && (t.preventDefault(), window.scrollTo({ top: s.offsetTop - 100, behavior: "smooth" })) }) }), window.matchMedia("(prefers-reduced-motion: reduce)").matches && (document.documentElement.classList.add("reduce-motion"), document.querySelectorAll("*").forEach(t => { t.style.animation = "none", t.style.transition = "none" })) }) }(); class HighlightsSection { constructor() { this.init() } init() { this.cache(), this.section && (this.bindEvents(), this.setupRevealAnimation(), this.setupCounterObserver()) } cache() { this.section = document.getElementById("highlights"), this.cards = Array.from(document.querySelectorAll(".highlight-card")), this.statNumbers = Array.from(document.querySelectorAll(".stat-number")), this.statBoxes = Array.from(document.querySelectorAll(".stat-box")) } bindEvents() { this.cards.forEach(t => { t.addEventListener("mouseenter", () => { t.style.transform = "translateY(-10px) scale(1.02)" }), t.addEventListener("mouseleave", () => { t.style.transform = "translateY(-10px)" }), t.addEventListener("click", e => { e.target.closest("a") || (t.style.transform = "translateY(-10px) scale(0.98)", setTimeout(() => { t.style.transform = "translateY(-10px) scale(1.02)" }, 150)) }) }), this.statBoxes.forEach(t => { t.addEventListener("mouseenter", () => { t.style.transform = "translateY(-5px)" }), t.addEventListener("mouseleave", () => { t.style.transform = "" }) }) } setupRevealAnimation() { this.cards.forEach(t => { t.style.opacity = "0", t.style.transform = "translateY(30px)", t.style.transition = "opacity 0.8s cubic-bezier(0.4,0,0.2,1), transform 0.8s cubic-bezier(0.4,0,0.2,1)" }); let t = new IntersectionObserver(e => { e[0].isIntersecting && (this.cards.forEach((t, e) => { setTimeout(() => { t.classList.add("fade-in-up"), t.style.opacity = "1", t.style.transform = "translateY(0)" }, 200 * e) }), t.disconnect()) }, { threshold: .2 }); t.observe(this.section) } setupCounterObserver() { let t = new IntersectionObserver(e => { e[0].isIntersecting && (this.animateCounters(), t.disconnect()) }, { threshold: .3 }); t.observe(this.section) } animateCounters() { this.statNumbers.forEach(t => { if (t.dataset.animated) return; let e = parseInt(t.getAttribute("data-count"), 10) || 0; t.dataset.animated = "true"; let s = performance.now(); function i(a) { let n = Math.min((a - s) / 2e3, 1); t.textContent = Math.floor(n * e), t.style.transform = "scale(1.1)", setTimeout(() => t.style.transform = "scale(1)", 50), n < 1 && requestAnimationFrame(i) } requestAnimationFrame(i) }) } } class EventsTeaser {
    constructor() { this.config = { eventsDataUrl: "./data/events.json", autoRotate: !0, rotateInterval: 8e3, skeletonDuration: 1500 }, this.state = { events: [], featuredEvents: [], currentIndex: 0, isLoading: !0, isAutoRotating: !0 }, this.elements = { container: null, eventsGrid: null, skeletonContainer: null, prevBtn: null, nextBtn: null, emptyState: null }, this.init() } async init() { try { this.createDOM(), await this.loadEvents(), this.filterFeaturedEvents(), this.renderEvents(), this.setupEventListeners(), this.config.autoRotate && this.startAutoRotation() } catch (t) { console.error("Error initializing events teaser:", t), this.showErrorState() } } createDOM() { let t = document.createElement("div"), e = document.createElement("div"); e.className = "container mx-auto px-4 relative z-10", this.elements.skeletonContainer = document.createElement("div"), this.elements.skeletonContainer.className = "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-10", this.elements.skeletonContainer.id = "events-teaser-skeleton"; for (let s = 0; s < 3; s++) { let i = document.createElement("div"); i.className = "skeleton-card", this.elements.skeletonContainer.appendChild(i) } e.appendChild(this.elements.skeletonContainer), this.elements.eventsGrid = document.createElement("div"), this.elements.eventsGrid.className = "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-10 hidden", this.elements.eventsGrid.id = "events-teaser-grid", e.appendChild(this.elements.eventsGrid), this.elements.emptyState = this.createEmptyState(), this.elements.emptyState.className += " hidden", e.appendChild(this.elements.emptyState); let a = document.createElement("div"); a.className = "relative mt-12", this.elements.prevBtn = document.createElement("button"), this.elements.prevBtn.className = "teaser-nav-btn teaser-nav-prev", this.elements.prevBtn.innerHTML = '<i class="fas fa-chevron-left"></i>', this.elements.prevBtn.setAttribute("aria-label", "Previous events"), this.elements.nextBtn = document.createElement("button"), this.elements.nextBtn.className = "teaser-nav-btn teaser-nav-next", this.elements.nextBtn.innerHTML = '<i class="fas fa-chevron-right"></i>', this.elements.nextBtn.setAttribute("aria-label", "Next events"), a.appendChild(this.elements.prevBtn), a.appendChild(this.elements.nextBtn), e.appendChild(a), t.appendChild(e); let n = document.getElementById("homepage-events-teaser") || document.querySelector("main") || document.body; n ? n.appendChild(t) : document.body.appendChild(t), this.elements.container = t } createEmptyState() {
        let t = document.createElement("div"); return t.className = "text-center py-12", t.innerHTML = `
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
        `, t
    } async loadEvents() { try { let t = await fetch(this.config.eventsDataUrl); if (!t.ok) throw Error(`HTTP error! status: ${t.status}`); let e = await t.json(); this.state.events = e.events || [] } catch (s) { throw console.error("Error loading events data:", s), s } } filterFeaturedEvents() { let t = new Date; this.state.featuredEvents = this.state.events.filter(e => { if (!e.featured) return !1; let s = new Date(`${e.date}T${e.time}`), i = new Date(`${e.endDate}T${e.endTime}`); return s > t || t >= s && t <= i }).sort((t, e) => new Date(t.date) - new Date(e.date)) } calculateCountdown(t) { let e = new Date, s = new Date(t), i = s - e; return i <= 0 ? null : { days: Math.floor(i / 864e5), hours: Math.floor(i % 864e5 / 36e5), minutes: Math.floor(i % 36e5 / 6e4), seconds: Math.floor(i % 6e4 / 1e3) } } formatDate(t) { let e = new Date(t); return e.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) } formatTime(t) { return new Date(`2000-01-01T${t}`).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }) } getCategoryStyle(t) { return ({ workshop: "bg-blue-500/10 text-blue-300 border-blue-500/30", competition: "bg-red-500/10 text-red-300 border-red-500/30", hackathon: "bg-purple-500/10 text-purple-300 border-purple-500/30", seminar: "bg-green-500/10 text-green-300 border-green-500/30", bootcamp: "bg-yellow-500/10 text-yellow-300 border-yellow-500/30" })[t] || "bg-gray-500/10 text-gray-300 border-gray-500/30" } createEventCard(t) {
        let e = this.calculateCountdown(`${t.date}T${t.time}`), s = this.getCategoryStyle(t.category); return `
            <div class="teaser-event-card animate-fade-in-up" data-event-id="${t.id}">
                <div class="featured-badge">
                    <i class="fas fa-fire mr-1"></i> Featured
                </div>
                
                <div class="teaser-image-container">
                    <img src="${t.image}" 
                         alt="${t.title}" 
                         class="teaser-image" 
                         loading="lazy">
                    <div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-robotics-blue/90 to-transparent p-4">
                        <span class="category-tag ${s} border">
                            <i class="fas fa-tag"></i>
                            ${t.category.charAt(0).toUpperCase() + t.category.slice(1)}
                        </span>
                    </div>
                </div>
                
                <div class="p-5">
                    <h3 class="text-lg font-orbitron font-bold text-white mb-2 line-clamp-2" 
                        style="min-height: 3rem;">
                        ${t.title}
                    </h3>
                    
                    <p class="text-gray-300 text-sm mb-4 line-clamp-2" style="min-height: 2.5rem;">
                        ${t.brief}
                    </p>
                    
                    <div class="flex items-center justify-between mb-4">
                        <div class="flex items-center gap-2">
                            <i class="fas fa-calendar text-robotics-gold text-sm"></i>
                            <span class="text-gray-300 text-sm">
                                ${this.formatDate(t.date)}
                            </span>
                        </div>
                        <div class="flex items-center gap-2">
                            <i class="fas fa-clock text-robotics-gold text-sm"></i>
                            <span class="text-gray-300 text-sm">
                                ${this.formatTime(t.time)}
                            </span>
                        </div>
                    </div>
                    
                    <div class="flex items-center gap-2 mb-4">
                        <i class="fas fa-map-marker-alt text-robotics-gold text-sm"></i>
                        <span class="text-gray-300 text-sm truncate">${t.venue}</span>
                    </div>
                    
                    ${e ? `
                        <div class="mb-4">
                            <p class="text-gray-300 text-xs mb-2 text-center">Starts in:</p>
                            <div class="countdown-timer">
                                <div class="countdown-item">
                                    <span class="countdown-value">${e.days}</span>
                                    <span class="countdown-label">Days</span>
                                </div>
                                <div class="countdown-item">
                                    <span class="countdown-value">${e.hours}</span>
                                    <span class="countdown-label">Hours</span>
                                </div>
                                <div class="countdown-item">
                                    <span class="countdown-value">${e.minutes}</span>
                                    <span class="countdown-label">Mins</span>
                                </div>
                            </div>
                        </div>
                    `: ""}
                    </br>
                    <button class="register-btn cta-button secondary w-full py-2.5 text-sm" 
                            data-event-id="${t.id}"
                            ${t.registered >= t.capacity ? "disabled" : ""}>
                        <i class="fas fa-user-plus mr-2"></i>
                        ${t.registered >= t.capacity ? "Fully Booked" : "Register Now"}
                    </button>
                </div>
            </div>
        `} renderEvents() { setTimeout(() => { if (this.elements.skeletonContainer.classList.add("hidden"), this.state.featuredEvents.length > 0) { this.elements.eventsGrid.classList.remove("hidden"), this.elements.eventsGrid.innerHTML = this.state.featuredEvents.map(t => this.createEventCard(t)).join(""); let t = this.elements.eventsGrid.querySelectorAll(".animate-fade-in-up"); t.forEach((t, e) => { t.style.animationDelay = `${.15 * e}s` }) } else this.elements.emptyState.classList.remove("hidden"); this.state.isLoading = !1 }, this.config.skeletonDuration) } setupEventListeners() { this.elements.prevBtn.addEventListener("click", () => { this.navigate(-1), this.resetAutoRotation() }), this.elements.nextBtn.addEventListener("click", () => { this.navigate(1), this.resetAutoRotation() }), this.elements.eventsGrid.addEventListener("click", t => { let e = t.target.closest(".register-btn"); e && !e.disabled && this.handleRegistration(e.dataset.eventId); let s = t.target.closest(".teaser-event-card"); s && !t.target.closest(".register-btn") && this.handleCardClick(s.dataset.eventId) }), document.addEventListener("keydown", t => { "ArrowLeft" === t.key ? (this.navigate(-1), this.resetAutoRotation()) : "ArrowRight" === t.key && (this.navigate(1), this.resetAutoRotation()) }), this.elements.container.addEventListener("mouseenter", () => { this.pauseAutoRotation() }), this.elements.container.addEventListener("mouseleave", () => { this.state.isAutoRotating && this.startAutoRotation() }) } navigate(t) { this.state.featuredEvents.length <= 1 || (this.state.currentIndex += t, this.state.currentIndex < 0 ? this.state.currentIndex = this.state.featuredEvents.length - 1 : this.state.currentIndex >= this.state.featuredEvents.length && (this.state.currentIndex = 0), this.updateActiveState()) } updateActiveState() { let t = this.elements.eventsGrid.querySelectorAll(".teaser-event-card"); t.forEach((t, e) => { e === this.state.currentIndex ? t.classList.add("ring-2", "ring-robotics-gold") : t.classList.remove("ring-2", "ring-robotics-gold") }) } handleRegistration(t) { let e = this.state.featuredEvents.find(e => e.id == t); e && (this.showToast(`Redirecting to registration for "${e.title}"`), setTimeout(() => { window.location.href = e.registrationLink || "./events.html" }, 500)) } handleCardClick(t) { window.location.href = `./events.html#event-${t}` } startAutoRotation() { this.rotationTimer && clearInterval(this.rotationTimer), this.rotationTimer = setInterval(() => { this.navigate(1) }, this.config.rotateInterval), this.state.isAutoRotating = !0 } pauseAutoRotation() { this.rotationTimer && (clearInterval(this.rotationTimer), this.state.isAutoRotating = !1) } resetAutoRotation() { this.pauseAutoRotation(), this.config.autoRotate && setTimeout(() => this.startAutoRotation(), 2e3) } showToast(t) {
        let e = document.createElement("div"); e.className = "fixed top-4 right-4 bg-robotics-blue border border-robotics-gold/30 text-white px-4 py-3 rounded-lg shadow-lg z-50 animate-fade-in-up", e.innerHTML = `
            <div class="flex items-center gap-3">
                <i class="fas fa-info-circle text-robotics-gold"></i>
                <span>${t}</span>
            </div>
        `, document.body.appendChild(e), setTimeout(() => { e.classList.add("opacity-0", "transition-opacity", "duration-300"), setTimeout(() => e.remove(), 300) }, 3e3)
    } showErrorState() {
        this.elements.skeletonContainer.classList.add("hidden"); let t = document.createElement("div"); t.className = "text-center py-12", t.innerHTML = `
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
        `, this.elements.container.querySelector(".container").appendChild(t)
    } destroy() { this.rotationTimer && clearInterval(this.rotationTimer), this.elements.prevBtn?.removeEventListener("click", () => { }), this.elements.nextBtn?.removeEventListener("click", () => { }), this.elements.container?.remove() }
} class SimpleImageSlider {
    constructor() { this.currentIndex = 1, this.images = [], this.totalImages = 1, this.isAnimating = !1, this.autoPlayInterval = null, this.isAutoPlaying = !0, this.autoPlayDelay = 3e3, this.init() } async init() { this.cacheElements(), await this.loadImages(), this.setupEventListeners(), this.startAutoPlay(), this.updateUI() } cacheElements() { this.slidesContainer = document.getElementById("slides-container"), this.dotsContainer = document.getElementById("slider-dots"), this.prevBtn = document.querySelector(".slider-prev"), this.nextBtn = document.querySelector(".slider-next"), this.currentSlideEl = document.getElementById("current-slide"), this.totalSlidesEl = document.getElementById("total-slides"), this.imageTitleEl = document.getElementById("image-title"), this.imageDescEl = document.getElementById("image-description"), this.loadingIndicator = document.querySelector(".loading-indicator") } async loadImages() { try { this.loadingIndicator && this.loadingIndicator.classList.remove("hidden"), await this.loadFromJSON() } catch (t) { console.error("Error loading images:", t) } finally { this.loadingIndicator && this.loadingIndicator.classList.add("hidden") } } async loadFromJSON() { this.images = [{ id: 1, title: "Robotics Club", description: "Our club activities", url: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=800&q=80", alt: "Robotics club", category: "Club" }, { id: 2, title: "Technical Workshop", description: "Hands-on learning sessions", url: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&w=800&q=80", alt: "Technical workshop", category: "Workshop" }, { id: 3, title: "Coding Event", description: "Competitive programming and hackathons", url: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80", alt: "Coding event", category: "Event" }, { id: 4, title: "Mechanical Lab", description: "Practical mechanical engineering experiments", url: "https://images.unsplash.com/photo-1581091012184-5c7d7b6d3c98?auto=format&fit=crop&w=800&q=80", alt: "Mechanical engineering lab", category: "Laboratory" }, { id: 5, title: "Electronics Project", description: "Innovative electronics and PCB design", url: "https://images.unsplash.com/photo-1581090700227-1e37b190418e?auto=format&fit=crop&w=800&q=80", alt: "Electronics project", category: "Project" }, { id: 6, title: "Team Collaboration", description: "Students working together on projects", url: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=800&q=80", alt: "Team collaboration", category: "Team" }, { id: 7, title: "Innovation Showcase", description: "Displaying student innovations", url: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=80", alt: "Innovation showcase", category: "Exhibition" }, { id: 8, title: "AI & Robotics", description: "Artificial intelligence and robotics research", url: "https://images.unsplash.com/photo-1531746790731-6c087fecd65a?auto=format&fit=crop&w=800&q=80", alt: "AI robotics", category: "Research" }, { id: 9, title: "Campus Event", description: "Annual technical fest", url: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=800&q=80", alt: "Campus technical event", category: "Festival" }, { id: 10, title: "Student Presentation", description: "Knowledge sharing sessions", url: "https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?auto=format&fit=crop&w=800&q=80", alt: "Student presentation", category: "Seminar" }], this.totalImages = this.images.length, this.renderSlides() } renderSlides() { this.slidesContainer && 0 !== this.images.length && (this.slidesContainer.innerHTML = "", this.images.forEach((t, e) => { let s = this.createSlide(t, e); this.slidesContainer.appendChild(s), this.lazyLoadImage(s.querySelector("img")) }), this.renderDots(), this.showSlide(0)) } createSlide(t, e) {
        let s = document.createElement("div"); return s.className = "slide", s.dataset.index = e, s.innerHTML = `
            <img src="${t.url}" 
                 alt="${t.alt}" 
                 loading="lazy"
                 onerror="this.src='https://images.unsplash.com/photo-1555949963-aa79dcee981c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'">
            <div class="slide-overlay">
                <span class="slide-category">${t.category}</span>
                <h3 class="slide-title">${t.title}</h3>
                <p class="slide-description">${t.description}</p>
            </div>
        `, s
    } renderDots() { if (this.dotsContainer) { this.dotsContainer.innerHTML = ""; for (let t = 0; t < this.totalImages; t++) { let e = document.createElement("button"); e.className = "slider-dot", e.dataset.index = t, e.setAttribute("aria-label", `Go to slide ${t + 1}`), this.dotsContainer.appendChild(e) } } } lazyLoadImage(t) { let e = new IntersectionObserver(t => { t.forEach(t => { if (t.isIntersecting) { let s = t.target; s.classList.add("loaded"), e.unobserve(s) } }) }, { threshold: .1 }); e.observe(t) } setupEventListeners() { this.prevBtn && this.prevBtn.addEventListener("click", () => this.prev()), this.nextBtn && this.nextBtn.addEventListener("click", () => this.next()), this.dotsContainer?.addEventListener("click", t => { if (t.target.classList.contains("slider-dot")) { let e = parseInt(t.target.dataset.index); this.goToSlide(e) } }), document.addEventListener("keydown", t => { "ArrowLeft" === t.key && this.prev(), "ArrowRight" === t.key && this.next(), " " === t.key && (t.preventDefault(), this.toggleAutoPlay()) }), this.slidesContainer?.addEventListener("mouseenter", () => this.pauseAutoPlay()), this.slidesContainer?.addEventListener("mouseleave", () => this.resumeAutoPlay()) } showSlide(t) { if (this.isAnimating || t === this.currentIndex) return; this.isAnimating = !0; let e = document.querySelectorAll(".slide"), s = document.querySelectorAll(".slider-dot"); e[this.currentIndex] && e[this.currentIndex].classList.remove("active"), s[this.currentIndex] && s[this.currentIndex].classList.remove("active"), this.currentIndex = t, e[this.currentIndex] && e[this.currentIndex].classList.add("active"), s[this.currentIndex] && s[this.currentIndex].classList.add("active"), this.updateUI(), setTimeout(() => { this.isAnimating = !1 }, 500) } goToSlide(t) { this.showSlide(t), this.resetAutoPlay() } next() { let t = (this.currentIndex + 1) % this.totalImages; this.goToSlide(t) } prev() { let t = (this.currentIndex - 1 + this.totalImages) % this.totalImages; this.goToSlide(t) } updateUI() { if (this.currentSlideEl && (this.currentSlideEl.textContent = this.currentIndex + 1), this.totalSlidesEl && (this.totalSlidesEl.textContent = this.totalImages), this.images[this.currentIndex]) { let t = this.images[this.currentIndex]; this.imageTitleEl && (this.imageTitleEl.textContent = t.title), this.imageDescEl && (this.imageDescEl.textContent = t.description) } } startAutoPlay() { this.autoPlayInterval && clearInterval(this.autoPlayInterval), this.autoPlayInterval = setInterval(() => { this.next() }, this.autoPlayDelay), this.isAutoPlaying = !0 } pauseAutoPlay() { this.autoPlayInterval && (clearInterval(this.autoPlayInterval), this.autoPlayInterval = null), this.isAutoPlaying = !1 } resumeAutoPlay() { this.isAutoPlaying || this.startAutoPlay() } toggleAutoPlay() { this.isAutoPlaying ? this.pauseAutoPlay() : this.startAutoPlay() } resetAutoPlay() { this.isAutoPlaying && (this.pauseAutoPlay(), this.startAutoPlay()) } destroy() { this.pauseAutoPlay() }
} const ACHIEVEMENTS_CONFIG = { jsonPath: "./data/achievements.json", animationDelay: 200 }; let achievementsData = []; async function initRecentAchievements() { try { await loadAchievements(), renderAchievements(), bindAchievementEvents() } catch (t) { console.error("Achievements init failed:", t), showAchievementsError() } } async function loadAchievements() { try { let t = await fetch(ACHIEVEMENTS_CONFIG.jsonPath); if (!t.ok) throw Error("Achievements JSON failed"); let e = await t.json(); achievementsData = e.achievements || [] } catch (s) { console.warn("Data Loading Failed") } } function renderAchievements() {
    let t = document.getElementById("featured-achievements-container"); if (!t) return; let e = achievementsData.filter(t => t.featured).sort((t, e) => e.year - t.year); if (!e.length) {
        t.innerHTML = `
            <div class="col-span-full text-center py-16 text-gray-400">
                No featured achievements yet
            </div>
        `; return
    } t.innerHTML = e.map((t, e) => renderAchievementCard(t, e)).join(""), enableAchievementGlow()
} function renderAchievementCard(t, e) {
    return `
        <div class="featured-achievement-card animate-card-rise"
             style="animation-delay:${e * ACHIEVEMENTS_CONFIG.animationDelay}ms"
             data-id="${t.id}">
            
            <div class="featured-card-image">
                <img src="${t.thumbnail}"
                     alt="${t.name}"
                     loading="lazy">
            </div>

            <div class="featured-card-content">
                <h3 class="featured-card-title">
                    ${t.name}
                </h3>

                <div class="featured-achievement-type">
                    <i class="fas fa-${getAchievementIcon(t.category)}"></i>
                    ${t.achievement}
                </div>

                <p class="featured-card-description">
                    ${t.brief_description}
                </p>

                <div class="mt-6 pt-4 border-t border-gray-700/50 text-sm text-gray-400">
                    <i class="fas fa-users mr-2"></i>
                    ${t.team_members.slice(0, 2).join(", ")}
                </div>
            </div>
        </div>
    `} function enableAchievementGlow() { document.querySelectorAll(".featured-achievement-card").forEach(t => { t.addEventListener("mousemove", e => { let s = t.getBoundingClientRect(); t.style.setProperty("--mouse-x", `${(e.clientX - s.left) / s.width * 100}%`), t.style.setProperty("--mouse-y", `${(e.clientY - s.top) / s.height * 100}%`) }), t.addEventListener("click", () => { window.location.href = "achievements.html" }) }) } function bindAchievementEvents() { let t = document.querySelector(".view-more-card"); t?.addEventListener("click", () => { window.location.href = "achievements.html" }) } function getAchievementIcon(t) { return ({ competition: "flag-checkered", research: "book", innovation: "lightbulb", grants_awards: "award" })[t] || "trophy" } function showAchievementsError() {
    let t = document.getElementById("featured-achievements-container"); t && (t.innerHTML = `
        <div class="col-span-full text-center py-16 text-red-400">
            Failed to load achievements
        </div>
    `)
}