// Theme management
function toggleTheme() {
  const currentTheme = document.documentElement.getAttribute('data-theme');
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

  document.documentElement.setAttribute('data-theme', newTheme);
  localStorage.setItem('theme', newTheme);
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

function init() {
  // Theme toggle functionality
  const themeToggleBtn = document.getElementById('theme-toggle-btn');
  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', toggleTheme);
  }

  // Back to top functionality
  const backToTop = document.getElementById('back-to-top');
  if (backToTop) {
    backToTop.style.display = 'block';
    backToTop.style.opacity = '0';
    backToTop.style.transition = 'opacity 0.3s ease-in-out';

    // Toggle visibility on scroll
    window.addEventListener('scroll', function() {
      if (window.scrollY > window.innerHeight * 0.4) {
        backToTop.style.opacity = '1';
      } else {
        backToTop.style.opacity = '0';
      }
    });

    // Smooth scroll to top on click
    backToTop.addEventListener('click', function() {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
}
