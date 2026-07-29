// Function to filter the posts based on the selected category
function filterPosts() {
  const selectedCategory = document.querySelector('input[name="categories"]:checked');
  const postElements = document.querySelectorAll(".post");

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

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', function() {
    const radioButtons = document.querySelectorAll('input[name="categories"]');
    radioButtons.forEach(radio => {
      radio.addEventListener("change", filterPosts);
    });

    // Posts are server-rendered, filter immediately
    filterPosts();
  });
} else {
  const radioButtons = document.querySelectorAll('input[name="categories"]');
  radioButtons.forEach(radio => {
    radio.addEventListener("change", filterPosts);
  });
  filterPosts();
}
