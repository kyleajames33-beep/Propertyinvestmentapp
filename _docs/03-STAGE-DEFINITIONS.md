# Stage Definitions - Detailed Requirements

## Stage 1: Financial Foundation

### User Story
As an investor, I want to understand my current financial position and borrowing capacity so I can determine what I can afford to purchase.

### Inputs Required

| Field | Type | Validation | Example |
|-------|------|------------|---------|
| Current property value | Currency ($) | > 0 or 0 if no property | $1,070,000 |
| Outstanding loan | Currency ($) | ≥ 0, ≤ property value | $770,000 |
| Annual income (gross) | Currency ($) | > 0 | $150,000 |
| Monthly expenses | Currency ($) | > 0 | $4,000 |
| Other debts | Currency ($) | ≥ 0 | $15,000 |
| Cash savings | Currency ($) | ≥ 0 | $20,000 |
| HECS/HELP balance | Currency ($) | ≥ 0 | $18,000 |
| HECS/HELP monthly repayment | Currency ($) | ≥ 0 | $350 |

### Calculations to Perform

#### 1. Equity Calculation
```javascript
// Total Equity
const totalEquity = currentPropertyValue - outstandingLoan;

// Usable Equity at 80% LVR
const maxLoanAt80LVR = currentPropertyValue * 0.80;
const usableEquity = maxLoanAt80LVR - outstandingLoan;

// Handle case where user has no existing property
if (currentPropertyValue === 0) {
  totalEquity = 0;
  usableEquity = 0;
}

// Handle negative equity scenario
if (totalEquity < 0) {
  // Display warning to user
  showWarning("Your property is in negative equity");
}
```

#### 2. Borrowing Capacity (Simplified Formula)
```javascript
// Include HECS/HELP repayments if toggled on
const hecsMonthly = hasHecs ? hecsMonthlyRepayment : 0;

// Annual commitments
const totalMonthlyExpenses = monthlyExpenses + hecsMonthly;
const annualCommitments = (totalMonthlyExpenses * 12) + otherDebts;

// Serviceable income
const serviceableIncome = annualIncome - annualCommitments;

// Borrowing capacity (conservative 6x multiplier)
const borrowingCapacity = serviceableIncome * 6;

// Ensure not negative
const safeBorrowingCapacity = Math.max(0, borrowingCapacity);
```

#### 3. Maximum Purchase Price
```javascript
// At 80% LVR (no LMI required)
const depositRequired = 0.20; // 20%
const maxPurchasePrice80LVR = (usableEquity + borrowingCapacity) / depositRequired;

// Or simpler calculation:
const maxPurchase = usableEquity + borrowingCapacity;

// This assumes you use your usable equity as the deposit
```

#### 4. Purchase Range Recommendation
```javascript
// Conservative lower bound (70% of max)
const minRecommendedPurchase = maxPurchase * 0.70;

// Upper bound (90% of max, leaving buffer)
const maxRecommendedPurchase = maxPurchase * 0.90;

// Display as range: $XXX,XXX - $XXX,XXX
```

### Visual Output Specification

#### Summary Card Design
```
┌─────────────────────────────────────────────────┐
│  YOUR INVESTMENT CAPACITY                       │
│                                                 │
│  💰 Total Equity                                │
│     $300,000                                    │
│                                                 │
│  🏦 Usable Equity (80% LVR)                     │
│     $86,000                                     │
│                                                 │
│  📊 Borrowing Capacity                          │
│     $620,000                                    │
│                                                 │
│  🏠 Recommended Purchase Range                  │
│     $500,000 - $650,000                         │
│                                                 │
│  ✅ Investment Ready                            │
│     You can afford to invest now!               │
│                                                 │
│  [Start Suburb Research →]                      │
└─────────────────────────────────────────────────┘
```

#### Color Coding Rules
- **Green (Success):** Borrowing capacity > $300k
- **Yellow (Caution):** Borrowing capacity $100k - $300k
- **Red (Warning):** Borrowing capacity < $100k or negative equity

### Validation Rules

