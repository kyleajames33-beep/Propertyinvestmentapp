# Sprint 7.0: Code Restructure Guide

**Status:** 📋 PLANNED (PREREQUISITE for Sprint 7.1-7.4)
**Priority:** CRITICAL
**Estimated Time:** 2-3 hours
**Current File Size:** 4,370 lines in single index.html

---

## Why This Is Critical

The current single-file approach (4,370 lines in index.html) is causing:
1. **Performance issues** - Browser must parse entire file on every load
2. **Slow calculations** - No code optimization possible with monolith
3. **Maintenance nightmare** - Hard to find code, test changes, or review
4. **Blocking Sprint 7.1-7.4** - Can't work on separate features in parallel

**This was always the plan:** See [00-PROJECT-OVERVIEW.md:50-52](file:///C:/Users/kygs/property-investment-app/_docs/00-PROJECT-OVERVIEW.md#L50-L52) - original docs said to split after Stage 2.

---

## Target File Structure

```
property-investment-app/
├── index.html                    (~100-150 lines - lightweight shell)
├── css/
│   ├── main.css                  (~200 lines: variables, resets, base styles)
│   ├── components.css            (~300 lines: buttons, cards, forms, nav)
│   └── stages.css                (~800 lines: stage-specific layouts)
├── js/
│   ├── app.js                    (~200 lines: navigation, PWA, init)
│   ├── utils.js                  (~150 lines: debounce, formatters, storage)
│   └── stages/
│       ├── stage1.js             (~400 lines: financial calculations)
│       ├── stage2.js             (~500 lines: suburb comparison)
│       ├── stage3.js             (~350 lines: location intelligence)
│       ├── stage4.js             (~300 lines: professional network)
│       ├── stage5.js             (~350 lines: acquisition tracker)
│       └── stage6.js             (~300 lines: portfolio dashboard)
├── manifest.json                 (existing - no changes)
├── service-worker.js             (update cache list with new files)
├── privacy.html                  (existing - no changes)
├── icon-generator.html           (existing - no changes)
├── screenshot-guide.html         (existing - no changes)
└── _docs/                        (existing - no changes)
```

**Total lines after restructure:** ~4,400 lines (slightly more due to module patterns, but organized)

---

## Step-by-Step Implementation

### Phase 1: Create Folder Structure (5 min)

```bash
mkdir css
mkdir js
mkdir js/stages
```

### Phase 2: Extract CSS (30 min)

**2.1 Create `css/main.css`**
- Extract everything from `<style>` tag in index.html lines ~17-600
- Include: CSS variables, resets, base body styles
- Content: `:root {}`, `* {}`, `body {}`, utility classes

**2.2 Create `css/components.css`**
- Extract: buttons, cards, forms, inputs, navigation, badges
- Search for: `.btn`, `.card`, `.form-group`, `.badge`, `.stage-nav-btn`

**2.3 Create `css/stages.css`**
- Extract: stage-specific styles
- Search for: `#stage1Section`, `#stage2Section`, etc.
- Include: stage headers, layouts, grids

**2.4 Update index.html**
Replace `<style>` tag with:
```html
<link rel="stylesheet" href="/css/main.css">
<link rel="stylesheet" href="/css/components.css">
<link rel="stylesheet" href="/css/stages.css">
```

---

### Phase 3: Extract JavaScript Utilities (30 min)

**3.1 Create `js/utils.js`**

Extract and organize:
```javascript
// Debounce function (will be used in Sprint 7.1)
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Number formatters
function formatCurrency(value) {
  return '$' + parseInt(value).toLocaleString('en-AU');
}

function formatPercent(value) {
  return parseFloat(value).toFixed(2) + '%';
}

// localStorage helpers
function saveToStorage(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
    return true;
  } catch (e) {
    console.error('Storage error:', e);
    return false;
  }
}

function loadFromStorage(key) {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  } catch (e) {
    console.error('Storage error:', e);
    return null;
  }
}
```

---

### Phase 4: Extract Stage JavaScript (60 min)

**4.1 Create `js/stages/stage1.js`**

Extract from index.html (search for Stage 1 related code):
- `STORAGE_KEY_STAGE1` constant
- `loadStage1Data()` function
- `saveStage1Data()` function
- `calculateResults()` function
- `calculateBorrowingCapacity()` function
- `calculateLMI()` function
- All Stage 1 event listeners

Wrap in module pattern:
```javascript
// Stage 1: Financial Foundation
(function() {
  const STORAGE_KEY_STAGE1 = 'investmentApp_stage1';

  function loadStage1Data() {
    // ... existing code
  }

  function saveStage1Data() {
    // ... existing code
  }

  // ... all other Stage 1 functions

  // Initialize on load
  window.initStage1 = function() {
    loadStage1Data();
    // Attach event listeners
    document.getElementById('propertyValue')?.addEventListener('input', calculateResults);
    // ... all other listeners
  };
})();
```

**4.2 Repeat for stage2.js through stage6.js**

Each stage file should:
- Use IIFE (Immediately Invoked Function Expression) to avoid global scope pollution
- Expose only `initStageX()` function to global scope
- Include all stage-specific code (constants, functions, listeners)

---

### Phase 5: Create Main App File (30 min)

**5.1 Create `js/app.js`**

```javascript
// Main App Initialization
(function() {

  // Stage navigation
  function switchToStage(stageNumber) {
    // Hide all stages
    document.getElementById('stage1Section').style.display = 'none';
    document.getElementById('stage2Section').style.display = 'none';
    document.getElementById('stage3Section').style.display = 'none';
    document.getElementById('stage4Section').style.display = 'none';
    document.getElementById('stage5Section').style.display = 'none';
    document.getElementById('stage6Section').style.display = 'none';

    // Remove active class from all nav buttons
    document.querySelectorAll('.stage-nav-btn').forEach(btn => {
      btn.classList.remove('active');
    });

    // Show selected stage and initialize
    if (stageNumber === 1) {
      document.getElementById('stage1Section').style.display = 'block';
      document.getElementById('navStage1').classList.add('active');
      if (window.initStage1) window.initStage1();
    } else if (stageNumber === 2) {
      document.getElementById('stage2Section').style.display = 'block';
      document.getElementById('navStage2').classList.add('active');
      if (window.initStage2) window.initStage2();
    }
    // ... repeat for stages 3-6
  }

  // PWA Install Prompt
  let deferredPrompt;
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    document.getElementById('installBanner').style.display = 'flex';
  });

  document.getElementById('installBtn')?.addEventListener('click', async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      deferredPrompt = null;
      document.getElementById('installBanner').style.display = 'none';
    }
  });

  document.getElementById('dismissInstall')?.addEventListener('click', () => {
    document.getElementById('installBanner').style.display = 'none';
  });

  // Service Worker Registration
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/service-worker.js')
      .then(reg => console.log('Service Worker registered'))
      .catch(err => console.error('Service Worker registration failed:', err));
  }

  // Initialize app on load
  document.addEventListener('DOMContentLoaded', function() {
    // Attach navigation listeners
    document.getElementById('navStage1')?.addEventListener('click', () => switchToStage(1));
    document.getElementById('navStage2')?.addEventListener('click', () => switchToStage(2));
    document.getElementById('navStage3')?.addEventListener('click', () => switchToStage(3));
    document.getElementById('navStage4')?.addEventListener('click', () => switchToStage(4));
    document.getElementById('navStage5')?.addEventListener('click', () => switchToStage(5));
    document.getElementById('navStage6')?.addEventListener('click', () => switchToStage(6));

    // Initialize Stage 1 by default
    switchToStage(1);
  });

})();
```

---

### Phase 6: Update index.html Shell (20 min)

**6.1 Keep in index.html:**
- `<!DOCTYPE html>` and `<head>` section (meta tags, title, PWA links)
- All HTML structure (keep all the `<div>` elements, forms, cards, etc.)
- PWA install banner HTML
- Footer HTML

**6.2 Remove from index.html:**
- Entire `<style>` tag (replaced with CSS links)
- Entire `<script>` tag (replaced with JS file links)

**6.3 Add before `</body>`:**
```html
<!-- Utility Functions -->
<script src="/js/utils.js"></script>

<!-- Stage Scripts -->
<script src="/js/stages/stage1.js"></script>
<script src="/js/stages/stage2.js"></script>
<script src="/js/stages/stage3.js"></script>
<script src="/js/stages/stage4.js"></script>
<script src="/js/stages/stage5.js"></script>
<script src="/js/stages/stage6.js"></script>

<!-- Main App -->
<script src="/js/app.js"></script>
```

**Order matters!** utils.js → stage files → app.js (app.js calls stage init functions)

---

### Phase 7: Update Service Worker (10 min)

**7.1 Update `service-worker.js`**

Change cache list from:
```javascript
const CACHE_NAME = 'property-investment-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/privacy.html',
  // icons...
];
```

To:
```javascript
const CACHE_NAME = 'property-investment-v2'; // Increment version
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/privacy.html',
  '/css/main.css',
  '/css/components.css',
  '/css/stages.css',
  '/js/utils.js',
  '/js/app.js',
  '/js/stages/stage1.js',
  '/js/stages/stage2.js',
  '/js/stages/stage3.js',
  '/js/stages/stage4.js',
  '/js/stages/stage5.js',
  '/js/stages/stage6.js',
  // icons...
];
```

---

### Phase 8: Testing (30 min)

**8.1 Functional Testing**
- [ ] Open index.html in browser
- [ ] Check browser console for errors (should be zero)
- [ ] Test Stage 1: Enter data, verify calculations work
- [ ] Test navigation: Click all 6 stage buttons, verify switching works
- [ ] Test Stage 2: Add suburb, verify card/table toggle works
- [ ] Test Stage 3: Select amenities, verify scoring works
- [ ] Test Stage 4: Add contact, verify CRUD operations
- [ ] Test Stage 5: Enter dates, check documents/payments
- [ ] Test Stage 6: Add property, verify calculations

**8.2 Persistence Testing**
- [ ] Enter data in Stage 1, refresh page, verify data persists
- [ ] Add suburbs in Stage 2, refresh, verify suburbs still there
- [ ] Test all stages for localStorage persistence

**8.3 PWA Testing**
- [ ] Verify service worker registers (check DevTools > Application > Service Workers)
- [ ] Test offline: Disconnect network, reload page, should still work
- [ ] Test install prompt appears (Chrome: check for install icon in address bar)

**8.4 Performance Testing**
- [ ] Open DevTools > Performance tab
- [ ] Record page load
- [ ] Verify initial load is faster than before
- [ ] Check "Coverage" tab - should see code splitting benefits

---

## Acceptance Criteria

Before marking Sprint 7.0 complete, verify:

- ✅ All 6 stages function identically to before restructure
- ✅ Zero console errors
- ✅ All localStorage data persists correctly across page refreshes
- ✅ Stage navigation works (all 6 stages accessible)
- ✅ PWA install prompt still appears
- ✅ Service worker caches all new files
- ✅ App works offline
- ✅ Initial page load is faster (measure with DevTools)
- ✅ Code is organized and easy to find
- ✅ File structure matches specification above

---

## Benefits After Completion

1. **Immediate Performance Boost**
   - Smaller initial HTML parse
   - Browser can optimize individual JS files
   - Better caching strategy

2. **Enables Sprint 7.1-7.4**
   - Multiple AIs can work on different stage files simultaneously
   - Partner income changes only touch `stage1.js`
   - UI/UX changes can be made in `components.css` without touching stage logic

3. **Future-Proof**
   - Industry-standard structure
   - Easy to add lazy-loading later (only load stage JS when needed)
   - Capacitor build tools work better with organized files
   - Can add build tools (Vite, Webpack) later if needed

4. **Maintainability**
   - Easy to find specific code (stage3.js for location features)
   - Easier to review changes (git diff on specific files)
   - Better separation of concerns

---

## Common Pitfalls to Avoid

❌ **Don't change functionality** - This is pure refactoring, behavior must stay identical
❌ **Don't skip testing** - Each stage must be tested after restructure
❌ **Don't forget service worker** - Users will get stale cached version if not updated
❌ **Don't break script order** - utils.js must load before stages, stages before app.js
❌ **Don't lose comments** - Preserve all code comments during extraction

---

## Next Steps After Sprint 7.0

Once code restructure is complete and tested:

1. **Sprint 7.1: Performance Optimization** - Add debouncing (now easier with utils.js)
2. **Sprint 7.2: Partner Income** - Modify only `js/stages/stage1.js`
3. **Sprint 7.3: Detailed Expenses** - Modify only `js/stages/stage1.js` and `css/components.css`
4. **Sprint 7.4: UI/UX Redesign** - Modify CSS files and `css/components.css` primarily

All of these can now be worked on in parallel by different AIs!

---

## Rollback Plan

If restructure causes issues:

1. Keep backup of original index.html (copy to `index.backup.html` before starting)
2. If critical bugs found, can quickly restore original
3. Git commit after each phase for granular rollback options
