# ds-hem — Design Saga

Personal site by Sangeeth Gandhi. Built with [Eleventy](https://www.11ty.dev/) (static site generator), Nunjucks templates, and vanilla CSS/JS.

## Quick start

```bash
npm install
npm start        # dev server with hot reload at http://localhost:8080
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
  js/               # All scripts
    main.js         #   Shared: accordion, SPA transitions, like-facts
    filter.js       #   Blog category filter
    projects.js     #   Project cards renderer
  img/              # All images
    blog/           #   Blog-specific images (2023/)
index.njk           # Homepage
blog/               # Blog posts & listing
projects/           # Projects page (JSON-driven)
tools/              # Utility scripts
```

## Conventions

- **CSS**: One file per page/feature. `main.css` loads globally; all others load per-page via `{% block css %}`.
- **JS**: Vanilla IIFE modules. `main.js` loads globally; page scripts load per-page via `{% block js %}`.
- **Templates**: Nunjucks (`.njk`). Extend `base.njk`, fill `content` block. Use `_includes/` partials for reusable components.
- **Blog posts**: Markdown files in `blog/posts/`. Frontmatter fields: `title`, `date`, `description`, `category` (`web_design` or `general`), `nav: blog`.
- **Projects**: Data in `projects/projects.json`. Each entry: `title`, `tagline`, `description`, `url`, `year`, `tags[]`, `status` (`live`|`wip`).

## Eleventy config

- Input: `.` (project root)
- Output: `_site/`
- Passthrough copy: `src/` assets, `robots.txt`, `sitemap.xml`, `.nojekyll`
- Markdown: Nunjucks engine, with footnote & heading-anchor plugins
