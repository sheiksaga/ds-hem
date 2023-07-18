$(document).ready(function () {
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
