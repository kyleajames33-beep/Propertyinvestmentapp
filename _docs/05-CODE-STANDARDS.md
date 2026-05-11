# Code Standards & Best Practices

## JavaScript Standards

### Naming Conventions
```javascript
// Variables: camelCase
const purchasePrice = 500000;
const monthlyRent = 2400;
const currentPropertyValue = 1070000;

// Constants: UPPER_SNAKE_CASE
const MAX_PROPERTIES = 20;
const DEFAULT_LVR = 0.8;
const MIN_BORROWING_CAPACITY = 50000;

// Functions: camelCase, verb-first
function calculateEquity() {}
function updateSummaryCard() {}
function saveToLocalStorage() {}
function loadUserData() {}

// DOM element references: add $ prefix (optional but recommended)
const $propertyValue = document.getElementById('propertyValue');
const $calculateBtn = document.getElementById('calculateBtn');
```

### Function Structure
```javascript
/**
 * Calculate available equity from property value and loan
 * @param {number} propertyValue - Current market value of property
 * @param {number} loanAmount - Outstanding loan amount
 * @param {number} lvrTarget - Target Loan-to-Value ratio (default 0.8 for 80%)
 * @returns {object} Object containing totalEquity and usableEquity
 */
function calculateAvailableEquity(propertyValue, loanAmount, lvrTarget = 0.8) {
  // 1. Validate inputs
  if (propertyValue < 0 || loanAmount < 0) {
    console.error('Invalid inputs for equity calculation');
    return { totalEquity: 0, usableEquity: 0 };
  }

  // 2. Calculate total equity
  const totalEquity = propertyValue - loanAmount;

  // 3. Calculate usable equity at target LVR
  const maxLoanAtLVR = propertyValue * lvrTarget;
  const usableEquity = Math.max(0, maxLoanAtLVR - loanAmount);

  // 4. Return results
  return {
    totalEquity: totalEquity,
    usableEquity: usableEquity
  };
}
```

### Error Handling
```javascript
// Always validate user inputs
function processUserInput(inputValue, fieldName = 'input') {
  try {
    // Convert to number
    const value = parseFloat(inputValue);

    // Check if valid number
    if (isNaN(value)) {
      throw new Error(`${fieldName} must be a valid number`);
    }

    // Check if negative
    if (value < 0) {
      throw new Error(`${fieldName} cannot be negative`);
    }

    // Check if unreasonably large
    if (value > 100000000) {
      throw new Error(`${fieldName} value seems unreasonably high`);
    }

    return value;

  } catch (error) {
    console.error('Input validation error:', error.message);
    showErrorMessage(error.message);
    return null;
  }
}
```

### LocalStorage Pattern
```javascript
// Save data to localStorage
function saveData(key, data) {
  try {
    const jsonString = JSON.stringify(data);
    localStorage.setItem(key, jsonString);
    return true;
  } catch (error) {
    console.error('Failed to save data to localStorage:', error);
    return false;
  }
}

// Load data from localStorage
function loadData(key, defaultValue = null) {
  try {
    const jsonString = localStorage.getItem(key);

    if (jsonString === null) {
      return defaultValue;
    }

    const data = JSON.parse(jsonString);
    return data;

  } catch (error) {
    console.error('Failed to load data from localStorage:', error);
    return defaultValue;
  }
}

// Clear specific data
function clearData(key) {
  try {
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error('Failed to clear data from localStorage:', error);
    return false;
  }
}
```

### Number Formatting
```javascript
// Format currency (Australian dollars)
function formatCurrency(value) {
  return new Intl.NumberFormat('en-AU', {
    style: 'currency',
    currency: 'AUD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value);
}

// Usage: formatCurrency(1070000) → "$1,070,000"

// Format percentage
function formatPercentage(value, decimals = 1) {
  return `${value.toFixed(decimals)}%`;
}

// Usage: formatPercentage(4.567, 2) → "4.57%"

// Format number with commas
function formatNumber(value) {
  return new Intl.NumberFormat('en-AU').format(value);
}

// Usage: formatNumber(1234567) → "1,234,567"
```

