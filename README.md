# ds-hem — Design Saga

Personal site by Sangeeth Gandhi. Built with [Eleventy](https://www.11ty.dev/) (static site generator), Nunjucks templates, and vanilla CSS/JS.

## Quick start

```bash
npm install
npm start        # dev server with hot reload at http://localhost:8081
npm run build    # production build → _site/
```

## Project structure

```
_includes/          # Nunjucks layouts & partials
  base.njk          #   Root layout (HTML shell, header, footer)
  blog-post.njk     #   Blog post layout
  hero.njk          #   Homepage hero section
  ...
src/
  css/              # All stylesheets (one per concern)
    main.css        #   CSS variables, reset, typography, header/footer, transitions
    ds.css          #   Homepage: hero, accordion, boxes
    blog.css        #   Blog posts & listing: footnotes, nav, code blocks
    filter.css      #   Blog category filter (radio-based)
    projects.css    #   Project cards accordion
    theme.css       #   Dark-mode toggle: peeking sphere, cursor ring, bleed
  js/               # All scripts
    main.js         #   Shared: accordion, SPA transitions, like-facts
    filter.js       #   Blog category filter
    projects.js     #   Project cards renderer
    theme.js        #   Dark-mode toggle: persistence + reveal
  img/              # All images
    blog/           #   Blog-specific images (2023/)
index.njk           # Homepage
blog/               # Blog posts & listing
projects/           # Projects page (JSON-driven)
tools/              # Utility scripts
_data/site.json     # Site-wide data (canonical URL)
sitemap.xml.njk     # Generated sitemap
robots.txt.njk      # Generated robots.txt
```

## Conventions

- **CSS**: One file per page/feature. `main.css` loads globally; all others load per-page via `{% block css %}`.
- **JS**: Vanilla IIFE modules. `main.js` loads globally; page scripts load per-page via `{% block js %}`.
- **Templates**: Nunjucks (`.njk`). Extend `base.njk`, fill `content` block. Use `_includes/` partials for reusable components.
- **Blog posts**: Markdown files in `blog/posts/`. Frontmatter fields: `title`, `date`, `description`, `category` (`web_design` or `general`), `nav: blog`.
- **Projects**: Data in `projects/projects.json`. Each entry: `title`, `tagline`, `description`, `url`, `year`, `tags[]`, `status` (`live`|`wip`).

## Theming (dark mode)

- **Tokens**: `main.css` defines semantic colour tokens (`--paper`, `--ink`, `--surface`, `--rule`, `--accent`, …) for light mode and overrides them under `html[data-theme="dark"]`. Component CSS references tokens, never raw colours.
- **Default**: light. A pre-paint inline script in `base.njk` reads `localStorage['ds-theme']`, falls back to `prefers-color-scheme`, and sets `data-theme` on `<html>` before first paint (no flash). An explicit toggle is remembered and wins.
- **Toggle**: a peeking sphere pinned to the top-right (`theme.css` + `theme.js`). Hover slides it out and shows a custom cursor ring; click runs a circular "bleed" via the View Transitions API (instant fallback; disabled under `prefers-reduced-motion`). Touch devices show the sphere fully and "pop" it on tap.

## Eleventy config

- Input: `.` (project root)
- Output: `_site/`
- Passthrough copy: `src/` assets, `.nojekyll`
- Generated: `sitemap.xml` (all HTML pages; `lastmod` for dated posts) and `robots.txt`, via `sitemap.xml.njk` / `robots.txt.njk`
- Canonical URL: `_data/site.json` (`site.url`) is the single source of truth for sitemap, robots, and `og:url`
- Markdown: Nunjucks engine, with footnote & heading-anchor plugins
