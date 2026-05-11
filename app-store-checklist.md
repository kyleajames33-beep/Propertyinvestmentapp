# App Store Submission Checklist
**Property Investment App v1.1 Release**

Last Updated: 2025-11-16

---

## 📋 Pre-Submission Requirements

### ✅ App Development Status

- [x] Stage 1: Financial Foundation - Complete
- [x] Stage 2: Suburb Comparison - Complete
- [x] PWA manifest configuration - Complete
- [x] Service worker with offline caching - Complete
- [x] Install prompt UI - Complete
- [x] Mobile responsive design (375px+) - Complete
- [x] All features tested and working - Complete

### ❌ Critical Blockers (REQUIRED BEFORE SUBMISSION)

- [ ] **Icon Generation** - MANDATORY
  - [ ] Generate all 8 icon sizes (72x72 to 512x512)
  - [ ] Place icons in `/icons/` folder
  - [ ] Test icons appear correctly in PWA install
  - 📝 Use: `icon-generator.html` for guidance

- [ ] **Privacy Policy** - MANDATORY
  - [x] Privacy policy page created (`privacy.html`)
  - [x] Privacy policy linked in app footer
  - [ ] Update contact information in privacy policy (Section 10)
  - [ ] Review and customize privacy policy as needed

- [ ] **Screenshots** - MANDATORY
  - [ ] Capture 3-5 iOS screenshots (1290 × 2796 px)
  - [ ] Capture 2-4 Android screenshots (1080 × 1920 px)
  - [ ] Save in `/screenshots/ios/` and `/screenshots/android/`
  - 📝 Use: `screenshot-guide.html` for instructions

---

## 📱 iOS App Store Submission

### 1. Prerequisites

- [ ] Apple Developer account ($99/year)
- [ ] Xcode installed (Mac required)
- [ ] Valid Apple ID with 2FA enabled
- [ ] Certificates & provisioning profiles set up

### 2. Capacitor Setup

```bash
# Install Capacitor
npm install @capacitor/core @capacitor/cli
npm install @capacitor/ios

# Initialize Capacitor
npx cap init "Property Investment App" "com.yourname.propertyinvestor"

# Add iOS platform
npx cap add ios

# Copy web assets
npx cap copy ios

# Open in Xcode
npx cap open ios
```

### 3. Xcode Configuration

- [ ] Set app bundle identifier (e.g., `com.yourname.propertyinvestor`)
- [ ] Set deployment target (iOS 13.0 minimum recommended)
- [ ] Configure app icons in Assets.xcassets
- [ ] Add required permissions (if any) to Info.plist
- [ ] Set app display name
- [ ] Configure launch screen

### 4. App Store Connect Setup