#### Input Validation
```javascript
// All currency inputs
function validateCurrencyInput(value, fieldName) {
  // Must be a number
  if (isNaN(value)) {
    return { valid: false, error: `${fieldName} must be a number` };
  }

  // Must not be negative (except where allowed)
  if (value < 0) {
    return { valid: false, error: `${fieldName} cannot be negative` };
  }

  // Must not be unreasonably large (data quality check)
  if (value > 100000000) { // $100M limit
    return { valid: false, error: `${fieldName} seems unreasonably high` };
  }

  return { valid: true };
}

// Loan cannot exceed property value
if (outstandingLoan > currentPropertyValue && currentPropertyValue > 0) {
  showError("Your loan cannot exceed your property value");
}

// Income must cover expenses
if (annualIncome < (monthlyExpenses * 12)) {
  showWarning("Your income doesn't cover your expenses - please review");
}
```

#### Business Logic Validation
```javascript
// Check if user can actually invest
if (borrowingCapacity < 50000) {
  showMessage("Your borrowing capacity is low. Consider improving your income or reducing debts before investing.");
}

// Check if user has negative equity
if (totalEquity < 0 && currentPropertyValue > 0) {
  showWarning("You're in negative equity. Investment may not be advisable at this time.");
}

// Check if LVR is too high
const currentLVR = outstandingLoan / currentPropertyValue;
if (currentLVR > 0.90 && currentPropertyValue > 0) {
  showWarning("Your current LVR is high (>90%). You may have limited equity to use.");
}
```

### Data Storage (localStorage)

#### Storage Structure
```javascript
const stage1Data = {
  // Inputs
  currentPropertyValue: 1070000,
  outstandingLoan: 770000,
  annualIncome: 150000,
  monthlyExpenses: 4000,
  otherDebts: 15000,
  cashSavings: 20000,

  // Calculated values (for reference)
  totalEquity: 300000,
  usableEquity: 86000,
  borrowingCapacity: 620000,
  maxPurchasePrice: 706000,
  recommendedMin: 494200,
  recommendedMax: 635400,

  // Metadata
  lastUpdated: "2024-11-15T10:30:00Z",
  stage: 1,
  version: "1.0"
};

// Save to localStorage
localStorage.setItem('investmentApp_stage1', JSON.stringify(stage1Data));
```

#### Load Function
```javascript
function loadStage1Data() {
  const saved = localStorage.getItem('investmentApp_stage1');

  if (saved) {
    try {
      const data = JSON.parse(saved);

      // Populate form fields
      document.getElementById('propertyValue').value = data.currentPropertyValue || 0;
      document.getElementById('loanAmount').value = data.outstandingLoan || 0;
      document.getElementById('annualIncome').value = data.annualIncome || 0;
      document.getElementById('monthlyExpenses').value = data.monthlyExpenses || 0;
      document.getElementById('otherDebts').value = data.otherDebts || 0;
      document.getElementById('cashSavings').value = data.cashSavings || 0;

      // Trigger calculation to show results
      calculateFinancials();

    } catch (error) {
      console.error('Error loading saved data:', error);
    }
  }
}

// Call on page load
window.addEventListener('DOMContentLoaded', loadStage1Data);
```

### Real-Time Calculation

#### Event Listeners
```javascript
// Add input event listeners to all fields for real-time calculation
const inputFields = [
  'propertyValue',
  'loanAmount',
  'annualIncome',
  'monthlyExpenses',
  'otherDebts',
  'cashSavings'
];

inputFields.forEach(fieldId => {
  const element = document.getElementById(fieldId);

  // Update on input (as user types)
  element.addEventListener('input', () => {
    calculateFinancials();
    saveStage1Data();
  });
});
```

### Mobile Responsive Requirements

#### Breakpoints
```css
/* Mobile: < 640px */
- Single column layout
- Full-width inputs
- Larger touch targets (min 44px height)
- Summary card stacks vertically

/* Tablet: 640px - 1024px */
- Two column layout for inputs
- Summary card can be side-by-side

/* Desktop: > 1024px */
- Maximum width container (800px)
- Centered layout
- Comfortable spacing
```

### Accessibility Requirements
- All inputs must have associated `<label>` elements
- Use `aria-label` for icon buttons
- Ensure color is not the only indicator (use icons + text)
- Keyboard navigation support (tab through fields)
- Focus indicators visible

### Test Scenarios

