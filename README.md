# ðŸ  Property Investment App

**A privacy-first Australian property investment calculator and suburb comparison tool**

Version: 1.1 (Release Candidate)
Status: 85% Complete - Ready for App Store Submission

## ðŸš€ Quick Start

### Option 1: Live Server (Recommended - Zero Config!)

1. **Open in VS Code**
   ```bash
   cd property-investment-app
   code .
   ```

2. **Install Live Server Extension**
   - Open VS Code Extensions (Ctrl+Shift+X or Cmd+Shift+X)
   - Search for "Live Server" by Ritwick Dey
   - Click Install

3. **Run the App**
   - Right-click on `index.html`
   - Select "Open with Live Server"
   - Your browser will open automatically at `http://127.0.0.1:5500`
   - Any changes you make will auto-refresh!

### Option 2: Just Double-Click

- Simply double-click `index.html` to open it in your browser
- Works immediately, no setup needed

---

## ðŸ“ Project Structure

```
property-investment-app/
â”‚
â”œâ”€â”€ index.html                    # Main app (Stages 1-6 complete)
â”œâ”€â”€ manifest.json                 # PWA manifest
â”œâ”€â”€ service-worker.js             # Offline caching
â”œâ”€â”€ privacy.html                  # Privacy policy page
â”œâ”€â”€ README.md                     # This file
â”‚
â”œâ”€â”€ NEXT-STEPS.md                 # ðŸš€ Quick guide to app store release
â”œâ”€â”€ app-store-checklist.md        # Complete submission checklist
â”œâ”€â”€ icon-generator.html           # Icon generation tool
â”œâ”€â”€ screenshot-guide.html         # Screenshot capture guide
â”‚
â”œâ”€â”€ icons/                        # Icon PNG files (to be generated)
â”œâ”€â”€ screenshots/                  # App screenshots (to be captured)
â”‚   â”œâ”€â”€ ios/
â”‚   â””â”€â”€ android/
â”‚
â””â”€â”€ _docs/                        # Development Documentation
    â”œâ”€â”€ 00-PROJECT-OVERVIEW.md    # Project vision and AI rules
    â”œâ”€â”€ 01-MASTER-PLAN.md         # Complete development roadmap
    â”œâ”€â”€ 02-CURRENT-STATUS.md      # Current progress (85% complete)
    â”œâ”€â”€ 03-STAGE-DEFINITIONS.md   # Detailed stage requirements
    â”œâ”€â”€ 04-DESIGN-SYSTEM.md       # Visual design standards
    â”œâ”€â”€ 05-CODE-STANDARDS.md      # Coding best practices
    â”œâ”€â”€ 06-PWA-SETUP.md           # PWA configuration guide
    â”œâ”€â”€ 07-RELEASE-PROCESS.md     # App store release guide
    â””â”€â”€ 99-CHANGELOG.md           # Development history
```

---

## ðŸŽ¯ The 6 Stages

### ï¿½o. Stage 1: Financial Foundation (COMPLETE)
Calculate your investment capacity based on:
- Current property value and loan
- Income and expenses
- Borrowing capacity
- Recommended purchase price range
- Deposit mix (usable equity + cash savings) and estimated LMI impact
- HECS/HELP toggle so repayments adjust servicing
- Preferred investment strategy (growth/cashflow/balanced) saved to localStorage

### ï¿½o. Stage 2: Suburb Comparison (COMPLETE)
- Compare up to 20 suburbs with cards and table views
- Strategy-aware scoring (growth/cashflow/balanced)
- Sort by score, name, price + responsive toggles
- Deep-dive metric matrix (vacancy, stock, DSR, approvals, amenity, affordability) with 0â€“2 scoring
- localStorage persistence

### ï¿½o. Stage 3: Location Intelligence (COMPLETE)
- Amenity checklist (train, bus, schools, shopping, hospital, parks, CBD)
- Weighted location scoring and recommendation copy
- Development notes log + persistent results

### ï¿½o. Stage 4: Professional Network (COMPLETE)
- Capture brokers, conveyancers, PMs, inspectors, agents, accountants
- Rating selector, notes, delete controls
- CRM stored locally

### ï¿½o. Stage 5: Acquisition Tracker (COMPLETE)
- Track key dates (contract, finance, settlement, inspections)
- Document checklist + payment tracker with totals
- All entries persist locally