---

## HTML Standards

### Document Structure
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="Australian property investment planning tool">
  <title>Property Investment App</title>

  <style>
    /* CSS goes here for single-file approach */
  </style>
</head>
<body>

  <!-- ========================================
       HEADER
       ======================================== -->
  <header>
    <!-- Header content -->
  </header>

  <!-- ========================================
       MAIN CONTENT
       ======================================== -->
  <main>
    <!-- Page content -->
  </main>

  <!-- ========================================
       FOOTER
       ======================================== -->
  <footer>
    <!-- Footer content -->
  </footer>

  <!-- ========================================
       SCRIPTS
       ======================================== -->
  <script>
    // JavaScript goes here for single-file approach
  </script>

</body>
</html>
```

### Form Input Best Practices
```html
<!-- Always use labels with inputs -->
<div class="form-group">
  <label for="propertyValue" class="form-label">
    Current Property Value
  </label>
  <input
    type="number"
    id="propertyValue"
    name="propertyValue"
    class="form-input"
    placeholder="e.g., 1070000"
    min="0"
    step="1000"
    aria-describedby="propertyValueHelp"
  >
  <span id="propertyValueHelp" class="form-help-text">
    Enter your property's current market value
  </span>
</div>
```

### Semantic HTML
```html
<!-- Use semantic elements -->
<header>...</header>
<nav>...</nav>
<main>...</main>
<section>...</section>
<article>...</article>
<aside>...</aside>
<footer>...</footer>

<!-- NOT generic divs everywhere -->
<div class="header">...</div> <!-- ❌ Bad -->
<header>...</header>           <!-- ✅ Good -->
```

### Accessibility Attributes
```html
<!-- Buttons with aria-label for icon-only buttons -->
<button
  type="button"
  aria-label="Calculate investment capacity"
  class="btn btn-primary"
>
  Calculate 📊
</button>

<!-- Links with descriptive text -->
<a href="#stage2" aria-label="Go to suburb research stage">
  Next Stage →
</a>

<!-- Required inputs -->
<input
  type="number"
  id="annualIncome"
  required
  aria-required="true"
  aria-invalid="false"
>

<!-- Error states -->
<input
  type="number"
  id="annualIncome"
  class="form-input-error"
  aria-invalid="true"
  aria-describedby="incomeError"
>
<span id="incomeError" class="form-error-text" role="alert">
  Annual income is required
</span>
```

---

## CSS Standards

### File Organization
```css
/* ==========================================
   1. CSS VARIABLES (Custom Properties)
   ========================================== */
:root {
  --primary-color: #2563eb;
  --spacing-unit: 1rem;
}

/* ==========================================
   2. RESET & BASE STYLES
   ========================================== */
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  line-height: 1.5;
}

/* ==========================================
   3. LAYOUT COMPONENTS
   ========================================== */
.container {
  max-width: 1200px;
  margin: 0 auto;
}

/* ==========================================
   4. UI COMPONENTS
   ========================================== */
.btn {
  /* Button styles */
}

.card {
  /* Card styles */
}

/* ==========================================
   5. UTILITY CLASSES
   ========================================== */
.text-center {
  text-align: center;
}

.hidden {
  display: none;
}

/* ==========================================
   6. RESPONSIVE / MEDIA QUERIES
   ========================================== */
@media (max-width: 768px) {
  /* Mobile styles */
}
```

### Class Naming (BEM-inspired)
```css
/* Component */
.property-card { }

/* Component element */
.property-card__title { }
.property-card__value { }
.property-card__icon { }

/* Component modifier */
.property-card--highlighted { }
.property-card--warning { }

/* Example usage in HTML */
<div class="property-card property-card--highlighted">
  <h3 class="property-card__title">Total Equity</h3>
  <p class="property-card__value">$300,000</p>
