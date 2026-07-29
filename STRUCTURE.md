# Project Structure — ds-hem

Eleventy static site with Nunjucks templates. No bundler — raw CSS/JS served from `src/`.

## Render tree

```
index.njk                          Homepage
  └─ _includes/base.njk            Shell (head, header, footer, nav)
       ├─ _includes/hero.njk               Hero intro
       ├─ _includes/projects-highlight.njk Projects teaser box
       ├─ _includes/services-accordion.njk "What I do" accordion
       └─ _includes/places.njk             Contact / social links

blog/index.njk                     Blog listing
  └─ _includes/base.njk

blog/posts/**/*.md + blog-post.njk Blog post (auto-collected)
  └─ _includes/base.njk
       └─ _includes/blog-post.njk          Post layout (prev/next nav)

projects/index.njk                 Projects listing
  └─ _includes/base.njk
  (cards rendered client-side from projects/projects.json.njk)

projects/chatchat/index.njk        ChatChat detail page
  └─ _includes/base.njk
projects/mes/index.njk             MES detail page
  └─ _includes/base.njk
```

## CSS responsibility

| File | Scope | Key selectors |
|------|-------|---------------|
| `src/css/main.css` | Site-wide: layout, header, footer, nav, typography, CSS vars, SPA transitions | `.ds-header`, `.footer`, `:root`, `#page-content` |
| `src/css/ds.css` | Homepage: hero, accordion, section boxes, list styling | `.hero`, `.accordion-*`, `.box`, `.hi` |
| `src/css/blog.css` | Blog listing + post pages: markdown content, code blocks, footnotes, prev/next nav, scroll progress | `.blog-post-article`, `#post-article`, `.post-navigation` |
| `src/css/projects.css` | Projects listing: accordion cards, skeleton loader | `.projects-deck`, `.project-card`, `.card-*` |
| `src/css/filter.css` | Blog category filter (radio-button tabs) | `.filters`, `input[type="radio"]`, `.post` |

## JS responsibility

| File | Scope | Key functions |
|------|-------|---------------|
| `src/js/main.js` | Site-wide: accordion toggle, theme toggle, page transitions (SPA nav), email obfuscation, "like" randomizer | accordion, theme, SPA navigation |
| `src/js/filter.js` | Blog listing: category filter radio buttons + URL hash sync | filter posts by category |
| `src/js/projects.js` | Projects listing: fetch JSON, render accordion cards client-side | fetch + render project cards |

## Key files

| File | Purpose |
|------|---------|
| `.eleventy.js` | Eleventy config: Markdown-it, collections, filters, passthrough copy |
| `package.json` | Dependencies: @11ty/eleventy, markdown-it, gsap |
| `_includes/base.njk` | Master layout shell (head, header, nav, footer) |
| `_includes/blog-post.njk` | Blog post wrapper with prev/next navigation |
| `blog/template.md` | Template for new blog posts |
| `projects/projects.json.njk` | Project data (JSON endpoint consumed by projects.js) |
| `tools/new-post.js` | CLI script to scaffold new blog posts |

## Naming conventions

- Class prefix `ds-` → Design Saga brand (e.g. `.ds-header`)
- Class prefix `blog-` → blog-specific
- Class prefix `card-` → project cards
- ID `#post-article` → markdown-rendered article content
- ID `#main-content` → skip-link target on every page

## Adding a blog post

1. Create `blog/posts/<year>/<Title>.md` with frontmatter:
   ```yaml
   ---
   title: "Post Title"
   date: YYYY-MM-DD
   category: web_design | general
   layout: blog-post.njk
   ---
   ```
2. Run `node tools/new-post.js` to scaffold, or create manually.

## Adding a project

1. Add entry to `projects/projects.json.njk`
2. Optionally create `projects/<slug>/index.njk` for a detail page
