// Payment Gateway Functionality
document.addEventListener('DOMContentLoaded', () => {
    // Format card number with spaces
    const cardNumberInput = document.getElementById('cardNumber');
    if (cardNumberInput) {
        cardNumberInput.addEventListener('input', (e) => {
            // Remove all non-digits and limit to 16 characters
            let value = e.target.value.replace(/\D/g, '').substring(0, 16);
            // Add space after every 4 digits
            value = value.replace(/(\d{4})(?=\d)/g, '$1 ');
            e.target.value = value;
        });
    }

    // Format expiry date
    const expiryDateInput = document.getElementById('expiryDate');
    if (expiryDateInput) {
        expiryDateInput.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length > 2) {
                value = value.substring(0, 2) + '/' + value.substring(2, 4);
            }
            e.target.value = value;
        });
    }

    // Format CVC
    const cvcInput = document.getElementById('cvc');
    if (cvcInput) {
        cvcInput.addEventListener('input', (e) => {
            e.target.value = e.target.value.replace(/\D/g, '').substring(0, 4);
        });
    }

    // Handle payment form submission
    const paymentForm = document.getElementById('paymentForm');
    if (paymentForm) {
        paymentForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            // Basic validation
            const cardNumber = document.getElementById('cardNumber').value.replace(/\s+/g, '');
            const expiryDate = document.getElementById('expiryDate').value;
            const cvc = document.getElementById('cvc').value;
            const cardName = document.getElementById('cardName').value;
            const email = document.getElementById('paymentEmail').value;
            const termsChecked = document.getElementById('paymentTerms').checked;

            // Simple validation
            if (!isValidCardNumber(cardNumber)) {
                showPaymentError('Please enter a valid card number');
                return;
            }

            if (!isValidExpiryDate(expiryDate)) {
                showPaymentError('Please enter a valid expiry date (MM/YY)');
                return;
            }

            if (!cvc || cvc.length < 3) {
                showPaymentError('Please enter a valid CVC');
                return;
            }

            if (!cardName) {
                showPaymentError('Please enter the name on card');
                return;
            }

            if (!isValidEmail(email)) {
                showPaymentError('Please enter a valid email address');
                return;
            }


            if (!termsChecked) {
                showPaymentError('Please accept the terms and conditions');
                return;
            }

            // Show loading state
            const submitButton = paymentForm.querySelector('button[type="submit"]');
            const originalButtonText = submitButton.innerHTML;
            submitButton.disabled = true;
            submitButton.innerHTML = `
                <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
            `;

            // Simulate API call
            try {
                // In a real app, you would make an actual API call to your payment processor here
                await new Promise(resolve => setTimeout(resolve, 2000));
                
                // Show success message
                showPaymentSuccess('Payment successful! Thank you for your purchase.');
                
                // Reset form
                paymentForm.reset();
                
                // Close modal after delay
                setTimeout(() => {
                    toggleModal('paymentModal');
                }, 2000);
            } catch (error) {
                showPaymentError('Payment failed. Please try again.');
            } finally {
                // Reset button state
                submitButton.disabled = false;
                submitButton.innerHTML = originalButtonText;
            }
        });
    }

    // Helper functions
    function isValidCardNumber(cardNumber) {
        // Simple Luhn check for card number validation
        if (!/^\d{13,19}$/.test(cardNumber)) return false;
        
        let sum = 0;
        const numDigits = cardNumber.length;
        const parity = numDigits % 2;
        
        for (let i = 0; i < numDigits; i++) {
            let digit = parseInt(cardNumber.charAt(i), 10);
            if (i % 2 === parity) digit *= 2;
            if (digit > 9) digit -= 9;
            sum += digit;
        }
        
        return sum % 10 === 0;
    }

    function isValidExpiryDate(expiryDate) {
        if (!/^\d{2}\/\d{2}$/.test(expiryDate)) return false;
        
        const [month, year] = expiryDate.split('/').map(Number);
        if (month < 1 || month > 12) return false;
        
        // Check if the card is expired
        const currentDate = new Date();
        const currentYear = currentDate.getFullYear() % 100;
        const currentMonth = currentDate.getMonth() + 1; // Months are 0-indexed
        
        if (year < currentYear) return false;
        if (year === currentYear && month < currentMonth) return false;
        
        return true;
    }

    function isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    function showPaymentError(message) {
        // Remove any existing error messages
        const existingError = document.querySelector('.payment-error');
        if (existingError) existingError.remove();
        
        const errorElement = document.createElement('div');
        errorElement.className = 'payment-error bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-4 rounded';
        errorElement.innerHTML = `
            <div class="flex">
                <div class="flex-shrink-0">
                    <svg class="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
                    </svg>
                </div>
                <div class="ml-3">
                    <p class="text-sm">${message}</p>
                </div>
            </div>
        `;
        
        const submitButton = document.querySelector('#paymentForm button[type="submit"]');
        if (submitButton) {
            submitButton.parentNode.insertBefore(errorElement, submitButton);
        }
        
        // Scroll to error
        errorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    function showPaymentSuccess(message) {
        // Remove any existing messages
        const existingMessage = document.querySelector('.payment-message');
        if (existingMessage) existingMessage.remove();
        
        const messageElement = document.createElement('div');
        messageElement.className = 'payment-message bg-green-50 border-l-4 border-green-500 text-green-700 p-4 mb-4 rounded';
        messageElement.innerHTML = `
            <div class="flex">
                <div class="flex-shrink-0">
                    <svg class="h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                    </svg>
                </div>
                <div class="ml-3">
                    <p class="text-sm">${message}</p>
                </div>
            </div>
        `;
        
        const paymentForm = document.getElementById('paymentForm');
        if (paymentForm) {
            paymentForm.insertBefore(messageElement, paymentForm.firstChild);
        }
        
        // Scroll to top
        messageElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
});

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
function toggleModal(modalId, event = null) {
    if (event) event.preventDefault();
    
    const modal = document.getElementById(modalId);
    if (!modal) return;
    
    const isHidden = modal.classList.contains('hidden');
    
    // Close all modals first
    document.querySelectorAll('[id$="Modal"]').forEach(m => {
        m.classList.add('hidden');
    });
    
    // Toggle the requested modal
    if (isHidden) {
        modal.classList.remove('hidden');
        document.body.classList.add('modal-open');
        
        // Focus on first input if exists
        const firstInput = modal.querySelector('input:not([type="hidden"]), button, [tabindex]');
        if (firstInput) {
            setTimeout(() => firstInput.focus(), 100);
        }
    } else {
        document.body.classList.remove('modal-open');
    }
    
    // Prevent body scroll when modal is open
    document.body.style.overflow = isHidden ? 'hidden' : '';
}