</div>
```

### CSS Custom Properties (Variables)
```css
:root {
  /* Colors */
  --color-primary: #2563eb;
  --color-success: #10b981;
  --color-danger: #ef4444;

  /* Spacing */
  --space-xs: 0.25rem;
  --space-sm: 0.5rem;
  --space-md: 1rem;
  --space-lg: 1.5rem;
  --space-xl: 2rem;

  /* Typography */
  --font-size-sm: 0.875rem;
  --font-size-base: 1rem;
  --font-size-lg: 1.125rem;

  /* Borders */
  --border-radius: 0.5rem;
  --border-color: #e5e7eb;
}

/* Usage */
.card {
  padding: var(--space-lg);
  border-radius: var(--border-radius);
  border: 1px solid var(--border-color);
}
```

---

## Code Comments

### JavaScript Comments
```javascript
// ============================================
// SECTION: EQUITY CALCULATIONS
// ============================================

/**
 * Calculate total and usable equity
 * This is the primary calculation for Stage 1
 */
function calculateEquity() {
  // Get input values from form
  const propertyValue = getInputValue('propertyValue');
  const loanAmount = getInputValue('loanAmount');

  // Calculate total equity
  const totalEquity = propertyValue - loanAmount;

  // Calculate usable equity at 80% LVR
  // Formula: (Property Value × 0.8) - Loan Amount
  const usableEquity = (propertyValue * 0.8) - loanAmount;

  // Return both values
  return { totalEquity, usableEquity };
}

// --- Helper Functions ---

// Get and validate input value by ID
function getInputValue(inputId) {
  const element = document.getElementById(inputId);
  return parseFloat(element.value) || 0;
}
```

### HTML Comments
```html
<!-- ========================================
     STAGE 1: FINANCIAL FOUNDATION
     ======================================== -->

<section id="stage1" class="stage-section">

  <!-- Input Form -->
  <div class="input-container">
    <!-- Property value input -->
    <div class="form-group">
      <label for="propertyValue">Current Property Value</label>
      <input type="number" id="propertyValue">
    </div>
  </div>

  <!-- Summary Card -->
  <div id="summaryCard" class="card card-highlight hidden">
    <!-- Results will be displayed here -->
  </div>

</section>
```

### CSS Comments
```css
/* ==========================================
   BUTTON COMPONENTS
   ========================================== */

/* Base button styles */
.btn {
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
}

/* Primary button (main actions) */
.btn-primary {
  background: var(--color-primary);
  color: white;
}

/* Hover state */
.btn-primary:hover {
  background: var(--color-primary-dark);
}
```

---

## File Organization

### Single File Approach (Current - Stage 1)
```
index.html (everything in one file)
├── HTML structure
├── <style> CSS
└── <script> JavaScript
```

**When to use:**
- MVP / Prototype phase
- Simple applications
- Quick iterations
- Stage 1 & 2 of this project

### Multi-File Approach (Future - if needed)
```
property-investment-app/
├── index.html
├── css/
│   └── styles.css
├── js/
│   ├── app.js
│   ├── calculations.js
│   └── storage.js
└── _docs/
    └── [context files]
```

**When to split:**
- File exceeds 1000 lines
- Code becomes hard to navigate
- Team collaboration needed
- Explicitly requested by user

---

## Testing Standards

### Manual Testing Checklist
```
Before marking ANY feature complete:

□ Browser Console
  □ No errors in console
  □ No warnings related to our code
  □ All console.log() debugging removed

□ Functionality
  □ All calculations mathematically correct
  □ Edge cases handled (zero, negative, very large)
  □ User inputs validated
  □ Error messages display correctly

□ Data Persistence
  □ Data saves to localStorage
  □ Data loads correctly on page refresh
  □ Clear/reset functionality works

□ Visual Design
  □ Professional appearance
  □ Consistent spacing
  □ Aligned elements
  □ Readable text (good contrast)

□ Responsive Design
  □ Works on 375px width (mobile)
  □ Works on 768px width (tablet)
  □ Works on 1920px width (desktop)
  □ No horizontal scrolling
  □ Touch targets min 44px

