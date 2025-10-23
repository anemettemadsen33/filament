# Queue Worker Deployment Runbook

## Production Queue Setup

### Prerequisites

- Supervisor installed on the server
- Laravel application deployed
- Database configured

### Installation Steps

#### 1. Install Supervisor

```bash
# Ubuntu/Debian
sudo apt-get install supervisor

# CentOS/RHEL
sudo yum install supervisor
```

#### 2. Configure Queue Workers

Copy the Supervisor configuration file:

```bash
sudo cp deployment/supervisor/rental-platform-worker.conf /etc/supervisor/conf.d/
```

Edit the configuration file to match your environment:

```bash
sudo nano /etc/supervisor/conf.d/rental-platform-worker.conf
```

Update these values:

- `command`: Update `/path/to/your/backend` with your actual Laravel path
- `user`: Change to your web server user (e.g., `www-data`, `nginx`, `ubuntu`)
- `numprocs`: Number of worker processes (start with 2, scale based on load)

#### 3. Start the Workers

```bash
# Reload Supervisor configuration
sudo supervisorctl reread

# Add the new program
sudo supervisorctl update

# Start the workers
sudo supervisorctl start rental-platform-worker:*

# Check status
sudo supervisorctl status rental-platform-worker:*
```

### Queue Configuration

The queue is configured in `config/queue.php` with the following settings:

**Database Driver** (recommended for simplicity):

- Jobs stored in `jobs` table
- Failed jobs tracked in `failed_jobs` table
- No additional Redis/Beanstalkd dependencies

**Job Settings**:

- `tries`: 3 attempts per job
- `timeout`: 60 seconds per job execution
- `max-time`: 3600 seconds (1 hour) worker runtime before restart
- `sleep`: 3 seconds between queue checks
- `retry_after`: 90 seconds before job retry

### Monitoring & Maintenance

#### Check Worker Status

```bash
sudo supervisorctl status rental-platform-worker:*
```

#### View Worker Logs

```bash
# Live tail
sudo tail -f /var/log/supervisor/rental-platform-worker.log

# Last 100 lines
sudo tail -n 100 /var/log/supervisor/rental-platform-worker.log
```

#### Restart Workers (After Code Deployment)

```bash
# Graceful restart (recommended)
php artisan queue:restart

# Or force restart via Supervisor
sudo supervisorctl restart rental-platform-worker:*
```

#### Check Failed Jobs

```bash
# List failed jobs
php artisan queue:failed

# Retry a specific failed job
php artisan queue:retry <job-id>

# Retry all failed jobs
php artisan queue:retry all

# Clear failed jobs
php artisan queue:flush
```

#### Monitor Queue Length

```bash
# Check pending jobs count
php artisan queue:monitor database --max=100

# Or query directly
php artisan tinker
>>> DB::table('jobs')->count();
```

### Performance Tuning

#### Scaling Workers

Monitor your queue length and adjust `numprocs` in supervisor config:

```bash
# Edit config
sudo nano /etc/supervisor/conf.d/rental-platform-worker.conf

# Update numprocs value (e.g., from 2 to 4)
numprocs=4

# Apply changes
sudo supervisorctl reread
sudo supervisorctl update
```

**Recommended worker counts**:

- Low traffic: 2-3 workers
- Medium traffic: 4-6 workers
- High traffic: 8-12 workers

#### Job Prioritization

For high-priority jobs (e.g., booking confirmations), use different queues:

```php
// Dispatch to high-priority queue
BookingConfirmedNotification::dispatch($booking)->onQueue('high');

// Start a dedicated high-priority worker
php artisan queue:work database --queue=high,default
```

Update Supervisor config to add priority worker:

```ini
[program:rental-platform-worker-high]
command=php /path/to/backend/artisan queue:work database --queue=high --sleep=1 --tries=3
numprocs=1
```

### Redis Queue (Alternative - Better Performance)

For production with high volume, consider Redis:

#### 1. Install Redis

```bash
sudo apt-get install redis-server
composer require predis/predis
```

#### 2. Update `.env`

```env
QUEUE_CONNECTION=redis
REDIS_HOST=127.0.0.1
REDIS_PASSWORD=null
REDIS_PORT=6379
```

#### 3. Update Supervisor Config

```ini
command=php /path/to/backend/artisan queue:work redis --sleep=1 --tries=3
```

### Troubleshooting

#### Workers Not Processing Jobs

```bash
# Check if workers are running
sudo supervisorctl status

# Check Laravel logs
tail -f storage/logs/laravel.log

# Check queue connection
php artisan tinker
>>> Queue::size();
```

#### High Memory Usage

```bash
# Add memory limit to supervisor config
command=php /path/to/backend/artisan queue:work database --memory=512

# Or in Laravel config/queue.php
'connections' => [
    'database' => [
        'driver' => 'database',
        'table' => 'jobs',
        'queue' => 'default',
        'retry_after' => 90,
        'after_commit' => false,
    ],
],
```

#### Jobs Timing Out

```bash
# Increase timeout in supervisor config
command=php /path/to/backend/artisan queue:work database --timeout=120
```

```bash
# Or in job class
public $timeout = 120;
```

### Best Practices

1. **Always use `queue:restart` after deployment** to reload code changes
2. **Monitor failed jobs daily** and investigate recurring failures
3. **Set up alerting** for queue length spikes (>1000 jobs)
4. **Log rotation**: Configure logrotate for supervisor logs
5. **Graceful shutdowns**: Let `stopwaitsecs` match your longest job duration
6. **Database backups**: Include `jobs` and `failed_jobs` tables
7. **Testing**: Use `QUEUE_CONNECTION=sync` in development/testing

### Health Check Script

Create a monitoring script:

```bash
#!/bin/bash
# queue-health-check.sh

QUEUE_SIZE=$(php artisan tinker --execute="echo Queue::size();")
FAILED_JOBS=$(php artisan tinker --execute="echo DB::table('failed_jobs')->count();")

echo "Pending jobs: $QUEUE_SIZE"
echo "Failed jobs: $FAILED_JOBS"

if [ $QUEUE_SIZE -gt 1000 ]; then
    echo "WARNING: Queue backlog detected!"
fi

if [ $FAILED_JOBS -gt 50 ]; then
    echo "WARNING: High number of failed jobs!"
fi
```

Run via cron:

```cron
*/5 * * * * /path/to/queue-health-check.sh
```

### Emergency Procedures

#### Clear Stuck Queue

```bash
# Stop workers
sudo supervisorctl stop rental-platform-worker:*

# Clear all jobs (USE WITH CAUTION)
php artisan queue:clear database

# Restart workers
sudo supervisorctl start rental-platform-worker:*
```

#### Pause Queue Processing

```bash
# Pause (jobs accumulate but don't process)
php artisan queue:pause

# Resume
php artisan queue:resume
```

---

## Support

For issues or questions:

- Check logs: `storage/logs/laravel.log` and `/var/log/supervisor/`
- [Laravel queue documentation](https://laravel.com/docs/queues)
- [Supervisor documentation](http://supervisord.org/)
