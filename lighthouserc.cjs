/* global module */
module.exports = {
  ci: {
    collect: {
      startServerCommand:
        'node node_modules/vite/bin/vite.js preview --host 127.0.0.1 --port 4176 --strictPort',
      startServerReadyPattern: '4176',
      url: ['http://127.0.0.1:4176/css-lab/'],
      numberOfRuns: 3,
      settings: { chromeFlags: '--headless --no-sandbox' },
    },
    assert: {
      assertions: {
        'categories:performance': ['error', { minScore: 0.9, aggregationMethod: 'median' }],
        'categories:accessibility': ['error', { minScore: 0.95, aggregationMethod: 'median' }],
        'largest-contentful-paint': [
          'error',
          { maxNumericValue: 2500, aggregationMethod: 'median' },
        ],
      },
    },
    upload: { target: 'filesystem', outputDir: '.lighthouseci/reports' },
  },
}