□ Accessibility
  □ Can navigate with keyboard only
  □ Screen reader friendly (labels present)
  □ Focus indicators visible
  □ Color not sole indicator

□ Cross-Browser (if possible)
  □ Chrome
  □ Firefox
  □ Safari
  □ Edge
```

### Test Data Sets

**Test Set 1: Experienced Investor**
```javascript
{
  propertyValue: 1070000,
  loanAmount: 770000,
  annualIncome: 150000,
  monthlyExpenses: 4000,
  otherDebts: 15000,
  cashSavings: 20000
}
Expected:
- Total Equity: $300,000
- Usable Equity: ~$86,000
- Borrowing Capacity: ~$621,000
```

**Test Set 2: First-Time Investor**
```javascript
{
  propertyValue: 0,
  loanAmount: 0,
  annualIncome: 100000,
  monthlyExpenses: 3000,
  otherDebts: 0,
  cashSavings: 50000
}
Expected:
- Total Equity: $0
- Usable Equity: $0
- Borrowing Capacity: ~$568,000
- Can purchase with savings as deposit
```

**Test Set 3: Edge Case - Negative Equity**
```javascript
{
  propertyValue: 500000,
  loanAmount: 550000,
  annualIncome: 80000,
  monthlyExpenses: 3500,
  otherDebts: 20000,
  cashSavings: 10000
}
Expected:
- Total Equity: -$50,000
- Warning message displayed
- Recommendation: Not ready to invest
```

---

## Performance Guidelines

### Optimization Rules
1. **Minimize DOM manipulation** - Batch updates where possible
2. **Debounce input events** - Don't recalculate on every keystroke
3. **Use event delegation** - For dynamic elements
4. **Lazy load images** - When we add images later
5. **Minimize localStorage writes** - Debounce save operations

### Example: Debounced Input
```javascript
// Don't recalculate on every keystroke
let debounceTimer;

function handleInputChange() {
  clearTimeout(debounceTimer);

  debounceTimer = setTimeout(() => {
    calculateFinancials();
    saveToLocalStorage();
  }, 500); // Wait 500ms after user stops typing
}

// Attach to inputs
document.getElementById('propertyValue').addEventListener('input', handleInputChange);
```

---

## Security Considerations

### Input Sanitization
```javascript
// Always sanitize user inputs
function sanitizeInput(input) {
  // Remove any non-numeric characters except decimal point
  return input.replace(/[^0-9.]/g, '');
}

// Use before processing
const cleanValue = sanitizeInput(userInput);
```

### LocalStorage Safety
```javascript
// Never store sensitive data in localStorage
// ✅ OK to store:
// - Property values
// - Calculation results
// - User preferences

// ❌ NEVER store:
// - Passwords
// - API keys
// - Personal identification numbers
// - Banking details
```

---

## Git Commit Standards (When Using Version Control)

### Commit Message Format
```
type: Short description (max 50 chars)

Longer explanation if needed (wrap at 72 chars)
- Bullet points for multiple changes
- Another change

Refs: #issue-number (if applicable)
```

### Commit Types
- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `style:` Code style changes (formatting)
- `refactor:` Code refactoring
- `test:` Adding tests
- `chore:` Maintenance tasks

### Examples
```
feat: Add equity calculator to Stage 1

- Implement total equity calculation
- Add usable equity at 80% LVR
- Create summary card display
- Add localStorage persistence

fix: Correct borrowing capacity formula

The previous calculation didn't account for other debts.
Now using: (income - expenses - debts) * 6

style: Improve mobile responsive layout

- Increase touch target sizes to 44px
- Adjust spacing for better readability
- Fix card layout on small screens
```

---

## Documentation Standards

### Function Documentation (JSDoc)
```javascript
/**
 * Calculate the maximum purchase price based on equity and borrowing capacity
 *
 * @param {number} usableEquity - Available equity from existing property
 * @param {number} borrowingCapacity - Maximum amount user can borrow
 * @param {number} [lvrTarget=0.8] - Target Loan-to-Value ratio (default 80%)
 * @returns {object} Object containing maxPurchase, depositAmount, loanAmount
 * @throws {Error} If inputs are invalid or negative
 *
 * @example
 * const result = calculateMaxPurchase(86000, 620000, 0.8);
 * // Returns: { maxPurchase: 706000, depositAmount: 141200, loanAmount: 564800 }
 */
