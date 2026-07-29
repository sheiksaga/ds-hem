/**
 * Build site and start a static file server for Playwright tests.
 * Usage: node tools/serve-for-tests.js
 *
 * Designed to be run from project root: `node tools/serve-for-tests.js`
 */
const { execSync } = require('child_process');
const path = require('path');
const http = require('http');
const fs = require('fs');

const root = path.resolve(__dirname, '..');
const siteDir = path.join(root, '_site');

// Build
console.log('Building site...');
execSync('npx @11ty/eleventy', { cwd: root, stdio: 'inherit' });

// MIME types
const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.ico': 'image/x-icon',
  '.json': 'application/json',
  '.xml': 'text/xml',
  '.txt': 'text/plain; charset=utf-8',
  '.woff2': 'font/woff2',
};

const server = http.createServer((req, res) => {
  let urlPath = req.url.split('?')[0];
  if (urlPath.endsWith('/')) urlPath += 'index.html';
  const filePath = path.join(siteDir, urlPath);
  try {
    const data = fs.readFileSync(filePath);
    const ext = path.extname(filePath);
    res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream' });
    res.end(data);
  } catch {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found');
  }
});

server.listen(8090, () => {
  console.log('Test server ready on http://localhost:8090');
});
