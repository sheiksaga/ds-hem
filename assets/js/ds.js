// Function to randomly select and display a "like"
function displayRandomLike() {
  const likes = [
    "the jabberwocky",
    "something about LLMs",
    "a good book",
    "why tea is superior to coffee on a hot day",
    "rains are a good thing when warm, actually",
    "a crackling fireplace",
    "the fact that nothing beats a good home-cooked meal",
    "the smell of old books",
    "the buzz of a sleeping city",
    "why runny egg yolks are better",
    "creating a very good pun"
  ];
  const likeDisplay = document.getElementById("likeDisplay");
  if (likeDisplay) {
    const randomIndex = Math.floor(Math.random() * likes.length);
    likeDisplay.textContent = likes[randomIndex];
  }
}

// Wait for DOM to be ready before running
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', function() {
    displayRandomLike();

    // Refresh the "like" when the refresh icon is clicked
    const refreshIcon = document.querySelector(".refresh-icon");
    if (refreshIcon) {
      refreshIcon.addEventListener("click", displayRandomLike);
    }
  });
} else {
  // DOM is already ready
  displayRandomLike();

  // Refresh the "like" when the refresh icon is clicked
  const refreshIcon = document.querySelector(".refresh-icon");
  if (refreshIcon) {
    refreshIcon.addEventListener("click", displayRandomLike);
  }
}
