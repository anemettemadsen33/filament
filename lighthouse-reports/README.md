# 📊 Lighthouse Reports Directory

This directory contains performance audit reports from Google Lighthouse CI.

---

## 📁 Directory Structure

```
lighthouse-reports/
├── baseline/          # Initial audit before optimizations
│   ├── report.html   # Visual HTML report
│   ├── report.json   # Raw JSON data
│   └── score.txt     # Quick score reference
├── phase1/           # After Week 1 (Quick Wins)
├── phase2/           # After Week 2 (Core Optimizations)
└── final/            # After full implementation
```

---

## 🎯 Purpose

Track performance improvements over time:
- Baseline: Current state (Performance Score: 82)
- Phase 1: After quick wins (Target: 87)
- Phase 2: After core optimizations (Target: 92)
- Final: After full implementation (Target: 95+)

---

## 🚀 How to Generate Reports

### Manual Audit

```bash
# Install Lighthouse CI
npm install -g @lighthouse-ci/cli

# Build and preview
cd Renthub
npm run build
npm run preview

# Run audit
lhci autorun \
  --collect.url=http://localhost:4173 \
  --upload.target=filesystem \
  --upload.outputDir=./lighthouse-reports/baseline
```

### Automated (GitHub Actions)

Reports are automatically generated on:
- Every PR to main
- Daily at 2 AM UTC
- Manual workflow trigger

Access reports in GitHub Actions artifacts.

---

## 📈 Viewing Reports

### HTML Report
```bash
# Open in browser
open lighthouse-reports/baseline/report.html  # Mac
xdg-open lighthouse-reports/baseline/report.html  # Linux
```

### JSON Data
```bash
# View raw data
cat lighthouse-reports/baseline/report.json | jq '.categories.performance.score'
```

### Quick Score
```bash
# Check score
cat lighthouse-reports/baseline/score.txt
```

---

## 🔍 Comparing Reports

```bash
# Compare baseline vs final
diff lighthouse-reports/baseline/score.txt lighthouse-reports/final/score.txt

# Or use Lighthouse CI compare
lhci compare --base=baseline --head=final
```

---

## 📊 Report Metrics

Each report includes:
- **Performance Score** (0-100)
- **First Contentful Paint (FCP)**
- **Largest Contentful Paint (LCP)**
- **Total Blocking Time (TBT)**
- **Cumulative Layout Shift (CLS)**
- **Speed Index**
- **Time to Interactive (TTI)**

Plus detailed opportunities and diagnostics.

---

## 🎯 Performance Targets

| Phase | Score Target | FCP | LCP | TBT |
|-------|-------------|-----|-----|-----|
| Baseline | 82 | 2.1s | 3.8s | 850ms |
| Phase 1 | 87 | 1.7s | 3.0s | 550ms |
| Phase 2 | 92 | 1.4s | 2.4s | 300ms |
| Final | 95+ | 1.2s | 2.0s | 150ms |

---

## 🔒 Git Ignore

**Note**: Only the baseline report structure is committed to Git.  
Actual HTML/JSON reports are `.gitignore`d to keep the repo clean.

To preserve your reports:
1. Download from GitHub Actions artifacts
2. Or save locally outside the repo

---

## 📚 Related Documentation

- [LIGHTHOUSE_README.md](../LIGHTHOUSE_README.md) - Main navigation hub
- [Lighthouse-Analysis.md](../Lighthouse-Analysis.md) - Technical analysis
- [LIGHTHOUSE_QUICK_START.md](../LIGHTHOUSE_QUICK_START.md) - Implementation guide
- [.github/workflows/lighthouse.yml](../.github/workflows/lighthouse.yml) - CI/CD automation

---

**Last Updated**: October 24, 2025  
**Status**: Infrastructure ready for audits
