// Theme management
function toggleTheme() {
  const currentTheme = document.documentElement.getAttribute('data-theme');
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

  document.documentElement.setAttribute('data-theme', newTheme);
  localStorage.setItem('theme', newTheme);
}

// Note: Theme is already initialized inline in HTML to prevent FOUC
// This script now just provides the toggleTheme function

$(document).ready(function () {
  // Theme toggle functionality
  $('#theme-toggle-btn').click(function() {
    toggleTheme();
  });

  // Back to top
  $(window).scroll(function () {
      if ($(this).scrollTop() > $(this).height() * 0.4) {
          $('#back-to-top').fadeIn();
      } else {
          $('#back-to-top').fadeOut();
      }
  });

  $('#back-to-top').click(function () {
      $("html, body").animate({
          scrollTop: 0
      }, 600);
      return false;
  });
 });
