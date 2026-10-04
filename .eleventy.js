const markdownItFootnote = require("markdown-it-footnote");
const markdownItAnchor = require("markdown-it-anchor");

module.exports = function(eleventyConfig) {
  // --- Markdown: extend Eleventy's built-in markdown-it with plugins ---
  eleventyConfig.amendLibrary("md", function(mdLib) {
    mdLib.use(markdownItFootnote);
    mdLib.use(markdownItAnchor, {
      level: [1, 2, 3, 4, 5, 6],
      slugify: function(s) {
        return s
          .toLowerCase()
          .replace(/[^\w\s-]/g, "")
          .replace(/\s+/g, "-")
          .replace(/-+/g, "-");
      },
      permalink: markdownItAnchor.permalink.headerLink(),
    });
  });

  // --- Filters ---
  eleventyConfig.addFilter("readableDate", function(date) {
    const d = new Date(date);
    return d.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  });

  eleventyConfig.addFilter("shortDate", function(date) {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = String(d.getFullYear()).slice(-2);
    return `${day}-${month}-${year}`;
  });

  // --- Passthrough copy (static assets, standalone pages) ---
  eleventyConfig.addPassthroughCopy("src");
  eleventyConfig.addPassthroughCopy("blog/posts/index.html");
  eleventyConfig.addPassthroughCopy(".nojekyll");

  // --- Blog posts collection ---
  eleventyConfig.addCollection("blogPosts", function(collectionApi) {
    return collectionApi.getFilteredByGlob("blog/posts/**/*.md");
  });

  // --- Prev/Next post helpers ---
  eleventyConfig.addFilter("prevPost", function(collection, page) {
    const posts = [...collection].sort((a, b) => b.date - a.date);
    const idx = posts.findIndex(p => p.url === page.url);
    return idx < posts.length - 1 ? posts[idx + 1] : null;
  });

  eleventyConfig.addFilter("nextPost", function(collection, page) {
    const posts = [...collection].sort((a, b) => b.date - a.date);
    const idx = posts.findIndex(p => p.url === page.url);
    return idx > 0 ? posts[idx - 1] : null;
  });

  // --- Group posts by year ---
  eleventyConfig.addFilter("groupByYear", function(posts) {
    const groups = {};
    posts.forEach(post => {
      const year = post.date.getFullYear();
      if (!groups[year]) groups[year] = [];
      groups[year].push(post);
    });
    return groups;
  });

  // --- Sitemap entries: HTML pages only, lastmod for dated posts ---
  eleventyConfig.addFilter("sitemapPages", function(collection, blogPosts) {
    const postUrls = new Set((blogPosts || []).map(function(p) { return p.url; }));
    return collection
      .filter(function(p) {
        return p.outputPath && p.outputPath.endsWith(".html");
      })
      .sort(function(a, b) { return a.url < b.url ? -1 : a.url > b.url ? 1 : 0; })
      .map(function(p) {
        return {
          url: p.url,
          lastmod: postUrls.has(p.url) ? p.date.toISOString().slice(0, 10) : null,
        };
      });
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
