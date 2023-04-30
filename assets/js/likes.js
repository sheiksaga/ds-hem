$(document).ready(function() {
    var facts = [
      "puppies", "cats", "books", "tv shows", "websites", "the latest LLM", "games", "sports", "hobbies"
    ];
  
    function newFact() {
      var randomFact = Math.floor(Math.random() * facts.length);
      $('#likeDisplay').text(facts[randomFact]);
    }
  
    newFact();
  });

  $.get("/blog/posts/2023/index.html", function(data) {
    // Get the last <li> element and find the <a> tag inside it
    var lastLink = $(data).find('li:last').find('a');
    // Set the HTML of #2023 to the last link
    $("#2023").html(lastLink);
});