function calculateMaxPurchase(usableEquity, borrowingCapacity, lvrTarget = 0.8) {
  // Function implementation
}
```

---

### Optional Form Sections (Toggles)
When a section is controlled by a toggle (e.g. HECS/HELP), follow this pattern:

```javascript
const $toggle = document.getElementById('hasHecs');
const $dependentFields = document.getElementById('hecsFields');

function toggleHecsFields(forceState) {
  const active = typeof forceState === 'boolean' ? forceState : $toggle.checked;
  if (active) {
    $dependentFields.classList.remove('hidden');
  } else {
    $dependentFields.classList.add('hidden');
    $hecsBalance.value = '';
    $hecsMonthlyRepayment.value = '';
  }
}

$toggle.addEventListener('change', () => {
  toggleHecsFields();
  saveToLocalStorage();
  updateSummaryCard();
});
```

Key points:
- Always hide dependent fields when the toggle is off.
- Clear values when hiding so stale data does not affect calculations.
- Persist the toggle state in localStorage so it restores on reload.
- When the toggle affects calculations, recompute immediately after change.

---

## Coding Principles

### DRY (Don't Repeat Yourself)
```javascript
// ❌ Bad: Repetitive code
const equity1 = property1Value - loan1Amount;
const equity2 = property2Value - loan2Amount;
const equity3 = property3Value - loan3Amount;

// ✅ Good: Reusable function
function calculateEquity(propertyValue, loanAmount) {
  return propertyValue - loanAmount;
}

const equity1 = calculateEquity(property1Value, loan1Amount);
const equity2 = calculateEquity(property2Value, loan2Amount);
const equity3 = calculateEquity(property3Value, loan3Amount);
```

### KISS (Keep It Simple, Stupid)
```javascript
// ❌ Overly complex
const result = arr.reduce((acc, val) => acc + val, 0) / arr.length;

// ✅ Simple and clear
const sum = arr.reduce((total, value) => total + value, 0);
const average = sum / arr.length;
```

### Single Responsibility Principle
```javascript
// ❌ Function doing too many things
function processAndDisplayResults() {
  const data = getInputs();
  const results = calculate(data);
  updateUI(results);
  saveToStorage(results);
  sendAnalytics(results);
}

// ✅ Each function has one job
function getFormData() { /* ... */ }
function calculateResults(data) { /* ... */ }
function displayResults(results) { /* ... */ }
function saveResults(results) { /* ... */ }

// Then orchestrate
const data = getFormData();
const results = calculateResults(data);
displayResults(results);
saveResults(results);
```

---

## Error Messages

### User-Friendly Error Messages
```javascript
// ❌ Technical error message
"NaN returned from parseFloat()"

// ✅ User-friendly message
"Please enter a valid number for property value"

// ❌ Generic error
"Error occurred"

// ✅ Specific, actionable error
"Annual income must be greater than zero. Please enter your gross annual income."
```

### Error Display
```javascript
function showError(message, fieldId = null) {
  // Create error element
  const errorDiv = document.createElement('div');
  errorDiv.className = 'form-error-text';
  errorDiv.textContent = message;
  errorDiv.setAttribute('role', 'alert');

  // If field specified, show error below that field
  if (fieldId) {
    const field = document.getElementById(fieldId);
    const existingError = field.nextElementSibling;

    // Remove existing error if present
    if (existingError && existingError.classList.contains('form-error-text')) {
      existingError.remove();
    }

    // Add new error
    field.insertAdjacentElement('afterend', errorDiv);
    field.classList.add('form-input-error');
    field.setAttribute('aria-invalid', 'true');
  }
}
```
