# 📖 Operations Runbook

**Project**: RentHub - Rental Platform  
**Last Updated**: October 24, 2025  
**Maintainer**: DevOps Team

---

## 🎯 Purpose

This runbook contains operational procedures for managing the RentHub platform in production. Use this guide for deployments, incident response, rollbacks, and routine maintenance.

---

## 🚀 Deployment Procedures

### Staging Deployment (Automatic)

Staging deploys automatically when code is pushed to `develop` branch.

```bash
# Trigger automatic staging deployment
git checkout develop
git pull origin develop
git merge feature/your-feature
git push origin develop

# Watch deployment
# Visit: https://github.com/anemettemadsen33/filament/actions
```

**Post-Deployment Checks:**
1. Visit https://staging.renthub.com
2. Verify health endpoint: `curl https://staging.renthub.com/health`
3. Test critical user flows (login, search, booking)
4. Check error logs in Sentry

### Production Deployment (Manual Approval)

Production requires manual approval and a version tag.

**Pre-Deployment Checklist:**
- [ ] All CI checks passed on main branch
- [ ] Code reviewed and approved
- [ ] Staging tested successfully
- [ ] Database backup completed
- [ ] Team notified of deployment window
- [ ] Rollback plan confirmed

**Deployment Steps:**

```bash
# 1. Create a release tag
git checkout main
git pull origin main
git tag -a v1.2.3 -m "Release v1.2.3"
git push origin v1.2.3

# 2. Backup production database
ssh production-server
pg_dump -h localhost -U renthub_user -d renthub_prod > /backups/renthub_$(date +%Y%m%d_%H%M%S).sql
gzip /backups/renthub_$(date +%Y%m%d_%H%M%S).sql
exit

# 3. Trigger deployment workflow
# Visit: https://github.com/anemettemadsen33/filament/actions/workflows/deploy-prod.yml
# Click "Run workflow"
# Enter version tag: v1.2.3
# Click "Run workflow"

# 4. Approve deployment when prompted
# GitHub will pause for approval before deploying to production

# 5. Monitor deployment
# Watch workflow progress
# Check deployment logs
```

**Post-Deployment Verification:**

```bash
# Health check
curl https://renthub.com/health

# API check
curl https://renthub.com/api/v1/auth/ping

# Check application version
curl https://renthub.com/api/v1/version

# Monitor errors (first 15 minutes critical)
# Check Sentry dashboard: https://sentry.io/renthub
```

---

## 🔄 Rollback Procedures

### Quick Rollback (< 5 minutes)

If deployment fails or critical issues detected:

```bash
# Option 1: Automatic rollback (if health checks fail)
# The deploy-prod.yml workflow will automatically trigger rollback

# Option 2: Manual rollback
ssh production-server

cd /var/www/production

# Switch to previous version
sudo mv backend backend-failed
sudo mv backend-old backend
sudo mv frontend frontend-failed
sudo mv frontend-old frontend

# Restart services
sudo systemctl restart php8.2-fpm
sudo systemctl reload nginx

# Verify
curl http://localhost/health
exit

# Verify externally
curl https://renthub.com/health
```

### Database Rollback

If migrations need to be rolled back:

```bash
ssh production-server

cd /var/www/production/backend

# Rollback last migration
php artisan migrate:rollback --step=1

# Rollback specific migration
php artisan migrate:rollback --path=/database/migrations/2024_10_24_create_table.php

# If severe data corruption, restore from backup
exit

# On local machine with backup access
ssh production-server
gunzip /backups/renthub_20251024_100000.sql.gz
psql -h localhost -U renthub_user -d renthub_prod < /backups/renthub_20251024_100000.sql
```

**⚠️ Warning**: Database rollbacks can cause data loss. Always verify with team lead first.

---

## 🔍 Incident Response

### 1. High Error Rate Alert

**Symptoms**: Sentry alerts, increased 500 errors, user complaints

**Investigation Steps:**

```bash
# 1. Check application logs
ssh production-server
sudo tail -f /var/www/production/backend/storage/logs/laravel.log

# 2. Check PHP-FPM logs
sudo tail -f /var/log/php8.2-fpm.log

# 3. Check Nginx logs
sudo tail -f /var/log/nginx/error.log
sudo tail -f /var/log/nginx/access.log

# 4. Check system resources
htop
df -h
free -h

# 5. Check database
psql -h localhost -U renthub_user -d renthub_prod
SELECT * FROM pg_stat_activity;
\q
```

**Common Fixes:**

```bash
# Clear caches
cd /var/www/production/backend
php artisan cache:clear
php artisan config:clear
php artisan route:clear
php artisan view:clear

# Restart services
sudo systemctl restart php8.2-fpm
sudo systemctl restart nginx

# If queue issues
php artisan queue:restart
```

### 2. Database Connection Issues

**Symptoms**: "Connection refused" errors, timeout errors

**Investigation:**

