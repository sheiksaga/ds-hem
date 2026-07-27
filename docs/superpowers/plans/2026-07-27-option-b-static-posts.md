# Option B: Static Post Pages + Dead-Domain Fix — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Pre-render each blog post as a real static HTML page with its own meta tags, generate a correct sitemap, and replace every reference to the inactive `designsaga.com` / `designsaga.se` domains with the live GitHub Pages URL.

**Architecture:** A new authoring-time Node script (`tools/build-posts.js`) reads `blog/posts.json` and the markdown files, renders each post with a *vendored, version-pinned* copy of marked, and writes `blog/<year>/<slug>/index.html` from an HTML template, plus a fresh `sitemap.xml`. The client-side markdown engine is then reduced to an index-builder; old `#post/YEAR/SLUG` hash URLs redirect to the new static pages. No `package.json`, no `node_modules`, no CI change — deployment stays "push the branch".

**Tech Stack:** Node.js (already used by `tools/new-post.js`), marked v12.0.2 vendored as a single file in `tools/vendor/`. No other dependencies.

## Global Constraints

- Canonical base URL everywhere: `https://sheiksaga.github.io/ds-hem` (no trailing slash in the constant; paths append `/...`). Neither designsaga.com nor designsaga.se is active — no code or metadata may reference them. (Prose *inside* old markdown posts is historical writing and stays untouched.)
- No `package.json`, no npm install, no build step in CI. The only new tooling is `tools/build-posts.js` + `tools/vendor/marked.min.js` (pinned at 12.0.2, committed to the repo), run manually at authoring time.
- Post URLs: `blog/<year>/<slug>/` (mirrors the old `#post/<year>/<slug>` scheme so redirects are mechanical).
- Valid categories: `web_design`, `general` (from `tools/new-post.js:19`). Display form: `web_design` → `Web Design` (underscore → space, title case).
- Date display format on post pages: `DD-MM-YY` (matches existing `formatDate` in `blog/assets/js/markdown-blog.js:164-170`).
- Generated pages must load the existing CSS/JS so the theme toggle, magnetic nav, and scroll animations keep working. Relative asset depth from `blog/<year>/<slug>/index.html`: site assets `../../../assets/`, blog assets `../../assets/`.
- There is no test framework in this repo and none should be added. Each step's "test" is a concrete verification command with its expected output.
- The four existing posts (from `blog/posts.json`): `2026/back-in-the-saddle`, `2023/as-of-01-may`, `2023/website-builds`, `2023/what-is-this`.

---

### Task 1: Replace dead-domain references

**Files:**
- Modify: `robots.txt:11`
- Modify: `index.html:19`
- Modify: `blog/index.html:19`
- Modify: `blog/posts/index.html:5`

**Interfaces:**
- Produces: nothing programmatic; establishes the base URL `https://sheiksaga.github.io/ds-hem` that Task 3's script also uses. (`sitemap.xml` still contains designsaga URLs after this task — Task 3 regenerates it wholesale, so leave it alone here.)

- [ ] **Step 1: Fix robots.txt**

Change line 11 from:
```
Sitemap: https://designsaga.com/sitemap.xml
```
to:
```
Sitemap: https://sheiksaga.github.io/ds-hem/sitemap.xml
```

- [ ] **Step 2: Fix og:url in index.html**

Change line 19 from:
```html
    <meta property="og:url" content="https://designsaga.com">
```
to:
```html
    <meta property="og:url" content="https://sheiksaga.github.io/ds-hem/">
```

- [ ] **Step 3: Fix og:url in blog/index.html**

Change line 19 from:
```html
    <meta property="og:url" content="https://designsaga.com/blog">
```
to:
```html
    <meta property="og:url" content="https://sheiksaga.github.io/ds-hem/blog/">
```

- [ ] **Step 4: Fix the redirect stub blog/posts/index.html**

This file is a leftover from when the blog lived at designsaga.se. It sits at `/blog/posts/`, so a relative redirect one level up reaches the blog index and works on any host. Change line 5 from:
```html
        <meta http-equiv="Refresh" content="0; url='https://designsaga.se/blog/'" />
```
to:
```html
        <meta http-equiv="Refresh" content="0; url='../'" />
```

- [ ] **Step 5: Verify no live code references the dead domains**

