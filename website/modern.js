// Modern website functionality
document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    setupMobileMenu();
    
    // Smooth scrolling for navigation links
    setupSmoothScrolling();
    
    // Animate elements on scroll
    setupScrollAnimations();
    
    // Form validation
    setupFormValidation();
});

/**
 * Sets up the mobile menu functionality
 */
function setupMobileMenu() {
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const nav = document.getElementById('nav');
    
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', function() {
            nav.classList.toggle('active');
            document.body.classList.toggle('menu-open');
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (nav.classList.contains('active') && 
                !nav.contains(e.target) && 
                e.target !== mobileMenuBtn) {
                nav.classList.remove('active');
                document.body.classList.remove('menu-open');
            }
        });
        
        // Close menu when clicking on a nav link
        const navLinks = document.querySelectorAll('nav a');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                nav.classList.remove('active');
                document.body.classList.remove('menu-open');
            });
        });
    }
}

/**
 * Sets up smooth scrolling for navigation links
 */
function setupSmoothScrolling() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const headerOffset = 80;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/**
 * Sets up animations for elements when they come into view
 */
function setupScrollAnimations() {
    // Add fade-in animation class to elements
    const animatedElements = [
        ...document.querySelectorAll('.hero-text'),
        ...document.querySelectorAll('.hero-image'),
        ...document.querySelectorAll('.about-image'),
        ...document.querySelectorAll('.about-text'),
        ...document.querySelectorAll('.project-card'),
        ...document.querySelectorAll('.contact-form')
    ];
    
    // Add animation classes
    animatedElements.forEach((element, index) => {
        element.classList.add('animate-on-scroll');
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        element.dataset.delay = index * 0.1;
    });
    
    // Check if elements are in viewport and animate them
    function checkIfInView() {
        animatedElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const elementBottom = element.getBoundingClientRect().bottom;
            const isVisible = (elementTop < window.innerHeight - 100) && (elementBottom > 0);
            
            if (isVisible && element.style.opacity === '0') {
                setTimeout(() => {
                    element.style.opacity = '1';
                    element.style.transform = 'translateY(0)';
                }, element.dataset.delay * 1000);
            }
        });
    }
    
    // Run on load
    checkIfInView();
    
    // Run on scroll
    window.addEventListener('scroll', checkIfInView);
}

/**
 * Sets up form validation for the contact form
 */
function setupFormValidation() {
    const form = document.querySelector('form');
    
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form fields
            const nameInput = document.getElementById('name');
            const emailInput = document.getElementById('email');
            const messageInput = document.getElementById('message');
            
            // Simple validation
            let isValid = true;
            
            if (!nameInput.value.trim()) {
                showError(nameInput, 'Please enter your name');
                isValid = false;
            } else {
                clearError(nameInput);
            }
            
            if (!emailInput.value.trim()) {
                showError(emailInput, 'Please enter your email');
                isValid = false;
            } else if (!isValidEmail(emailInput.value)) {
                showError(emailInput, 'Please enter a valid email');
                isValid = false;
            } else {
                clearError(emailInput);
            }
            
            if (!messageInput.value.trim()) {
                showError(messageInput, 'Please enter your message');
                isValid = false;
            } else {
                clearError(messageInput);
            }
            
            // If valid, show success message
            if (isValid) {
                // In a real application, you would send the form data to a server here
                showSuccessMessage(form);
            }
        });
    }
    
    // Helper functions for form validation
    function showError(input, message) {
        const formGroup = input.parentElement;
        let errorElement = formGroup.querySelector('.error-message');
        
        if (!errorElement) {
            errorElement = document.createElement('div');
            errorElement.className = 'error-message';
            errorElement.style.color = '#e53e3e';
            errorElement.style.fontSize = '0.875rem';
            errorElement.style.marginTop = '0.25rem';
            formGroup.appendChild(errorElement);
        }
        
        errorElement.textContent = message;
        input.style.borderColor = '#e53e3e';
    }
    
    function clearError(input) {
        const formGroup = input.parentElement;
        const errorElement = formGroup.querySelector('.error-message');
        
        if (errorElement) {
            errorElement.textContent = '';
        }
        
        input.style.borderColor = '';
    }
    
    function isValidEmail(email) {
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }
    
    function showSuccessMessage(form) {
        // Hide the form
        form.style.display = 'none';
        
        // Create success message
        const successMessage = document.createElement('div');
        successMessage.className = 'success-message';
        successMessage.style.textAlign = 'center';
        successMessage.style.padding = '2rem';
        
        const icon = document.createElement('div');
        icon.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color: #10b981; margin-bottom: 1rem;"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>`;
        
        const heading = document.createElement('h3');
        heading.textContent = 'Message Sent!';
        heading.style.fontSize = '1.5rem';
        heading.style.marginBottom = '1rem';
        
        const text = document.createElement('p');
        text.textContent = 'Thank you for your message. I will get back to you as soon as possible.';
        
        successMessage.appendChild(icon);
        successMessage.appendChild(heading);
        successMessage.appendChild(text);
        
        // Add success message to the DOM
        form.parentElement.appendChild(successMessage);
        
        // Reset form (in case user navigates back)
        form.reset();
        
        // Optional: Add a button to send another message
        const resetButton = document.createElement('button');
        resetButton.textContent = 'Send Another Message';
        resetButton.className = 'submit-btn';
        resetButton.style.marginTop = '1.5rem';
        
        resetButton.addEventListener('click', function() {
            successMessage.remove();
            form.style.display = 'block';
        });
        
        successMessage.appendChild(resetButton);
    }
}

// Add a subtle parallax effect to the hero section
window.addEventListener('scroll', function() {
    const scrollPosition = window.pageYOffset;
    const heroImage = document.querySelector('.hero-image img');
    
    if (heroImage) {
        heroImage.style.transform = `translateY(${scrollPosition * 0.1}px)`;
    }
});

// Add a theme toggle functionality (light/dark mode)
function setupThemeToggle() {
    // This is a placeholder for future implementation
    // You could add a theme toggle button in the header
    // and implement light/dark mode switching
} 