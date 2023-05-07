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

  // Dark mode
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches || localStorage.getItem('dark-mode') === 'true') {
      $('body').addClass('dark-mode');
  }

  $('#theme-toggle-btn').on('click', function () {
      $('body').toggleClass('dark-mode');
      localStorage.setItem('dark-mode', $('body').hasClass('dark-mode').toString());
  });

  // Fetch 2023 list
  $.get("posts/2023/index.html", function (data) {
      $("#2023").html(data);
  });

  // Filter buttons
  $(".list-of-posts li").show();
  $(".filter-button").click(function () {
      var selectedTags = $(".filter-button.selected").map(function () {
          return $(this).data("tag");
      }).get();

      if (selectedTags.length === 0) {
          $(".list-of-posts li").show();
          return;
      }

      $(".list-of-posts li").hide();
      selectedTags.forEach(function (tag) {
          $(".list-of-posts li:has(." + tag + ")").show();
      });
  });

  $(".filter-button").click(function () {
      $(this).toggleClass("selected");
  });

//   // Breadcrumbs
//   var url = window.location.href;
//    var segments = url.split('/');
//    segments.shift();
//    segments.pop();
//    var breadcrumbs = [];

//    $.each(segments, function (index, segment) {
//        var title = segment.replace(/-/g, ' ').toUpperCase();
//        var link = '/' + segments.slice(0, index + 1).join('/') + '/';
//        var crumb = '<a href="' + link + '">' + title + '</a>';
//        breadcrumbs.push(crumb);
//    });

//    var separator = '<span> > </span>';
//    var breadcrumbHtml = '<div class="breadcrumbs">' + breadcrumbs.join(separator) + '</div>';
//    $('body').append(breadcrumbHtml);
 });