// Payment Modal Tabs
function switchPaymentTab(tabId) {
    console.log('Switching to tab:', tabId);
    
    // Get all payment methods and tabs
    const paymentMethods = document.querySelectorAll('.payment-method');
    const allTabs = document.querySelectorAll('.payment-tab');
    
    // Reset all tabs and forms
    allTabs.forEach(tab => {
        const tabDataTab = tab.getAttribute('data-tab');
        if (tabDataTab === tabId) {
            tab.classList.add('border-purple-600', 'text-purple-600');
            tab.classList.remove('border-transparent', 'text-gray-500');
        } else {
            tab.classList.remove('border-purple-600', 'text-purple-600');
            tab.classList.add('border-transparent', 'text-gray-500');
        }
    });
    
    // Show/hide payment methods
    let foundActiveMethod = false;
    paymentMethods.forEach(method => {
        const methodDataMethod = method.getAttribute('data-method');
        if (methodDataMethod === tabId) {
            method.style.display = 'block';
            method.classList.remove('hidden');
            foundActiveMethod = true;
            
            // Update the payment button for the active method
            updatePaymentButton(tabId, method);
        } else {
            method.style.display = 'none';
            method.classList.add('hidden');
        }
    });
    
    console.log(`Tab ${tabId} switched, found matching form:`, foundActiveMethod);
}

