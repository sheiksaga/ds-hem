// Function to randomly select and display a "like"
function displayRandomLike() {
  const likes = [
    "long walks on the beach",
    "the smell of rain",
    "a good book",
    "a warm cup of coffee",
    "a sunny day",
    "a starry night",
    "a crackling fireplace",
    "a home-cooked meal",
    "a good laugh",
    "a long hug"
  ];
  const likeDisplay = document.getElementById("likeDisplay");
  const randomIndex = Math.floor(Math.random() * likes.length);
  likeDisplay.textContent = likes[randomIndex];
}

// Display a random "like" when the page loads
displayRandomLike();

// Refresh the "like" when the refresh icon is clicked
const refreshIcon = document.querySelector(".refresh-icon");
refreshIcon.addEventListener("click", displayRandomLike);
