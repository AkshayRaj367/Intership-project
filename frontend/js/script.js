// Mobile Menu Toggle
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const mobileMenu = document.getElementById('mobile-menu');

mobileMenuBtn.addEventListener('click', () => {
    mobileMenu.classList.toggle('hidden');
});

// Smooth Scrolling for Navigation Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
            // Close mobile menu if open
            mobileMenu.classList.add('hidden');
        }
    });
});

// Contact Form Handling
const contactForm = document.getElementById('contactForm');
const formMessage = document.getElementById('formMessage');

contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Get form data
    const formData = new FormData(contactForm);
    const data = {
        name: formData.get('name'),
        email: formData.get('email'),
        subject: formData.get('subject'),
        message: formData.get('message'),
        newsletter: formData.get('newsletter') === 'on'
    };
    
    // Validate form
    if (!validateForm(data)) {
        return;
    }
    
    // Show loading state
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Sending...';
    submitBtn.disabled = true;
    
    try {
        // Send data to backend
        const response = await fetch('http://localhost:5000/api/contact', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });
        
        const result = await response.json();
        
        if (response.ok) {
            showMessage('success', 'Thank you for your message! We\'ll get back to you soon.');
            contactForm.reset();
        } else {
            showMessage('error', result.message || 'Something went wrong. Please try again.');
        }
    } catch (error) {
        console.error('Error:', error);
        showMessage('error', 'Network error. Please check your connection and try again.');
    } finally {
        // Reset button state
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    }
});

function validateForm(data) {
    const errors = [];
    
    if (!data.name || data.name.trim().length < 2) {
        errors.push('Name must be at least 2 characters long');
    }
    
    if (!data.email || !isValidEmail(data.email)) {
        errors.push('Please enter a valid email address');
    }
    
    if (!data.message || data.message.trim().length < 10) {
        errors.push('Message must be at least 10 characters long');
    }
    
    if (errors.length > 0) {
        showMessage('error', errors.join('. '));
        return false;
    }
    
    return true;
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function showMessage(type, message) {
    formMessage.classList.remove('hidden', 'bg-green-100', 'bg-red-100', 'text-green-700', 'text-red-700');
    
    if (type === 'success') {
        formMessage.classList.add('bg-green-100', 'text-green-700');
        formMessage.innerHTML = `<i class="fas fa-check-circle mr-2"></i>${message}`;
    } else {
        formMessage.classList.add('bg-red-100', 'text-red-700');
        formMessage.innerHTML = `<i class="fas fa-exclamation-circle mr-2"></i>${message}`;
    }
    
    // Auto-hide message after 5 seconds
    setTimeout(() => {
        formMessage.classList.add('hidden');
    }, 5000);
}

// Add scroll effect to navigation
window.addEventListener('scroll', () => {
    const nav = document.querySelector('nav');
    if (window.scrollY > 100) {
        nav.classList.add('bg-purple-800', 'bg-opacity-95');
        nav.classList.remove('glass-effect');
    } else {
        nav.classList.remove('bg-purple-800', 'bg-opacity-95');
        nav.classList.add('glass-effect');
    }
});

// Animate elements on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe feature cards and other elements
document.addEventListener('DOMContentLoaded', () => {
    const animateElements = document.querySelectorAll('.hover-scale, .grid > div');
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});

// Add typing effect to hero title
function typeWriter(element, text, speed = 100) {
    let i = 0;
    element.innerHTML = '';
    
    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

// Initialize typing effect when page loads
window.addEventListener('load', () => {
    const heroTitle = document.querySelector('#home h1');
    if (heroTitle) {
        // Disable typing effect to preserve HTML formatting
        heroTitle.style.opacity = '1';
    }
});

// Add parallax effect to hero section (disabled to fix overlap)
// window.addEventListener('scroll', () => {
//     const scrolled = window.pageYOffset;
//     const heroSection = document.querySelector('#home');
//     if (heroSection && scrolled < window.innerHeight) {
//         heroSection.style.transform = `translateY(${scrolled * 0.5}px)`;
//     }
// });

// Form input animations
document.querySelectorAll('input, textarea, select').forEach(element => {
    element.addEventListener('focus', function() {
        this.parentElement.classList.add('transform', 'scale-105');
    });
    
    element.addEventListener('blur', function() {
        this.parentElement.classList.remove('transform', 'scale-105');
    });
});

// Add hover effect to feature cards
document.querySelectorAll('.hover-scale').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'scale(1.05) translateY(-5px)';
        this.style.boxShadow = '0 20px 40px rgba(0,0,0,0.1)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'scale(1) translateY(0)';
        this.style.boxShadow = 'none';
    });
});

// Console welcome message
console.log('%c🚀 Welcome to TechFlow!', 'color: #667eea; font-size: 20px; font-weight: bold;');
console.log('%cBuilt with passion and modern web technologies', 'color: #764ba2; font-size: 14px;');