// Update payment button based on selected tab
function updatePaymentButton(tabId, activeMethod) {
    const amount = document.querySelector('.payment-amount')?.textContent || '$9.00';
    let buttonText = `Pay ${amount}`;
    
    // Set button text based on payment method
    switch(tabId) {
        case 'card':
            buttonText = `Pay ${amount} with Card`;
            break;
        case 'upi':
            buttonText = `Pay ${amount} with UPI`;
            break;
        case 'netbanking':
            buttonText = `Pay ${amount} with Net Banking`;
            break;
    }
    
    // Get or create the submit button container
    let submitButtonContainer = activeMethod.querySelector('.submit-button-container');
    if (!submitButtonContainer) {
        submitButtonContainer = document.createElement('div');
        submitButtonContainer.className = 'submit-button-container mt-6';
        activeMethod.appendChild(submitButtonContainer);
    }
    
    // Create or update the submit button
    let submitButton = submitButtonContainer.querySelector('.payment-submit-btn');
    if (!submitButton) {
        submitButton = document.createElement('button');
        submitButton.className = 'w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-4 rounded-lg shadow-md hover:shadow-lg transition duration-200';
        submitButton.type = 'submit';
        submitButton.classList.add('payment-submit-btn');
        submitButtonContainer.appendChild(submitButton);
    }
    
    // Update button text
    submitButton.textContent = buttonText;
    
    // Update form submit handler
    activeMethod.onsubmit = function(e) {
        e.preventDefault();
        console.log(`Processing ${tabId} payment...`);
        // For demo purposes, just close the modal
        closeModal('paymentModal');
        return false;
    };
}

// Initialize payment tabs and event listeners
document.addEventListener('DOMContentLoaded', function() {
    // Add click handlers to all payment tabs
    const tabs = document.querySelectorAll('.payment-tab');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', function(e) {
            e.preventDefault();
            const tabId = this.getAttribute('data-tab');
            if (tabId) {
                switchPaymentTab(tabId);
            }
        });
    });
    
    // Initialize with the first tab active
    if (tabs.length > 0) {
        const firstTabId = tabs[0].getAttribute('data-tab');
        if (firstTabId) {
            switchPaymentTab(firstTabId);
        }
    }

// Toggle UPI payment options
document.addEventListener('DOMContentLoaded', function() {
    // UPI Options Toggle
    const upiIdOption = document.getElementById('upiIdOption');
    const qrCodeOption = document.getElementById('qrCodeOption');
    const qrCodeContainer = document.getElementById('qrCodeContainer');
    const upiIdInput = document.getElementById('upiId');
    
    if (upiIdOption && qrCodeOption && qrCodeContainer) {
        upiIdOption.addEventListener('change', function() {
            qrCodeContainer.classList.add('hidden');
            if (upiIdInput) upiIdInput.required = true;
        });
        
        qrCodeOption.addEventListener('change', function() {
            qrCodeContainer.classList.remove('hidden');
            if (upiIdInput) upiIdInput.required = false;
        });
    }
    
    // Net Banking Options Toggle
    const quickPayOption = document.getElementById('quickPayOption');
    const manualLoginOption = document.getElementById('manualLoginOption');
    const manualLoginContainer = document.getElementById('manualLoginContainer');
    const bankSelect = document.getElementById('bankSelect');
    
    if (quickPayOption && manualLoginOption && manualLoginContainer) {
        quickPayOption.addEventListener('change', function() {
            manualLoginContainer.classList.add('hidden');
            if (bankSelect) bankSelect.required = true;
        });
        
        manualLoginOption.addEventListener('change', function() {
            manualLoginContainer.classList.remove('hidden');
            if (bankSelect) bankSelect.required = false;
        });
    }
    
    // Initialize tooltips for UPI apps
    const tooltipTriggers = document.querySelectorAll('[data-tooltip]');
    tooltipTriggers.forEach(trigger => {
        trigger.addEventListener('mouseenter', showTooltip);
        trigger.addEventListener('mouseleave', hideTooltip);
    });
});

// Tooltip functions
function showTooltip(e) {
    const tooltip = document.createElement('div');
    tooltip.className = 'tooltip';
    tooltip.textContent = this.getAttribute('data-tooltip');
    document.body.appendChild(tooltip);
    
    const rect = this.getBoundingClientRect();
    tooltip.style.top = `${rect.top - tooltip.offsetHeight - 5}px`;
    tooltip.style.left = `${rect.left + (this.offsetWidth / 2) - (tooltip.offsetWidth / 2)}px`;
    
    this._tooltip = tooltip;
}

function hideTooltip() {
    if (this._tooltip) {
        this._tooltip.remove();
        this._tooltip = null;
    }
}