Run:
```bash
grep -rn "designsaga" --include="*.html" --include="*.xml" --include="*.txt" --include="*.js" . | grep -v "sitemap.xml"
```
Expected: no output. (`sitemap.xml` is excluded because Task 3 regenerates it; markdown post prose is excluded by the file filters.)

- [ ] **Step 6: Commit**

```bash
git add robots.txt index.html blog/index.html blog/posts/index.html
git commit -m "fix: replace inactive designsaga domains with GitHub Pages URL"
```

---

### Task 2: Post page HTML template

**Files:**
- Create: `tools/post-template.html`

**Interfaces:**
- Produces: an HTML file with these literal placeholders, which Task 3's script fills via string replacement: `{{TITLE}}` (HTML-escaped post title), `{{DESCRIPTION}}` (HTML-escaped ~155-char excerpt), `{{URL}}` (absolute canonical URL, e.g. `https://sheiksaga.github.io/ds-hem/blog/2026/back-in-the-saddle/`), `{{DATE_DISPLAY}}` (DD-MM-YY), `{{CATEGORY_DISPLAY}}` (e.g. `Web Design`), `{{CONTENT}}` (rendered post HTML), `{{POST_NAV}}` (prev/next nav HTML or empty string).

- [ ] **Step 1: Create tools/post-template.html**

This mirrors `blog/index.html`'s head/header/footer with three deliberate differences: asset paths are one level deeper (`../../../` for site assets, `../../` for blog assets), the marked/js-yaml/quicklink/filter scripts are gone (nothing is rendered client-side), and the body is a static article instead of the dynamic containers.

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <!-- support browser themeing -->
    <meta name="theme-color" content="#002f80">
    <meta name="msapplication-navbutton-color" content="#002f80">
    <meta name="apple-mobile-web-app-status-bar-style" content="#002f80">
    <!-- title -->
    <title>{{TITLE}} | Design Saga Blog</title>
    <!-- meta description for SEO -->
    <meta name="description" content="{{DESCRIPTION}}">
    <link rel="canonical" href="{{URL}}">
    <!-- Open Graph tags for social sharing -->
    <meta property="og:title" content="{{TITLE}}">
    <meta property="og:description" content="{{DESCRIPTION}}">
    <meta property="og:type" content="article">
    <meta property="og:url" content="{{URL}}">
    <!-- favicon -->
    <link rel="icon" type="image/x-icon" href="../../../assets/img/favicon.ico">
    <!-- Load fonts directly -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Syne&family=Inter:wght@400&display=swap" rel="stylesheet">

    <!-- Initialize theme immediately to prevent FOUC -->
    <script>
      (function() {
        const savedTheme = localStorage.getItem('theme');
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const theme = savedTheme || (systemPrefersDark ? 'dark' : 'light');
        if (theme === 'dark') {
          document.documentElement.setAttribute('data-theme', 'dark');
        }
      })();
    </script>
    <!-- Load CSS files directly instead of via @import -->
    <link rel="stylesheet" href="../../../assets/css/main.css">
    <link rel="stylesheet" href="../../assets/css/blog.css">
    <!-- GSAP for scroll animations -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js" defer></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js" defer></script>
</head>

