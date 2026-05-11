# App Store Release Process

## Overview
This document outlines the complete process for releasing the Property Investment App to the **Apple App Store** and **Google Play Store** using the Capacitor wrapper framework.

---

## Pre-Release Checklist

### Development Complete
- [ ] All planned stages implemented and tested
- [ ] No console errors in production mode
- [ ] All test cases from `03-STAGE-DEFINITIONS.md` passing
- [ ] Mobile responsive (tested at 375px, 768px, 1024px)
- [ ] localStorage working correctly
- [ ] PWA installable and tested

### Assets Prepared
- [ ] App icons generated (all sizes from 72x72 to 512x512)
- [ ] Screenshots created (phone + tablet, both portrait and landscape)
- [ ] App Store preview video (optional but recommended)
- [ ] Marketing materials (description, keywords, promo text)

### Legal & Compliance
- [ ] Privacy Policy created (see template below)
- [ ] Terms of Service created
- [ ] About/Help section in app
- [ ] Contact information/support email
- [ ] Copyright notices

### Accounts Setup
- [ ] Apple Developer Account ($99/year USD)
- [ ] Google Play Developer Account ($25 one-time USD)
- [ ] Payment/tax information submitted

---

## Version Management

### Semantic Versioning
Use **MAJOR.MINOR.PATCH** format:

```
1.0.0 - Initial release
1.0.1 - Bug fixes
1.1.0 - New features (Stage 2 added)
2.0.0 - Breaking changes (architecture overhaul)
```

### Where to Update Version

**1. `manifest.json`**
```json
{
  "version": "1.0.0"
}
```

**2. `service-worker.js`**
```javascript
const CACHE_VERSION = 'property-investment-v1.0.0';
```

**3. Capacitor `capacitor.config.json`** (when created)
```json
{
  "appId": "com.yourdomain.propertyinvestor",
  "appName": "Property Investor",
  "version": "1.0.0",
  "versionCode": 1  // Android only, increment with each release
}
```

**4. iOS `Info.plist`** (auto-generated from Capacitor config)
- `CFBundleShortVersionString` = 1.0.0
- `CFBundleVersion` = 1

**5. Android `build.gradle`** (auto-generated from Capacitor config)
- `versionName` = "1.0.0"
- `versionCode` = 1

---

## Setup: Installing Capacitor

### Step 1: Install Node.js (Required)
Even though app is pure HTML/CSS/JS, Capacitor build tools need Node.

Download from: https://nodejs.org/ (LTS version)

Verify:
```bash
node --version  # Should show v18+ or v20+
npm --version   # Should show v9+ or v10+
```

### Step 2: Initialize Capacitor in Project

**From project root:**
```bash
# Install Capacitor CLI globally
npm install -g @capacitor/cli

# Initialize Capacitor in project
npm init -y  # Creates package.json
npm install @capacitor/core @capacitor/cli

# Create Capacitor config
npx cap init "Property Investor" "com.yourdomain.propertyinvestor" --web-dir .
```

**When prompted:**
- App name: `Property Investor`
- App ID: `com.yourdomain.propertyinvestor` (reverse domain notation, choose unique)
- Web directory: `.` (current directory, since index.html is at root)

**This creates:**
- `capacitor.config.json` - Main config file
- `package.json` - Node dependencies

### Step 3: Add iOS and Android Platforms

```bash
# Add iOS (requires macOS)
npm install @capacitor/ios
npx cap add ios

# Add Android
npm install @capacitor/android
npx cap add android
```

**This creates:**
- `ios/` folder - Xcode project
- `android/` folder - Android Studio project

---

## Building for iOS (Apple App Store)

### Prerequisites
- **macOS required** (cannot build iOS apps on Windows)
- **Xcode** installed (free from Mac App Store)
- **Apple Developer Account** ($99/year)
- **Code signing certificate** (generated in Xcode)

### Step 1: Sync Web App to iOS Project

```bash
# Copy web assets to iOS project
npx cap sync ios

# Open in Xcode
npx cap open ios
```

### Step 2: Configure in Xcode

**General Tab:**
1. Select the app target (Property Investor)
2. Set **Display Name**: "Property Investor"
3. Set **Bundle Identifier**: `com.yourdomain.propertyinvestor`
4. Set **Version**: 1.0.0
5. Set **Build**: 1
6. Select **Team**: Your Apple Developer team
7. **Deployment Target**: iOS 13.0 or later

