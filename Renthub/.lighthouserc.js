module.exports = {
  ci: {
    collect: {
      // URLs to audit - runs Lighthouse on these pages
      url: [
        'http://localhost:4173',
        'http://localhost:4173/search',
        'http://localhost:4173/properties',
      ],
      // Number of times to run Lighthouse on each URL for more stable results
      numberOfRuns: 3,
      // Settings for Chrome when running Lighthouse
      settings: {
        // Run in headless mode (no UI)
        chromeFlags: '--no-sandbox --disable-dev-shm-usage',
      },
    },
    upload: {
      // Store reports in .lighthouseci folder
      target: 'filesystem',
      outputDir: './.lighthouseci',
      // Generate HTML reports for easier viewing
      reportFilenamePattern: '%%PATHNAME%%-%%DATETIME%%-report.%%EXTENSION%%',
    },
    assert: {
      // Performance budgets and assertions
      preset: 'lighthouse:recommended',
      assertions: {
        // Core Web Vitals thresholds
        'categories:performance': ['error', { minScore: 0.9 }],
        'categories:accessibility': ['warn', { minScore: 0.9 }],
        'categories:best-practices': ['warn', { minScore: 0.9 }],
        'categories:seo': ['warn', { minScore: 0.9 }],
        
        // Specific metrics
        'first-contentful-paint': ['warn', { maxNumericValue: 1800 }],
        'largest-contentful-paint': ['warn', { maxNumericValue: 2500 }],
        'total-blocking-time': ['warn', { maxNumericValue: 200 }],
        'cumulative-layout-shift': ['warn', { maxNumericValue: 0.1 }],
      },
    },
  },
};