<body>
    <!-- skip navigation link for accessibility -->
    <a href="#main-content" class="skip-link">Skip to main content</a>
    <!-- scroll progress indicator -->
    <div class="scroll-progress"></div>
    <!-- header -->
    <header class="ds-header" id="header">
            <div class="blog-ref">
                <a href="../../index.html">
                    <img class="logo-header" src="../../../assets/img/design-saga-blue.svg" alt="logo">
                </a>
            </div>
            <div class="menu">
            <ul class="nav-links">
                <div class="nav-indicator"></div>
                <li class="list-item"><a href="../../../index.html">HOME</a></li>
                    <li class="list-item"><a href="../../index.html" class="active-link">BLOG</a></li>
            </ul>
            <button class="theme-toggle" id="theme-toggle-btn" aria-label="Toggle dark mode">
                <svg class="sun-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="12" cy="12" r="5"></circle>
                    <line x1="12" y1="1" x2="12" y2="3"></line>
                    <line x1="12" y1="21" x2="12" y2="23"></line>
                    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                    <line x1="1" y1="12" x2="3" y2="12"></line>
                    <line x1="21" y1="12" x2="23" y2="12"></line>
                    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
                </svg>
                <svg class="moon-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
                </svg>
                <span class="star star-1">★</span>
                <span class="star star-2">★</span>
            </button>
        </div>
    </header>

    <div id="post-content">
        <a href="../../index.html" class="back-button">← Back to Blog</a>
        <nav class="breadcrumbs">
            <a href="../../index.html">Blog</a>
            <span class="breadcrumb-separator">›</span>
            <span class="breadcrumb-current">{{TITLE}}</span>
        </nav>
        <article id="post-article" data-main-content>
            <h1 id="main-content">{{TITLE}}</h1>
            <div class="post-meta">
                <span class="post-date">{{DATE_DISPLAY}}</span>
                <span class="post-category">{{CATEGORY_DISPLAY}}</span>
            </div>
            <hr>
            {{CONTENT}}
            {{POST_NAV}}
        </article>
    </div>

    <!-- back to top button -->
    <button id="back-to-top">↩︎</button>

    <!-- footer -->
    <footer class="footer">
        <div >
            Built in GBG with VS Code and lots of Love <br>
            Sangeeth G, 2026
        </div>
    </footer>

    <!-- js scripts (loaded at end for DOM ready access) -->
    <script src="../../assets/js/styles.js"></script>
    <script src="../../assets/js/blog-scroll-animations.js"></script>
    <script src="../../../assets/js/nav-magnetic.js"></script>

</body>
</html>
```

- [ ] **Step 2: Verify the template has all placeholders exactly once each (except TITLE ×4, DESCRIPTION ×2, URL ×2)**

Run:
```bash
grep -o "{{[A-Z_]*}}" tools/post-template.html | sort | uniq -c
```
Expected output:
```
      1 {{CATEGORY_DISPLAY}}
      1 {{CONTENT}}
      1 {{DATE_DISPLAY}}
      2 {{DESCRIPTION}}
      1 {{POST_NAV}}
      4 {{TITLE}}
      2 {{URL}}
```

- [ ] **Step 3: Commit**

```bash
git add tools/post-template.html
git commit -m "feat: add static post page template"
```

---

### Task 3: Build script — generate post pages and sitemap

**Files:**
- Create: `tools/vendor/marked.min.js` (downloaded once, committed)
- Create: `tools/build-posts.js`
- Create (generated): `blog/2026/back-in-the-saddle/index.html`, `blog/2023/as-of-01-may/index.html`, `blog/2023/website-builds/index.html`, `blog/2023/what-is-this/index.html`
- Modify (regenerated): `sitemap.xml`

**Interfaces:**
- Consumes: `tools/post-template.html` placeholders from Task 2; `blog/posts.json` (array `posts` of `{slug, title, date, category, file, year}`).
- Produces: `node tools/build-posts.js` — idempotent, run after adding/editing any post; writes `blog/<year>/<slug>/index.html` per manifest entry and rewrites `sitemap.xml`. Task 4 links to these pages as `./<year>/<slug>/` from `blog/index.html`.

- [ ] **Step 1: Vendor marked, pinned at 12.0.2**

```bash
mkdir -p tools/vendor
curl -sSL -o tools/vendor/marked.min.js "https://cdn.jsdelivr.net/npm/marked@12.0.2/marked.min.js"
```

- [ ] **Step 2: Verify the vendored file loads under Node and renders markdown**

Run:
```bash
node -e "const {marked}=require('./tools/vendor/marked.min.js'); console.log(marked.parse('# hi'))"
```
Expected output:
```
<h1>hi</h1>
```
(If the require fails, the download was corrupted or blocked — re-run Step 1 and check the file starts with a UMD wrapper, not an HTML error page.)

- [ ] **Step 3: Write tools/build-posts.js**

The footnote pre-processor and heading-ID renderer are ported from `blog/assets/js/markdown-blog.js` so static pages render identically to what the client engine produced. The frontmatter is three flat `key: value` lines, so a tiny line parser replaces js-yaml.

```js
#!/usr/bin/env node

/**
 * Static Post Page Generator (Option B)
 * Renders every post in blog/posts.json to blog/<year>/<slug>/index.html
 * and regenerates sitemap.xml. Run after adding or editing a post:
 *
 *   node tools/build-posts.js
 *
 * Uses the vendored marked (tools/vendor/marked.min.js, pinned @12.0.2)
 * so rendering never changes underneath us. No npm install needed.
 */

