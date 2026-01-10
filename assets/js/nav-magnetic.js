// Magnetic Navigation Hover Effect
(function() {
    'use strict';

    const navLinks = document.querySelector('.nav-links');
    const indicator = document.querySelector('.nav-indicator');
    const links = document.querySelectorAll('.nav-links .list-item a');

    if (!navLinks || !indicator || links.length === 0) {
        console.warn('Magnetic nav: Required elements not found');
        return;
    }

    // Initialize indicator position on active link
    function initIndicator() {
        const activeLink = document.querySelector('.nav-links .list-item a.active-link');
        if (activeLink) {
            moveIndicatorTo(activeLink);
        }
    }

    // Move indicator to a specific link
    function moveIndicatorTo(link) {
        const linkRect = link.getBoundingClientRect();
        const navRect = navLinks.getBoundingClientRect();

        // Calculate position relative to nav container
        const left = linkRect.left - navRect.left;
        const width = linkRect.width;

        // Animate using GSAP
        gsap.to(indicator, {
            left: left,
            width: width,
            duration: 0.3,
            ease: "power2.out"
        });
    }

    // Add hover listeners to each link
    links.forEach(link => {
        link.addEventListener('mouseenter', () => {
            moveIndicatorTo(link);
        });
    });

    // Return to active link when mouse leaves nav area
    navLinks.addEventListener('mouseleave', () => {
        const activeLink = document.querySelector('.nav-links .list-item a.active-link');
        if (activeLink) {
            moveIndicatorTo(activeLink);
        }
    });

    // Handle window resize
    window.addEventListener('resize', () => {
        initIndicator();
    });

    // Initialize on load
    initIndicator();
})();