**Signing & Capabilities:**
1. Enable **Automatically manage signing**
2. Select your team
3. Xcode will create provisioning profile

**App Icons & Launch Screen:**
1. Click **App Icon** → Add all icon sizes
2. Customize **LaunchScreen.storyboard** (optional)

### Step 3: Test on Simulator

1. Select simulator (e.g., "iPhone 15 Pro")
2. Click ▶️ Run
3. App launches in simulator
4. Test all functionality

### Step 4: Build for App Store

**Archive the app:**
1. Select "Any iOS Device (arm64)" as destination
2. Product → Archive
3. Wait for archive to complete
4. Organizer window opens

**Upload to App Store Connect:**
1. Click "Distribute App"
2. Select "App Store Connect"
3. Click "Upload"
4. Sign with your Apple ID
5. Wait for upload (5-15 minutes)

### Step 5: Submit in App Store Connect

1. Go to https://appstoreconnect.apple.com/
2. My Apps → ➕ New App
3. Fill in:
   - **Platform**: iOS
   - **Name**: Property Investment App
   - **Primary Language**: English (Australia)
   - **Bundle ID**: com.yourdomain.propertyinvestor
   - **SKU**: propertyinvestor001
4. App Information:
   - Category: Finance
   - Subtitle: Australian Property Investment Tool
   - Privacy Policy URL: (required)
5. Pricing: Free or Paid
6. Build: Select uploaded build
7. Screenshots: Add iPhone + iPad screenshots
8. Description: (see template below)
9. Keywords: property, investment, australia, calculator, portfolio
10. Click "Submit for Review"

**Review time:** 1-3 days typically

---

## Building for Android (Google Play Store)

### Prerequisites
- **Android Studio** installed (works on Windows, Mac, Linux)
- **Java JDK** 11 or 17
- **Google Play Developer Account** ($25 one-time)

### Step 1: Sync Web App to Android Project

```bash
# Copy web assets to Android project
npx cap sync android

# Open in Android Studio
npx cap open android
```

### Step 2: Configure in Android Studio

**File → Project Structure:**
1. **Compile SDK**: 34 (Android 14)
2. **Min SDK**: 22 (Android 5.1) - 95% device coverage
3. **Target SDK**: 34

**app/build.gradle:**
```gradle
android {
    namespace "com.yourdomain.propertyinvestor"
    compileSdk 34

    defaultConfig {
        applicationId "com.yourdomain.propertyinvestor"
        minSdk 22
        targetSdk 34
        versionCode 1
        versionName "1.0.0"
    }
}
```

**res/values/strings.xml:**
```xml
<string name="app_name">Property Investor</string>
```

**App Icon:**
1. Right-click `res` → New → Image Asset
2. Upload 512x512 icon
3. Generate all sizes

### Step 3: Test on Emulator/Device

1. Create Android Virtual Device (AVD) or connect physical device
2. Click ▶️ Run
3. Test all functionality

### Step 4: Generate Signed APK/AAB

**Create signing key (first time only):**
```bash
# In android/ folder
keytool -genkey -v -keystore property-investor.keystore -alias propertyinvestor -keyalg RSA -keysize 2048 -validity 10000

# Save the password securely!
```

**Build → Generate Signed Bundle/APK:**
1. Select "Android App Bundle" (AAB) for Play Store
2. Create new keystore or use existing
3. Fill in key details
4. Select "release" build variant
5. Click Finish

**Output:** `android/app/release/app-release.aab`

### Step 5: Upload to Google Play Console

1. Go to https://play.google.com/console/
2. Create App → Select "App" (not game)
3. Fill in:
   - **App name**: Property Investment App
   - **Default language**: English (Australia)
   - **App/Game**: App
   - **Free/Paid**: Free
4. Dashboard → Testing → Internal testing (or Production)
5. Create new release → Upload AAB
6. Add release notes
7. Save → Review release → Start rollout

**Store Listing:**
- Short description (80 chars)
- Full description (4000 chars)
- Screenshots (min 2, recommend 8)
- Feature graphic (1024x500)
- App icon (512x512)
- Privacy Policy URL
- Category: Finance

