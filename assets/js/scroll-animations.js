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

        // ========== SCROLL PROGRESS INDICATOR ==========

        gsap.to('.scroll-progress', {
            width: '100%',
            ease: 'none',
            scrollTrigger: {
                trigger: 'body',
                start: 'top top',
                end: 'bottom bottom',
                scrub: 0.3
            }
        });

        // ========== PAGE TRANSITION ANIMATIONS ==========

        // Page exit animation - fade out when clicking links
        document.querySelectorAll('a[href]').forEach(link => {
            link.addEventListener('click', function(e) {
                const href = this.getAttribute('href');

                // Skip: hash links, target="_blank", external links, javascript links
                if (href.startsWith('#') ||
                    this.target === '_blank' ||
                    this.hostname !== window.location.hostname ||
                    href.startsWith('javascript:')) {
                    return;
                }

                e.preventDefault();
                const destination = this.href;

                // Smooth fade out
                gsap.to('body', {
                    opacity: 0,
                    duration: 0.5,
                    ease: "power2.inOut",
                    onComplete: function() {
                        window.location.href = destination;
                    }
                });
            });
        });

        // Page enter animation - fade in on load (smoother, longer)
        gsap.fromTo('body',
            { opacity: 0 },
            { opacity: 1, duration: 0.6, ease: "power2.out", delay: 0.05 }
        );

        // ========== TEXT REVEAL ANIMATION (Main Page Only) ==========

        // Helper function for character-by-character reveal
        function revealText(element) {
            const text = element.textContent;
            element.innerHTML = text.split('').map(char => {
                return char === ' ' ? '<span>&nbsp;</span>' : `<span>${char}</span>`;
            }).join('');

            gsap.fromTo(element.querySelectorAll('span'),
                { opacity: 0, y: 10 },
                { opacity: 1, y: 0, duration: 0.4, stagger: 0.02, ease: "power2.out" }
            );
        }

        // Apply to main heading on page load (one-time animation, not scroll-triggered)
        const mainHeading = document.querySelector('.hi');
        if (mainHeading) {
            revealText(mainHeading);
        }
    }

    // Initialize on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initAnimations);
    } else {
        initAnimations();
    }
})();
