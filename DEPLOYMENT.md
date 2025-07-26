# Deployment Guide

This guide explains how to deploy the FinClamp Financial Calculator to various hosting platforms.

## 🚀 Quick Deploy

### Netlify (Recommended)
1. Connect your GitHub repository to Netlify
2. Build command: `npm run build`
3. Publish directory: `dist`
4. The `_redirects` file will automatically handle SPA routing

### Vercel
1. Connect your GitHub repository to Vercel
2. Build command: `npm run build`
3. Output directory: `dist`
4. The `vercel.json` file will handle SPA routing

### GitHub Pages
1. Enable GitHub Pages in repository settings
2. Use GitHub Actions for deployment:
```yaml
name: Deploy to GitHub Pages
on:
  push:
    branches: [ main ]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run build
      - uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

## 🔧 Configuration Files

### For Netlify
- `public/_redirects` - Handles SPA routing
- Automatically included in build

### For Vercel
- `vercel.json` - Handles SPA routing and headers
- Automatically detected

### For Apache Servers
- `public/.htaccess` - Handles SPA routing and caching
- Automatically included in build

## 🌐 URL Structure

The app supports these URL patterns:
- `/calculators?in=emi` - EMI Calculator
- `/calculators?in=sip` - SIP Calculator
- `/games?in=finance-quest` - Finance Game
- Legacy: `/?calculator=emi&category=loans`

## 🐛 Troubleshooting

### "Page Not Found" on Direct URL Access
- Ensure your hosting platform serves `index.html` for all routes
- Check that the appropriate config file is deployed:
  - Netlify: `_redirects`
  - Vercel: `vercel.json`
  - Apache: `.htaccess`

### Build Errors
- Run `npm ci` to ensure clean dependencies
- Check Node.js version (requires 16+)
- Verify all environment variables are set

### Performance Issues
- The app uses code splitting for better performance
- Static assets are cached for 1 year
- Consider enabling gzip compression on your server

## 📊 Bundle Analysis

The build creates optimized chunks:
- `vendor.js` - React and core dependencies
- `charts.js` - Recharts library
- `motion.js` - Framer Motion animations
- `icons.js` - Lucide React icons
- `index.js` - Main application code

## 🔒 Security Headers

The configuration includes security headers:
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `X-XSS-Protection: 1; mode=block`

## 📱 PWA Support

The app includes PWA features:
- Service Worker for offline support
- Web App Manifest for installation
- Optimized for mobile devices
