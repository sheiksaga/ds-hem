//fetch 2023 list
$.get("posts/2023/index.html", function(data) {
    $("#2023").html(data);
});

//filter buttons
$(document).ready(function() {
    // Initially show all items
    $(".list-of-posts li").show();
    // Add click event to filter buttons
    $(".filter-button").click(function() {
      // Get all selected tags
      var selectedTags = $(".filter-button.selected").map(function() {
        return $(this).data("tag");
      }).get();
      // If no tag is selected, show all items
      if (selectedTags.length === 0) {
        $(".list-of-posts li").show();
        return;
      }
      // Hide all items
      $(".list-of-posts li").hide();
      // Show items that have any of the selected tags
      selectedTags.forEach(function(tag) {
        $(".list-of-posts li:has(." + tag + ")").show();
      });
    });
    // Add click event to toggle button selection
    $(".filter-button").click(function() {
      $(this).toggleClass("selected");
    });
  });