const { defineConfig } = require('playwright/test');

module.exports = defineConfig({
  testDir: '.',

  timeout: 30000,

  expect: {
    toHaveScreenshot: {
      maxDiffPixelRatio: 0.02,
      maxDiffPixels: 100,
      threshold: 0.2,
    },
  },

  use: {
    baseURL: 'http://localhost:8090',
    viewport: { width: 1280, height: 800 },
    ignoreHTTPSErrors: true,
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
  },

  webServer: {
    command: 'node ../tools/serve-for-tests.js',
    port: 8090,
    reuseExistingServer: false,
    timeout: 60000,
  },

  projects: [
    {
      name: 'desktop',
      use: { viewport: { width: 1280, height: 800 } },
    },
    {
      name: 'mobile',
      use: { viewport: { width: 375, height: 667 } },
    },
  ],
});
