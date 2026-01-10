// Markdown Blog Engine
// Dynamic blog system that loads Markdown files and renders them client-side
// Author: Sangeeth G
// Description: Core blog engine for dynamic Markdown loading

(function() {
    'use strict';

    // Configuration
    const CONFIG = {
        manifestUrl: './posts.json',
        cacheEnabled: true
    };

    // Custom footnotes pre-processor
    function processFootnotes(markdown) {
        // Extract footnote definitions
        const footnoteDefs = {};
        const defRegex = /^\[\^([^\]]+)\]:(.*)$/gm;
        let match;

        while ((match = defRegex.exec(markdown)) !== null) {
            footnoteDefs[match[1]] = match[2].trim();
        }

        // Remove all footnote definitions from the content
        markdown = markdown.replace(defRegex, '');

        // Replace footnote references with superscript links
        let footnoteIndex = 1;
        const footnotesHtml = [];

        markdown = markdown.replace(/\[\^([^\]]+)\]/g, (refMatch, refId) => {
            const text = footnoteDefs[refId];
            if (text) {
                const refNum = footnoteIndex++;
                footnotesHtml.push(`<li id="fn-${refNum}">${text} <a href="#fnref-${refNum}" class="footnote-backref">↩︎</a></li>`);
                return `<sup id="fnref-${refNum}"><a href="#fn-${refNum}" data-footnote="${text}">${refNum}</a></sup>`;
            }
            return refMatch;
        });

        // Append footnotes section if there are any
        if (footnotesHtml.length > 0) {
            markdown += `\n\n<div class="footnotes">\n<ol>\n${footnotesHtml.join('\n')}\n</ol>\n</div>`;
        }

        return markdown;
    }

    // Configure marked with footnotes pre-processor and heading IDs for anchor links
    const markedConfig = {
      gfm: true,
      breaks: false,
      pedantic: false,
      renderer: {
        heading(textOrToken, level, raw, slugger) {
          // Handle both marked.js v4- (separate params) and v5+ (single token object)
          let text, levelNum, rawText;

          // Check if using marked.js v5+ API (single token object)
          if (typeof textOrToken === 'object' && textOrToken.type === 'heading') {
            text = textOrToken.text;
            levelNum = textOrToken.depth;
            rawText = text;
          } else {
            // marked.js v4- API (separate parameters)
            text = textOrToken;
            levelNum = level;
            rawText = raw || text;
          }

          // Generate ID from raw text
          const id = (rawText || '').toLowerCase()
            .replace(/[^\w\s-]/g, '')    // Remove special characters except spaces and hyphens
            .replace(/\s+/g, '-')         // Replace spaces with hyphens
            .replace(/-+/g, '-');         // Replace multiple hyphens with single

          // For v5+, text is already a string
          // For v4-, text might be tokens
          const htmlText = text;

          return `<h${levelNum} id="${id}">${htmlText}</h${levelNum}>`;
        }
      }
    };

    marked.use(markedConfig);

    // State
    let postsData = null;
    let postsCache = {};

    // DOM Elements
    const blogIndex = document.getElementById('blog-index');
    const postContent = document.getElementById('post-content');
    const postArticle = document.getElementById('post-article');
    const backToBlogBtn = document.getElementById('back-to-blog');
    const loadingEl = document.getElementById('loading');
    const errorEl = document.getElementById('error');
    const introSection = document.querySelector('.intro');
    const filtersSection = document.querySelector('.filters');
    const filterInputs = document.querySelectorAll('input[name="categories"]');
    const breadcrumbsEl = document.getElementById('breadcrumbs');

    // ========== UTILITY FUNCTIONS ==========

    // Show loading spinner
    function showLoading() {
        if (loadingEl) loadingEl.style.display = 'block';
        if (errorEl) errorEl.style.display = 'none';
    }

    // Hide loading spinner
    function hideLoading() {
        if (loadingEl) loadingEl.style.display = 'none';
    }

    // Show error message
    function showError(message) {
        if (errorEl) {
            errorEl.textContent = 'Error: ' + message;
            errorEl.style.display = 'block';
        }
        if (loadingEl) loadingEl.style.display = 'none';
        console.error('Markdown Blog Error:', message);
    }

    // Parse YAML frontmatter from Markdown
    function parseFrontmatter(markdown) {
        // Check for YAML frontmatter delimited by ---
        const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/;
        const match = markdown.match(frontmatterRegex);

        if (!match) {
            // No frontmatter found, return null with full content
            return { frontmatter: null, content: markdown };
        }

        const yamlText = match[1];
        const content = match[2];

        try {
            // Parse YAML using js-yaml library
            const frontmatter = jsyaml.load(yamlText);
            return { frontmatter, content };
        } catch (e) {
            console.warn('Failed to parse YAML frontmatter:', e);
            return { frontmatter: null, content: markdown };
        }
    }

    // Format date as DD-MM-YY
    function formatDate(dateString) {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = String(date.getFullYear()).slice(-2);
        return `${day}-${month}-${year}`;
    }

    // Convert category slug to display name
    function formatCategory(category) {
        return category.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
    }

    // Generate URL-safe slug from title
    function generateSlug(title) {
        return title
            .toLowerCase()
            .replace(/[^\w\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .trim();
    }

    // Generate breadcrumbs HTML
    function generateBreadcrumbs(post) {
        const category = formatCategory(post.category);
        return `
            <a href="#blog">Blog</a>
            <span class="breadcrumb-separator">›</span>
            <a href="#blog" data-category="${post.category}">${category}</a>
            <span class="breadcrumb-separator">›</span>
            <span class="breadcrumb-current">${post.title}</span>
        `;
    }

    // ========== CORE FUNCTIONS ==========

    // Load posts manifest
    async function loadManifest() {
        try {
            const response = await fetch(CONFIG.manifestUrl);
            if (!response.ok) {
                throw new Error(`Failed to load posts.json: ${response.statusText}`);
            }
            const data = await response.json();
            postsData = data;
            return data;
        } catch (e) {
            showError('Could not load blog posts. Please refresh the page.');
            throw e;
        }
    }

    // Build blog index HTML
    function buildIndex(posts) {
        // Group posts by year
        const postsByYear = {};
        posts.forEach(post => {
            if (!postsByYear[post.year]) {
                postsByYear[post.year] = [];
            }
            postsByYear[post.year].push(post);
        });

        // Sort years in descending order
        const sortedYears = Object.keys(postsByYear).sort((a, b) => b - a);

        // Build HTML
        let html = '';

        sortedYears.forEach(year => {
            html += `<div class="posts">`;
            html += `<h2>${year}</h2>`;
            html += `<ul class="list-of-posts">`;

            // Sort posts by date (newest first)
            const yearPosts = postsByYear[year].sort((a, b) =>
                new Date(b.date) - new Date(a.date)
            );

            yearPosts.forEach(post => {
                const categoryClass = post.category === 'web_design' ? 'sub-web' : 'sub-gen';
                html += `
                    <li class="post" data-category="${post.category}">
                        <a href="#post/${post.year}/${post.slug}">${post.title}</a>
                        <span class="super">${formatDate(post.date)}</span>
                        <span class="${categoryClass}">${formatCategory(post.category)}</span>
                    </li>
                `;
            });

            html += `</ul>`;
            html += `</div>`;
        });

        return html;
    }

    // Load and render a single post
    async function renderPost(year, slug) {
        try {
            showLoading();

            // Find post in manifest
            const post = postsData.posts.find(p => p.year === year && p.slug === slug);
            if (!post) {
                throw new Error(`Post not found: ${year}/${slug}`);
            }

            // Check cache first
            if (CONFIG.cacheEnabled && postsCache[post.file]) {
                displayPost(postsCache[post.file], post);
                return;
            }

            // Fetch Markdown file
            const response = await fetch(post.file);
            if (!response.ok) {
                throw new Error(`Failed to load post: ${response.statusText}`);
            }

            const markdown = await response.text();

            // Parse frontmatter and content
            const { frontmatter, content } = parseFrontmatter(markdown);

            // Use frontmatter data if available, otherwise use manifest data
            const postData = {
                title: frontmatter?.title || post.title,
                date: frontmatter?.date || post.date,
                category: frontmatter?.category || post.category,
                content: content
            };

            // Cache the parsed content
            if (CONFIG.cacheEnabled) {
                postsCache[post.file] = postData;
            }

            displayPost(postData, post);

        } catch (e) {
            showError(e.message);
        }
    }

    // Get previous and next posts
    function getAdjacentPosts(currentPost) {
        // Sort all posts by date (newest first)
        const sortedPosts = [...postsData.posts].sort((a, b) =>
            new Date(b.date) - new Date(a.date)
        );

        const currentIndex = sortedPosts.findIndex(
            p => p.slug === currentPost.slug && p.year === currentPost.year
        );

        return {
            prev: currentIndex > 0 ? sortedPosts[currentIndex - 1] : null,
            next: currentIndex < sortedPosts.length - 1 ? sortedPosts[currentIndex + 1] : null
        };
    }

    // Display post content
    function displayPost(postData, manifestPost) {
        // Process footnotes, then convert Markdown to HTML
        const processedContent = processFootnotes(postData.content);
        const htmlContent = marked.parse(processedContent);

        // Get adjacent posts for navigation
        const { prev, next } = getAdjacentPosts(manifestPost);

        // Build navigation HTML
        let navHtml = '<div class="post-navigation">';

        if (prev) {
            navHtml += `
                <a href="#post/${prev.year}/${prev.slug}" class="nav-button prev-post">
                    <span class="nav-icon">←</span>
                    <span class="nav-text">
                        <span class="nav-label">Previous</span>
                        <span class="nav-title">${prev.title}</span>
                    </span>
                </a>
            `;
        } else {
            navHtml += `<div></div>`; // Empty placeholder
        }

        if (next) {
            navHtml += `
                <a href="#post/${next.year}/${next.slug}" class="nav-button next-post">
                    <span class="nav-text">
                        <span class="nav-label">Next</span>
                        <span class="nav-title">${next.title}</span>
                    </span>
                    <span class="nav-icon">→</span>
                </a>
            `;
        } else {
            navHtml += `<div></div>`; // Empty placeholder
        }

        navHtml += '</div>';

        // Build post HTML
        const html = `
            <h1>${postData.title}</h1>
            <div class="post-meta">
                <span class="post-date">${formatDate(postData.date)}</span>
                <span class="post-category">${formatCategory(postData.category)}</span>
            </div>
            <hr>
            ${htmlContent}
            ${navHtml}
        `;

        // Set breadcrumbs
        if (breadcrumbsEl) {
            breadcrumbsEl.innerHTML = generateBreadcrumbs(manifestPost);
            breadcrumbsEl.style.display = 'block';
        }

        // Update DOM with animation
        if (postArticle) {
            // Start with fade-in state
            postArticle.classList.add('fade-in');
            postArticle.innerHTML = html;

            // Trigger reflow
            void postArticle.offsetWidth;

            // Remove fade-in class to trigger animation
            requestAnimationFrame(() => {
                postArticle.classList.remove('fade-in');
            });

            // Setup footnote tooltips
            setupFootnoteTooltips();
        }

        // Show post content, hide index
        if (postContent) postContent.style.display = 'block';
        if (blogIndex) blogIndex.style.display = 'none';

        // Hide intro and filters when viewing a post
        if (introSection) introSection.style.display = 'none';
        if (filtersSection) filtersSection.style.display = 'none';
        // Hide filter radio inputs
        filterInputs.forEach(input => {
            input.style.display = 'none';
        });

        hideLoading();

        // Scroll to top
        window.scrollTo(0, 0);
    }

    // Setup footnote hover tooltips
    function setupFootnoteTooltips() {
        // Find all footnote references
        const footnoteRefs = postArticle.querySelectorAll('sup[id^="fnref"] a');
        const footnotesSection = postArticle.querySelector('.footnotes');

        if (!footnotesSection) return;

        // Find all footnote items in the footnotes section
        footnoteRefs.forEach(ref => {
            const footnoteId = ref.getAttribute('href');
            if (footnoteId && footnoteId.startsWith('#fn')) {
                const footnoteItem = postArticle.querySelector(footnoteId);
                if (footnoteItem) {
                    // Get the footnote text (excluding the back-reference)
                    let footnoteText = footnoteItem.textContent;
                    // Remove the back-reference arrow symbol if present
                    footnoteText = footnoteText.replace(/↩︎/g, '').trim();
                    // Set the data attribute for CSS tooltip
                    ref.setAttribute('data-footnote', footnoteText);
                }
            }
        });
    }

    // Show blog index
    function showIndex() {
        if (postContent) postContent.style.display = 'none';
        if (blogIndex) {
            // Start with fade-in state
            blogIndex.classList.add('fade-in');

            // Show the index
            blogIndex.style.display = 'block';

            // Trigger reflow and remove fade-in class
            void blogIndex.offsetWidth;
            requestAnimationFrame(() => {
                blogIndex.classList.remove('fade-in');
            });
        }

        // Hide breadcrumbs
        if (breadcrumbsEl) {
            breadcrumbsEl.style.display = 'none';
        }

        // Show intro and filters again
        if (introSection) introSection.style.display = 'block';
        if (filtersSection) filtersSection.style.display = 'block';
        // Show filter radio inputs
        filterInputs.forEach(input => {
            input.style.display = '';
        });

        hideLoading();
    }

    // Parse hash and route
    function handleHash() {
        const hash = window.location.hash;

        // If we're currently viewing a post and hash is an internal anchor
        // Don't redirect to index - let browser handle anchor navigation
        if (postContent && postContent.style.display === 'block' &&
            hash && hash !== '#' && hash !== '' && hash !== '#blog' &&
            !hash.match(/^#post\/(\d{4})\/([^/]+)$/)) {
            // Internal anchor link within current post - do nothing
            return;
        }

        if (!hash || hash === '#' || hash === '' || hash === '#blog') {
            // Show index
            showIndex();
            return;
        }

        // Parse post hash: #post/YEAR/SLUG
        const postMatch = hash.match(/^#post\/(\d{4})\/([^/]+)$/);
        if (postMatch) {
            const year = postMatch[1];
            const slug = postMatch[2];
            renderPost(year, slug);
        } else {
            // Invalid hash, show index
            showIndex();
        }
    }

    // ========== INITIALIZATION ==========

    // Initialize the blog
    async function init() {
        try {
            console.log('[Markdown Blog] Starting initialization...');

            // Check if required libraries are loaded
            if (typeof marked === 'undefined') {
                throw new Error('marked.js library not loaded');
            }
            console.log('[Markdown Blog] marked.js is loaded');

            if (typeof jsyaml === 'undefined') {
                throw new Error('js-yaml library not loaded');
            }
            console.log('[Markdown Blog] js-yaml is loaded');

            // Load posts manifest
            showLoading();
            await loadManifest();
            console.log('[Markdown Blog] Posts loaded:', postsData.posts.length);

            // Build index
            const indexHtml = buildIndex(postsData.posts);
            console.log('[Markdown Blog] Index HTML generated, length:', indexHtml.length);
            if (blogIndex) {
                blogIndex.innerHTML = indexHtml;
                console.log('[Markdown Blog] Blog index updated');
            }

            // Trigger filter after index is built
            if (typeof filterPosts === 'function') {
                filterPosts();
            }

            // Setup back button
            if (backToBlogBtn) {
                backToBlogBtn.addEventListener('click', () => {
                    window.location.hash = '';
                    showIndex();
                });
            }

            // Setup breadcrumb click handlers for category filtering
            document.addEventListener('click', (e) => {
                const breadcrumbLink = e.target.closest('.breadcrumbs a[data-category]');
                if (breadcrumbLink) {
                    e.preventDefault();
                    const category = breadcrumbLink.getAttribute('data-category');
                    window.location.hash = '';

                    // Wait for index to show, then apply filter
                    setTimeout(() => {
                        const radioBtn = document.querySelector(`input[name="categories"][value="${category}"]`);
                        if (radioBtn) {
                            radioBtn.checked = true;
                            if (typeof filterPosts === 'function') {
                                filterPosts();
                            }
                        }
                    }, 100);
                }
            });

            // Handle initial hash
            handleHash();

            // Listen for hash changes
            window.addEventListener('hashchange', handleHash);

            hideLoading();
            console.log('Markdown Blog initialized successfully');

        } catch (e) {
            showError(e.message);
        }
    }

    // Start when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
