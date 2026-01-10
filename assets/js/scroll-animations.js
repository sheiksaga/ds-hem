// GSAP Scroll Animations for ds-hem homepage
// Author: Sangeeth G
// Description: Subtle fade-in up animations on scroll

(function() {
    'use strict';

    // Wait for DOM to be ready
    function initAnimations() {
        // Check if GSAP is loaded
        if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
            console.warn('GSAP or ScrollTrigger not loaded. Animations disabled.');
            return;
        }

        // Check for reduced motion preference
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        if (prefersReducedMotion) {
            console.log('Reduced motion preferred. Animations disabled.');
            return;
        }

        // Register ScrollTrigger plugin
        gsap.registerPlugin(ScrollTrigger);

        // Mobile detection
        const isMobile = window.innerWidth < 768;

        // ========== HERO SECTION ANIMATIONS ==========

        // Animate "Hi!" text on page load
        gsap.fromTo(".hi",
            { opacity: 0, y: isMobile ? 20 : 30 },
            { opacity: 1, y: 0, duration: isMobile ? 0.6 : 0.8, ease: "power2.out", delay: 0.1 }
        );

        // Animate emoji on page load
        gsap.fromTo(".hero_emoji",
            { opacity: 0, y: isMobile ? 20 : 30 },
            { opacity: 1, y: 0, duration: isMobile ? 0.6 : 0.8, ease: "power2.out", delay: 0.1 }
        );

        // Animate hero text on page load
        gsap.fromTo(".hero-text",
            { opacity: 0, y: isMobile ? 15 : 20 },
            { opacity: 1, y: 0, duration: isMobile ? 0.6 : 0.8, ease: "power2.out", delay: 0.1 }
        );

        // ========== SERVICES SECTION ANIMATIONS ==========

        // Animate services box heading
        gsap.fromTo(".box h2",
            { opacity: 0, y: isMobile ? 20 : 30 },
            {
                opacity: 1,
                y: 0,
                duration: isMobile ? 0.5 : 0.7,
                ease: "power2.out",
                scrollTrigger: {
                    trigger: ".box",
                    start: "top 80%",
                    toggleActions: "play none none reverse"
                }
            }
        );

        // Animate all service containers together (no stagger/delay)
        const serviceContainers = gsap.utils.toArray(".box > div[class^='container']");
        serviceContainers.forEach((container, i) => {
            gsap.fromTo(container,
                { opacity: 0, y: isMobile ? 25 : 40 },
                {
                    opacity: 1,
                    y: 0,
                    duration: isMobile ? 0.4 : 0.6,
                    ease: "power2.out",
                    scrollTrigger: {
                        trigger: ".box",
                        start: "top 80%",
                        toggleActions: "play none none reverse"
                    }
                }
            );
        });

        // ========== PORTFOLIO SECTION ANIMATIONS ==========

        // Animate portfolio box heading
        const portfolioBox = document.querySelector('.box:nth-of-type(2)');
        if (portfolioBox) {
            gsap.fromTo(portfolioBox.querySelector('h2'),
                { opacity: 0, y: isMobile ? 20 : 30 },
                {
                    opacity: 1,
                    y: 0,
                    duration: isMobile ? 0.5 : 0.7,
                    ease: "power2.out",
                    scrollTrigger: {
                        trigger: portfolioBox,
                        start: "top 80%",
                        toggleActions: "play none none reverse"
                    }
                }
            );

            // Animate all portfolio containers together (no stagger)
            const portfolioContainers = portfolioBox.querySelectorAll("div[class^='container']");
            portfolioContainers.forEach(container => {
                gsap.fromTo(container,
                    { opacity: 0, y: isMobile ? 25 : 35 },
                    {
                        opacity: 1,
                        y: 0,
                        duration: isMobile ? 0.45 : 0.65,
                        ease: "power2.out",
                        scrollTrigger: {
                            trigger: portfolioBox,
                            start: "top 80%",
                            toggleActions: "play none none reverse"
                        }
                    }
                );
            });
        }

        // ========== FOOTER ANIMATION ==========

        gsap.fromTo(".footer",
            { opacity: 0, y: isMobile ? 15 : 20 },
            {
                opacity: 1,
                y: 0,
                duration: 0.5,
                ease: "power2.out",
                scrollTrigger: {
                    trigger: ".footer",
                    start: "top 95%",
                    toggleActions: "play none none reverse"
                }
            }
        );

        console.log('GSAP scroll animations initialized');
    }

    // Initialize on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initAnimations);
    } else {
        initAnimations();
    }
})();