- [ ] Log in to [App Store Connect](https://appstoreconnect.apple.com)
- [ ] Create new app listing
- [ ] Fill in app information:
  - [ ] App name (e.g., "Property Investment App")
  - [ ] Subtitle (e.g., "Australian Property Calculator")
  - [ ] Primary category: Finance
  - [ ] Secondary category: Business or Productivity
- [ ] Add app description (see template below)
- [ ] Add keywords (see suggestions below)
- [ ] Upload screenshots (3-5 required)
- [ ] Upload icon (1024x1024 required)
- [ ] Add support URL
- [ ] Add privacy policy URL

### 5. Build & Upload

- [ ] Archive app in Xcode (Product → Archive)
- [ ] Upload to App Store Connect
- [ ] Wait for processing (can take 10-30 minutes)
- [ ] Submit for review
- [ ] Answer App Review questions:
  - [ ] Uses encryption? **No** (unless adding HTTPS APIs later)
  - [ ] Content rights? **Yes** (your own content)
  - [ ] Advertising identifier? **No**

### 6. Review Process

- [ ] Typical review time: 1-3 days
- [ ] Monitor status in App Store Connect
- [ ] Respond to any rejection feedback promptly
- [ ] Once approved, release immediately or schedule

---

## 🤖 Google Play Store Submission

### 1. Prerequisites

- [ ] Google Play Developer account ($25 one-time fee)
- [ ] Android Studio installed
- [ ] Google account for console access

### 2. Capacitor Setup

```bash
# Add Android platform
npx cap add android

# Copy web assets
npx cap copy android

# Open in Android Studio
npx cap open android
```

### 3. Android Studio Configuration

- [ ] Set package name (e.g., `com.yourname.propertyinvestor`)
- [ ] Set app version code and version name
- [ ] Configure app icon in `res/mipmap/`
- [ ] Update `strings.xml` with app name
- [ ] Set minimum SDK version (API 22 / Android 5.1 recommended)
- [ ] Sign app with release keystore

### 4. Generate Signed APK/AAB

- [ ] Build → Generate Signed Bundle / APK
- [ ] Select Android App Bundle (AAB) - preferred by Google
- [ ] Create new keystore (or use existing)
- [ ] **IMPORTANT:** Backup keystore file securely
- [ ] Select release build variant
- [ ] Wait for build to complete

### 5. Google Play Console Setup

- [ ] Log in to [Google Play Console](https://play.google.com/console)
- [ ] Create new app
- [ ] Fill in app details:
  - [ ] App name
  - [ ] Short description (80 chars max)
  - [ ] Full description (4000 chars max)
  - [ ] Category: Finance
  - [ ] Tags: Finance, Property, Investment, Calculator
- [ ] Upload screenshots (2-8 required)
  - [ ] Phone: 1080 × 1920 minimum
  - [ ] Tablet (optional): 1920 × 1080
- [ ] Upload feature graphic (1024 × 500, required)
- [ ] Upload app icon (512 × 512, required)
- [ ] Add privacy policy URL
- [ ] Complete content rating questionnaire
- [ ] Set pricing (Free)
- [ ] Select countries for distribution (Australia + others)

### 6. Upload & Release

- [ ] Upload AAB file to Production track
- [ ] Set version name (e.g., "1.1")
- [ ] Add release notes (what's new)
- [ ] Review and publish
- [ ] Wait for review (typically faster than iOS, 1-3 days)

---

## 📝 App Store Listing Templates

### App Name
```
Property Investment App
```

### Subtitle (iOS only, 30 chars)
```
Australian Property Calculator
```

### Short Description (Google Play, 80 chars)
```
Calculate borrowing capacity, compare suburbs, and plan your property portfolio.
```

### Full Description

```
🏠 PROPERTY INVESTMENT APP

The essential tool for Australian property investors. Calculate your borrowing capacity, compare investment suburbs, and make informed property decisions.

✨ FEATURES

📊 Financial Foundation Calculator
• Calculate your maximum borrowing capacity
• See your usable equity from existing properties
• Get instant LMI estimates
• Choose your investment strategy (growth, cashflow, or balanced)
• All calculations stay private on your device

🏘️ Suburb Comparison Tool
• Compare up to 20 Australian suburbs side-by-side
• Smart scoring based on your investment strategy
• Track median prices, rental yields, capital growth, and vacancy rates
• Switch between card and table views
• Sort by score, price, or name

🔒 Privacy First
• All your data stays on your device - nothing sent to servers
• No account required
• No tracking or analytics
• Works completely offline after installation

🎯 Perfect For:
• First-time property investors
• Experienced portfolio builders
• Anyone researching Australian property markets
• Investors comparing suburbs and crunching numbers

💡 IMPORTANT
This app provides general information only and should not be considered financial advice. Always consult qualified financial professionals before making investment decisions.

📱 TECHNICAL
• Works on iPhone, iPad, and Android
• Offline-capable progressive web app
• Responsive design for all screen sizes
• Fast, lightweight, and easy to use
```

### Keywords (iOS, max 100 chars, comma-separated)
```
property,investment,calculator,borrowing,equity,suburb,compare,australia,LMI,rental,yield,growth
```

### Keywords (Google Play, up to 5 tags)
```
property investment
property calculator
australian property
suburb comparison
investment calculator
```

### What's New (Release Notes)
```
Version 1.1

🎉 Initial Release

✅ Financial Foundation Calculator
Calculate your borrowing capacity, usable equity, and estimated LMI based on your current financial position.

✅ Suburb Comparison Tool
Compare up to 20 suburbs with smart scoring that adapts to your investment strategy (growth, cashflow, or balanced).

✅ Privacy-First Design
All data stored locally on your device. No tracking, no accounts, works offline.

✅ Mobile Optimized
Fully responsive design works perfectly on phones, tablets, and desktops.

Thank you for using Property Investment App! Send feedback to [your-email@example.com]
```

### Support URL
```
[Your website or GitHub repo URL]
Example: https://github.com/yourusername/property-investment-app
```

### Privacy Policy URL
```
[Your hosted privacy policy URL]
Example: https://yourdomain.com/privacy.html
```

---

## 🎨 Required Graphics Checklist

### Icons
- [ ] 72x72 PNG
- [ ] 96x96 PNG
- [ ] 128x128 PNG
- [ ] 144x144 PNG
- [ ] 152x152 PNG
- [ ] 192x192 PNG
- [ ] 384x384 PNG
- [ ] 512x512 PNG
- [ ] 1024x1024 PNG (iOS App Store icon)

### iOS Screenshots (minimum 3 required)
- [ ] iPhone 15 Pro Max: 1290 × 2796 px (or 1284 × 2778)
- [ ] Recommended: 4-5 screenshots showing key features
- [ ] Format: PNG or JPEG

### Android Screenshots (minimum 2 required)
- [ ] Phone: 1080 × 1920 px (minimum)
- [ ] Recommended: 4-6 screenshots showing key features
- [ ] Format: PNG or JPEG
- [ ] Optional: Tablet screenshots (1920 × 1080)

### Google Play Feature Graphic (required)
- [ ] 1024 × 500 PNG or JPEG
- [ ] Shows app name and key benefit
- [ ] No device frames or text overlays

---

## 🛡️ Privacy & Compliance

### Privacy Policy Requirements
- [x] Privacy policy created and accessible
- [ ] Contact information updated in privacy policy
- [ ] Privacy policy URL provided to both stores
- [ ] Privacy policy hosted publicly (if required)

### Content Rating
- [ ] Complete IARC questionnaire (Google Play)
- [ ] Select appropriate age rating (iOS: 4+, Google: Everyone)
- [ ] Confirm no inappropriate content
- [ ] Confirm no gambling or real-money transactions

### Data Safety (Google Play)
- [ ] Declare data collection practices:
  - **Data collected:** None
  - **Data shared:** None
  - **Security practices:** Data encrypted on device
- [ ] Confirm no data leaves the device

---

## 🧪 Pre-Launch Testing

### Functional Testing
- [ ] Test Stage 1 calculations with various inputs
- [ ] Test Stage 2 suburb addition and deletion
- [ ] Test view toggles (cards/table)
- [ ] Test scoring algorithm with different strategies
- [ ] Test localStorage persistence (refresh page)
- [ ] Test offline functionality
- [ ] Test PWA install flow

### Device Testing
- [ ] Test on iPhone (latest iOS)
- [ ] Test on Android (latest version)
- [ ] Test on tablet (iPad or Android)
- [ ] Test at various screen sizes (375px, 768px, 1024px+)
- [ ] Test in portrait and landscape modes

### Browser Testing
- [ ] Safari (iOS)
- [ ] Chrome (Android)
- [ ] Chrome (Desktop)
- [ ] Edge (Desktop)
- [ ] Firefox (Desktop)

### Performance Testing
- [ ] App loads in under 3 seconds
- [ ] No console errors
- [ ] All buttons and inputs work
- [ ] No broken links
- [ ] Privacy policy loads correctly

---

## 📤 Submission Day Checklist

### Final Preparations
- [ ] All icons generated and in place
- [ ] All screenshots captured and organized
- [ ] Privacy policy reviewed and URLs updated
- [ ] App description and keywords finalized
- [ ] Release notes written
- [ ] Support email/URL ready
- [ ] Pricing set (Free)
- [ ] Distribution countries selected

### iOS Submission
- [ ] Xcode build successful
- [ ] App uploaded to App Store Connect
- [ ] All metadata entered
- [ ] Screenshots uploaded
- [ ] Privacy policy URL added
- [ ] Submitted for review
- [ ] Confirmation email received

### Android Submission
- [ ] Android Studio build successful
- [ ] Signed AAB generated and backed up
- [ ] Keystore backed up securely
- [ ] All metadata entered in Play Console
- [ ] Screenshots and graphics uploaded
- [ ] Content rating completed
- [ ] Data safety form completed
- [ ] Privacy policy URL added
- [ ] Submitted for review
- [ ] Confirmation email received

---

## 🎯 Post-Submission

### Monitoring
- [ ] Check App Store Connect daily for review status
- [ ] Check Google Play Console daily for review status
- [ ] Respond to any rejection feedback within 24 hours
- [ ] Monitor app reviews after launch
- [ ] Track download numbers

### If Rejected
- [ ] Read rejection reason carefully
- [ ] Make required changes
- [ ] Test changes thoroughly
- [ ] Resubmit with response notes
- [ ] Request clarification if rejection reason unclear

### After Approval
- [ ] Celebrate! 🎉
- [ ] Share app link on social media
- [ ] Ask friends/family to download and review
- [ ] Monitor user feedback
- [ ] Plan v1.2 features based on feedback

---

## 📞 Support Resources

### Documentation
- [Icon Generator](icon-generator.html)
- [Screenshot Guide](screenshot-guide.html)
- [Privacy Policy](privacy.html)
- [Release Process](_docs/07-RELEASE-PROCESS.md)
- [PWA Setup](_docs/06-PWA-SETUP.md)

### Official Store Documentation
- [Apple App Store Review Guidelines](https://developer.apple.com/app-store/review/guidelines/)
- [Google Play Developer Policy](https://play.google.com/about/developer-content-policy/)
- [Capacitor iOS Guide](https://capacitorjs.com/docs/ios)
- [Capacitor Android Guide](https://capacitorjs.com/docs/android)

### Common Issues & Solutions
- **Icons not showing:** Check file paths in manifest.json match actual files
- **PWA not installable:** Ensure HTTPS, valid manifest, and service worker registered
- **Screenshots wrong size:** Use exact pixel dimensions required by each store
- **Build errors:** Check Node version, clear cache, reinstall dependencies
- **Rejected for functionality:** Record video demo showing all features working

---

## ✅ Final Status

**Development:** ✅ Complete
**Icons:** ❌ Pending (use icon-generator.html)
**Privacy Policy:** ✅ Complete (update contact info)
**Screenshots:** ❌ Pending (use screenshot-guide.html)
**iOS Setup:** ⏳ Not Started
**Android Setup:** ⏳ Not Started

**Estimated Time to Release:** 6-10 hours (assuming icons/screenshots completed quickly)

---

**Good luck with your submission! 🚀**