#### Test Case 1: First-Time Investor (No Property)
```javascript
Inputs:
- Current property value: $0
- Outstanding loan: $0
- Annual income: $100,000
- Monthly expenses: $3,000
- Other debts: $0
- Cash savings: $50,000

Expected Results:
- Total equity: $0
- Usable equity: $0
- Borrowing capacity: $568,000
- Max purchase (using savings as deposit): ~$250,000
- Status: Can invest with savings as deposit
```

#### Test Case 2: Existing Homeowner
```javascript
Inputs:
- Current property value: $1,070,000
- Outstanding loan: $770,000
- Annual income: $150,000
- Monthly expenses: $4,000
- Other debts: $15,000
- Cash savings: $20,000

Expected Results:
- Total equity: $300,000
- Usable equity: $86,000 (at 80% LVR)
- Borrowing capacity: $621,000
- Max purchase: ~$707,000
- Recommended range: $495,000 - $636,000
- Status: Ready to invest
```

#### Test Case 3: Negative Equity Scenario
```javascript
Inputs:
- Current property value: $500,000
- Outstanding loan: $550,000
- Annual income: $80,000
- Monthly expenses: $3,500
- Other debts: $20,000
- Cash savings: $10,000

Expected Results:
- Total equity: -$50,000
- Usable equity: $0 (can't be negative)
- Borrowing capacity: $158,000
- Warning: "Negative equity - investment not recommended"
- Status: Not ready to invest
```

#### Test Case 4: High Income, High Expenses
```javascript
Inputs:
- Current property value: $2,000,000
- Outstanding loan: $1,200,000
- Annual income: $300,000
- Monthly expenses: $8,000
- Other debts: $50,000
- Cash savings: $100,000

Expected Results:
- Total equity: $800,000
- Usable equity: $400,000
- Borrowing capacity: $1,302,000
- Max purchase: ~$1,702,000
- Status: High capacity investor
```

---

## Stage 2: Suburb Comparison

### User Story
As an investor, I want to record qualitative and quantitative indicators for multiple suburbs so I can build a shortlist that aligns with my strategy (growth, cashflow, or balanced) before committing to a purchase.

### Key Capabilities
- Capture a complete snapshot for up to 20 suburbs including city/town, price band, lending notes, and assessment date.
- Flag whether a suburb should remain in the shortlist (`Include?`) and record a 1–2 sentence thesis plus a manual overall score (/10).
- Score 20+ advanced metrics across three periods (P1 demand/supply, P2 growth foundations, P3 macro drivers) using a standardized 0–2 scale that automatically produces an Auto Score (/10).
- Switch between responsive card and table views, with live sort controls (score, name, price, include flag, etc.) and collapsible metric breakdowns.
- Persist all entries (including matrix values) via `localStorage` key `investmentApp_stage2` and enforce a 20-suburb limit.

### Form Inputs

| Field | Type | Validation | Notes |
|-------|------|------------|-------|
| Suburb Name | Text | Required | e.g. Parramatta |
| City / Town | Text | Required | Capture metro area or SA4 |
| State | Select | Required (`NSW`, `VIC`, `QLD`, `SA`, `WA`, `TAS`, `ACT`, `NT`) |
| Postcode | Text | Required, 4 digits | Inline validation rejects non-numeric |
| Price Band | Select | Required (`<$400k`, `$400-$500k`, `$500-$600k`, `$600-$700k`, `$700-$800k`, `$800k+`) |
| Date Assessed | Date | Required | Used for card/table badges |
| Median House Price | Number | Required, 100k - 10m | Used for yield + affordability context |
| Weekly Rent | Number | Required, $50-$5,000 | Drives calculated gross yield |
| Annual Capital Growth (%) | Number | Optional, -20 to 40 |
| Vacancy Rate (%) | Number | Optional, 0-20 |
| Distance to CBD (km) | Number | Optional, 0-500 |
| Include in shortlist? | Select | Required (`Yes`/`No`) |
| Manual Overall Score (/10) | Number | Optional, 0-10, 0.1 increments |
| Investment Thesis | Textarea | Optional, 1–2 sentence rationale |
| Additional Notes | Textarea | Optional catch-all notes |

### Advanced Metrics Matrix (Auto Score Inputs)

Metrics are grouped into three panels. Each row captures:
- **Value** (number or short note)
- **Meets Target** (`Yes`, `No`, `N/A`)
- **Trend / Qual** — Quant metrics use `Up`, `Flat/Stable`, `Down`, `Unknown`; qualitative metrics use `Strong`, `Neutral`, `Weak`, `Unclear`
- **Notes**
- **Score (0–2)** — required to influence the Auto Score calculation

