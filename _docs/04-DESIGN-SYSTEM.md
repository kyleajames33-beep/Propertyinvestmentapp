# Design System & UI Standards

## Color Palette

### Primary Colors
```css
--primary-blue: #2563eb;      /* Main brand color */
--primary-blue-dark: #1e40af; /* Hover states */
--primary-blue-light: #60a5fa; /* Accents */
```

### Semantic Colors
```css
--success-green: #10b981;  /* Positive metrics, success states */
--warning-amber: #f59e0b;  /* Caution, moderate alerts */
--danger-red: #ef4444;     /* Errors, negative metrics */
--info-blue: #3b82f6;      /* Information, help text */
```

### Neutral Colors
```css
--gray-50: #f9fafb;    /* Backgrounds */
--gray-100: #f3f4f6;   /* Light backgrounds */
--gray-200: #e5e7eb;   /* Borders */
--gray-300: #d1d5db;   /* Input borders */
--gray-400: #9ca3af;   /* Disabled states */
--gray-500: #6b7280;   /* Placeholder text */
--gray-600: #4b5563;   /* Secondary text */
--gray-700: #374151;   /* Primary text */
--gray-800: #1f2937;   /* Headings */
--gray-900: #111827;   /* Dark text */
```

### Usage Guide
```css
/* Backgrounds */
body { background: var(--gray-50); }
.card { background: white; }

/* Text */
h1, h2, h3 { color: var(--gray-800); }
p { color: var(--gray-700); }
.text-muted { color: var(--gray-600); }

/* Borders */
.card { border: 1px solid var(--gray-200); }
input { border: 1px solid var(--gray-300); }

/* States */
.success { color: var(--success-green); }
.warning { color: var(--warning-amber); }
.error { color: var(--danger-red); }
```

---

## Typography

### Font Stack
```css
font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
             "Helvetica Neue", Arial, sans-serif;
```

### Font Sizes
```css
--text-xs: 0.75rem;     /* 12px - Small labels */
--text-sm: 0.875rem;    /* 14px - Helper text */
--text-base: 1rem;      /* 16px - Body text */
--text-lg: 1.125rem;    /* 18px - Emphasized text */
--text-xl: 1.25rem;     /* 20px - Subheadings */
--text-2xl: 1.5rem;     /* 24px - Card titles */
--text-3xl: 1.875rem;   /* 30px - Section headers */
--text-4xl: 2.25rem;    /* 36px - Page headers */
--text-5xl: 3rem;       /* 48px - Hero text */
```

### Font Weights
```css
--font-normal: 400;     /* Body text */
--font-medium: 500;     /* Emphasized text */
--font-semibold: 600;   /* Subheadings */
--font-bold: 700;       /* Headings, buttons */
```

### Line Heights
```css
--leading-tight: 1.25;   /* Headings */
--leading-normal: 1.5;   /* Body text */
--leading-relaxed: 1.75; /* Long-form content */
```

### Typography Classes
```css
.heading-1 {
  font-size: var(--text-4xl);
  font-weight: var(--font-bold);
  line-height: var(--leading-tight);
  color: var(--gray-900);
}

.heading-2 {
  font-size: var(--text-3xl);
  font-weight: var(--font-bold);
  line-height: var(--leading-tight);
  color: var(--gray-800);
}

.body-text {
  font-size: var(--text-base);
  line-height: var(--leading-normal);
  color: var(--gray-700);
}

.small-text {
  font-size: var(--text-sm);
  color: var(--gray-600);
}
```

---

## Spacing System

### Base Unit: 4px (0.25rem)
```css
--space-1: 0.25rem;   /* 4px */
--space-2: 0.5rem;    /* 8px */
--space-3: 0.75rem;   /* 12px */
--space-4: 1rem;      /* 16px */
--space-5: 1.25rem;   /* 20px */
--space-6: 1.5rem;    /* 24px */
--space-8: 2rem;      /* 32px */
--space-10: 2.5rem;   /* 40px */
--space-12: 3rem;     /* 48px */
--space-16: 4rem;     /* 64px */
--space-20: 5rem;     /* 80px */
```

### Usage Guidelines
```css
/* Component internal spacing */
padding: var(--space-4);       /* 16px */

/* Between related elements */
margin-bottom: var(--space-2); /* 8px */

/* Between sections */
margin-bottom: var(--space-8); /* 32px */

/* Page margins */
padding: var(--space-6);       /* 24px */
```

---

## Component Styles