```bash
# Check database service
ssh production-server
sudo systemctl status postgresql

# Check connections
psql -h localhost -U renthub_user -d renthub_prod -c "SELECT count(*) FROM pg_stat_activity;"

# Check max connections
psql -h localhost -U postgres -c "SHOW max_connections;"

# Kill long-running queries (if needed)
psql -h localhost -U postgres -d renthub_prod
SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE state = 'active' AND query_start < NOW() - INTERVAL '5 minutes';
```

**Fix:**

```bash
# Restart PostgreSQL (last resort)
sudo systemctl restart postgresql

# Restart application
sudo systemctl restart php8.2-fpm
```

### 3. High CPU/Memory Usage

**Investigation:**

```bash
ssh production-server

# Check processes
top
htop

# Check disk usage
df -h
du -sh /var/www/*

# Check for memory leaks
ps aux | grep php | awk '{print $6}' | awk '{sum+=$1} END {print sum/1024 " MB"}'
```

**Common Fixes:**

```bash
# Clear old logs
sudo find /var/www/production/backend/storage/logs -name "*.log" -mtime +30 -delete
sudo find /var/log/nginx -name "*.log" -mtime +30 -delete

# Restart PHP-FPM
sudo systemctl restart php8.2-fpm

# Optimize database
psql -h localhost -U renthub_user -d renthub_prod
VACUUM ANALYZE;
\q
```

### 4. SSL Certificate Expiry

**Investigation:**

```bash
# Check certificate expiry
echo | openssl s_client -servername renthub.com -connect renthub.com:443 2>/dev/null | openssl x509 -noout -dates
```