#### P1 — 1–5 year demand & supply
- Renter proportion %
- Vacancy rate %
- Auction clearance rate %
- Days on market
- Vendor discount %
- Stock on market %
- Online search interest (12m)
- Gross yield %
- Demand-to-Supply Ratio (DSR)
- 36-month median value growth rate %
- 12-month rental growth %
- Accessibility infrastructure
- Job infrastructure
- 18m approvals vs total dwellings
- Developable land supply

#### P2 — 6–15 year growth foundations
- Amenity (schools / PT / shops / parks)
- Proximity to job centres
- Household income growth vs State
- Professional occupations % trend
- 10-year median value average growth %
- Affordability headroom (rent <30%)
- Affordability headroom (mortgage <30%)

#### P3 — City/Town macro drivers
- Job infrastructure (city-level)
- 18m approvals (city-level)
- 5-year job ads trend

### Scoring Logic
- **Manual Score (/10):** optional analyst override stored exactly as entered.
- **Auto Score (/10):** average of all populated metric scores (0–2) mapped to a 10-point scale: `autoScore = round(((sum / (count * 2)) * 10), 1)`. Requires at least one metric score; otherwise the UI prompts the user to add data.
- **Strategy Score (/100):** legacy scoring that blends Stage 1 strategy inputs (growth/cashflow/balanced) with median price, yield, vacancy, and distance. Used as a fallback color indicator when no auto score exists.

Auto score, manual score, include flag, city/state badge, price band, rent, growth, vacancy, distance to CBD, thesis, notes, and a collapsible metric table are all rendered on the card view. The table view shows suburb, city/state, price band, include flag, manual score, auto score (/10), date assessed, and quick delete actions.

### Validation & Limits
- Reject blank suburb name, city/town, postcode, state, price band, or assessment date.
- Postcode must be exactly four digits; highlight errors inline.
- Weekly rent and median price enforce sensible ranges with context hints.
- Form submission hard-stops at 20 suburbs and prompts the user to delete entries before adding more.
- After adding a suburb the form resets and the metric matrix clears, ready for the next entry.

### Persistence & Sorting
- All entries, advanced metrics, and UI preferences (view mode, sort column/direction) are stored in `localStorage` under `investmentApp_stage2`.
- Default sort: `autoScore` descending. Users can toggle between cards/table, and sorting works for numeric and text columns.
- Each suburb card/table row exposes a delete button with confirmation.

---

## Stage 3: Location Intelligence

### Inputs Captured
| Field | Type | Validation |
|-------|------|------------|
| Suburb name | Text | Required |
| State | Select (NSW, VIC, QLD, SA, WA, TAS, ACT, NT) | Required |
| Amenity checklist | Boolean flags | Optional |
| Development notes | Textarea | Optional |

### Scoring Logic
- Weighted amenity scoring (train station 15 pts, shopping 13 pts, CBD proximity 12 pts, etc.)
- Total score (0-100) mapped to guidance messages (“Ready”, “Worth investigating”, etc.)
- Persisted in `investmentApp_stage3`

---
## Stage 4: Professional Network & Watchlist

### Features
- Add professional contacts with name, category, phone, email, rating (0-5), notes
- Categories: Mortgage Broker, Conveyancer, Property Manager, Building Inspector, Pest Inspector, Real Estate Agent, Accountant, Other
- Card grid with delete buttons; stored in `investmentApp_stage4`

---
## Stage 5: Acquisition Tracker

### Features
- Key dates form (contract, settlement, finance due, inspection)
- Document checklist (Contract of Sale, Building Inspection, Pest Inspection, Finance Pre-Approval, Section 32, Strata Report, Insurance, Settlement Statement)
- Payment tracker (deposit, inspections, conveyancing, stamp duty, settlement balance) with totals vs paid
- Persisted in `investmentApp_stage5`

---
## Stage 6: Portfolio Dashboard

### Phase 1 (MVP) - Single Property View

**Will be detailed when Stage 2 is complete.**

Basic features:
- Property summary card
- Loan details
- Cashflow calculation
- Equity display
- Link back to add another property

### Phase 2 (Future) - Multi-Property Portfolio

**To be defined post-MVP**
