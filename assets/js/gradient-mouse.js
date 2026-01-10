// Mouse-following (desktop) and scroll-based (mobile) gradient effect for .hi and .hero_emoji
(function() {
  'use strict';

  let hiElement = null;
  let emojiElement = null;

  // Current gradient position (for smooth interpolation)
  let currentX = 50;
  let currentY = 50;
  // Target gradient position
  let targetX = 50;
  let targetY = 50;

  // Detect if device is mobile (touch capability or screen width)
  function isMobile() {
    return window.innerWidth < 768 || 'ontouchstart' in window;
  }

  // Update gradient based on position
  function updateGradient(element, x, y) {
    if (!element) return;

    // Set CSS custom properties for gradient position
    element.style.setProperty('--gradient-x', `${x}%`);
    element.style.setProperty('--gradient-y', `${y}%`);
  }

  // Smooth animation loop
  function animate() {
    // Smooth interpolation (lerp)
    const ease = isMobile() ? 0.05 : 0.08;
    currentX += (targetX - currentX) * ease;
    currentY += (targetY - currentY) * ease;

    // Update both elements
    updateGradient(hiElement, currentX, currentY);
    updateGradient(emojiElement, currentX, currentY);

    requestAnimationFrame(animate);
  }

  // Mouse move handler (desktop)
  function handleMouseMove(e) {
    if (isMobile()) return; // Skip if mobile

    const x = (e.clientX / window.innerWidth) * 100;
    const y = (e.clientY / window.innerHeight) * 100;

    targetX = x;
    targetY = y;
  }

  // Scroll handler (mobile)
  function handleScroll() {
    if (!isMobile()) return; // Only on mobile

    // Calculate scroll position as percentage
    const scrollPercent = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;

    // Create flowing movement based on scroll
    // X oscillates between 20% and 80%
    targetX = 50 + Math.sin(scrollPercent * 0.05) * 30;
    // Y moves from top to bottom based on scroll
    targetY = 20 + (scrollPercent * 0.6);
  }

  // Initialize on DOM ready
  function init() {
    // Find elements now that DOM is ready
    hiElement = document.querySelector('.hi');
    emojiElement = document.querySelector('.hero_emoji');

    if (!hiElement && !emojiElement) {
      console.warn('Gradient effect: No .hi or .hero_emoji elements found');
      return;
    }

    // Add mouse move listener (desktop)
    document.addEventListener('mousemove', handleMouseMove);

    // Add scroll listener (mobile)
    window.addEventListener('scroll', handleScroll, { passive: true });

    // Initial position for mobile
    if (isMobile()) {
      handleScroll();
    }

    // Start animation loop
    animate();
  }

  // Wait for DOM to be ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