**Fix (Let's Encrypt):**

```bash
ssh production-server

# Renew certificate
sudo certbot renew

# Or force renewal
sudo certbot renew --force-renewal

# Reload Nginx
sudo systemctl reload nginx
```

---

## 📊 Monitoring & Alerts

### Key Metrics to Monitor

| Metric | Normal | Warning | Critical | Action |
|--------|--------|---------|----------|--------|
| Response Time (p95) | < 500ms | > 1s | > 3s | Investigate, consider scaling |
| Error Rate | < 1% | > 5% | > 10% | Investigate immediately |
| CPU Usage | < 60% | > 80% | > 95% | Scale up |
| Memory Usage | < 70% | > 85% | > 95% | Restart services, scale up |
| Disk Usage | < 70% | > 85% | > 95% | Clean logs, expand disk |
| Database Connections | < 50 | > 80 | > 95 | Investigate connection leaks |

### Monitoring Tools

- **Sentry**: https://sentry.io/renthub - Error tracking
- **Grafana**: https://grafana.renthub.com - Metrics dashboards
- **Uptime**: https://uptimerobot.com - Health checks
- **Logs**: Centralized in Loki/Grafana Cloud

### Alert Channels

- **Critical**: PagerDuty → On-call engineer
- **High**: Slack #alerts channel
- **Medium**: Email to devops@renthub.com
- **Low**: Daily digest email

---

## 🔧 Routine Maintenance

### Daily Tasks

```bash
# Check error logs
ssh production-server
sudo tail -100 /var/www/production/backend/storage/logs/laravel.log | grep ERROR

# Check disk space
df -h

# Check service status
sudo systemctl status php8.2-fpm nginx postgresql
```

### Weekly Tasks

- [ ] Review Dependabot PRs
- [ ] Run security audits:
  ```bash
  cd Rental-Platform-main/backend
  composer audit
  
  cd ../../Renthub
  npm audit
  ```
- [ ] Review Sentry errors (triage and fix top 10)
- [ ] Check SSL certificate expiry (should be > 30 days)
- [ ] Review and rotate logs:
  ```bash
  ssh production-server
  sudo logrotate -f /etc/logrotate.d/nginx
  sudo logrotate -f /etc/logrotate.d/php8.2-fpm
  ```

### Monthly Tasks

- [ ] Full database backup and restore test
- [ ] Performance review (Lighthouse + Web Vitals)
- [ ] Security scan (npm audit, composer audit, CodeQL review)
- [ ] Update dependencies (minor/patch versions)
- [ ] Review and optimize database indexes:
  ```sql
  SELECT schemaname, tablename, indexname, idx_scan
  FROM pg_stat_user_indexes
  ORDER BY idx_scan ASC
  LIMIT 20;
  ```
- [ ] Clean old data (logs, sessions, temp files):
  ```bash
  php artisan telescope:prune --hours=168
  php artisan horizon:snapshot
  ```

### Quarterly Tasks

- [ ] Full security audit
- [ ] Penetration test (external if budget allows)
- [ ] Dependency upgrade sprint (major versions)
- [ ] Review and update security policies
- [ ] Disaster recovery drill (full restore from backups)
- [ ] Team security training refresh

---

## 🗄️ Database Operations

### Backup Procedures

**Automated Daily Backups:**

```bash
# Cron job on production server
0 2 * * * /opt/scripts/backup-database.sh
```

**Manual Backup:**

```bash
ssh production-server

# Create backup
pg_dump -h localhost -U renthub_user -d renthub_prod -F c -f /backups/manual_$(date +\%Y\%m\%d_\%H\%M\%S).dump

# Verify backup
pg_restore --list /backups/manual_*.dump | head -20

# Upload to S3 (if configured)
aws s3 cp /backups/manual_*.dump s3://renthub-backups/manual/
```

### Restore Procedures

```bash
ssh production-server

# Stop application (to prevent writes during restore)
sudo systemctl stop php8.2-fpm

# Drop and recreate database
psql -h localhost -U postgres
DROP DATABASE renthub_prod;
CREATE DATABASE renthub_prod OWNER renthub_user;
\q

# Restore from backup
pg_restore -h localhost -U renthub_user -d renthub_prod /backups/renthub_20251024_020000.dump

# Start application
sudo systemctl start php8.2-fpm

# Verify
curl http://localhost/health
```

### Database Migrations

```bash
ssh production-server
cd /var/www/production/backend

# Check migration status
php artisan migrate:status

# Run pending migrations
php artisan migrate --force

# Rollback if needed
php artisan migrate:rollback --step=1
```

---

## 🔐 Security Operations

### Rotate Secrets

**Application Key:**

```bash
# Generate new key
php artisan key:generate --show

# Update in GitHub Secrets
gh secret set APP_KEY --body "base64:..."

# Update on server
ssh production-server
nano /var/www/production/.env
# Update APP_KEY=...
sudo systemctl restart php8.2-fpm
```

**Database Password:**

```bash
# 1. Generate strong password
openssl rand -base64 32

# 2. Update database user
psql -h localhost -U postgres
ALTER USER renthub_user WITH PASSWORD 'new-strong-password';
\q

# 3. Update .env
nano /var/www/production/.env
# Update DB_PASSWORD=...

# 4. Restart application
sudo systemctl restart php8.2-fpm
```

### Review Access Logs

```bash
ssh production-server

# Check for suspicious activity
sudo grep "POST" /var/log/nginx/access.log | tail -100
sudo grep "login" /var/www/production/backend/storage/logs/laravel.log | tail -50

# Check failed login attempts
sudo grep "Failed login" /var/www/production/backend/storage/logs/laravel.log | wc -l

# Block IP if needed
sudo ufw deny from 192.168.1.100
```

---

## 📞 Escalation & Contacts

### On-Call Rotation

| Week | Primary | Secondary |
|------|---------|-----------|
| Current | John Doe (+1-555-0100) | Jane Smith (+1-555-0101) |
| Next | Jane Smith (+1-555-0101) | Bob Johnson (+1-555-0102) |

### Escalation Path

1. **Level 1** (0-15 min): On-call engineer investigates
2. **Level 2** (15-30 min): Team lead notified if unresolved
3. **Level 3** (30-60 min): CTO/VP Engineering notified
4. **Level 4** (> 60 min): External support engaged

### Emergency Contacts

- **On-Call Engineer**: Via PagerDuty
- **DevOps Lead**: devops-lead@renthub.com, +1-555-0100
- **CTO**: cto@renthub.com, +1-555-0200
- **Hosting Support**: AWS Support, Case Priority: Critical

---

## 📚 Useful Commands Reference

### Service Management

```bash
# Check service status
sudo systemctl status php8.2-fpm
sudo systemctl status nginx
sudo systemctl status postgresql

# Restart services
sudo systemctl restart php8.2-fpm
sudo systemctl restart nginx
sudo systemctl restart postgresql

# View service logs
sudo journalctl -u php8.2-fpm -f
sudo journalctl -u nginx -f
sudo journalctl -u postgresql -f
```

### Laravel Artisan Commands

```bash
cd /var/www/production/backend

# Cache management
php artisan cache:clear
php artisan config:cache
php artisan route:cache
php artisan view:cache
php artisan optimize

# Queue management
php artisan queue:work --daemon
php artisan queue:restart
php artisan queue:failed

# Maintenance mode
php artisan down --message="Scheduled maintenance"
php artisan up
```

### Database Commands

```bash
# Connect to database
psql -h localhost -U renthub_user -d renthub_prod

# Show active queries
SELECT pid, now() - query_start AS duration, query 
FROM pg_stat_activity 
WHERE state = 'active' 
ORDER BY duration DESC;

# Kill query
SELECT pg_terminate_backend(pid);

# Database size
SELECT pg_size_pretty(pg_database_size('renthub_prod'));

# Table sizes
SELECT schemaname, tablename, 
       pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC
LIMIT 10;
```

---

## 📖 Additional Resources

- [Production Readiness Checklist](./PRODUCTION_READINESS_CHECKLIST.md)
- [Security Checklist](./SECURITY_CHECKLIST.md)
- [Deployment Guide](./DEPLOYMENT_GUIDE.md)
- [Testing Guide](./TESTING_GUIDE.md)

---

**Last Updated**: October 24, 2025  
**Next Review**: Monthly  
**Maintained By**: DevOps Team
