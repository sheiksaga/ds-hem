const { test, expect } = require('playwright/test');

const PAGES = [
  { path: '/',               name: 'homepage' },
  { path: '/blog/',          name: 'blog-listing' },
  { path: '/blog/posts/',    name: 'blog-posts-index' },
  { path: '/blog/2023/as-of-01-may/',     name: 'blog-2023-as-of-01-may' },
  { path: '/blog/2023/website-builds/',   name: 'blog-2023-website-builds' },
  { path: '/blog/2023/what-is-this/',     name: 'blog-2023-what-is-this' },
  { path: '/blog/2026/back-in-the-saddle/', name: 'blog-2026-back-in-the-saddle' },
  { path: '/projects/',      name: 'projects' },
  { path: '/projects/chatchat/', name: 'projects-chatchat' },
  { path: '/projects/mes/',  name: 'projects-mes' },
  { path: '/STRUCTURE/',     name: 'structure' },
];

for (const { path, name } of PAGES) {
  test(`screenshot: ${name}`, async ({ page }) => {
    await page.goto(path);
    await page.waitForLoadState('networkidle');

    // ── Per-page stabilisation ──────────────────────────────

    if (path === '/') {
      // Deterministic "like" fact — random text makes screenshots flaky
      await page.waitForSelector('#likeDisplay');
      await page.evaluate(() => {
        const el = document.getElementById('likeDisplay');
        if (el) el.textContent = 'a good book';
      });
    }

    if (path === '/projects/') {
      // Wait for the JSON-driven cards to render (or error state)
      await page.waitForSelector('.project-card, .empty-state', { timeout: 10000 });
    }

    // All accordions start closed — keep them closed for consistent baseline

    // ── Screenshot ──────────────────────────────────────────
    await expect(page).toHaveScreenshot(`${name}.png`, { fullPage: true });
  });
}
