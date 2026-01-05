/* ============================================================
   Common ANIMATED STATISTICS COUNTERS
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