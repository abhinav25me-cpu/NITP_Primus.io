// ============================================
// CONTACT PAGE SPECIFIC JAVASCRIPT
// ============================================

document.addEventListener('DOMContentLoaded', function () {

    // ========== FORM VALIDATION & SUBMISSION ==========
    const contactForm = document.getElementById('contact-form');
    const successMessage = document.getElementById('success-message');
    const charCount = document.getElementById('char-count');
    const messageField = document.getElementById('message');

    // Character counter for message field
    messageField.addEventListener('input', function () {
        const length = this.value.length;
        charCount.textContent = length;

        // Update color based on length
        if (length > 450) {
            charCount.classList.add('text-red-400');
            charCount.classList.remove('text-gray-400', 'text-yellow-400');
        } else if (length > 400) {
            charCount.classList.add('text-yellow-400');
            charCount.classList.remove('text-gray-400', 'text-red-400');
        } else {
            charCount.classList.add('text-gray-400');
            charCount.classList.remove('text-yellow-400', 'text-red-400');
        }
    });

    // Form validation function
    const validateForm = () => {
        let isValid = true;

        // Reset all error messages
        document.querySelectorAll('[id$="-error"]').forEach(error => {
            error.classList.add('hidden');
        });

        // Validate name
        const nameField = document.getElementById('name');
        if (nameField.value.trim().length < 2) {
            document.getElementById('name-error').classList.remove('hidden');
            nameField.classList.add('border-red-400');
            isValid = false;
        } else {
            nameField.classList.remove('border-red-400');
        }

        // Validate email
        const emailField = document.getElementById('email');
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(emailField.value)) {
            document.getElementById('email-error').classList.remove('hidden');
            emailField.classList.add('border-red-400');
            isValid = false;
        } else {
            emailField.classList.remove('border-red-400');
        }

        // Validate subject
        const subjectField = document.getElementById('subject');
        if (!subjectField.value) {
            document.getElementById('subject-error').classList.remove('hidden');
            subjectField.classList.add('border-red-400');
            isValid = false;
        } else {
            subjectField.classList.remove('border-red-400');
        }

        // Validate message
        const messageValue = messageField.value.trim();
        if (messageValue.length < 10 || messageValue.length > 500) {
            document.getElementById('message-error').classList.remove('hidden');
            messageField.classList.add('border-red-400');
            isValid = false;
        } else {
            messageField.classList.remove('border-red-400');
        }

        return isValid;
    };

    // Form submission handler
    contactForm.addEventListener('submit', function (e) {
        e.preventDefault();

        // Validate form
        if (!validateForm()) {
            // Add shake animation to invalid fields
            const invalidFields = this.querySelectorAll('.border-red-400');
            invalidFields.forEach(field => {
                field.classList.add('animate-shake');
                setTimeout(() => field.classList.remove('animate-shake'), 500);
            });
            return;
        }

        // Get form data
        const formData = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            subject: document.getElementById('subject').value,
            message: document.getElementById('message').value,
            timestamp: new Date().toISOString()
        };

        // Show loading state on button
        const submitBtn = this.querySelector('.submit-btn');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Sending...';
        submitBtn.disabled = true;

        // Simulate API call with timeout
        setTimeout(() => {
            // Show success message
            successMessage.classList.add('show');

            // Reset form
            contactForm.reset();
            charCount.textContent = '0';
            charCount.classList.add('text-gray-400');
            charCount.classList.remove('text-yellow-400', 'text-red-400');

            // Reset button
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;

            // Hide success message after 5 seconds
            setTimeout(() => {
                successMessage.classList.remove('show');
            }, 5000);

            // Scroll to success message
            successMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

        }, 1500); // Simulate network delay
    });

    // ========== FAQ ACCORDION FUNCTIONALITY ==========
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        const icon = question.querySelector('i');

        // Set initial state
        answer.style.maxHeight = '0';
        answer.style.opacity = '0';
        answer.style.overflow = 'hidden';
        answer.style.transition = 'max-height 0.3s ease, opacity 0.3s ease';

        question.addEventListener('click', () => {
            // Close all other items
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    const otherAnswer = otherItem.querySelector('.faq-answer');
                    const otherIcon = otherItem.querySelector('.faq-question i');
                    otherAnswer.style.maxHeight = '0';
                    otherAnswer.style.opacity = '0';
                    otherIcon.style.transform = 'rotate(0deg)';
                }
            });

            // Toggle current item
            if (answer.style.maxHeight === '0px' || answer.style.maxHeight === '') {
                answer.style.maxHeight = answer.scrollHeight + 'px';
                answer.style.opacity = '1';
                icon.style.transform = 'rotate(180deg)';
            } else {
                answer.style.maxHeight = '0';
                answer.style.opacity = '0';
                icon.style.transform = 'rotate(0deg)';
            }
        });
    });

    // ========== SOCIAL MEDIA LINK ANIMATIONS ==========
    const socialLinks = document.querySelectorAll('.social-link');

    socialLinks.forEach(link => {
        link.addEventListener('mouseenter', function () {
            this.style.transform = 'translateY(-5px) scale(1.1)';
        });

        link.addEventListener('mouseleave', function () {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });

    // ========== ANIMATION ON SCROLL ==========
    const animateElements = document.querySelectorAll('.animate-fade-in-up, .animate-slide-in-left, .animate-slide-in-right');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translate(0, 0)';
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    animateElements.forEach(element => {
        element.style.opacity = '0';
        if (element.classList.contains('animate-slide-in-left')) {
            element.style.transform = 'translateX(-30px)';
        } else if (element.classList.contains('animate-slide-in-right')) {
            element.style.transform = 'translateX(30px)';
        } else {
            element.style.transform = 'translateY(20px)';
        }
        observer.observe(element);
    });

    // ========== INPUT FIELD FOCUS EFFECTS ==========
    const formInputs = document.querySelectorAll('.form-input');

    formInputs.forEach(input => {
        input.addEventListener('focus', function () {
            this.parentElement.classList.add('ring-2', 'ring-robotics-gold/30');
        });

        input.addEventListener('blur', function () {
            this.parentElement.classList.remove('ring-2', 'ring-robotics-gold/30');
        });
    });

    // ========== LOCATION IMAGE LAZY LOADING ==========
    const locationImage = document.querySelector('.location-container img');
    if (locationImage) {
        // Add loading animation
        locationImage.style.opacity = '0';
        locationImage.style.transition = 'opacity 0.5s ease';

        // Simulate loading delay for better UX
        setTimeout(() => {
            locationImage.style.opacity = '1';
        }, 300);
    }

    // ========== REDUCED MOTION PREFERENCE ==========
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

    if (prefersReducedMotion.matches) {
        // Disable all animations
        document.querySelectorAll('*').forEach(el => {
            el.style.animation = 'none !important';
            el.style.transition = 'none !important';
        });

        // Show all content immediately
        animateElements.forEach(element => {
            element.style.opacity = '1';
            element.style.transform = 'none';
        });
    }
});