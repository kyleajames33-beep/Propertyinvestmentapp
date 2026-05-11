# Master Development Plan

## Stage 1: Financial Foundation ?o. COMPLETE
### Features
- [x] Basic HTML structure and layout
- [x] Current property value input
- [x] Outstanding loan input
- [x] Annual income input
- [x] Monthly expenses input
- [x] Other debts input
- [x] Cash savings input
- [x] Equity calculator (total equity)
- [x] Equity calculator (usable equity at 80% LVR)
- [x] Borrowing capacity calculator
- [x] Maximum purchase price calculator (handles equity + savings deposits)
- [x] LMI calculator (for LVR > 80%)
- [x] Investment strategy selector (growth/cashflow/balanced)
- [x] HECS/HELP toggle & repayment logic included in servicing
- [x] Visual summary card with results
- [x] Save to localStorage
- [x] Load from localStorage on page refresh
- [x] Mobile responsive design
- [x] Input validation and error messages

### Acceptance Criteria
- All calculations accurate to nearest dollar
- Results update in real-time as user types
- Mobile responsive (works on 375px width)
- Saved to localStorage automatically
- No console errors
- Professional visual design

---

## Stage 2: Suburb Comparison (COMPLETE)
### Features
- [x] Rich suburb form (name, city/town, state, postcode, price band, include flag, median price, weekly rent, capital growth, vacancy, distance, thesis, notes)
- [x] Manual score (/10) input stored alongside strategy-aware scoring
- [x] Advanced metrics matrix (P1 demand/supply, P2 growth foundations, P3 macro drivers) with value + meets target + trend/qual + notes + 0-2 score columns
- [x] Auto score (/10) generated from matrix averages with inline hinting when no metric scores exist
- [x] Suburb cards showing include pill, badges, auto/strategy/manual scores, quick metrics, thesis, notes, and collapsible metric breakdown
- [x] Table view with include flag, manual score, auto score (/10), date assessed, delete action, and sort controls
- [x] Sort controls (auto score, suburb name, price band, include flag) plus responsive card/table toggle
- [x] Color-coded score badges (green ≥75, amber ≥50, red otherwise) using auto score or strategy fallback
- [ ] Export comparison to CSV (deferred)
- [ ] Visual charts (bar/line) (deferred)
- [x] Delete suburb functionality with confirmation
- [x] Data persists in localStorage with a strict 20 suburb limit

### Acceptance Criteria
- Max 20 suburbs with graceful warning when the limit is reached
- Required inputs (name, city/town, state, postcode, price band, date, include flag) validate inline
- Auto score averages populated metric scores (0-2) and maps to /10 with strategy fallback powering the badge when metrics are missing
- Manual score stores independently and is surfaced on both cards and table
- Cards and table stay in sync, persist the selected view, and respect column sorting after refresh
- Data reloads from localStorage (including the metric matrix) with zero console errors

---
## Stage 3: Location Intelligence �o. COMPLETE
### Features
- [x] Suburb + state capture
- [x] Amenity checklist (train, bus, schools, shopping, hospital, parks, CBD)
- [x] Weighted location scoring with recommendation copy
- [x] Development notes log
- [x] localStorage persistence

---
## Stage 4: Professional Network & Watchlist �o. COMPLETE
### Features
- [x] Add professional contact form (name, category, phone, email)
- [x] Rating selector and notes field
- [x] Category list for brokers, conveyancers, PMs, inspectors, agents, accountants
- [x] Card grid with delete controls
- [x] localStorage persistence

---
## Stage 5: Acquisition & Settlement �o. COMPLETE
### Features
- [x] Key dates form (contract, settlement, finance, inspection)
- [x] Document checklist (8 core items with completion states)
- [x] Payment tracker (deposit, inspection fees, conveyancing, stamp duty, settlement balance)
- [x] Running totals for costs vs paid amounts
- [x] localStorage persistence

---
## Stage 6: Portfolio Dashboard �o. COMPLETE
### Phase 1 (MVP) Features
- [x] Multi-property entry (address, value, loan, rent, expenses)
- [x] Equity & loan-to-value calculations
- [x] Monthly repayment + cashflow calculation
- [x] Card grid with delete controls
- [x] localStorage persistence

### Future Features (Post-MVP)
- Portfolio-level charts and refinancing detection
- Document storage, reminders, projections, tax helpers

---
## Development Sequence

### Sprint 1: Foundation (Week 1-2) �o. COMPLETE
1. �o. Project setup
2. �o. Context files created
3. �o. Stage 1 HTML structure
4. �o. Stage 1 calculations (equity, borrowing capacity)
5. �o. Stage 1 visual design
6. �o. Stage 1 localStorage integration
7. �o. Stage 1 mobile responsive
8. �o. Stage 1 testing with real data
### Sprint 2: Suburb Analysis (Week 3-4) ✅ COMPLETE
1. ✅ Stage 2 data entry form
2. ✅ Stage 2 comparison views (cards + table)
3. ✅ Stage 2 scoring algorithm (linked to Stage 1 strategy)
4. ⏸️ Stage 2 charts and visualizations (deferred)
5. ✅ Stage 2 testing

### Sprint 3: Basic Portfolio (Week 5) �o. COMPLETE
1. Stage 6 MVP (multi-property dashboard)
2. Stage navigation + regression testing

### Sprint 4: Location Intelligence (Week 6-7) �o. COMPLETE
1. Stage 3 amenity scoring and recommendations
2. Responsive polish + persistence

### Sprint 5: Professionals & Watchlist (Week 8-9) �o. COMPLETE
1. Stage 4 CRM implementation
2. Testing + UX polish

### Sprint 6: Enhanced Portfolio (Week 10) �o. COMPLETE
1. Stage 5 acquisition tracker (timeline, documents, payments)
2. Testing + data persistence