### ï¿½o. Stage 6: Portfolio Dashboard (COMPLETE)
- Add multiple properties with value, loan, rent, expenses
- Automatic equity, LVR, monthly repayment & cashflow
- Card grid with delete controls + persistence

---## ðŸ¤– Working with AI in VS Code

### IMPORTANT: Always Start Your Session Like This

When working with AI assistants (GitHub Copilot, Cursor, etc.), ALWAYS tell them:

```
Before we start coding, please read these files:
1. _docs/00-PROJECT-OVERVIEW.md
2. _docs/02-CURRENT-STATUS.md

Then continue from where we left off.
```

### Why This Matters

The `_docs/` folder contains:
- **What we're building** (overall vision)
- **Where we are** (current progress)
- **What's next** (priority tasks)
- **How to code it** (standards and patterns)

This prevents AI from:
- âŒ Forgetting the plan
- âŒ Duplicating code
- âŒ Overcomplicating things
- âŒ Breaking existing features

### After Completing Work

**ALWAYS** update `_docs/02-CURRENT-STATUS.md` to reflect:
- What you completed
- What's in progress
- Any blocking issues

---

## ðŸ’» Technology Stack

- **HTML5** - Structure
- **CSS3** - Styling (custom CSS, no frameworks)
- **Vanilla JavaScript** - Functionality (ES6+)
- **LocalStorage** - Data persistence

### Why No Frameworks?

- âœ… Zero build process
- âœ… No dependency hell
- âœ… Instant startup (just open the file!)
- âœ… Easy to understand and modify
- âœ… Works everywhere

---

## ðŸ§ª Testing Stage 1

Try these test scenarios:

### Test 1: Experienced Investor
```
Property Value: $1,070,000
Loan Amount: $770,000
Annual Income: $150,000
Monthly Expenses: $4,000
Other Debts: $15,000
Cash Savings: $20,000

Expected Results:
- Total Equity: ~$300,000
- Usable Equity: ~$86,000
- Borrowing Capacity: ~$621,000
- Status: âœ… Ready to Invest
```

### Test 2: First-Time Investor
```
Property Value: $0
Loan Amount: $0
Annual Income: $100,000
Monthly Expenses: $3,000
Other Debts: $0
Cash Savings: $50,000

Expected Results:
- Total Equity: $0
- Usable Equity: $0
- Borrowing Capacity: ~$568,000
- Status: âœ… Ready to Invest
```

### Test 3: Negative Equity Warning
```
Property Value: $500,000
Loan Amount: $550,000
Annual Income: $80,000
Monthly Expenses: $3,500
Other Debts: $20,000
Cash Savings: $10,000

Expected Results:
- Total Equity: -$50,000 (RED)
- Status: âš ï¸ Negative Equity - Seek Advice
```

---

## ðŸ“ Development Workflow

### 1. Before You Start
```bash
# Open project in VS Code
cd property-investment-app
code .

# Read the current status
cat _docs/02-CURRENT-STATUS.md
```

### 2. While Coding
- Follow patterns in `_docs/04-DESIGN-SYSTEM.md`
- Follow standards in `_docs/05-CODE-STANDARDS.md`
- Test frequently in the browser
- Use browser DevTools console to check for errors

### 3. After Completing a Feature
- Update `_docs/02-CURRENT-STATUS.md`
- Add entry to `_docs/99-CHANGELOG.md`
- Test on mobile screen size (DevTools responsive mode)
- Commit changes (if using Git)

---

## ðŸ› Troubleshooting

### Live Server Not Working?
1. Make sure Live Server extension is installed
2. Right-click directly on `index.html` (not the folder)
3. Select "Open with Live Server"
4. Check if another app is using port 5500

### Calculator Not Working?
1. Open browser console (F12)
2. Look for JavaScript errors
3. Check if all required fields are filled
4. Try with the test data above

### Data Not Saving?
1. Check browser console for localStorage errors
2. Make sure you're not in Private/Incognito mode
3. Check if localStorage is enabled in browser settings

### Can't See Changes?
1. Hard refresh the page (Ctrl+Shift+R or Cmd+Shift+R)
2. Clear browser cache
3. Make sure Live Server is running (look for "Live" in VS Code status bar)

---

## ðŸ“– Learning Resources

