//back to top
$(document).ready(function(){
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

//dark mode
$(document).ready(function() {
    // check if user prefers dark mode
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches || localStorage.getItem('dark-mode') === 'true') {
      $('body').addClass('dark-mode');
    }
  
    // listen for click events on the button
    $('#theme-toggle-btn').on('click', function() {
      $('body').toggleClass('dark-mode');
      localStorage.setItem('dark-mode', $('body').hasClass('dark-mode'));
    });
});

