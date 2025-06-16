document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const digitalDistractionsSection = document.getElementById('digital-distractions');
    const focusMeter = document.getElementById('focusMeter');
    const focusPercentage = document.getElementById('focusPercentage');
    const distractionOverlay = document.getElementById('distractionOverlay');
    
    // State
    let focusLevel = 0;
    let focusInterval;
    let isSectionVisible = false;
    let activeDistractions = 0;
    const maxDistractions = 5;
    
    // Notification templates
    const notifications = [
        { 
            icon: '📱', 
            iconBg: '#4299e1',
            title: 'New Message',
            messages: [
                '3 new messages from Sarah',
                'John: Are you free to chat?',
                'Mom: Call me when you can!',
                'You have 5 unread messages'
            ]
        },
        { 
            icon: '📧', 
            iconBg: '#48bb78',
            title: 'New Email',
            messages: [
                'Your daily digest is ready',
                'Special offer: 50% off today only!',
                'Your subscription is about to expire',
                'New connection request on LinkedIn'
            ]
        },
        { 
            icon: '🔔', 
            iconBg: '#ed8936',
            title: 'Reminder',
            messages: [
                'Time for your break!',
                'Don\'t forget to drink water',
                'You\'ve been sitting for 1 hour',
                'Update available for your app'
            ]
        }
    ];
    
    const socialIcons = [
        { icon: '📘', bg: '#4267B2', label: 'Facebook' },
        { icon: '📸', bg: '#E1306C', label: 'Instagram' },
        { icon: '🐦', bg: '#1DA1F2', label: 'Twitter' },
        { icon: '💬', bg: '#25D366', label: 'WhatsApp' },
        { icon: '📺', bg: '#FF0000', label: 'YouTube' },
        { icon: '💼', bg: '#0077B5', label: 'LinkedIn' },
        { icon: '📌', bg: '#E60023', label: 'Pinterest' },
        { icon: '🎵', bg: '#1DB954', label: 'Spotify' },
        { icon: '🎮', bg: '#6441A5', label: 'Discord' },
        { icon: '📱', bg: '#FF4500', label: 'TikTok' }
    ];
    
    const phoneAlerts = [
        'Low battery (15% remaining)',
        'Storage almost full',
        'New voicemail received',
        'Update available',
        'Backup completed',
        'New app update available',
        'Your storage is almost full',
        'You have 3 new notifications'
    ];
    
    // Initialize Intersection Observer
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                isSectionVisible = true;
                startFocusMeter();
                startDistractions();
            } else {
                isSectionVisible = false;
                stopFocusMeter();
                clearDistractions();
            }
        });
    }, { threshold: 0.5 });
    
    // Start observing the section
    if (digitalDistractionsSection) {
        observer.observe(digitalDistractionsSection);
    }
    
    // Focus meter functions
    function startFocusMeter() {
        focusLevel = 0;
        updateFocusMeter();
        focusInterval = setInterval(() => {
            if (focusLevel < 100) {
                focusLevel += 0.5;
                updateFocusMeter();
            }
        }, 100);
    }
    
    function stopFocusMeter() {
        clearInterval(focusInterval);
    }
    
    function updateFocusMeter() {
        focusMeter.style.width = `${focusLevel}%`;
        focusPercentage.textContent = `${Math.min(100, Math.round(focusLevel))}%`;
        
        // Update progress bar color based on focus level
        if (focusLevel < 30) {
            focusMeter.style.background = 'linear-gradient(90deg, #ef4444, #f97316)';
        } else if (focusLevel < 70) {
            focusMeter.style.background = 'linear-gradient(90deg, #f59e0b, #eab308)';
        } else {
            focusMeter.style.background = 'linear-gradient(90deg, #4f46e5, #8b5cf6)';
        }
    }
    
    function reduceFocus(amount) {
        focusLevel = Math.max(0, focusLevel - amount);
        updateFocusMeter();
    }
    
    // Distraction functions
    function startDistractions() {
        // Start with a delay
        setTimeout(() => {
            if (!isSectionVisible) return;
            
            // Randomly choose which type of distraction to show
            const distractionType = Math.floor(Math.random() * 3);
            
            if (distractionType === 0) {
                showNotification();
            } else if (distractionType === 1) {
                showSocialIcon();
            } else {
                showPhoneAlert();
            }
            
            // Schedule next distraction if section is still visible
            if (isSectionVisible) {
                const nextDistractionTime = 2000 + Math.random() * 3000; // 2-5 seconds
                setTimeout(startDistractions, nextDistractionTime);
            }
        }, 3000); // Initial delay before first distraction
    }
    
    function showNotification() {
        if (activeDistractions >= maxDistractions) return;
        
        const notification = notifications[Math.floor(Math.random() * notifications.length)];
        const message = notification.messages[Math.floor(Math.random() * notification.messages.length)];
        
        const notificationEl = document.createElement('div');
        notificationEl.className = 'notification';
        notificationEl.style.top = `${10 + Math.random() * 60}%`;
        notificationEl.style.left = `${10 + Math.random() * 70}%`;
        
        notificationEl.innerHTML = `
            <div class="notification-icon" style="background-color: ${notification.iconBg}">
                ${notification.icon}
            </div>
            <div class="notification-content">
                <div class="notification-title">${notification.title}</div>
                <div class="notification-message">${message}</div>
            </div>
        `;
        
        distractionOverlay.appendChild(notificationEl);
        
        // Trigger reflow
        void notificationEl.offsetWidth;
        
        // Show notification
        notificationEl.classList.add('visible');
        activeDistractions++;
        
        // Reduce focus when notification appears
        reduceFocus(15 + Math.random() * 20);
        
        // Add screen shake if multiple distractions
        if (activeDistractions > 2) {
            digitalDistractionsSection.classList.add('screen-shake');
            setTimeout(() => {
                digitalDistractionsSection.classList.remove('screen-shake');
            }, 500);
        }
        
        // Remove notification after delay
        setTimeout(() => {
            notificationEl.classList.remove('visible');
            setTimeout(() => {
                if (distractionOverlay.contains(notificationEl)) {
                    distractionOverlay.removeChild(notificationEl);
                    activeDistractions--;
                }
            }, 300);
        }, 5000); // Increased display time to 5 seconds for better readability
    }
    
    function showSocialIcon() {
        if (activeDistractions >= maxDistractions) return;
        
        const social = socialIcons[Math.floor(Math.random() * socialIcons.length)];
        
        const iconEl = document.createElement('div');
        iconEl.className = 'social-icon';
        iconEl.style.top = `${10 + Math.random() * 70}%`;
        iconEl.style.left = `${10 + Math.random() * 80}%`;
        iconEl.style.backgroundColor = social.bg;
        iconEl.setAttribute('aria-label', social.label);
        iconEl.textContent = social.icon;
        
        // Add hover effect
        iconEl.addEventListener('mouseenter', () => {
            iconEl.style.transform = 'scale(1.5)';
            reduceFocus(25);
            
            // Remove on click
            const clickHandler = () => {
                iconEl.remove();
                activeDistractions--;
                iconEl.removeEventListener('click', clickHandler);
            };
            
            iconEl.addEventListener('click', clickHandler);
        });
        
        iconEl.addEventListener('mouseleave', () => {
            iconEl.style.transform = 'scale(1.2)';
        });
        
        distractionOverlay.appendChild(iconEl);
        
        // Trigger reflow
        void iconEl.offsetWidth;
        
        // Show icon
        iconEl.classList.add('visible');
        activeDistractions++;
        
        // Reduce focus when icon appears
        reduceFocus(10 + Math.random() * 15);
        
        // Add screen shake if multiple distractions
        if (activeDistractions > 2) {
            digitalDistractionsSection.classList.add('screen-shake');
            setTimeout(() => {
                digitalDistractionsSection.classList.remove('screen-shake');
            }, 500);
        }
        
        // Remove icon after delay if not removed by click
        setTimeout(() => {
            if (document.body.contains(iconEl)) {
                iconEl.classList.remove('visible');
                setTimeout(() => {
                    if (distractionOverlay.contains(iconEl)) {
                        distractionOverlay.removeChild(iconEl);
                        activeDistractions--;
                    }
                }, 300);
            }
        }, 4000);
    }
    
    function showPhoneAlert() {
        if (activeDistractions >= maxDistractions) return;
        
        const message = phoneAlerts[Math.floor(Math.random() * phoneAlerts.length)];
        
        const alertEl = document.createElement('div');
        alertEl.className = 'phone-alert';
        alertEl.style.bottom = '20px';
        alertEl.style.right = '20px';
        
        alertEl.innerHTML = `
            <div class="phone-alert-icon">!</div>
            <div class="notification-content">
                <div class="notification-message">${message}</div>
            </div>
        `;
        
        distractionOverlay.appendChild(alertEl);
        
        // Trigger reflow
        void alertEl.offsetWidth;
        
        // Show alert
        alertEl.classList.add('visible');
        activeDistractions++;
        
        // Reduce focus when alert appears
        reduceFocus(20 + Math.random() * 25);
        
        // Add screen shake if multiple distractions
        if (activeDistractions > 2) {
            digitalDistractionsSection.classList.add('screen-shake');
            setTimeout(() => {
                digitalDistractionsSection.classList.remove('screen-shake');
            }, 500);
        }
        
        // Remove alert after delay
        setTimeout(() => {
            alertEl.classList.remove('visible');
            setTimeout(() => {
                if (distractionOverlay.contains(alertEl)) {
                    distractionOverlay.removeChild(alertEl);
                    activeDistractions--;
                }
            }, 300);
        }, 3500);
    }
    
    function clearDistractions() {
        // Clear all distractions
        while (distractionOverlay.firstChild) {
            distractionOverlay.removeChild(distractionOverlay.firstChild);
        }
        activeDistractions = 0;
    }
});
