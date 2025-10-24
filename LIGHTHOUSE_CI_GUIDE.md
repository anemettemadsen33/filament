# Lighthouse CI Workflow Guide

## 🎯 Overview

This repository includes a complete Lighthouse CI setup for automated performance auditing of the React 19 + TypeScript + Vite frontend.

## 🔧 How It Works

### Automated Triggers
The workflow runs automatically on:
- **Push to main branch** - Monitors production performance
- **Pull requests** - Validates performance before merging

### What It Does
1. ✅ Checks out repository code
2. ✅ Sets up Node.js 18 environment with npm caching
3. ✅ Installs project dependencies
4. ✅ Builds the production application
5. ✅ Starts a preview server
6. ✅ Runs Lighthouse CI with `lhci autorun`
7. ✅ Generates reports in `.lighthouseci` folder
8. ✅ Uploads reports as GitHub Actions artifacts (30-day retention)

## 📁 Files Involved

### 1. `.github/workflows/lighthouse.yml`
The GitHub Actions workflow file that orchestrates the entire process.

### 2. `Renthub/.lighthouserc.js`
Configuration file for Lighthouse CI that defines:
- URLs to audit
- Number of runs per URL
- Chrome settings
- Performance budgets and assertions
- Report output settings

### 3. `lighthouse-budget.json`
Performance budget definitions for resource sizes, counts, and timing metrics.

## 🚀 Running Locally

You can run Lighthouse CI locally before pushing:

```bash
# Navigate to the Renthub directory
cd Renthub

# Install dependencies (if not already done)
npm ci

# Build the application
npm run build

# Start the preview server in one terminal
npm run preview

# In another terminal, run Lighthouse CI
npm run lighthouse
```

The reports will be generated in `Renthub/.lighthouseci/`.

## 📊 Viewing Results

### In GitHub Actions
1. Go to the "Actions" tab in your repository
2. Click on a workflow run
3. Scroll to "Artifacts" section
4. Download `lighthouse-reports` artifact
5. Extract and open HTML reports in your browser

### Locally
After running `npm run lighthouse`, open:
```
Renthub/.lighthouseci/*.html
```

## 🎯 Performance Targets

The workflow enforces these targets:
- **Performance Score**: ≥ 90 (error if below)
- **Accessibility Score**: ≥ 90 (warning if below)
- **Best Practices Score**: ≥ 90 (warning if below)
- **SEO Score**: ≥ 90 (warning if below)

### Core Web Vitals
- **First Contentful Paint (FCP)**: ≤ 1.8s
- **Largest Contentful Paint (LCP)**: ≤ 2.5s
- **Total Blocking Time (TBT)**: ≤ 200ms
- **Cumulative Layout Shift (CLS)**: ≤ 0.1

## 🔧 Customization

### Adding More URLs
Edit `Renthub/.lighthouserc.js`:

```javascript
collect: {
  url: [
    'http://localhost:4173',
    'http://localhost:4173/search',
    'http://localhost:4173/properties',
    'http://localhost:4173/your-new-page',  // Add here
  ],
}
```

### Adjusting Performance Budgets
Edit `lighthouse-budget.json` or modify assertions in `.lighthouserc.js`:

```javascript
assert: {
  assertions: {
    'categories:performance': ['error', { minScore: 0.85 }],  // Lower threshold
  },
}
```

### Changing Artifact Retention
Edit `.github/workflows/lighthouse.yml`:

```yaml
- name: Upload Lighthouse reports
  uses: actions/upload-artifact@v4
  with:
    retention-days: 90  # Change from 30 to 90 days
```

## 🐛 Troubleshooting

### Workflow fails with "Server not ready"
- Check if the preview server starts correctly
- Increase timeout in workflow: `npx wait-on http://localhost:4173 --timeout 120000`

### No reports generated
- Verify `.lighthouserc.js` configuration
- Check workflow logs for errors during `lhci autorun`
- Ensure URLs are accessible from the CI environment

### Artifact upload fails
The workflow is configured with `if-no-files-found: warn` to prevent failures if the folder is empty. Check workflow logs to diagnose why reports weren't generated.

## 📚 Resources

- [Lighthouse CI Documentation](https://github.com/GoogleChrome/lighthouse-ci)
- [Lighthouse Scoring Guide](https://web.dev/performance-scoring/)
- [GitHub Actions Artifacts](https://docs.github.com/en/actions/using-workflows/storing-workflow-data-as-artifacts)

## ✨ Benefits

✅ **Automated** - No manual intervention required
✅ **Consistent** - Same auditing process every time
✅ **Historical** - 30-day artifact retention for trend analysis
✅ **Preventive** - Catches performance regressions before merge
✅ **Actionable** - Detailed reports with specific recommendations
