// Function to filter the posts based on the selected category
function filterPosts() {
  const selectedCategory = document.querySelector('input[name="categories"]:checked');
  const postElements = document.querySelectorAll(".post");

  // If no posts exist yet (blog not loaded), return
  if (!postElements || postElements.length === 0) {
    return;
  }

  const category = selectedCategory ? selectedCategory.value : 'all';

  postElements.forEach(post => {
    if (category === "all" || post.dataset.category === category) {
      post.classList.add('visible');
      post.classList.remove('hidden');
    } else {
      post.classList.add('hidden');
      post.classList.remove('visible');
    }
  });
}

// Wait for DOM to be ready before accessing elements
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', function() {
    // Add event listeners to the radio buttons
    const radioButtons = document.querySelectorAll('input[name="categories"]');
    radioButtons.forEach(radio => {
      radio.addEventListener("change", filterPosts);
    });

    // Initially filter the posts (after blog index is built)
    // Wait a bit for markdown-blog.js to finish loading
    setTimeout(filterPosts, 100);
  });
} else {
  // DOM is already ready
  // Add event listeners to the radio buttons
  const radioButtons = document.querySelectorAll('input[name="categories"]');
  radioButtons.forEach(radio => {
    radio.addEventListener("change", filterPosts);
  });

  // Initially filter the posts (after blog index is built)
  setTimeout(filterPosts, 100);
}
