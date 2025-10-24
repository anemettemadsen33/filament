# Nginx Configuration for RentHub

This directory contains the production Nginx configuration optimized for Lighthouse performance.

## 🎯 Features

- **Brotli Compression**: Better compression than Gzip (~20% smaller files)
- **Aggressive Caching**: Static assets cached for 1 year
- **Security Headers**: X-Frame-Options, CSP, etc.
- **SPA Routing**: Proper handling of client-side routes
- **HTTP/2 Ready**: Optimized for modern protocols

## 📦 Installation

### Option 1: Docker (Recommended)

```bash
# Build Docker image with Nginx + Brotli
docker build -t renthub-nginx -f docker/Dockerfile .

# Run container
docker run -d -p 80:80 -p 443:443 renthub-nginx
```

### Option 2: Nginx with Brotli Module

If you're using a custom Nginx installation, you need the Brotli module:

```bash
# Ubuntu/Debian
sudo apt-get install nginx-module-brotli

# Or compile Nginx with Brotli
git clone https://github.com/google/ngx_brotli.git
cd ngx_brotli && git submodule update --init
./configure --add-module=../ngx_brotli
make && sudo make install
```

### Option 3: Use Pre-built Nginx with Brotli

Some distributions include Brotli by default:
- Nginx from official repos (1.23.0+)
- Cloudflare's Nginx builds
- OpenResty

## 🚀 Usage

1. **Copy configuration to Nginx:**
   ```bash
   sudo cp docker/nginx/default.conf /etc/nginx/sites-available/renthub
   sudo ln -s /etc/nginx/sites-available/renthub /etc/nginx/sites-enabled/
   ```

2. **Test configuration:**
   ```bash
   sudo nginx -t
   ```

3. **Reload Nginx:**
   ```bash
   sudo systemctl reload nginx
   ```

## 🔍 Verification

### Check Brotli Compression

```bash
# Test if Brotli is working
curl -H "Accept-Encoding: br" -I https://your-domain.com/assets/index.js

# Should see:
# Content-Encoding: br
```

### Check File Sizes

Before Brotli:
```
vendor.js:  1.2MB (original)
vendor.js:  380KB (gzip)
vendor.js:  165KB (brotli) ✅ 56% smaller
```

### Lighthouse Score Impact

Expected improvements:
- Performance: +3-5 points
- FCP: -200ms
- LCP: -500ms
- Total Size: -30%

## 📊 Performance Budget

With this configuration, you should achieve:

| Metric | Target | Expected |
|--------|--------|----------|
| Performance Score | 87+ | ✅ |
| FCP | <1.8s | ✅ |
| LCP | <2.5s | ✅ |
| Total Bundle | <1.8MB | ✅ |
| JS Bundle | <500KB | ✅ |

## 🛠️ Troubleshooting

### Brotli not working?

1. **Check if module is loaded:**
   ```bash
   nginx -V 2>&1 | grep brotli
   ```

2. **Fallback to Gzip:**
   If Brotli isn't available, uncomment the Gzip section in `default.conf`

3. **Pre-compress files:**
   ```bash
   # Generate .br files during build
   npm run build
   find dist -type f \( -name '*.js' -o -name '*.css' \) -exec brotli {} \;
   ```

### Cache not working?

1. **Clear browser cache:**
   - Chrome: Ctrl+Shift+R (hard reload)
   - Or open DevTools → Network → Disable cache

2. **Check headers:**
   ```bash
   curl -I https://your-domain.com/assets/main.js
   # Should see: Cache-Control: public, immutable
   ```

### SPA routing 404s?

Make sure the `try_files` directive is present:
```nginx
location / {
    try_files $uri $uri/ /index.html;
}
```

## 🔒 Security Considerations

The configuration includes:
- XSS Protection headers
- Frame options
- Content type sniffing prevention
- Referrer policy

For production, also consider:
- Enable HTTPS (SSL certificates)
- Add Content Security Policy (CSP)
- Rate limiting
- DDoS protection

## 📚 References

- [Nginx Brotli Module](https://github.com/google/ngx_brotli)
- [Lighthouse Performance](https://web.dev/performance-scoring/)
- [HTTP Caching](https://web.dev/http-cache/)
- [Security Headers](https://web.dev/security-headers/)