### HTML/CSS/JavaScript
- [MDN Web Docs](https://developer.mozilla.org/) - Best web development reference
- [CSS Tricks](https://css-tricks.com/) - CSS guides and tips
- [JavaScript.info](https://javascript.info/) - Modern JavaScript tutorial

### Property Investment (Australian Context)
- Research suburb data from Domain, REA, CoreLogic
- Understand LVR, LMI, stamp duty calculations
- Learn about investment strategies (growth vs cashflow)

---

## ðŸŽ¨ Design System

All design tokens are in `_docs/04-DESIGN-SYSTEM.md`:

- **Colors**: Blues, greens, reds for status indicators
- **Spacing**: 4px base unit (multiples of 4)
- **Typography**: System fonts, clear hierarchy
- **Components**: Cards, buttons, forms all documented

---

## ðŸ”’ Data & Privacy

- All data is stored **locally** in your browser's localStorage
- No data is sent to any server
- No tracking or analytics
- Your financial information stays on your device

To clear all data:
```javascript
// Open browser console and run:
localStorage.clear();
```

---

## ðŸš§ Roadmap

### ï¿½o. Stage 1: Financial Foundation (COMPLETE)
Calculate your investment capacity based on:
- Current property value and loan
- Income and expenses
- Borrowing capacity
- Recommended purchase price range
- Deposit mix (usable equity + cash savings) and estimated LMI impact
- HECS/HELP toggle so repayments adjust servicing
- Preferred investment strategy (growth/cashflow/balanced) saved to localStorage

### ï¿½o. Stage 2: Suburb Comparison (COMPLETE)
- Compare up to 20 suburbs with cards and table views
- Strategy-aware scoring (growth/cashflow/balanced)
- Sort by score, name, price + responsive toggles
- localStorage persistence

### ï¿½o. Stage 3: Location Intelligence (COMPLETE)
- Amenity checklist (train, bus, schools, shopping, hospital, parks, CBD)
- Weighted location scoring and recommendation copy
- Development notes log + persistent results

### ï¿½o. Stage 4: Professional Network (COMPLETE)
- Capture brokers, conveyancers, PMs, inspectors, agents, accountants
- Rating selector, notes, delete controls
- CRM stored locally

### ï¿½o. Stage 5: Acquisition Tracker (COMPLETE)
- Track key dates (contract, finance, settlement, inspections)
- Document checklist + payment tracker with totals
- All entries persist locally

### ï¿½o. Stage 6: Portfolio Dashboard (COMPLETE)
- Add multiple properties with value, loan, rent, expenses
- Automatic equity, LVR, monthly repayment & cashflow
- Card grid with delete controls + persistence

---## ðŸš€ App Store Release (v1.1)

**Current Status:** 85% Complete - Ready for asset generation

### What's Complete
âœ… Stage 1 & Stage 2 features fully implemented
âœ… PWA configuration (manifest + service worker)
âœ… Privacy policy page
âœ… Icon designs and generation guide
âœ… Screenshot capture guide
âœ… Complete submission checklists

### What's Needed (1 hour)
âŒ Generate 8 icon PNG files â†’ Use `icon-generator.html`
âŒ Capture 3-5 screenshots â†’ Use `screenshot-guide.html`
âŒ Update privacy policy contact info â†’ Edit `privacy.html` Section 10

### Next Steps
ðŸ“‹ **See [NEXT-STEPS.md](NEXT-STEPS.md)** for complete guide
ðŸ“‹ **See [app-store-checklist.md](app-store-checklist.md)** for submission workflow

**Time to Release:** ~5-7 hours (1 hour assets + 4-6 hours Capacitor & submission)

---

## ðŸ’¡ Contributing

This is a personal project, but if you want to:

1. **Report a bug**: Create an issue with steps to reproduce
2. **Suggest a feature**: Open an issue describing the use case
3. **Ask a question**: Check the `_docs/` folder first, then ask

---

## ðŸ“„ License

Personal project - use as you wish!

---

## ðŸ™ Acknowledgments

Built with:
- VS Code
- Live Server extension
- A lot of coffee â˜•

---

## ðŸ“ž Support

For questions about the code:
1. Check `_docs/05-CODE-STANDARDS.md` for coding patterns
2. Check `_docs/03-STAGE-DEFINITIONS.md` for feature specs
3. Check browser console for error messages

For questions about property investment:
- This is a planning tool, not financial advice
- Always consult with qualified professionals
- Calculations are simplified for planning purposes

---

**Happy Investing! ðŸ ðŸ“ˆ**