**Review time:** Hours to 1 day typically

---

## Update Process (After Initial Release)

### Step 1: Make Changes
- Implement new features/bug fixes
- Update version numbers (see "Version Management" above)
- Test thoroughly

### Step 2: Rebuild

**iOS:**
```bash
npx cap sync ios
npx cap open ios
# Archive and upload as before
```

**Android:**
```bash
npx cap sync android
npx cap open android
# Generate new signed AAB with incremented versionCode
```

### Step 3: Submit Update

**iOS:**
- Create new version in App Store Connect
- Upload new build
- Add "What's New" notes
- Submit for review

**Android:**
- Create new release in Google Play Console
- Upload new AAB
- Add release notes
- Start rollout (can do staged 5% → 25% → 100%)

---

## Marketing Assets

### App Description Template

**Short (80 characters):**
```
Calculate investment capacity, compare suburbs, manage your property portfolio
```

**Full (4000 characters):**
```
AUSTRALIAN PROPERTY INVESTMENT MADE SIMPLE

Property Investment App is your complete toolkit for building wealth through Australian property investment. From first-time investors to experienced portfolio managers, our app guides you through every stage of the investment journey.

✅ STAGE 1: FINANCIAL FOUNDATION
• Calculate your borrowing capacity using Australian lending criteria
• Discover usable equity in your current property
• Factor in cash savings for deposit planning
• Estimate LMI (Lender's Mortgage Insurance) costs
• Choose investment strategy: growth, cashflow, or balanced

✅ STAGE 2: MARKET RESEARCH (Coming in v1.1)
• Compare suburbs side-by-side with key metrics
• Analyze rental yields, capital growth, vacancy rates
• Custom scoring based on your investment strategy
• Save and track your suburb shortlist

✅ STAGE 6: PORTFOLIO DASHBOARD (Coming in v1.2)
• Track all your investment properties in one place
• Monitor equity growth and refinancing opportunities
• Calculate cashflow across your entire portfolio
• Plan your next investment move

FEATURES:
📱 Mobile-first design - works perfectly on any device
💾 All your data stored locally - complete privacy
🔒 No account required - get started immediately
🇦🇺 Built specifically for Australian investors
📊 Real-time calculations with detailed breakdowns
✨ Clean, professional interface - no clutter

PERFECT FOR:
• First-time property investors researching their first purchase
• Homeowners wanting to leverage equity for investment
• Portfolio investors tracking multiple properties
• Mortgage brokers running client scenarios
• Anyone serious about building wealth through property

PRIVACY & SECURITY:
Your financial data never leaves your device. Everything is stored locally using your browser's secure storage. No cloud sync, no tracking, complete privacy.

FREE TO USE:
Full functionality at no cost. No ads, no subscriptions, no hidden fees.

AUSTRALIAN-FOCUSED:
Calculations use Australian lending criteria, LMI structures, and market conventions. Built for Aussie investors by Aussie property enthusiasts.

Download now and take control of your property investment journey!

Questions or feedback? Contact: support@yourapp.com
```

### Screenshots Needed