### Buttons
```css
.btn {
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

.btn-primary {
  background: var(--primary-blue);
  color: white;
}

.btn-primary:hover {
  background: var(--primary-blue-dark);
  transform: translateY(-1px);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.btn-secondary {
  background: white;
  color: var(--primary-blue);
  border: 2px solid var(--primary-blue);
}

.btn-secondary:hover {
  background: var(--gray-50);
}

.btn-large {
  padding: 1rem 2rem;
  font-size: 1.125rem;
}

.btn-small {
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
}
```

### Cards
```css
.card {
  background: white;
  border-radius: 0.75rem;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid var(--gray-200);
}

.card-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--gray-900);
  margin-bottom: 1rem;
}

.card-highlight {
  border-left: 4px solid var(--primary-blue);
  background: linear-gradient(to right, #eff6ff, white);
}

.card-success {
  border-left: 4px solid var(--success-green);
  background: linear-gradient(to right, #f0fdf4, white);
}

.card-warning {
  border-left: 4px solid var(--warning-amber);
  background: linear-gradient(to right, #fffbeb, white);
}
```

### Input Fields
```css
.form-group {
  margin-bottom: 1.5rem;
}

.form-label {
  display: block;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: var(--gray-700);
  font-size: 0.875rem;
}

.form-input {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid var(--gray-300);
  border-radius: 0.5rem;
  font-size: 1rem;
  transition: all 0.2s ease;
}

.form-input:focus {
  outline: none;
  border-color: var(--primary-blue);
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
}

.form-input::placeholder {
  color: var(--gray-400);
}

.form-input-error {
  border-color: var(--danger-red);
}

.form-input-error:focus {
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
}

.form-help-text {
  font-size: 0.875rem;
  color: var(--gray-600);
  margin-top: 0.25rem;
}

.form-error-text {
  font-size: 0.875rem;
  color: var(--danger-red);
  margin-top: 0.25rem;
}
```

### Containers
```css
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
}

.container-sm {
  max-width: 800px;
  margin: 0 auto;
  padding: 0 1.5rem;
}

.container-xs {
  max-width: 600px;
  margin: 0 auto;
  padding: 0 1.5rem;
}
```

### Grid Layouts
```css
.grid {
  display: grid;
  gap: 1.5rem;
}

.grid-2 {
  grid-template-columns: repeat(2, 1fr);
}

.grid-3 {
  grid-template-columns: repeat(3, 1fr);
}

/* Responsive */
@media (max-width: 768px) {
  .grid-2, .grid-3 {
    grid-template-columns: 1fr;
  }
}
```

---

## Responsive Design

### Breakpoints
```css
/* Mobile: < 640px */
/* Tablet: 640px - 1024px */
/* Desktop: > 1024px */

/* Mobile first approach */
/* Base styles are mobile */

@media (min-width: 640px) {
  /* Tablet styles */
}

@media (min-width: 1024px) {
  /* Desktop styles */
}
```

### Mobile Considerations
```css
/* Touch targets */
.btn, .form-input, a {
  min-height: 44px; /* iOS recommendation */
}

/* Prevent zoom on input focus (iOS) */
.form-input {
  font-size: 16px; /* Prevents auto-zoom */
}

/* Safe areas for notch devices */
body {
  padding-left: env(safe-area-inset-left);
  padding-right: env(safe-area-inset-right);
}
```

---

## Icons & Emojis

### Using Emojis (No Dependencies)
```css
.icon {
  font-size: 1.5rem;
  line-height: 1;
  display: inline-block;
}

.icon-large {
  font-size: 2.5rem;
}
```

### Icon Library
```
💰 - Money, Finance, Earnings
🏠 - House, Property
🏦 - Bank, Loans
📊 - Charts, Analytics
📈 - Growth, Increase
📉 - Decrease
✅ - Success, Completed
❌ - Error, Remove, Cancel
⚠️ - Warning, Caution
🔔 - Notifications, Alerts
⭐ - Favorite, Important
🗺️ - Map, Location
🚆 - Transport
🏫 - School, Education
🛒 - Shopping
💵 - Cash, Rent
📅 - Calendar, Date
📝 - Notes, Documents
🔍 - Search
⚙️ - Settings
```

---

## Animations & Transitions

### Timing Functions
```css
--ease-in: cubic-bezier(0.4, 0, 1, 1);
--ease-out: cubic-bezier(0, 0, 0.2, 1);
--ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
```

### Standard Transitions
```css
/* Hover effects */
transition: all 0.2s var(--ease-out);

/* Page transitions */
transition: all 0.3s var(--ease-in-out);

/* Slow reveals */
transition: all 0.5s var(--ease-out);
```

