// Magnetic Filter Hover Effect
(function() {
    'use strict';

    const filters = document.querySelector('.filters');
    const indicator = document.querySelector('.filter-indicator');
    const labels = document.querySelectorAll('.filters li label');
    const radioInputs = document.querySelectorAll('input[name="categories"]');

    if (!filters || !indicator || labels.length === 0) {
        console.warn('Magnetic filters: Required elements not found');
        return;
    }

    // Initialize indicator position on checked filter
    function initIndicator() {
        const checkedInput = document.querySelector('input[name="categories"]:checked');
        if (checkedInput) {
            const checkedLabel = document.querySelector(`.filters label[for="${checkedInput.id}"]`);
            if (checkedLabel) {
                moveIndicatorTo(checkedLabel);
            }
        }
    }

    // Move indicator to a specific label
    function moveIndicatorTo(label) {
        const labelRect = label.getBoundingClientRect();
        const filtersRect = filters.getBoundingClientRect();

        // Calculate position relative to filters container
        const left = labelRect.left - filtersRect.left;
        const width = labelRect.width;

        // Animate using GSAP
        gsap.to(indicator, {
            left: left,
            width: width,
            duration: 0.3,
            ease: "power2.out"
        });
    }

    // Add hover listeners to each label
    labels.forEach(label => {
        label.addEventListener('mouseenter', () => {
            moveIndicatorTo(label);
        });
    });

    // Return to checked filter when mouse leaves filters area
    filters.addEventListener('mouseleave', () => {
        initIndicator();
    });

    // Update indicator when filter changes
    radioInputs.forEach(input => {
        input.addEventListener('change', () => {
            const label = document.querySelector(`.filters label[for="${input.id}"]`);
            if (label) {
                moveIndicatorTo(label);
            }
        });
    });

    // Handle window resize
    window.addEventListener('resize', () => {
        initIndicator();
    });

    // Initialize on load and after DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initIndicator);
    } else {
        // Small delay to ensure layout is complete
        setTimeout(initIndicator, 100);
    }

    // Also initialize after window load to be safe
    window.addEventListener('load', initIndicator);
})();