**iPhone (6.7" Display - iPhone 15 Pro Max):**
1. Stage 1 form with inputs filled
2. Summary card showing results
3. Investment strategy selection
4. (Stage 2 when ready)
5. (Stage 6 when ready)

**iPad (12.9" Display - iPad Pro):**
1. Full stage 1 view (landscape)
2. Summary dashboard (landscape)

**Android Phone:**
1-5. Same as iPhone

**Android Tablet:**
1-2. Same as iPad

**Tips:**
- Use real-looking data (not 0s or 123456)
- Show success states (green indicators)
- Ensure text is readable
- Use device frames (mockuphone.com)

---

## Privacy Policy Template

**Required for both stores.** Host at `/privacy-policy.html` or external site.

```markdown
# Privacy Policy - Property Investment App

**Last Updated:** [Date]

## Overview
Property Investment App ("the App") is committed to protecting your privacy. This policy explains how we handle your information.

## Data Collection
The App does NOT collect, transmit, or store any personal or financial data on external servers.

## Local Storage
All data you enter (property values, income figures, investment calculations) is stored locally on your device using browser localStorage technology. This data:
- Never leaves your device
- Is not transmitted to any server
- Is not accessible to us or any third party
- Can be cleared at any time by you

## Analytics
The App does not use analytics, tracking pixels, or any telemetry. We do not monitor your usage.

## Third-Party Services
The App does not integrate with any third-party services, APIs, or advertising networks.

## Children's Privacy
The App does not knowingly collect information from children under 13.

## Changes to Policy
We may update this policy. Changes will be posted in the App and on this page.

## Contact
Questions? Email: support@yourapp.com

## Your Rights
You can delete all app data by:
- iOS: Settings → General → iPhone Storage → Property Investor → Delete App
- Android: Settings → Apps → Property Investor → Clear Data
```

---

## Post-Release Monitoring

### Key Metrics to Track

**App Store Connect (iOS):**
- Downloads/installations
- Crashes (should be 0%)
- User reviews and ratings
- Search rankings for keywords

**Google Play Console (Android):**
- Installations
- Uninstalls
- Crashes and ANRs (App Not Responding)
- User reviews and ratings

### Responding to Issues

**Critical Bugs:**
1. Reproduce the issue
2. Fix immediately
3. Release hotfix within 24-48 hours
4. Notify affected users via update notes

**Feature Requests:**
1. Log in GitHub Issues or Trello
2. Evaluate against roadmap
3. Prioritize in next version
4. Communicate timeline in review responses

**Negative Reviews:**
1. Respond professionally within 24 hours
2. Ask for more details if needed
3. Promise fix in next update if valid issue
4. Update when fixed

---

## Maintenance Schedule

### Regular Updates
- **Bug fixes:** As needed (hotfix releases)
- **New stages:** Per master plan (v1.1, v1.2, etc.)
- **Security updates:** Immediately if discovered
- **OS compatibility:** When new iOS/Android versions release

### Suggested Release Cadence
- **v1.0**: Initial release (Stage 1 only)
- **v1.1**: +2 months (Stage 2 added)
- **v1.2**: +2 months (Stage 6 basic added)
- **v1.3**: +1 month (Bug fixes, polish)
- **v2.0**: +3 months (Stages 3-5 added)

---

## Troubleshooting Common Issues

### Capacitor Build Fails

**Error:** "Could not find or load main class"
**Fix:** Ensure Java JDK 11 or 17 installed

**Error:** "Platform not found"
**Fix:**
```bash
npx cap sync ios
npx cap sync android
```

**Error:** Service worker not working in app
**Fix:** Service workers work in Capacitor - check `capacitor.config.json`:
```json
{
  "server": {
    "allowNavigation": ["*"],
    "androidScheme": "https"
  }
}
```

### App Rejected by Apple

**Common reasons:**
1. Missing privacy policy
2. Crashes on reviewer's device
3. Incomplete app information
4. Misleading screenshots

**Response:** Fix issue, reply to rejection explaining changes, resubmit

### App Suspended on Google Play

**Common reasons:**
1. Policy violation
2. Malware detection (false positive)
3. Intellectual property claim

**Response:** Appeal immediately with explanation

---

## Continuous Improvement Workflow

### Monthly Review
1. Check analytics (downloads, engagement)
2. Read all user reviews
3. Identify top 3 pain points
4. Plan fixes for next release

### Quarterly Planning
1. Review master plan progress
2. Adjust timeline based on feedback
3. Scope next major version
4. Update roadmap in docs

### Annual Assessment
1. Full app audit (performance, design, UX)
2. Review against competition
3. Plan major improvements (v2.0, v3.0)
4. Consider platform-specific features

---

## Current Status

**Release Readiness:** 40% Complete

✅ **Complete:**
- PWA foundation
- Core functionality (Stage 1)
- Version management system
- Release documentation

❌ **Blocking Tasks for v1.0 Release:**
1. Generate full icon set (72x72 to 512x512)
2. Create privacy policy page
3. Create app store screenshots
4. Set up developer accounts (Apple + Google)
5. Install and configure Capacitor
6. Build and test iOS/Android apps
7. Submit to both stores

**Estimated Time to First Release:**
- With existing accounts: 1-2 weeks
- Without accounts: 3-4 weeks (includes approval wait)

**Next Actions:**
1. Generate icons
2. Create privacy policy
3. Set up Capacitor
4. Test builds locally
