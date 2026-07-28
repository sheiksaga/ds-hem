module.exports = function(eleventyConfig) {
  // --- Filters ---
  eleventyConfig.addFilter("readableDate", function(date) {
    const d = new Date(date);
    return d.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  });

  // --- Passthrough copy (static assets, standalone pages) ---
  eleventyConfig.addPassthroughCopy("assets");
  eleventyConfig.addPassthroughCopy("blog/assets");
  // blog/chatchat and blog/mes are now Eleventy templates (index.njk)
  // eleventyConfig.addPassthroughCopy("blog/chatchat");
  // eleventyConfig.addPassthroughCopy("blog/mes");
  eleventyConfig.addPassthroughCopy("blog/posts.json");
  eleventyConfig.addPassthroughCopy("blog/posts/index.html");
  eleventyConfig.addPassthroughCopy("projects/assets");
  eleventyConfig.addPassthroughCopy("projects/projects.json");
  eleventyConfig.addPassthroughCopy("robots.txt");
  eleventyConfig.addPassthroughCopy("sitemap.xml");
  eleventyConfig.addPassthroughCopy(".nojekyll");

  // --- Blog posts collection ---
  eleventyConfig.addCollection("blogPosts", function(collectionApi) {
    return collectionApi.getFilteredByGlob("blog/posts/**/*.md");
  });

  return {
    dir: {
      input: ".",
      output: "_site",
      includes: "_includes",
    },
    markdownTemplateEngine: "njk",
  };
};
