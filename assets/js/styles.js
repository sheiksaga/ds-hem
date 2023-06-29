// Helper function to toggle back-to-top visibility
function toggleBackToTopVisibility() {
    if ($(window).scrollTop() > $(window).height() * 0.4) {
      $('#back-to-top').fadeIn();
    } else {
      $('#back-to-top').fadeOut();
    }
  }
  
  // // Helper function to handle theme-toggle-btn click
  // function toggleDarkMode() {
  //   $('body').toggleClass('dark-mode');
  //   localStorage.setItem('dark-mode', $('body').hasClass('dark-mode').toString());
  // }
  
  // Helper function to display a new fact
  function newFact() {
    var facts = [
      "whether aliens like pizza", "the beauty of a perfectly brewed cup of coffee", "the magic of a well-written book", "why pineapples on pizza became socially accepted", "websites", "the latest LLM", "jabberwockys", "invisbile electric sheep", "how to construct the perfect pun"
    ];
    var randomFact = Math.floor(Math.random() * facts.length);
    $('#likeDisplay').text(facts[randomFact]);
  }
  
  $(document).ready(function() {
    // Back to top functionality
    $(window).scroll(toggleBackToTopVisibility);
    $('#back-to-top').click(function() {
      $("html, body").animate({ scrollTop: 0 }, 600);
      return false;
    });
  
    // // Dark mode functionality
    // if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches || localStorage.getItem('dark-mode') === 'true') {
    //   $('body').addClass('dark-mode');
    // }
    // $('#theme-toggle-btn').on('click', toggleDarkMode);
  
    // Fetch likes functionality
    newFact();
  
    $.get("/blog/posts/2023/index.html", function(data) {
      var firstLink = $(data).find('li:first').find('a');
      $("#2023").html(firstLink);
    });
  });
  