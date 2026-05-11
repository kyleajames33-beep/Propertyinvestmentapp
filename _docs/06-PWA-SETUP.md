# PWA Setup & Configuration Guide

## Overview
This app is configured as a **Progressive Web App (PWA)** to enable:
- Installation on mobile devices (iOS & Android)
- Offline functionality
- App-like experience
- Preparation for app store submission via wrapper frameworks

---

## PWA Components

### 1. Manifest File (`manifest.json`)
Located at: `/manifest.json`

**Purpose:** Defines app metadata for installation

**Key Properties:**
```json
{
  "name": "Property Investment App - Australian Property Investor Tool",
  "short_name": "Property Investor",
  "start_url": "/index.html",
  "display": "standalone",
  "theme_color": "#2563eb",
  "background_color": "#f9fafb"
}
```

**Icons Required:**
- 72x72, 96x96, 128x128, 144x144, 152x152 (various devices)
- 192x192 (Android)
- 512x512 (Android splash screen)

**Status:**
- ✅ Manifest created
- ❌ Icons need to be generated (placeholder paths exist)

---

### 2. Service Worker (`service-worker.js`)
Located at: `/service-worker.js`

**Purpose:** Enables offline caching and background functionality

**Caching Strategy:**
- **Static files** (index.html, manifest.json) cached on install
- **Network-first** for dynamic requests with cache fallback
- Automatic cache cleanup on version updates

**Version:** 1.0.0

**Cache Names:**
- `property-investment-v1.0.0-static` - Core app files
- `property-investment-v1.0.0-dynamic` - Runtime cached resources

---

### 3. Install Prompt (in `index.html`)
Located at: Lines 1347-1460 in `index.html`

