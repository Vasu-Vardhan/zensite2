// Carousel functionality
let currentSlide = 0;
let autoSlideInterval;

// Auto slide every 5 seconds with improved reliability
function startAutoSlide() {
    autoSlideInterval = setInterval(() => {
        currentSlide = (currentSlide + 1) % document.querySelectorAll('.testimonial-slide').length;
        updateCarousel();
    }, 5000);
}

function updateCarousel() {
    const carousel = document.getElementById('testimonialCarousel');
    if (!carousel) return;
    
    const slides = document.querySelectorAll('.testimonial-slide');
    const slideWidth = slides[0].offsetWidth;
    
    // Update active slide indicator
    document.querySelectorAll('.carousel-indicator').forEach((indicator, index) => {
        indicator.classList.toggle('bg-white/50', index !== currentSlide);
        indicator.classList.toggle('bg-white', index === currentSlide);
    });
    
    // Update carousel position
    carousel.style.transform = `translateX(-${currentSlide * 100}%)`;
}

// Modal functionality
function toggleModal(modalId) {
    const modal = document.getElementById(modalId);
    if (!modal) return;
    
    if (modal.classList.contains('hidden')) {
        // Show modal
        modal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
        
        // Focus on first input if exists
        const firstInput = modal.querySelector('input, button, [tabindex]');
        if (firstInput) firstInput.focus();
    } else {
        // Hide modal
        modal.classList.add('hidden');
        document.body.style.overflow = '';
    }
}

// Mobile menu functionality
document.addEventListener('DOMContentLoaded', () => {
    const mobileMenu = document.getElementById('mobileMenu');
    const mobileMenuButton = document.getElementById('mobileMenuButton');
    const overlay = document.createElement('div');
    overlay.className = 'overlay';
    document.body.appendChild(overlay);
    
    function openMobileMenu() {
        mobileMenu.classList.add('open');
        overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
    
    function closeMobileMenu() {
        mobileMenu.classList.remove('open');
        overlay.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    // Toggle mobile menu
    function toggleMobileMenu() {
        if (mobileMenu.classList.contains('open')) {
            closeMobileMenu();
        } else {
            openMobileMenu();
        }
    }
    
    // Event listeners
    mobileMenuButton.addEventListener('click', toggleMobileMenu);
    overlay.addEventListener('click', closeMobileMenu);
    
    // Close menu when clicking on a link
    mobileMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', closeMobileMenu);
    });
    
    // Expose functions to global scope for inline handlers
    window.toggleMobileMenu = toggleMobileMenu;
    
    // Initialize carousel if it exists
    if (document.getElementById('testimonialCarousel')) {
        startAutoSlide();
        
        // Pause auto slide on hover
        document.getElementById('testimonialCarousel').parentElement.addEventListener('mouseenter', () => {
            clearInterval(autoSlideInterval);
        });
        
        document.getElementById('testimonialCarousel').parentElement.addEventListener('mouseleave', () => {
            startAutoSlide();
        });
        
        // Pause auto-slide when window loses focus
        window.addEventListener('blur', () => {
            clearInterval(autoSlideInterval);
        });
        
        window.addEventListener('focus', () => {
            startAutoSlide();
        });
    }
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 80, // Adjust for fixed header
                behavior: 'smooth'
            });
        }
    });
});

// Intersection Observer for scroll animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
        }
    });
}, observerOptions);

// Observe all elements with animate-fade-in class
document.querySelectorAll('.animate-fade-in').forEach(element => {
    observer.observe(element);
});

// Expose functions to global scope for HTML event handlers
window.toggleModal = toggleModal;
