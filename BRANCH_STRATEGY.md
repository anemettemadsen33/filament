# 🌿 Branch Strategy & Protection

**Project**: RentHub - Rental Platform  
**Last Updated**: October 24, 2025

---

## 🎯 Branch Structure

### Main Branches

| Branch | Purpose | Protection | Deploy Target |
|--------|---------|------------|---------------|
| `main` | Production-ready code | ✅ Protected | Production (manual) |
| `develop` | Integration branch | ✅ Protected | Staging (automatic) |

### Feature Branches

| Type | Pattern | Example | Purpose |
|------|---------|---------|---------|
| Feature | `feat/<area>/<short-description>` | `feat/auth/social-login` | New features |
| Bug Fix | `fix/<area>/<issue>` | `fix/api/null-pointer` | Bug fixes |
| Chore | `chore/<task>` | `chore/update-deps` | Maintenance tasks |
| Hotfix | `hotfix/<critical-issue>` | `hotfix/security-patch` | Critical production fixes |
| Docs | `docs/<topic>` | `docs/api-guide` | Documentation only |
| Refactor | `refactor/<area>` | `refactor/auth-service` | Code refactoring |

---

## 🔒 Branch Protection Rules

### Main Branch (`main`)

**Required Settings:**
- ✅ **Require pull request reviews**: 1 approval minimum
- ✅ **Require status checks to pass**: All CI checks must be green
  - Backend CI
  - Frontend CI
  - Security Scan
  - CodeQL
  - Lighthouse CI (performance)
- ✅ **Require branches to be up to date**: Enforce before merging
- ✅ **Include administrators**: No bypass for admins
- ✅ **Restrict force pushes**: Disabled
- ✅ **Restrict deletions**: Disabled
- ✅ **Require linear history**: Enforce rebase or squash merges

**Required Checks:**
```yaml
- backend-ci
- frontend-ci
- security-scan
- codeql
- lighthouse-ci
```

### Develop Branch (`develop`)

**Required Settings:**
- ✅ **Require pull request reviews**: 1 approval minimum (can be same team)
- ✅ **Require status checks to pass**: Core CI checks
  - Backend CI
  - Frontend CI
  - Security Scan
- ✅ **Require branches to be up to date**: Recommended but flexible
- ✅ **Restrict force pushes**: Disabled
- ✅ **Restrict deletions**: Disabled

**Required Checks:**
```yaml
- backend-ci
- frontend-ci
- security-scan
```

### Feature Branches

**Settings:**
- ⚪ No protection required
- ⚪ Developers can push directly
- ⚪ Should be short-lived (< 1 week)
- ⚪ Deleted after merge

---

## 📝 Pull Request Guidelines

### PR Title Format

Use conventional commits style:

```
[TYPE] Short description - Related: #ISSUE_NUMBER

Examples:
[FEAT] Add social login - Related: #123
[FIX] Resolve null pointer in auth - Related: #456
[CHORE] Update dependencies - Related: #789
[DOCS] Add API documentation - Related: #101
[REFACTOR] Improve auth service structure - Related: #112
```

**Types:**
- `[FEAT]` - New feature
- `[FIX]` - Bug fix
- `[CHORE]` - Maintenance/tooling
- `[DOCS]` - Documentation
- `[REFACTOR]` - Code refactoring (no feature change)
- `[PERF]` - Performance improvement
- `[TEST]` - Adding/updating tests
- `[HOTFIX]` - Critical production fix

### PR Description Template

```markdown
## Description
Brief description of what this PR does.

## Type of Change
- [ ] Bug fix (non-breaking change which fixes an issue)
- [ ] New feature (non-breaking change which adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] Documentation update
- [ ] Chore/refactor

## Related Issues
Closes #123
Fixes #456

## Changes Made
- Change 1
- Change 2
- Change 3

## Testing Done
- [ ] Unit tests added/updated
- [ ] Integration tests added/updated
- [ ] Manual testing completed
- [ ] All tests passing locally

## Screenshots (if applicable)
Add screenshots for UI changes

## Checklist
- [ ] My code follows the code style of this project
- [ ] I have performed a self-review of my own code
- [ ] I have commented my code, particularly in hard-to-understand areas
- [ ] I have made corresponding changes to the documentation
- [ ] My changes generate no new warnings
- [ ] I have added tests that prove my fix is effective or that my feature works
- [ ] New and existing unit tests pass locally with my changes
- [ ] Any dependent changes have been merged and published

## Security Considerations
- [ ] No secrets committed
- [ ] Input validation added where needed
- [ ] SQL injection prevention verified
- [ ] XSS prevention verified
- [ ] CSRF protection verified
```

---

## 🔄 Workflow

### Creating a Feature

```bash
# 1. Start from latest develop
git checkout develop
git pull origin develop

# 2. Create feature branch
git checkout -b feat/auth/social-login

# 3. Make changes and commit
git add .
git commit -m "feat: implement Google OAuth integration"

# 4. Push to remote
git push origin feat/auth/social-login

# 5. Create Pull Request
# Use GitHub UI or:
gh pr create --base develop --title "[FEAT] Add social login - Related: #123"
```

### Code Review Process

1. **Developer**: Create PR with proper title and description
2. **CI**: Automated checks run (lint, test, build, security)
3. **Reviewer**: Review code, request changes if needed
4. **Developer**: Address feedback, push updates
5. **Reviewer**: Approve PR
6. **Developer/Maintainer**: Merge to develop

