// Theme management
function initTheme() {
  // Check for saved theme preference or default to system preference
  const savedTheme = localStorage.getItem('theme');
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

  if (savedTheme) {
    document.documentElement.setAttribute('data-theme', savedTheme);
  } else if (systemPrefersDark) {
    document.documentElement.setAttribute('data-theme', 'dark');
  }
}

function toggleTheme() {
  const currentTheme = document.documentElement.getAttribute('data-theme');
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

  document.documentElement.setAttribute('data-theme', newTheme);
  localStorage.setItem('theme', newTheme);
}

// Note: Theme is already initialized inline in HTML to prevent FOUC
// This script now just provides the toggleTheme function

// Helper function to toggle back-to-top visibility
function toggleBackToTopVisibility() {
    if ($(window).scrollTop() > $(window).height() * 0.4) {
      $('#back-to-top').fadeIn();
    } else {
      $('#back-to-top').fadeOut();
    }
  }


  // Helper function to display a new fact
  function newFact() {
    var facts = [
      "whether aliens like pizza", "the beauty of a perfectly brewed cup of coffee", "the magic of a well-written book", "why pineapples on pizza became socially accepted", "websites", "the latest LLM", "jabberwockys", "invisbile electric sheep", "how to construct the perfect pun"
    ];
    var randomFact = Math.floor(Math.random() * facts.length);
    $('#likeDisplay').text(facts[randomFact]);
  }

  $(document).ready(function() {
    // Theme toggle functionality
    $('#theme-toggle-btn').click(function() {
      toggleTheme();
    });

    // Back to top functionality
    $(window).scroll(toggleBackToTopVisibility);
    $('#back-to-top').click(function() {
      $("html, body").animate({ scrollTop: 0 }, 600);
      return false;
    });


    newFact();

  });
  