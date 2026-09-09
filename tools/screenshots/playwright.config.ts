import { defineConfig, devices } from '@playwright/test';

// Screenshot rig for the docs. Runs against a live aether-ops instance named by
// BASE_URL and writes PNGs into src/assets/screenshots. Serial by design: the
// specs mutate shared daemon state (wizard, nodes, deployments).
export default defineConfig({
  testDir: '.',
  testMatch: /.*\.spec\.ts/,
  fullyParallel: false,
  workers: 1,
  retries: 0,
  timeout: 10 * 60_000,
  outputDir: '.artifacts',
  reporter: [['list']],
  use: {
    baseURL: process.env.BASE_URL ?? 'http://localhost:8186',
    extraHTTPHeaders: process.env.API_TOKEN
      ? { Authorization: `Bearer ${process.env.API_TOKEN}` }
      : {},
    headless: true,
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 2,
    colorScheme: 'light',
    locale: 'en-US',
    timezoneId: 'UTC',
    // Transitions disabled so every frame is deterministic.
    contextOptions: { reducedMotion: 'reduce' },
    trace: 'retain-on-failure',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
});