### Merge Strategies

**For Feature → Develop:**
- ✅ **Squash and Merge** (recommended)
  - Clean history
  - Single commit per feature
  
**For Develop → Main:**
- ✅ **Merge Commit** (recommended)
  - Preserve feature history
  - Clear release points

**For Hotfix → Main:**
- ✅ **Squash and Merge**
  - Quick fix, minimal history

### Release Process

```bash
# 1. Ensure develop is ready
git checkout develop
git pull origin develop

# 2. Create release branch
git checkout -b release/v1.2.3

# 3. Update version numbers
# Update package.json, composer.json, etc.

# 4. Create PR to main
gh pr create --base main --title "[RELEASE] Version 1.2.3"

# 5. After merge, tag release
git checkout main
git pull origin main
git tag -a v1.2.3 -m "Release version 1.2.3"
git push origin v1.2.3

# 6. Merge back to develop
git checkout develop
git merge main
git push origin develop
```

---

## 🚨 Hotfix Process

For critical production issues:

```bash
# 1. Create hotfix branch from main
git checkout main
git pull origin main
git checkout -b hotfix/critical-security-patch

# 2. Make minimal fix
# Fix ONLY the critical issue

# 3. Commit and push
git commit -m "hotfix: patch critical security vulnerability"
git push origin hotfix/critical-security-patch

# 4. Create PR to main (expedited review)
gh pr create --base main --title "[HOTFIX] Critical security patch - URGENT"

# 5. After merge and deployment, merge to develop
git checkout develop
git merge main
git push origin develop
```

---

## 🔍 Code Review Checklist

### For Reviewers

**Code Quality:**
- [ ] Code is readable and well-commented
- [ ] No obvious bugs or logic errors
- [ ] Follows project coding standards
- [ ] DRY principle applied (no unnecessary duplication)
- [ ] SOLID principles followed

**Security:**
- [ ] No hardcoded secrets or credentials
- [ ] Input validation present
- [ ] SQL injection prevention (use ORM/parameterized queries)
- [ ] XSS prevention (sanitize output)
- [ ] CSRF protection (for state-changing operations)
- [ ] Authentication/authorization checks

**Testing:**
- [ ] Unit tests cover new code
- [ ] Integration tests for new features
- [ ] Edge cases handled
- [ ] Test coverage meets minimum (60%+)

**Performance:**
- [ ] No obvious performance bottlenecks
- [ ] Database queries optimized (N+1 prevention)
- [ ] Caching used where appropriate
- [ ] Large files/assets optimized

**Documentation:**
- [ ] README updated if needed
- [ ] API documentation updated
- [ ] Inline comments for complex logic
- [ ] CHANGELOG updated

---

## 📊 Automation

### GitHub Actions

All PRs automatically trigger:
1. **Lint checks**: ESLint, Prettier, PHP CS Fixer
2. **Type checks**: TypeScript, PHPStan
3. **Unit tests**: Vitest, PHPUnit
4. **Integration tests**: Full test suite
5. **Build tests**: Ensure app builds successfully
6. **Security scans**: npm audit, composer audit, CodeQL
7. **Performance checks**: Lighthouse CI

### Required Status Checks

Before merge to `main` or `develop`:
```yaml
required_checks:
  - backend-ci
  - frontend-ci
  - security-scan
  - codeql (main only)
  - lighthouse-ci (main only)
```

### Auto-Merge (Future)

When all conditions met:
- ✅ All required checks passed
- ✅ Approved by reviewer
- ✅ No merge conflicts
- ✅ Branch up to date

Then: Auto-merge with squash

---

## 🎓 Best Practices

### Commit Messages

Follow conventional commits:

```bash
# Good examples
git commit -m "feat: add user profile endpoint"
git commit -m "fix: resolve null pointer in auth service"
git commit -m "chore: update dependencies to latest"
git commit -m "docs: add API usage examples"
git commit -m "refactor: extract auth logic to service"
git commit -m "perf: optimize database queries for properties"
git commit -m "test: add unit tests for user model"

# Bad examples
git commit -m "update"
git commit -m "fix bug"
git commit -m "changes"
```

**Format:**
```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `style`: Code style (formatting, no logic change)
- `refactor`: Code refactoring
- `perf`: Performance improvement
- `test`: Adding/updating tests
- `chore`: Maintenance, tooling, dependencies

### Branch Naming

```bash
# ✅ Good
feat/auth/social-login
fix/api/null-pointer-exception
chore/update-deps
docs/api-guide
refactor/auth-service
hotfix/security-vulnerability

# ❌ Bad
my-feature
update
fix-bug
new-stuff
```

### PR Size

**Ideal PR:**
- ➕ **Lines Changed**: < 500 lines
- ➕ **Files Changed**: < 10 files
- ➕ **Commits**: 1-5 commits (after squash)
- ➕ **Review Time**: < 30 minutes

**If larger:**
- Split into multiple PRs
- Use feature flags for incremental rollout
- Provide detailed description and context

---

## 📞 Questions & Support

- **Branch Strategy Questions**: DevOps Team
- **Review Process**: Team Lead
- **CI/CD Issues**: Check [RUNBOOK.md](./RUNBOOK.md)
- **General Help**: [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)

---

**Last Updated**: October 24, 2025  
**Next Review**: Quarterly  
**Maintained By**: DevOps Team & Engineering Leads