**Features:**
- Custom install banner (styled to match app design)
- "Install" and "Not Now" options
- Remembers user choice (won't re-prompt if dismissed)
- Automatically hides after installation

**User Flow:**
1. User visits app in browser
2. After engagement, browser triggers `beforeinstallprompt` event
3. Custom banner slides up from bottom
4. User can install or dismiss
5. Choice is saved to localStorage

---

## Testing PWA Locally

### Requirements
- **HTTPS** or **localhost** (service workers require secure context)
- Modern browser (Chrome, Edge, Safari, Firefox)

### Testing Steps

#### 1. Serve with HTTPS
**Option A: Live Server (VS Code)**
```bash
# Install Live Server extension in VS Code
# Right-click index.html → "Open with Live Server"
```

**Option B: Python Simple Server**
```bash
# HTTP (for localhost testing only)
python -m http.server 8000

# HTTPS (requires SSL cert)
# See: https://gist.github.com/dergachev/7028596
```

**Option C: Node.js http-server**
```bash
# Install globally
npm install -g http-server

# Run with HTTPS
http-server -S -C cert.pem -K key.pem
```

#### 2. Check PWA Installability (Chrome DevTools)

1. Open Chrome DevTools (F12)
2. Go to **Application** tab
3. Check **Manifest** section:
   - ✅ All fields populated
   - ✅ Icons listed (even if 404 for now)
   - ✅ "Add to homescreen" available

4. Check **Service Workers** section:
   - ✅ Service worker registered
   - ✅ Status: "activated and running"
   - Can test offline mode

5. **Lighthouse** audit:
   - Click "Lighthouse" tab
   - Select "Progressive Web App"
   - Run audit
   - Target score: 90+ (100 after adding icons)

#### 3. Test Install Flow

**Desktop (Chrome/Edge):**
1. Look for install icon in address bar (⊕ or install button)
2. Or use custom install banner if it appears
3. Click install
4. App opens in standalone window

**Mobile (Chrome Android):**
1. Visit app in Chrome
2. Custom banner appears after short delay
3. Tap "Install"
4. App added to home screen

**iOS (Safari):**
1. Open in Safari
2. Tap Share button
3. "Add to Home Screen"
4. Icon uses `apple-touch-icon` meta tag

---

## Icon Generation (Required)

### Sizes Needed
Create icons in these sizes and place in `/icons/` folder:

```
icons/
├── icon-72x72.png
├── icon-96x96.png
├── icon-128x128.png
├── icon-144x144.png
├── icon-152x152.png
├── icon-192x192.png
├── icon-384x384.png
└── icon-512x512.png
```

### Design Guidelines
- **Simple, recognizable design** (works at small sizes)
- **Solid background color** (no transparency for some platforms)
- **Centered icon** with padding (safe area for rounded corners)
- **Colors:** Use primary blue (#2563eb) from design system
- **Symbol:** House/property related (🏠, 📊, or custom logo)

### Generation Tools

**Option 1: Online Generator**
- https://www.pwabuilder.com/imageGenerator
- Upload 512x512 source image
- Download full icon set

**Option 2: Manual (Figma/Photoshop)**
1. Create 512x512 artboard
2. Design icon with 10% padding
3. Export all required sizes
4. Optimize with https://tinypng.com/

**Option 3: Command Line (ImageMagick)**
```bash
# Convert single source to all sizes
convert icon-512x512.png -resize 192x192 icon-192x192.png
convert icon-512x512.png -resize 144x144 icon-144x144.png
# etc.
```

---

## Updating PWA Version

When making app changes:

### 1. Update Version Number
**In `manifest.json`:**
```json
{
  "version": "1.1.0"
}
```

**In `service-worker.js`:**
```javascript
const CACHE_VERSION = 'property-investment-v1.1.0';
```

### 2. Service Worker Auto-Update
The service worker checks for updates every minute (see `index.html` line 1337).

When a new version is detected:
1. New service worker installs in background
2. Becomes active on next page load
3. Old caches are automatically deleted

### 3. Force Update (Development)
In browser DevTools → Application → Service Workers:
- Click "Update" to fetch new service worker immediately
- Or check "Update on reload"

---

## Offline Functionality

### What Works Offline
- ✅ View Stage 1 calculator (already loaded)
- ✅ All saved data in localStorage
- ✅ App UI and interactions
- ✅ Cached pages and assets

### What Doesn't Work Offline
- ❌ Fresh page loads (if not cached)
- ❌ External API calls (future stages)
- ❌ New images/resources not yet cached

### Future Enhancement: Background Sync
When network returns, can sync:
- Suburb data (Stage 2)
- Portfolio updates (Stage 6)
- Analytics/usage data

Code stub exists in `service-worker.js` lines 147-152.

---

## App Store Preparation

### Next Steps for App Store Release

#### 1. Complete PWA Foundation (CURRENT)
- ✅ Manifest created
- ✅ Service worker implemented
- ✅ Install prompt added
- ❌ Generate icon set (REQUIRED)
- ❌ Create screenshots for manifest

#### 2. Choose Wrapper Framework
**Recommended: Capacitor** (by Ionic team)
- Modern, actively maintained
- Excellent PWA support
- No code changes needed
- CLI-based workflow

**Alternative: Cordova**
- Mature, stable
- Large plugin ecosystem
- More configuration required

**Alternative: TWA (Trusted Web Activity)**
- Android-only
- Simplest approach
- Just wraps existing PWA
- No iOS support

#### 3. Build Native Wrappers
See `07-RELEASE-PROCESS.md` for detailed steps.

---

## Troubleshooting

### Service Worker Not Registering
**Symptoms:** Console error "Failed to register service worker"

**Solutions:**
- ✅ Ensure serving via HTTPS or localhost
- ✅ Check `service-worker.js` has no syntax errors
- ✅ Verify path is `/service-worker.js` (root, not `/js/`)
- ✅ Clear browser cache and hard reload (Ctrl+Shift+R)

### Install Prompt Not Showing
**Symptoms:** No install banner appears

**Causes:**
1. Already installed (check chrome://apps)
2. User previously dismissed (check localStorage for `pwa-install-prompt-shown`)
3. Browser doesn't support (use Chrome/Edge)
4. PWA criteria not met (run Lighthouse audit)

**Test:**
```javascript
// In browser console
localStorage.removeItem('pwa-install-prompt-shown');
// Reload page
```

### Icons Not Loading (404 errors)
**Expected:** Icons don't exist yet

**Impact:** PWA still installable, just uses default browser icon

**Fix:** Generate icon set (see "Icon Generation" above)

### Offline Mode Not Working
**Check:**
1. Service worker registered? (DevTools → Application → Service Workers)
2. Assets cached? (DevTools → Application → Cache Storage)
3. Try "Offline" mode in DevTools Network tab

---

## Resources

### Documentation
- [MDN: Progressive Web Apps](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps)
- [web.dev: PWA](https://web.dev/progressive-web-apps/)
- [PWA Builder](https://www.pwabuilder.com/)

### Tools
- [Lighthouse](https://developers.google.com/web/tools/lighthouse) (PWA auditing)
- [Manifest Generator](https://www.simicart.com/manifest-generator.html/)
- [Icon Generator](https://www.pwabuilder.com/imageGenerator)

### Testing
- [Can I Use: Service Workers](https://caniuse.com/serviceworkers)
- [PWA Testing Checklist](https://web.dev/pwa-checklist/)

---

## Current Status

**PWA Readiness:** 80% Complete

✅ **Complete:**
- Manifest configuration
- Service worker with caching
- Install prompt UI
- Offline-first architecture
- Version management system

❌ **Pending:**
- Icon set generation (BLOCKER for app stores)
- Screenshot creation
- App store submission workflow (see `07-RELEASE-PROCESS.md`)
- Privacy policy & terms (required for stores)

**Next Action:** Generate icon set and update manifest paths.