// Mobile menu functionality
document.addEventListener('DOMContentLoaded', () => {
    const mobileMenu = document.getElementById('mobileMenu');
    const mobileMenuButton = document.getElementById('mobileMenuButton');
    const overlay = document.getElementById('mobileOverlay');
    const menuIcon = document.getElementById('menuIcon');
    let isTransitioning = false;
    let menuOpen = false;

    // Toggle mobile menu
    function toggleMobileMenu() {
        if (isTransitioning) return;
        
        const isOpen = mobileMenu.classList.contains('open');
        if (isOpen) {
            closeMobileMenu();
        } else {
            openMobileMenu();
        }
    }

    function openMobileMenu() {
        if (!mobileMenu || !overlay || isTransitioning || menuOpen) return;
        
        isTransitioning = true;
        menuOpen = true;
        document.body.classList.add('menu-open');
        
        // Ensure menu is visible and has correct styles
        mobileMenu.style.display = 'block';
        mobileMenu.style.height = '100%';
        mobileMenu.style.maxHeight = '100vh';
        mobileMenu.style.visibility = 'visible';
        
        // Force reflow
        void mobileMenu.offsetWidth;
        
        // Add classes to show menu and overlay
        mobileMenu.classList.add('open');
        overlay.classList.add('active');
        
        // Update UI
        menuIcon.textContent = '✕';
        mobileMenuButton.setAttribute('aria-expanded', 'true');
        
        // Reset transition flag after animation completes
        setTimeout(() => {
            isTransitioning = false;
            // Ensure menu stays visible
            mobileMenu.style.height = '';
            mobileMenu.style.maxHeight = '';
        }, 300);
    }

    function closeMobileMenu() {
        if (!mobileMenu || !overlay || isTransitioning || !menuOpen) return;
        
        isTransitioning = true;
        menuOpen = false;
        
        // Remove open class but keep display properties
        mobileMenu.classList.remove('open');
        overlay.classList.remove('active');
        
        // Update UI
        menuIcon.textContent = '☰';
        mobileMenuButton.setAttribute('aria-expanded', 'false');
        
        // Wait for the transition to complete before cleaning up
        setTimeout(() => {
            if (!mobileMenu.classList.contains('open')) {
                document.body.classList.remove('menu-open');
                // Keep the menu in the DOM but hide it off-screen
                mobileMenu.style.transform = 'translate3d(-100%, 0, 0)';
                mobileMenu.style.visibility = 'hidden';
            }
            isTransitioning = false;
        }, 300);
    }

    // Event listeners
    if (mobileMenuButton) {
        mobileMenuButton.addEventListener('click', (e) => {
            e.stopPropagation();
            e.preventDefault();
            toggleMobileMenu();
        });
    }
    
    // Handle menu links
    if (mobileMenu) {
        const menuLinks = mobileMenu.querySelectorAll('a');
        menuLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                // Close menu immediately to prevent any race conditions
                closeMobileMenu();
                
                // Get the target section and scroll to it after a short delay
                const targetId = link.getAttribute('href');
                if (targetId && targetId !== '#') {
                    e.preventDefault();
                    setTimeout(() => {
                        const targetElement = document.querySelector(targetId);
                        if (targetElement) {
                            targetElement.scrollIntoView({ behavior: 'smooth' });
                        }
                    }, 50);
                }
            });
        });
    }

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        const isClickInsideMenu = mobileMenu && mobileMenu.contains(e.target);
        const isClickOnMenuButton = mobileMenuButton && mobileMenuButton.contains(e.target);
        
        if (mobileMenu && mobileMenu.classList.contains('open') && !isClickInsideMenu && !isClickOnMenuButton) {
            closeMobileMenu();
        }
    });

    // Close menu on window resize to desktop
    let resizeTimer;
    function handleResize() {
        if (window.innerWidth >= 768 && mobileMenu && mobileMenu.classList.contains('open')) {
            closeMobileMenu();
        }
    }
    
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(handleResize, 250);
    });

    // Close menu when pressing Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && mobileMenu && mobileMenu.classList.contains('open')) {
            closeMobileMenu();
        }
    });
    
    // Clean up event listeners when component unmounts
    window.addEventListener('beforeunload', () => {
        if (mobileMenuButton) {
            mobileMenuButton.removeEventListener('click', toggleMobileMenu);
        }
        window.removeEventListener('resize', handleResize);
    });

    // Expose functions to window for inline handlers
    window.toggleMobileMenu = toggleMobileMenu;
    window.openMobileMenu = openMobileMenu;
    window.closeMobileMenu = closeMobileMenu;

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
