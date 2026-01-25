// Theme management
function toggleTheme() {
  const currentTheme = document.documentElement.getAttribute('data-theme');
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

  document.documentElement.setAttribute('data-theme', newTheme);
  localStorage.setItem('theme', newTheme);
}

// Helper function to toggle back-to-top visibility
function toggleBackToTopVisibility() {
  const backToTop = document.getElementById('back-to-top');
  if (window.scrollY > window.innerHeight * 0.4) {
    backToTop.style.opacity = '1';
  } else {
    backToTop.style.opacity = '0';
  }
}

// Helper function to display a new fact
function newFact() {
  const facts = [
    "whether aliens like pizza",
    "the beauty of a perfectly brewed cup of coffee",
    "the magic of a well-written book",
    "why pineapples on pizza became socially accepted",
    "websites",
    "the latest LLM",
    "jabberwockys",
    "invisbile electric sheep",
    "how to construct the perfect pun"
  ];
  const randomFact = Math.floor(Math.random() * facts.length);
  document.getElementById('likeDisplay').textContent = facts[randomFact];
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
  window.addEventListener('scroll', toggleBackToTopVisibility);

  const backToTop = document.getElementById('back-to-top');
  if (backToTop) {
    backToTop.style.display = 'block';
    backToTop.style.opacity = '0';
    backToTop.style.transition = 'opacity 0.3s ease-in-out';

    backToTop.addEventListener('click', function() {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // Display random fact
  const likeDisplay = document.getElementById('likeDisplay');
  if (likeDisplay) {
    newFact();

    // Add refresh icon functionality
    const refreshIcon = document.querySelector('.refresh-icon');
    if (refreshIcon) {
      refreshIcon.addEventListener('click', newFact);
    }
  }
}
