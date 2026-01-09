// Function to filter the posts based on the selected category
function filterPosts() {
  const selectedCategory = document.querySelector('input[name="categories"]:checked').value;
  const posts = document.querySelectorAll(".post");

  posts.forEach(post => {
    if (selectedCategory === "all" || post.dataset.category === selectedCategory) {
      post.style.display = "list-item";
    } else {
      post.style.display = "none";
    }
  });
}

// Add event listeners to the radio buttons
const radioButtons = document.querySelectorAll('input[name="categories"]');
radioButtons.forEach(radio => {
  radio.addEventListener("change", filterPosts);
});

// Initially filter the posts
filterPosts();
