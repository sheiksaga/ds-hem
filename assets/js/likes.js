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

  