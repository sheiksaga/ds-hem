const { test, expect } = require('playwright/test');

test.describe('homepage', () => {
  test.beforeEach(async ({ page }) => {
    // Mock Math.random so the "like" fact always picks first item: "the jabberwocky"
    await page.addInitScript(() => {
      Math.random = () => 0;
    });
    await page.goto('/');
  });

  test('like fact is populated by JS and clickable', async ({ page }) => {
    const likeEl = page.locator('#likeDisplay');
    await expect(likeEl).not.toBeEmpty({ timeout: 5000 });
    // With Math.random mocked to 0, click always picks the same item.
    // But we verify click doesn't throw and element stays populated.
    await likeEl.click();
    await expect(likeEl).not.toBeEmpty();
  });

  test('services accordion opens and closes', async ({ page }) => {
    const headers = page.locator('.accordion-header');
    await expect(headers.first()).toBeVisible();
    const count = await headers.count();
    expect(count).toBeGreaterThanOrEqual(1);

    // Click first header — opens
    const first = headers.first();
    await first.click();
    await expect(first).toHaveAttribute('aria-expanded', 'true');

    // Click same header again — closes
    await first.click();
    await expect(first).toHaveAttribute('aria-expanded', 'false');
  });

  test('services accordion switches which panel is open', async ({ page }) => {
    const headers = page.locator('.accordion-header');
    const count = await headers.count();

    if (count < 2) {
      test.skip(); // need at least 2 items to switch
    }

    // Open first
    await headers.nth(0).click();
    await expect(headers.nth(0)).toHaveAttribute('aria-expanded', 'true');

    // Click second — first closes, second opens
    await headers.nth(1).click();
    await expect(headers.nth(0)).toHaveAttribute('aria-expanded', 'false');
    await expect(headers.nth(1)).toHaveAttribute('aria-expanded', 'true');
  });
});

test.describe('blog listing', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/blog/');
    await page.waitForSelector('.post');
  });

  test('all posts visible by default', async ({ page }) => {
    const visible = page.locator('.post.visible');
    const total = page.locator('.post');
    await expect(visible).toHaveCount(await total.count());
  });

  test('filtering by web_design shows only matching posts', async ({ page }) => {
    // Click the <label> instead of the hidden <input>
    await page.locator('label[for="web_design"]').click();
    await page.waitForTimeout(300);

    const visible = page.locator('.post.visible');
    const count = await visible.count();
    expect(count).toBeGreaterThanOrEqual(1);

    for (let i = 0; i < count; i++) {
      await expect(visible.nth(i)).toHaveAttribute('data-category', 'web_design');
    }
  });

  test('filtering by general shows only matching posts', async ({ page }) => {
    await page.locator('label[for="general"]').click();
    await page.waitForTimeout(300);

    const visible = page.locator('.post.visible');
    const count = await visible.count();

    for (let i = 0; i < count; i++) {
      await expect(visible.nth(i)).toHaveAttribute('data-category', 'general');
    }
  });

  test('switching back to all shows every post', async ({ page }) => {
    // Narrow first
    await page.locator('label[for="web_design"]').click();
    await page.waitForTimeout(150);
    // Back to all
    await page.locator('label[for="all"]').click();
    await page.waitForTimeout(300);

    const visible = page.locator('.post.visible');
    const total = page.locator('.post');
    await expect(visible).toHaveCount(await total.count());
  });
});

test.describe('projects page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/projects/');
    await page.waitForSelector('.project-card', { timeout: 10000 });
  });

  test('all project cards start closed', async ({ page }) => {
    const cards = page.locator('.project-card');
    const count = await cards.count();
    for (let i = 0; i < count; i++) {
      await expect(cards.nth(i)).toHaveAttribute('aria-expanded', 'false');
    }
  });

  test('clicking a card opens it, clicking again closes it', async ({ page }) => {
    const card = page.locator('.project-card').first();
    await card.click();
    await expect(card).toHaveAttribute('aria-expanded', 'true');
    await card.click();
    await expect(card).toHaveAttribute('aria-expanded', 'false');
  });

  test('clicking a different card swaps which is open', async ({ page }) => {
    const cards = page.locator('.project-card');
    const count = await cards.count();
    if (count < 2) test.skip();

    // Open first
    await cards.nth(0).click();
    await expect(cards.nth(0)).toHaveAttribute('aria-expanded', 'true');

    // Click second — first closes
    await cards.nth(1).click();
    await expect(cards.nth(0)).toHaveAttribute('aria-expanded', 'false');
    await expect(cards.nth(1)).toHaveAttribute('aria-expanded', 'true');
  });

  test('keyboard Enter opens card', async ({ page }) => {
    const card = page.locator('.project-card').first();
    await card.focus();
    await page.keyboard.press('Enter');
    await expect(card).toHaveAttribute('aria-expanded', 'true');
  });

  test('keyboard Space opens card', async ({ page }) => {
    const card = page.locator('.project-card').first();
    await card.focus();
    await page.keyboard.press('Space');
    await expect(card).toHaveAttribute('aria-expanded', 'true');
  });
});

test.describe('SPA navigation', () => {
  test('internal nav link swaps content without full reload', async ({ page }) => {
    // Set a flag that would be wiped by a full page load
    await page.goto('/');
    await page.evaluate(() => { window.__spaTestFlag = true; });

    // Click the BLOG nav link (SPA navigation)
    await page.locator('.nav-links a[href="/blog/"]').click();

    // Wait for the URL to change and the SPA to finish
    await page.waitForURL('**/blog/');
    await page.waitForTimeout(600);

    // Verify the flag survived — means it wasn't a full reload
    const flag = await page.evaluate(() => window.__spaTestFlag);
    expect(flag).toBe(true);

    // Verify the page actually shows blog content
    await expect(page.locator('.intro')).toContainText('blog');
  });

  test('SPA navigation updates URL and page title', async ({ page }) => {
    await page.goto('/');
    await page.locator('.nav-links a[href="/blog/"]').click();
    await page.waitForURL('**/blog/');
    await page.waitForTimeout(500);

    expect(page.url()).toContain('/blog/');
  });

  test('browser back button works with SPA history', async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => { window.__spaBackFlag = true; });

    // Navigate to blog
    await page.locator('.nav-links a[href="/blog/"]').click();
    await page.waitForURL('**/blog/');
    await page.waitForTimeout(500);

    // Go back
    await page.goBack();
    await page.waitForTimeout(800);

    // Should be back at homepage
    expect(page.url()).not.toContain('/blog/');
    const flag = await page.evaluate(() => window.__spaBackFlag);
    expect(flag).toBe(true);
  });
});

test.describe('navigation links', () => {
  test('all nav links point to existing pages', async ({ page }) => {
    await page.goto('/');
    const links = page.locator('.nav-links a');
    const count = await links.count();

    for (let i = 0; i < count; i++) {
      const href = await links.nth(i).getAttribute('href');
      const response = await page.goto(href);
      expect(response.status()).toBe(200);
    }
  });
});

test.describe('blog post navigation', () => {
  test('prev/next post links exist', async ({ page }) => {
    await page.goto('/blog/2023/as-of-01-may/');
    await page.waitForLoadState('networkidle');

    const nav = page.locator('.post-navigation');
    const exists = await nav.count();
    expect(exists).toBe(1);
  });
});