const fs = require('fs');
const path = require('path');
const { marked } = require('./vendor/marked.min.js');

const ROOT = path.join(__dirname, '..');
const BLOG_DIR = path.join(ROOT, 'blog');
const POSTS_JSON = path.join(BLOG_DIR, 'posts.json');
const TEMPLATE_FILE = path.join(__dirname, 'post-template.html');
const SITEMAP_FILE = path.join(ROOT, 'sitemap.xml');
const BASE_URL = 'https://sheiksaga.github.io/ds-hem';

// ---------- helpers ported from blog/assets/js/markdown-blog.js ----------

function escapeHtml(text) {
    return String(text)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

// Footnote pre-processor: [^id] refs + [^id]: defs -> superscript links + list
function processFootnotes(markdown) {
    const footnoteDefs = {};
    const defRegex = /^\[\^([^\]]+)\]:(.*)$/gm;
    let match;
    while ((match = defRegex.exec(markdown)) !== null) {
        footnoteDefs[match[1]] = match[2].trim();
    }
    markdown = markdown.replace(defRegex, '');

    let footnoteIndex = 1;
    const footnotesHtml = [];
    markdown = markdown.replace(/\[\^([^\]]+)\]/g, (refMatch, refId) => {
        const text = footnoteDefs[refId];
        if (text) {
            const refNum = footnoteIndex++;
            footnotesHtml.push(`<li id="fn-${refNum}">${text} <a href="#fnref-${refNum}" class="footnote-backref">↩︎</a></li>`);
            return `<sup id="fnref-${refNum}"><a href="#fn-${refNum}" data-footnote="${escapeHtml(text)}">${refNum}</a></sup>`;
        }
        return refMatch;
    });

    if (footnotesHtml.length > 0) {
        markdown += `\n\n<div class="footnotes">\n<ol>\n${footnotesHtml.join('\n')}\n</ol>\n</div>`;
    }
    return markdown;
}

// Heading renderer with generated IDs for anchor links.
// marked 12 uses the (text, level, raw) signature; the object branch is kept
// so the code survives a future vendored-file upgrade to v14+.
marked.use({
    gfm: true,
    breaks: false,
    pedantic: false,
    renderer: {
        heading(textOrToken, level, raw) {
            let text, levelNum, rawText;
            if (typeof textOrToken === 'object' && textOrToken.type === 'heading') {
                text = textOrToken.text;
                levelNum = textOrToken.depth;
                rawText = text;
            } else {
                text = textOrToken;
                levelNum = level;
                rawText = raw || text;
            }
            const id = (rawText || '').toLowerCase()
                .replace(/[^\w\s-]/g, '')
                .replace(/\s+/g, '-')
                .replace(/-+/g, '-');
            return `<h${levelNum} id="${id}">${text}</h${levelNum}>`;
        }
    }
});

// ---------- build-time helpers ----------

