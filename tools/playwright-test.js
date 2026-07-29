/**
 * Cross-platform wrapper to run Playwright tests with NODE_PATH set
 * to the global npm modules directory (where playwright lives).
 */
const { execSync, spawnSync } = require('child_process');

const globalNodeModules = execSync('npm root -g', { encoding: 'utf8' }).trim();
process.env.NODE_PATH = globalNodeModules;

// Merge command-line args
const args = process.argv.slice(2);
const result = spawnSync('npx', ['playwright', 'test', ...args], {
  stdio: 'inherit',
  shell: true,
  env: process.env,
});

if (result.error) {
  console.error('Failed to run Playwright test:', result.error.message);
}
process.exit(result.status ?? 1);
