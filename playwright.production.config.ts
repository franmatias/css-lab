import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './tests/production',
  reporter: 'list',
  use: { baseURL: 'http://127.0.0.1:4174', ...devices['Desktop Chrome'] },
  webServer: {
    command: 'node node_modules/vite/bin/vite.js preview --host 127.0.0.1 --port 4174 --strictPort',
    url: 'http://127.0.0.1:4174/css-lab/',
    reuseExistingServer: !process.env.CI,
  },
})