### Common Animations
```css
/* Fade in */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

/* Slide up */
@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Usage */
.fade-in {
  animation: fadeIn 0.3s ease-out;
}

.slide-up {
  animation: slideUp 0.4s ease-out;
}
```

### Hover Effects
```css
.hover-lift {
  transition: transform 0.2s ease;
}

.hover-lift:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.hover-scale {
  transition: transform 0.2s ease;
}

.hover-scale:hover {
  transform: scale(1.02);
}
```

---

## Utility Classes

### Text Alignment
```css
.text-left { text-align: left; }
.text-center { text-align: center; }
.text-right { text-align: right; }
```

### Display
```css
.hidden { display: none; }
.block { display: block; }
.flex { display: flex; }
.grid { display: grid; }
```

### Flexbox Utilities
```css
.flex-row { flex-direction: row; }
.flex-col { flex-direction: column; }
.items-center { align-items: center; }
.items-start { align-items: flex-start; }
.items-end { align-items: flex-end; }
.justify-center { justify-content: center; }
.justify-between { justify-content: space-between; }
.justify-end { justify-content: flex-end; }
.gap-2 { gap: 0.5rem; }
.gap-4 { gap: 1rem; }
.gap-6 { gap: 1.5rem; }
```

### Spacing Utilities
```css
.mt-2 { margin-top: 0.5rem; }
.mt-4 { margin-top: 1rem; }
.mb-4 { margin-bottom: 1rem; }
.mb-8 { margin-bottom: 2rem; }
.p-4 { padding: 1rem; }
.p-6 { padding: 1.5rem; }
```

### Width Utilities
```css
.w-full { width: 100%; }
.w-1/2 { width: 50%; }
.w-1/3 { width: 33.333%; }
.max-w-sm { max-width: 600px; }
.max-w-md { max-width: 800px; }
.max-w-lg { max-width: 1000px; }
```

---

## Insight Cards

Used in Stage 1 to highlight Borrowing Capacity, Deposit Readiness, and Strategy Focus.

```css
.insight-card {
  background: linear-gradient(135deg, rgba(37, 99, 235, 0.08), rgba(16, 185, 129, 0.08));
  border: 1px solid var(--gray-200);
  border-radius: 0.75rem;
  padding: 1.5rem;
}

.insight-label {
  font-size: 0.75rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--gray-600);
}

.insight-value {
  font-size: 1.875rem;
  font-weight: 700;
  color: var(--gray-900);
}
```

### Usage Notes
- Always display in a responsive grid (min width 220px)
- Keep supporting text concise (one sentence)
- Use for quick-glance metrics that update in real time

---

## Toggle Control

Used for HECS/HELP toggle in Stage 1. Styled as pill switch with inline label.

```css
.toggle-control {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.35rem 0.75rem;
  border-radius: 999px;
  background: rgba(37, 99, 235, 0.08);
  font-weight: 600;
  color: var(--primary-blue-dark);
}

.toggle-control input {
  width: 36px;
  height: 20px;
  appearance: none;
  background: var(--gray-300);
  border-radius: 999px;
  position: relative;
  cursor: pointer;
  transition: background 0.2s;
}

.toggle-control input::after {
  content: '';
  position: absolute;
  top: 2px;
  left: 2px;
  width: 16px;
  height: 16px;
  background: white;
  border-radius: 50%;
  transition: transform 0.2s;
  box-shadow: 0 1px 3px rgba(0,0,0,0.2);
}

.toggle-control input:checked {
  background: var(--primary-blue);
}

.toggle-control input:checked::after {
  transform: translateX(16px);
}
```

### Usage Notes
- Always pair with explanatory helper text
- When toggled off, dependent fields should collapse/clear
- Works best on light backgrounds (use 0.08 opacity fill)

---

## Accessibility

### Focus States
```css
*:focus {
  outline: 2px solid var(--primary-blue);
  outline-offset: 2px;
}

*:focus:not(:focus-visible) {
  outline: none;
}

*:focus-visible {
  outline: 2px solid var(--primary-blue);
  outline-offset: 2px;
}
```

### Screen Reader Only
```css
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}
```

### Color Contrast
- Ensure text meets WCAG AA standards (4.5:1 for normal text)
- Use tools like WebAIM Contrast Checker
- Don't rely on color alone for information

---

## Print Styles
```css
@media print {
  .no-print {
    display: none;
  }

  body {
    background: white;
  }

  .card {
    box-shadow: none;
    border: 1px solid #000;
  }
}
```