// Frontmatter here is flat "key: value" lines (see tools/new-post.js) — no YAML lib needed
function parseFrontmatter(markdown) {
    const m = markdown.match(/^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/);
    if (!m) return { frontmatter: {}, content: markdown };
    const frontmatter = {};
    m[1].split('\n').forEach(line => {
        const kv = line.match(/^(\w+):\s*(.*)$/);
        if (kv) frontmatter[kv[1]] = kv[2].trim().replace(/^["']|["']$/g, '');
    });
    return { frontmatter, content: m[2] };
}

// DD-MM-YY, matching the client-side display format
function formatDate(dateString) {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = String(date.getFullYear()).slice(-2);
    return `${day}-${month}-${year}`;
}

function formatCategory(category) {
    return category.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
}

// First ~155 chars of prose with markdown syntax stripped, for meta description
function makeExcerpt(markdownContent) {
    const text = markdownContent
        .replace(/^#+\s.*$/gm, '')          // headings
        .replace(/!\[[^\]]*\]\([^)]*\)/g, '') // images
        .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1') // links -> label
        .replace(/[*_`>#]/g, '')
        .replace(/\s+/g, ' ')
        .trim();
    return text.length > 155 ? text.slice(0, 152).trimEnd() + '...' : text;
}

function buildPostNav(post, sortedPosts) {
    const i = sortedPosts.findIndex(p => p.slug === post.slug && p.year === post.year);
    const prev = i > 0 ? sortedPosts[i - 1] : null;
    const next = i < sortedPosts.length - 1 ? sortedPosts[i + 1] : null;

    let html = '<div class="post-navigation">';
    if (prev) {
        html += `
            <a href="../../${prev.year}/${prev.slug}/" class="nav-button prev-post">
                <span class="nav-icon">←</span>
                <span class="nav-text">
                    <span class="nav-label">Previous</span>
                    <span class="nav-title">${escapeHtml(prev.title)}</span>
                </span>
            </a>`;
    } else {
        html += '<div></div>';
    }
    if (next) {
        html += `
            <a href="../../${next.year}/${next.slug}/" class="nav-button next-post">
                <span class="nav-text">
                    <span class="nav-label">Next</span>
                    <span class="nav-title">${escapeHtml(next.title)}</span>
                </span>
                <span class="nav-icon">→</span>
            </a>`;
    } else {
        html += '<div></div>';
    }
    html += '</div>';
    return html;
}

function buildSitemap(posts) {
    const today = new Date().toISOString().split('T')[0];
    const staticPages = [
        { loc: `${BASE_URL}/`, lastmod: today, changefreq: 'monthly', priority: '1.0' },
        { loc: `${BASE_URL}/blog/`, lastmod: today, changefreq: 'weekly', priority: '0.8' },
        { loc: `${BASE_URL}/blog/mes/`, lastmod: today, changefreq: 'monthly', priority: '0.6' }
    ];
    const postPages = posts.map(p => ({
        loc: `${BASE_URL}/blog/${p.year}/${p.slug}/`,
        lastmod: p.date,
        changefreq: 'yearly',
        priority: '0.7'
    }));

    const entries = [...staticPages, ...postPages].map(e => `  <url>
    <loc>${e.loc}</loc>
    <lastmod>${e.lastmod}</lastmod>
    <changefreq>${e.changefreq}</changefreq>
    <priority>${e.priority}</priority>
  </url>`).join('\n');

    return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries}
</urlset>
`;
}

// ---------- main ----------

function main() {
    const template = fs.readFileSync(TEMPLATE_FILE, 'utf8');
    const postsData = JSON.parse(fs.readFileSync(POSTS_JSON, 'utf8'));
    const sortedPosts = [...postsData.posts].sort((a, b) => new Date(b.date) - new Date(a.date));

    sortedPosts.forEach(post => {
        const mdPath = path.join(BLOG_DIR, post.file);
        const markdown = fs.readFileSync(mdPath, 'utf8');
        const { frontmatter, content } = parseFrontmatter(markdown);

        const title = frontmatter.title || post.title;
        const date = frontmatter.date || post.date;
        const category = frontmatter.category || post.category;
        const url = `${BASE_URL}/blog/${post.year}/${post.slug}/`;

        const htmlContent = marked.parse(processFootnotes(content));

        const page = template
            .replace(/\{\{TITLE\}\}/g, escapeHtml(title))
            .replace(/\{\{DESCRIPTION\}\}/g, escapeHtml(makeExcerpt(content)))
            .replace(/\{\{URL\}\}/g, url)
            .replace(/\{\{DATE_DISPLAY\}\}/g, formatDate(date))
            .replace(/\{\{CATEGORY_DISPLAY\}\}/g, escapeHtml(formatCategory(category)))
            .replace(/\{\{POST_NAV\}\}/g, buildPostNav(post, sortedPosts))
            .replace(/\{\{CONTENT\}\}/g, () => htmlContent);

        const outDir = path.join(BLOG_DIR, post.year, post.slug);
        fs.mkdirSync(outDir, { recursive: true });
        const outFile = path.join(outDir, 'index.html');
        fs.writeFileSync(outFile, page, 'utf8');
        console.log(`✓ ${path.relative(ROOT, outFile)}`);
    });

    fs.writeFileSync(SITEMAP_FILE, buildSitemap(sortedPosts), 'utf8');
    console.log(`✓ sitemap.xml (${sortedPosts.length + 3} URLs)`);
}

main();
```

Note the `.replace(/\{\{CONTENT\}\}/g, () => htmlContent)` — the replacement is a function so that `$`-sequences inside rendered post HTML are not treated as replacement patterns.

- [ ] **Step 4: Run the generator**

```bash
node tools/build-posts.js
```
Expected output:
```
✓ blog/2026/back-in-the-saddle/index.html
✓ blog/2023/as-of-01-may/index.html
✓ blog/2023/website-builds/index.html
✓ blog/2023/what-is-this/index.html
✓ sitemap.xml (7 URLs)
```

- [ ] **Step 5: Verify per-post metadata and sitemap correctness**

```bash
grep -h "og:title\|<title>" blog/2026/back-in-the-saddle/index.html blog/2023/what-is-this/index.html
grep -c "designsaga\|#" sitemap.xml
grep "back-in-the-saddle" sitemap.xml
```
Expected: the first command shows `Back in the saddle` and `What is this?` titles (each page has its own); the second prints `0` (no dead domains, no hash URLs); the third shows `<loc>https://sheiksaga.github.io/ds-hem/blog/2026/back-in-the-saddle/</loc>`.

- [ ] **Step 6: Visual check in a browser**

```bash
python -m http.server 8000
```
Open `http://localhost:8000/blog/2026/back-in-the-saddle/` — the post renders with site styling, theme toggle works, prev/next nav links resolve. Then stop the server.

- [ ] **Step 7: Commit**

```bash
git add tools/vendor/marked.min.js tools/build-posts.js blog/2026 blog/2023 sitemap.xml
git commit -m "feat: pre-render blog posts as static pages and regenerate sitemap"
```

---

### Task 4: Point the blog index at the static pages; redirect old hash URLs

**Files:**
- Modify: `blog/assets/js/markdown-blog.js:248` (index link href)
- Modify: `blog/assets/js/markdown-blog.js:536-545` (hash router)

**Interfaces:**
- Consumes: static pages at `blog/<year>/<slug>/` from Task 3.
- Produces: index links of the form `./<year>/<slug>/`; legacy `#post/YEAR/SLUG` and `#slug` URLs redirect via `window.location.replace`. Task 5 replaces this whole file, but this task keeps the site correct as a standalone commit.

- [ ] **Step 1: Change the index link target**

In `buildIndex`, change:
```js
                        <a href="#post/${post.year}/${post.slug}">${post.title}</a>
```
to:
```js
                        <a href="./${post.year}/${post.slug}/">${post.title}</a>
```

- [ ] **Step 2: Redirect legacy hash URLs to the static pages**

In `handleHash`, replace:
```js
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
```
with:
```js
        // Legacy hash URLs (#post/YEAR/SLUG and bare #slug from the old
        // sitemap) permanently redirect to the static post pages
        const postMatch = hash.match(/^#post\/(\d{4})\/([^/]+)$/);
        if (postMatch) {
            window.location.replace(`./${postMatch[1]}/${postMatch[2]}/`);
            return;
        }
        const bareSlug = hash.slice(1);
        const legacyPost = postsData.posts.find(p => p.slug === bareSlug);
        if (legacyPost) {
            window.location.replace(`./${legacyPost.year}/${legacyPost.slug}/`);
            return;
        }
        // Unknown hash, show index
        showIndex();
```

- [ ] **Step 3: Verify in a browser**

```bash
python -m http.server 8000
```
Check all three at `http://localhost:8000/blog/`:
1. Clicking a post title on the index navigates to `/blog/<year>/<slug>/`.
2. `http://localhost:8000/blog/#post/2023/what-is-this` redirects to `/blog/2023/what-is-this/`.
3. `http://localhost:8000/blog/#back-in-the-saddle` (old sitemap form) redirects to `/blog/2026/back-in-the-saddle/`.
Then stop the server.

- [ ] **Step 4: Commit**

```bash
git add blog/assets/js/markdown-blog.js
git commit -m "feat: link index to static post pages, redirect legacy hash URLs"
```

---

### Task 5: Remove the client-side markdown engine

**Files:**
- Create: `blog/assets/js/blog-index.js` (replacement, ~120 lines)
- Delete: `blog/assets/js/markdown-blog.js`
- Modify: `blog/index.html` (drop marked/js-yaml scripts and post containers, swap script tag)

**Interfaces:**
- Consumes: static pages and redirect behavior defined in Tasks 3–4 (`./<year>/<slug>/` URLs, legacy-hash redirects — behavior must be preserved verbatim).
- Produces: `blog-index.js` exposing the same implicit contract the filter relies on: index items rendered as `li.post[data-category]` inside `#blog-index`, and it calls global `filterPosts()` after building (defined in `blog/assets/js/filter.js`).

- [ ] **Step 1: Write blog/assets/js/blog-index.js**

This keeps exactly what the index page still needs — manifest fetch, index build, legacy-hash redirects — and drops rendering, caching, footnotes, breadcrumbs, and the marked/js-yaml dependency (625 lines → ~120).

```js
// Blog Index Builder
// Builds the post index from posts.json and redirects legacy hash URLs
// to the static post pages generated by tools/build-posts.js.
// Author: Sangeeth G

(function() {
    'use strict';

    const MANIFEST_URL = './posts.json';

    const blogIndex = document.getElementById('blog-index');
    const loadingEl = document.getElementById('loading');
    const errorEl = document.getElementById('error');

    let postsData = null;

    function showError(message) {
        if (errorEl) {
            errorEl.textContent = 'Error: ' + message;
            errorEl.style.display = 'block';
        }
        if (loadingEl) loadingEl.style.display = 'none';
        console.error('Blog Index Error:', message);
    }

    // Format date as DD-MM-YY
    function formatDate(dateString) {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = String(date.getFullYear()).slice(-2);
        return `${day}-${month}-${year}`;
    }

    function formatCategory(category) {
        return category.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
    }

    function buildIndex(posts) {
        const postsByYear = {};
        posts.forEach(post => {
            if (!postsByYear[post.year]) postsByYear[post.year] = [];
            postsByYear[post.year].push(post);
        });

        const sortedYears = Object.keys(postsByYear).sort((a, b) => b - a);
        let html = '';

        sortedYears.forEach(year => {
            html += `<div class="posts">`;
            html += `<h2>${year}</h2>`;
            html += `<ul class="list-of-posts">`;

            const yearPosts = postsByYear[year].sort((a, b) =>
                new Date(b.date) - new Date(a.date)
            );

            yearPosts.forEach(post => {
                const categoryClass = post.category === 'web_design' ? 'sub-web' : 'sub-gen';
                html += `
                    <li class="post" data-category="${post.category}">
                        <a href="./${post.year}/${post.slug}/">${post.title}</a>
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

    // Legacy hash URLs (#post/YEAR/SLUG and bare #slug from the old
    // sitemap) permanently redirect to the static post pages
    function redirectLegacyHash() {
        const hash = window.location.hash;
        if (!hash || hash === '#' || hash === '#blog') return;

        const postMatch = hash.match(/^#post\/(\d{4})\/([^/]+)$/);
        if (postMatch) {
            window.location.replace(`./${postMatch[1]}/${postMatch[2]}/`);
            return;
        }
        const bareSlug = hash.slice(1);
        const legacyPost = postsData.posts.find(p => p.slug === bareSlug);
        if (legacyPost) {
            window.location.replace(`./${legacyPost.year}/${legacyPost.slug}/`);
        }
    }

    async function init() {
        try {
            const response = await fetch(MANIFEST_URL);
            if (!response.ok) {
                throw new Error(`Failed to load posts.json: ${response.statusText}`);
            }
            postsData = await response.json();

            redirectLegacyHash();

            if (blogIndex) {
                blogIndex.innerHTML = buildIndex(postsData.posts);
            }
            if (typeof filterPosts === 'function') {
                filterPosts();
            }
            if (loadingEl) loadingEl.style.display = 'none';
        } catch (e) {
            showError(e.message);
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
```

- [ ] **Step 2: Update blog/index.html**

Remove these two lines from the head (lines 43–45 area):
```html
    <!-- Markdown and YAML parsers (needed immediately for blog, no defer) -->
    <script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/js-yaml@4.1.0/dist/js-yaml.min.js"></script>
```

Replace the dynamic containers block:
```html
    <!-- Dynamic blog containers -->
    <div id="blog-index"></div>
    <div id="post-content" style="display:none;">
        <button id="back-to-blog" class="back-button">← Back to Blog</button>
        <nav class="breadcrumbs" id="breadcrumbs"></nav>
        <article id="post-article"></article>
    </div>
    <div id="loading" class="loading-spinner" style="display:none;">Loading...</div>
    <div id="error" class="error-message" style="display:none;"></div>
```
with:
```html
    <!-- Blog index (built from posts.json) -->
    <div id="blog-index"></div>
    <div id="loading" class="loading-spinner" style="display:none;">Loading...</div>
    <div id="error" class="error-message" style="display:none;"></div>
```

Change the engine script tag:
```html
    <!-- markdown blog engine (must load after filter.js) -->
    <script src="./assets/js/markdown-blog.js"></script>
```
to:
```html
    <!-- blog index builder (must load after filter.js) -->
    <script src="./assets/js/blog-index.js"></script>
```

- [ ] **Step 3: Delete the old engine**

```bash
git rm blog/assets/js/markdown-blog.js
```

- [ ] **Step 4: Verify in a browser**

```bash
python -m http.server 8000
```
At `http://localhost:8000/blog/`: index renders grouped by year, category filters still work (filter.js), post links navigate to static pages, `#back-in-the-saddle` and `#post/2026/back-in-the-saddle` still redirect. Open devtools Network tab: no requests to `cdn.jsdelivr.net`. Then stop the server.

- [ ] **Step 5: Commit**

```bash
git add blog/index.html blog/assets/js/blog-index.js
git commit -m "refactor: replace client-side markdown engine with index builder"
```

---

### Task 6: Update new-post.js — fix the heading bug, wire in the build step

**Files:**
- Modify: `tools/new-post.js:95-119` (createMarkdownFile)
- Modify: `tools/new-post.js:206-213` (final output)

**Interfaces:**
- Consumes: nothing new.
- Produces: `createMarkdownFile(frontmatter, title, filepath)` — note the added `title` parameter and updated call site.

- [ ] **Step 1: Fix the `# undefined` heading bug**

`createMarkdownFile` receives `frontmatter` as a *string* but reads `frontmatter.title` (line 100), so every generated post starts with `# undefined`. Change the function to take the title explicitly:

```js
function createMarkdownFile(frontmatter, title, filepath) {
    const content = `---
${frontmatter}
---

# ${title}

Write your content here...
`;
```
(rest of the function body unchanged), and update the call site at line 169 from:
```js
    createMarkdownFile(frontmatter, filepath);
```
to:
```js
    createMarkdownFile(frontmatter, title, filepath);
```

- [ ] **Step 2: Update the final output to mention the build step and real URL**

Replace lines 206–211:
```js
    // Done!
    console.log('\n✓ Post created successfully!\n');
    console.log(`Your post is ready! Edit the file at:`);
    console.log(`  ${filepath}\n`);
    console.log(`After writing your content, the post will be available at:`);
    console.log(`  #post/${year}/${slug}\n`);
```
with:
```js
    // Done!
    console.log('\n✓ Post created successfully!\n');
    console.log(`Your post is ready! Edit the file at:`);
    console.log(`  ${filepath}\n`);
    console.log(`After writing your content, run:`);
    console.log(`  node tools/build-posts.js`);
    console.log(`to generate the static page. The post will be available at:`);
    console.log(`  blog/${year}/${slug}/\n`);
```

- [ ] **Step 3: Verify end to end**

Run `node tools/new-post.js`, enter title `Temp Test Post`, accept the default date, category `general`. Then:
```bash
head -8 "blog/posts/2026/Temp Test Post.md"
```
Expected: the heading line reads `# Temp Test Post` (not `# undefined`).

Then clean up the test artifacts:
```bash
rm "blog/posts/2026/Temp Test Post.md"
git checkout blog/posts.json
```

- [ ] **Step 4: Commit**

```bash
git add tools/new-post.js
git commit -m "fix: new-post heading interpolation; point authors at build step"
```

---

## Authoring workflow after this plan

1. `node tools/new-post.js` — creates the markdown file, updates `posts.json`
2. Write the post
3. `node tools/build-posts.js` — generates the static page + sitemap
4. `git add`, `git commit`, `git push` — done, no CI

## Explicitly out of scope

- Astro (or any SSG) migration — revisit if posting becomes regular; nothing here obstructs it, since the markdown files remain the source of truth.
- De-duplicating the shared header across the four hand-written pages.
- Pre-rendering the blog *index* itself (it stays client-built from `posts.json`; the index page has its own static meta tags, so nothing is lost for SEO).
