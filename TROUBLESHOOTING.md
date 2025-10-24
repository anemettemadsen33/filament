# 🔧 Troubleshooting Guide - RentHub Platform

**Quick reference for common development and deployment issues**

---

## Table of Contents

1. [GitHub & npm Connectivity Issues](#github--npm-connectivity-issues)
2. [Development Environment Issues](#development-environment-issues)
3. [Build & Compilation Issues](#build--compilation-issues)
4. [Database Connection Issues](#database-connection-issues)
5. [Docker Issues](#docker-issues)
6. [GitHub Copilot Issues](#github-copilot-issues)
7. [Performance Issues](#performance-issues)
8. [Common Error Messages](#common-error-messages)

---

## GitHub & npm Connectivity Issues

### 🔍 Verifică Conexiunea la GitHub / npm (Check GitHub/npm Connection)

#### Step 1: Test Network Connectivity

Open your terminal and run these commands to verify connectivity:

```bash
# Test GitHub connectivity
ping github.com

# Test GitHub API connectivity
ping api.github.com

# Test npm registry connectivity
ping registry.npmjs.org

# Test npm service (requires npm installed)
npm ping
```

**Expected output for `npm ping`:**
```
npm notice PING https://registry.npmjs.org/
npm notice PONG 200ms
```

**If you get errors or timeouts:**
- ❌ No response = Firewall is blocking access
- ❌ "Request timeout" = Network connectivity issues
- ❌ "Unknown host" = DNS resolution problem

---

### 🔥 Allow Required Domains in Firewall/Proxy

If the ping tests fail, your firewall or corporate proxy may be blocking access. You need to whitelist these domains:

#### Required Domains for Development:

**GitHub Services:**
- `github.com` - Main GitHub website and repository access
- `api.github.com` - GitHub API (required for Copilot and CI/CD)
- `raw.githubusercontent.com` - Raw file access
- `*.github.com` - All GitHub subdomains

**npm Registry:**
- `registry.npmjs.org` - Main npm package registry
- `npmjs.com` - npm website
- `*.npmjs.com` - npm CDN and services

**GitHub Copilot (if using):**
- `copilot-proxy.githubusercontent.com` - Copilot API
- `*.githubcopilot.com` - Copilot services

#### How to Configure Firewall/Proxy:

**For Windows Firewall:**
```powershell
# Run PowerShell as Administrator
# Add outbound rule for GitHub
New-NetFirewallRule -DisplayName "Allow GitHub" -Direction Outbound -RemoteAddress github.com -Action Allow

# Add outbound rule for npm
New-NetFirewallRule -DisplayName "Allow npm Registry" -Direction Outbound -RemoteAddress registry.npmjs.org -Action Allow
```

**For Corporate Proxy (in terminal):**
```bash
# Set proxy for npm
npm config set proxy http://proxy.company.com:8080
npm config set https-proxy http://proxy.company.com:8080

# Set proxy for Git
git config --global http.proxy http://proxy.company.com:8080
git config --global https.proxy http://proxy.company.com:8080

# Verify settings
npm config get proxy
git config --global --get http.proxy
```

**For Linux iptables:**
```bash
# Allow outbound connections to GitHub (443 for HTTPS)
sudo iptables -A OUTPUT -p tcp -d github.com --dport 443 -j ACCEPT

# Allow outbound connections to npm registry
sudo iptables -A OUTPUT -p tcp -d registry.npmjs.org --dport 443 -j ACCEPT

# Save iptables rules
sudo iptables-save
```

---

### 🌐 Test on Different Network

If firewall configuration is complex or not possible, test on a different network:

#### Option 1: Mobile Hotspot
1. Enable mobile hotspot on your phone
2. Connect your computer to the hotspot
3. Run the connectivity tests again:
   ```bash
   ping github.com
   npm ping
   ```
4. Try installing packages:
   ```bash
   npm install
   ```

#### Option 2: Alternative Network
- Use home network instead of office network
- Use public WiFi (coffee shop, library) - **not recommended for sensitive work**
- Use VPN service to bypass restrictions

**If it works on mobile hotspot but not on office network:**
→ This confirms the issue is with your office firewall/proxy

---

### ⚙️ VS Code GitHub Copilot Settings

If you're using GitHub Copilot and experiencing connectivity issues:

#### Check VS Code Settings:

1. Open VS Code Settings:
   - **Windows/Linux**: `Ctrl + ,`
   - **macOS**: `Cmd + ,`

2. Search for "GitHub Copilot"

3. Check these settings:

**Network/Proxy Settings:**
```json
{
  // Disable strict SSL if behind corporate proxy
  "http.proxyStrictSSL": false,
  
  // Set proxy if required
  "http.proxy": "http://proxy.company.com:8080",
  
  // GitHub Copilot specific settings
  "github.copilot.advanced": {
    "debug.overrideEngine": "gpt-4",
    "debug.testOverrideProxyUrl": "",
    "debug.overrideProxyUrl": "http://proxy.company.com:8080"
  }
}
```

**Strict Firewall Mode:**
```json
{
  // Disable if causing issues
  "github.copilot.advanced.strictFirewall": false
}
```

#### Apply Settings:

1. **Method 1: Via UI**
   - Settings → Search "GitHub Copilot"
   - Find "Proxy / Network" section
   - Disable "Strict Firewall Mode" if enabled
   - Configure proxy URL if needed

2. **Method 2: Via settings.json**
   - Open Command Palette (`Ctrl+Shift+P` or `Cmd+Shift+P`)
   - Type: "Preferences: Open Settings (JSON)"
   - Add the settings shown above
   - Save and restart VS Code

---

### 🔄 Retry After Configuration

After allowing domains in firewall or configuring proxy:

1. **Clear npm cache:**
   ```bash
   npm cache clean --force
   ```

2. **Test connectivity again:**
   ```bash
   ping github.com
   npm ping
   ```

3. **Try installing dependencies:**
   ```bash
   # For frontend (Renthub)
   cd Renthub
   npm install
   
   # For backend (if using npm)
   cd Rental-Platform-main/backend
   npm install
   ```

4. **Verify Git connection:**
   ```bash
   git ls-remote https://github.com/anemettemadsen33/filament.git
   ```

5. **Test Copilot (if using):**
   - Open a code file in VS Code
   - Start typing a comment or function
   - Copilot should show suggestions

---

## Development Environment Issues

### Node.js Version Mismatch

**Error:** `Error: The engine "node" is incompatible with this module`

**Solution:**
```bash
# Check current Node.js version
node --version

# Required: Node.js 18+
# Install nvm (Node Version Manager)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# Install and use Node.js 18
nvm install 18
nvm use 18
nvm alias default 18

# Verify installation
node --version  # Should show v18.x.x
```

---

### PHP Version Issues

**Error:** `Your PHP version (7.4.x) does not satisfy that requirement`

**Solution:**
```bash
# Check current PHP version
php --version

# Required: PHP 8.2+
# For Ubuntu/Debian
sudo add-apt-repository ppa:ondrej/php
sudo apt update
sudo apt install php8.2 php8.2-cli php8.2-fpm php8.2-mysql php8.2-pgsql

# For macOS (using Homebrew)
brew install php@8.2
brew link php@8.2

# Verify installation
php --version  # Should show 8.2.x
```

---

### Composer Not Found

**Error:** `bash: composer: command not found`

**Solution:**
```bash
# Download and install Composer
php -r "copy('https://getcomposer.org/installer', 'composer-setup.php');"
php composer-setup.php
php -r "unlink('composer-setup.php');"
sudo mv composer.phar /usr/local/bin/composer

# Verify installation
composer --version
```

---

## Build & Compilation Issues

### Frontend Build Failures

**Error:** `FATAL ERROR: Reached heap limit Allocation failed - JavaScript heap out of memory`

**Solution:**
```bash
# Increase Node.js memory limit
export NODE_OPTIONS="--max-old-space-size=4096"

# Then run build again
npm run build
```

---

### Vite Build Issues

**Error:** `Failed to resolve import` or `Module not found`

**Solution:**
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Clear Vite cache
rm -rf node_modules/.vite

# Rebuild
npm run build
```

---

### TypeScript Errors

**Error:** `Cannot find module '@/components/...' or its corresponding type declarations`

**Solution:**
```bash
# Check tsconfig.json paths are correct
cat tsconfig.json

# Verify the paths section includes:
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}

# Restart TypeScript server in VS Code
# Command Palette → "TypeScript: Restart TS Server"
```

---

## Database Connection Issues

### Connection Refused

**Error:** `SQLSTATE[HY000] [2002] Connection refused`

**Solution:**
```bash
# Check if database service is running
# For PostgreSQL
sudo systemctl status postgresql
sudo systemctl start postgresql

# For MySQL
sudo systemctl status mysql
sudo systemctl start mysql

# If using Docker
docker-compose ps
docker-compose up -d postgres
```

---

### Authentication Failed

**Error:** `SQLSTATE[HY000] [1045] Access denied for user`

**Solution:**
```bash
# Verify .env database credentials
cat Rental-Platform-main/backend/.env | grep DB_

# Should match your database setup
DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=rental_platform
DB_USERNAME=postgres
DB_PASSWORD=your_password

# Test connection manually
psql -h 127.0.0.1 -U postgres -d rental_platform
```

---

## Docker Issues

### Docker Container Won't Start

**Error:** `Cannot start service: driver failed`

**Solution:**
```bash
# Check Docker daemon
sudo systemctl status docker
sudo systemctl start docker

# Clean up Docker resources
docker system prune -a

# Rebuild containers
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

---

### Port Already in Use

**Error:** `Bind for 0.0.0.0:3000 failed: port is already allocated`

**Solution:**
```bash
# Find what's using the port
# Linux/macOS
lsof -i :3000
sudo kill -9 <PID>

# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Or change port in docker-compose.yml
ports:
  - "3001:3000"  # Use 3001 instead
```

---

## GitHub Copilot Issues

### Copilot Not Working

**Symptoms:**
- No suggestions appearing
- "Copilot is not available" message
- Authentication errors

**Solutions:**

1. **Check Authentication:**
   ```bash
   # In VS Code, open Command Palette
   # Run: "GitHub Copilot: Sign Out"
   # Then: "GitHub Copilot: Sign In"
   ```

2. **Verify Subscription:**
   - Go to https://github.com/settings/copilot
   - Ensure subscription is active

3. **Check Extension:**
   - VS Code → Extensions
   - Search "GitHub Copilot"
   - Verify it's installed and enabled
   - Try disabling and re-enabling

4. **Clear Extension Cache:**
   ```bash
   # Close VS Code
   # Delete Copilot cache (Linux/macOS)
   rm -rf ~/.config/Code/User/workspaceStorage/*/ms-toolsai.vscode-copilot
   
   # Windows
   # Delete: %APPDATA%\Code\User\workspaceStorage\*\ms-toolsai.vscode-copilot
   ```

5. **Check Network Settings:**
   - See [VS Code GitHub Copilot Settings](#️-vs-code-github-copilot-settings) above

---

### Copilot Slow or Timing Out

**Solution:**
```json
// Add to VS Code settings.json
{
  "github.copilot.advanced": {
    "timeout": 10000,  // Increase timeout to 10 seconds
    "inlineSuggestCount": 1  // Reduce suggestions for faster response
  }
}
```

---

## Performance Issues

### Slow npm install

**Solution:**
```bash
# Use npm cache
npm cache verify

# Or use faster package manager
npm install -g pnpm
pnpm install

# Or use yarn
npm install -g yarn
yarn install
```

---

### Slow Development Server

**Solution:**
```bash
# For Vite (Renthub frontend)
# Add to vite.config.ts:
export default {
  server: {
    hmr: {
      overlay: false  // Disable error overlay for faster HMR
    }
  },
  optimizeDeps: {
    include: ['react', 'react-dom']  // Pre-bundle dependencies
  }
}
```

---

## Common Error Messages

### `EACCES: permission denied`

**Solution:**
```bash
# Fix npm permissions (Linux/macOS)
sudo chown -R $(whoami) ~/.npm
sudo chown -R $(whoami) /usr/local/lib/node_modules

# Or use nvm to avoid permission issues
# (see Node.js Version Mismatch section)
```

---

### `ENOSPC: System limit for number of file watchers reached`

**Solution:**
```bash
# Increase file watcher limit (Linux)
echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf
sudo sysctl -p
```

---

### `ERR_OSSL_EVP_UNSUPPORTED`

**Solution:**
```bash
# Add to your shell profile (~/.bashrc or ~/.zshrc)
export NODE_OPTIONS=--openssl-legacy-provider

# Then restart terminal and run again
npm run dev
```

---

## Getting Help

### Before Opening an Issue:

1. ✅ Check this troubleshooting guide
2. ✅ Search existing issues on GitHub
3. ✅ Check documentation:
   - [README.md](./README.md)
   - [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)
   - [TESTING_GUIDE.md](./TESTING_GUIDE.md)
   - [SECURITY_GUIDE.md](./SECURITY_GUIDE.md)

### When Opening an Issue:

Include:
- **Operating System**: Windows 10, macOS 14.0, Ubuntu 22.04, etc.
- **Node.js Version**: `node --version`
- **npm Version**: `npm --version`
- **PHP Version** (if backend): `php --version`
- **Error Message**: Full error with stack trace
- **Steps to Reproduce**: What you did before the error
- **What You've Tried**: Solutions you've already attempted

---

## Quick Reference Commands

### Check Versions
```bash
node --version          # Node.js version
npm --version           # npm version
php --version           # PHP version
composer --version      # Composer version
docker --version        # Docker version
git --version           # Git version
```

### Test Connectivity
```bash
ping github.com         # GitHub connectivity
ping registry.npmjs.org # npm registry connectivity
npm ping                # npm service status
git ls-remote https://github.com/anemettemadsen33/filament.git  # Git access
```

### Clean & Rebuild
```bash
# Frontend (Renthub)
rm -rf node_modules package-lock.json
npm cache clean --force
npm install
npm run build

# Backend (Laravel)
composer clear-cache
rm -rf vendor
composer install
php artisan config:clear
php artisan cache:clear
```

### Docker Commands
```bash
docker-compose ps                    # List running containers
docker-compose logs -f [service]     # View logs
docker-compose restart [service]     # Restart service
docker-compose down                  # Stop all services
docker-compose up -d                 # Start all services
docker system prune -a               # Clean up Docker
```

---

## Additional Resources

- **GitHub Status**: https://www.githubstatus.com/
- **npm Status**: https://status.npmjs.org/
- **Stack Overflow**: Tag your questions with `laravel`, `react`, `filament`, `vite`
- **Laravel Documentation**: https://laravel.com/docs
- **React Documentation**: https://react.dev/
- **Vite Documentation**: https://vitejs.dev/

---

**Last Updated**: October 24, 2025  
**Maintained by**: Development Team

For more information, see [README.md](./README.md)