### Sprint 7: Quality & Polish (Week 11) 📋 PLANNED
**Priority: HIGH - User Feedback Required**

#### 7.0 Code Restructure (PREREQUISITE)
**Current Issue:** 4,370 lines in single index.html causing performance issues and maintenance problems

**File Structure to Create:**
```
property-investment-app/
├── index.html (lightweight shell, ~100 lines)
├── css/
│   ├── main.css (variables, resets, shared styles)
│   ├── components.css (buttons, cards, forms, navigation)
│   └── stages.css (stage-specific styles)
├── js/
│   ├── app.js (navigation, PWA registration, utilities)
│   ├── utils.js (debounce, formatters, localStorage helpers)
│   └── stages/
│       ├── stage1.js (~400 lines: financial calculations)
│       ├── stage2.js (~500 lines: suburb comparison)
│       ├── stage3.js (~350 lines: location intelligence)
│       ├── stage4.js (~300 lines: professional network)
│       ├── stage5.js (~350 lines: acquisition tracker)
│       └── stage6.js (~300 lines: portfolio dashboard)
├── manifest.json (existing)
├── service-worker.js (update cache list)
├── privacy.html (existing)
└── _docs/ (existing)
```

**Tasks:**
- [x] Create folder structure (css/, js/, js/stages/)
- [x] Extract CSS from index.html into 3 organized files
- [x] Extract shared JavaScript utilities into utils.js
- [x] Split stage JavaScript into 6 separate files (stage1.js - stage6.js)
- [x] Create app.js for navigation and initialization
- [x] Update index.html to lightweight shell with script/link tags
- [x] Update service-worker.js cache list to include new files
- [ ] Test all stages work identically after restructure
- [ ] Verify localStorage persistence still works
- [ ] Verify PWA installation still works

**Benefits:**
- Immediate performance improvement (smaller initial load)
- Enables lazy-loading stages (future optimization)
- Makes Sprint 7.1-7.4 MUCH easier (work on separate files)
- Industry-standard structure for future expansion
- Multiple AIs can work in parallel on different stages

**Acceptance Criteria:**
- All 6 stages function identically to before
- No data loss (localStorage compatibility maintained)
- No console errors
- PWA still installable
- Performance improved (faster initial page load)
- Code is organized and easy to navigate

---

#### 7.1 Performance Optimization
- [ ] Add debouncing to calculation functions (prevent recalc on every keystroke)
- [ ] Optimize event listeners (use delegation where possible)
- [ ] Reduce localStorage write frequency (batch updates)
- [ ] Add loading states for heavy operations
- [ ] Profile and optimize JavaScript execution

**Note:** Sprint 7.0 must be completed before 7.1-7.4 can proceed efficiently.

---

#### 7.2 Stage 1 Enhancements - Partner Income
- [x] Add "Partner's Annual Income" input field
- [x] Update borrowing capacity formula to include combined household income
- [x] Add visual indicator showing individual vs combined income
- [x] Update summary card to show household borrowing power
- [ ] Test calculations with various income combinations

#### 7.3 Stage 1 Enhancements - Detailed Expenses
**Current Issue:** Single "Monthly Expenses" field is too basic and inaccurate

**New Expense Categories:**
- [x] Housing (current rent/mortgage)
- [x] Utilities (electricity, gas, water, internet)
- [x] Transport (car payments, fuel, insurance, public transport)
- [x] Food & Groceries
- [x] Insurance (health, life, home/contents)
- [x] Personal (entertainment, subscriptions, gym, clothing)
- [x] Other (childcare, education, misc)
- [x] Auto-calculate total monthly expenses from categories
- [x] Show category breakdown in summary card
- [x] Add collapsible expense section to reduce clutter

#### 7.4 UI/UX Redesign - Modern Design System
**Current Issue:** Design looks "tacky and old, boring"

**Design Improvements:**
- [ ] **Color Palette Update**
  - Contemporary blues (deeper, more vibrant)
  - Better accent colors (emerald greens, warm oranges)
  - Refined neutral grays
  - Gradient accents for CTAs and highlights

- [ ] **Typography Overhaul**
  - Larger, bolder headings with better hierarchy
  - Improved line-height and letter-spacing
  - Better font-weight variations
  - More breathing room between elements

- [ ] **Modern Components**
  - Glassmorphism effects (subtle blur/transparency)
  - Soft shadows instead of hard borders
  - Floating label inputs (labels animate on focus)
  - Improved button styles with hover states
  - Better card designs with depth
  - Smooth transitions and micro-animations

- [ ] **Layout Improvements**
  - Increased spacing and padding
  - Better visual grouping of related fields
  - Improved mobile responsive design
  - Better use of white space
  - Grid-based layouts for forms

- [ ] **Interactive Elements**
  - Smooth scroll animations
  - Fade-in effects for new content
  - Better loading states
  - Improved form validation feedback
  - Skeleton loaders for data-heavy sections

**Acceptance Criteria:**
- App feels modern and premium (2024+ design standards)
- Performance improvements result in instant responsiveness
- Partner income accurately reflects in borrowing calculations
- Expense breakdown provides detailed, realistic monthly costs
- All changes maintain localStorage compatibility (no data loss)
- Mobile experience is exceptional (not just "responsive")

---

### Sprint 8: Release Prep (Week 12) ⏳ BLOCKED
**Blocked by:** Sprint 7 completion required first

1. Icon + screenshot generation
2. Privacy policy contact info update
3. Capacitor builds and submission
4. App store listing creation (iOS & Android)

---

## Legend
- ✅ Complete
- ⏳ In Progress
- 📋 Planned
- ❌ Blocked
- 🔄 Needs Revision
- ⏸️ Deferred
