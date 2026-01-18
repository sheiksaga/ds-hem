// GSAP Scroll Animations for ds-hem blog pages
// Author: Sangeeth G
// Description: Subtle fade-in up animations for blog index and posts

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

        // ========== BLOG INDEX PAGE ANIMATIONS ==========

        const introSection = document.querySelector('.intro');
        if (introSection) {
            // Animate intro on page load
            gsap.fromTo(".intro",
                { opacity: 0, y: isMobile ? 15 : 25 },
                { opacity: 1, y: 0, duration: 0.7, ease: "power2.out", delay: 0.1 }
            );
        }

        const filtersSection = document.querySelector('.filters');
        if (filtersSection) {
            // Animate filters
            gsap.fromTo(".filters",
                { opacity: 0, y: isMobile ? 15 : 20 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.5,
                    ease: "power2.out",
                    scrollTrigger: {
                        trigger: ".filters",
                        start: "top 90%",
                        toggleActions: "play none none reverse"
                    }
                }
            );
        }

        const postsSection = document.querySelector('.posts');
        if (postsSection) {
            // Animate posts section heading and all posts together
            gsap.fromTo(".posts h2",
                { opacity: 0, y: isMobile ? 20 : 25 },
                {
                    opacity: 1,
                    y: 0,
                    duration: isMobile ? 0.5 : 0.6,
                    ease: "power2.out",
                    scrollTrigger: {
                        trigger: ".posts",
                        start: "top 85%",
                        toggleActions: "play none none reverse"
                    }
                }
            );

            // Animate all post items together (no stagger)
            gsap.fromTo(".post",
                { opacity: 0, y: isMobile ? 20 : 30 },
                {
                    opacity: 1,
                    y: 0,
                    duration: isMobile ? 0.4 : 0.5,
                    ease: "power2.out",
                    scrollTrigger: {
                        trigger: ".posts",
                        start: "top 85%",
                        toggleActions: "play none none reverse"
                    }
                }
            );
        }

        // ========== BLOG POST PAGE ANIMATIONS ==========

        // Animate all paragraphs together
        const paragraphs = document.querySelectorAll('.blog-post p');
        if (paragraphs.length > 0) {
            gsap.fromTo(paragraphs,
                { opacity: 0, y: isMobile ? 15 : 20 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.5,
                    ease: "power2.out",
                    scrollTrigger: {
                        trigger: ".blog-post",
                        start: "top 85%",
                        toggleActions: "play none none reverse"
                    }
                }
            );
        }

        // Animate images
        const images = document.querySelectorAll('.blog-img');
        if (images.length > 0) {
            gsap.fromTo(images,
                { opacity: 0, y: isMobile ? 20 : 30, scale: 0.95 },
                {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    duration: 0.7,
                    ease: "power2.out",
                    scrollTrigger: {
                        trigger: images,
                        start: "top 85%",
                        toggleActions: "play none none reverse"
                    }
                }
            );
        }

        // Animate code blocks
        const codeBlocks = document.querySelectorAll('pre');
        if (codeBlocks.length > 0) {
            gsap.fromTo(codeBlocks,
                { opacity: 0, y: isMobile ? 15 : 20 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.6,
                    ease: "power2.out",
                    scrollTrigger: {
                        trigger: codeBlocks,
                        start: "top 85%",
                        toggleActions: "play none none reverse"
                    }
                }
            );
        }

        // Animate headings (h1, h2, h3)
        const headings = document.querySelectorAll('h1, h2, h3');
        if (headings.length > 0) {
            gsap.fromTo(headings,
                { opacity: 0, y: isMobile ? 15 : 20 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.5,
                    ease: "power2.out",
                    scrollTrigger: {
                        trigger: headings,
                        start: "top 90%",
                        toggleActions: "play none none reverse"
                    }
                }
            );
        }

        // Animate lists
        const lists = document.querySelectorAll('ul, ol');
        if (lists.length > 0) {
            gsap.fromTo(lists,
                { opacity: 0, y: isMobile ? 15 : 20 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.5,
                    ease: "power2.out",
                    scrollTrigger: {
                        trigger: lists,
                        start: "top 90%",
                        toggleActions: "play none none reverse"
                    }
                }
            );
        }

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
    }

    // Initialize on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initAnimations);
    } else {
        initAnimations();
    }
})();
