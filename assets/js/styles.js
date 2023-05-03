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
        localStorage.setItem('dark-mode', $('body').hasClass('dark-mode').toString());
    });
});


  
//fetch likes
$(document).ready(function() {
    var facts = [
      "whether aliens like pizza", "the beauty of a perfectly brewed cup of coffee", "the magic of a well-written book", "why pineapples on pizza became socially accepted", "websites", "the latest LLM", "jabberwockys", "invisbile electric sheep", "how to construct the perfect pun"
    ];
  
    function newFact() {
      var randomFact = Math.floor(Math.random() * facts.length);
      $('#likeDisplay').text(facts[randomFact]);
    }
  
    newFact();
  });

  $.get("/blog/posts/2023/index.html", function(data) {
    // Get the first <li> element and find the <a> tag inside it
    var firstLink = $(data).find('li:first').find('a');
    // Set the HTML of #2023 to the last link
    $("#2023").html(firstLink);
});