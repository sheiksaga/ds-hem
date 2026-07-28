// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

function init() {
  // Back to top functionality
  const backToTop = document.getElementById('back-to-top');
  if (backToTop) {
    backToTop.style.display = 'block';
    backToTop.style.opacity = '0';

    // Toggle visibility on scroll
    window.addEventListener('scroll', function() {
      if (window.scrollY > window.innerHeight * 0.4) {
        backToTop.style.opacity = '1';
      } else {
        backToTop.style.opacity = '0';
      }
    });

    // Scroll to top on click
    backToTop.addEventListener('click', function() {
      window.scrollTo({ top: 0 });
    });
  }
}
