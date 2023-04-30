$(document).ready(function() {
    var facts = [
      "whether aliens like pizza", "The beauty of a perfectly brewed cup of coffee", "The magic of a well-written book", "why pineapples on pizza became socially accepted", "websites", "the latest LLM", "jabberwockys", "invisbile electric sheep", "how to construct the perfect pun"
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