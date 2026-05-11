# Product Roadmap: Property Purchase Guidance Platform

## Document metadata
| Property | Value |
|----------|-------|
| Version | 1.0 |
| Current state | v1 static site (NSW only) |
| Planning horizon | 18 months |

---

## v2 features (months 3-9)

### 2.1 Debt service ratio (DSR) calculator

| Attribute | Detail |
|-----------|--------|
| Description | Calculates gross and net debt service ratios to help users understand borrowing capacity across multiple lenders. Inputs: income, existing debts, proposed loan amount, living expenses. |
| User value | High: bridges the gap between 'what can I afford' and 'what will a bank lend me'. Critical for both FHB-OO and investors. |
| Technical complexity | Medium: pure client-side calculation with adjustable lender buffer rates (3% or floor rate, whichever is higher per APRA). Requires up-to-date lender policy data or manual buffer input. |
| Dependencies | None: can build on v1 calculator component patterns. |
| Estimated priority | P1: high user value, builds on existing calculator infrastructure. |

### 2.2 Post-purchase content modules

| Attribute | Detail |
|-----------|--------|
| Description | Content guides for the ownership phase: property maintenance schedules, insurance requirements, land tax obligations, renovation planning, and building equity. |
| User value | High for FHB-OO: fills a gap where most platforms stop at settlement. Creates ongoing engagement and future referral opportunities (refinance, equity release). |
| Technical complexity | Low: static content following existing guide patterns. No new components required. |
| Dependencies | Content writing and review (subject matter expert input). |
| Estimated priority | P1: low technical cost, high retention value, enables future refinance referrals. |

### 2.3 Refinance and equity release guide

| Attribute | Detail |
|-----------|--------|
| Description | Interactive guide covering when and how to refinance, equity release strategies, and using equity to fund further purchases. Includes equity calculator (current value × LTV - existing loan). |
| User value | High for INV-EXP and growing FHB-OO base: directly supports portfolio scaling and unlocks mortgage broker referral revenue. |
| Technical complexity | Medium: requires equity calculator component + content. Static content with one interactive element. |
| Dependencies | Post-purchase content module (2.2) as conceptual foundation. |
| Estimated priority | P1: directly drives revenue through refinance referrals. |

### 2.4 Quantity surveyor integration

| Attribute | Detail |
|-----------|--------|
| Description | Depreciation schedule estimator for investment properties. Rough calculation of Division 40 (plant and equipment) and Division 43 (capital works) deductions based on property age, type, and value. Referral CTA to quantity surveyor partners. |
| User value | Medium-High for INV-NEW and INV-EXP: tax depreciation is a key investor concern often poorly understood. |
| Technical complexity | Medium: requires depreciation rate tables by asset category and property age. Calculation logic is well-documented (ATO rulings). |
| Dependencies | Partner onboarding for quantity surveyors (professional-network-schema.json already supports this partner type). |
| Estimated priority | P2: strong value for investors, supports referral revenue, but narrower audience. |

### 2.5 Basic property deal analyser

| Attribute | Detail |
|-----------|--------|
| Description | Investment property cashflow calculator. Inputs: purchase price, rent, loan amount, interest rate, council rates, strata, insurance, property management fees, vacancy assumption. Outputs: weekly cashflow, yield, cash-on-cash return. |
| User value | High for INV-NEW and INV-EXP: core tool for investment decision-making. Differentiates platform from generic calculators. |
| Technical complexity | Medium: standard financial calculations, but requires robust input validation and sensitivity display (what if rates rise 1%?). |
| Dependencies | None: standalone calculator. Reuses components from stamp duty calculator. |
| Estimated priority | P1: flagship tool for investor personas, strong referral trigger to mortgage brokers and buyer's agents. |

### 2.6 Dynamic capabilities foundation (enabler)

| Attribute | Detail |
|-----------|--------|
| Description | Migrate from pure static site to serverless architecture: Cloudflare Workers or AWS Lambda for form handling, partner matching, and lead storage. Replace Formspree with custom form endpoints. Add database (PostgreSQL or DynamoDB) for lead records. |
| User value | Low direct user value: enables all other v2/v3 features. |
| Technical complexity | High: foundational infrastructure change. Requires database design, API design, authentication, and deployment pipeline updates. |
| Dependencies | None: but blocks all features marked with serverless requirement. |
| Estimated priority | P0: must be completed before v3 features. Recommended to start in month 3-4 in parallel with P1 content work. |

---

## v3 features (months 9-18)

### 3.1 Email parsing (lender email forwarding)

| Attribute | Detail |
|-----------|--------|
| Description | Users forward pre-approval letters, loan offers, and bank communications to a platform email address. System parses key data (approved amount, interest rate, conditions, expiry) and populates the user's profile. Enables personalised guidance based on actual lender offers. |
| User value | Very high: removes manual data entry, provides personalised comparison, and creates a defensible moat. No competitor offers this in Australia. |
| Technical complexity | High: requires email receiving infrastructure (AWS SES + Lambda), PDF and HTML parsing, NLP for entity extraction, and secure handling of sensitive financial documents. Document retention and deletion policy required under Privacy Act. |
| Dependencies | v2 serverless foundation (2.6), user accounts and authentication, secure document storage. |
| Estimated priority | P1: high differentiation, strong user lock-in, but complex. Defer until serverless foundation is stable. |

### 3.2 Advanced deal analyser with scenario modelling

| Attribute | Detail |
|-----------|--------|
| Description | Enhanced deal analyser supporting multi-scenario comparison: variable vs fixed, interest-only vs P&I, different deposit sizes, renovation scenarios, and projected equity growth. Side-by-side comparison table with visual charts. |
| User value | High for INV-EXP: enables sophisticated analysis previously requiring spreadsheets. Supports better referral conversion for mortgage brokers and buyer's agents. |
| Technical complexity | Medium-High: requires scenario state management, charting library (Chart.js or D3), and potentially monte-carlo simulation for growth projections. |
| Dependencies | v2 basic deal analyser (2.5), v2 serverless foundation (2.6) for saving scenarios to user accounts. |
| Estimated priority | P1: natural evolution of basic deal analyser, high investor value. |

### 3.3 Portfolio tracking dashboard

| Attribute | Detail |
|-----------|--------|
| Description | Registered users can add properties to a portfolio dashboard showing: current value (manual entry or estimate), loan balance, equity, rental income, expenses, cashflow, and yield. Summary-level and property-level views. |
| User value | High for INV-EXP: creates ongoing platform engagement and data foundation for equity release and refinance referrals. |
| Technical complexity | High: requires user authentication, database persistence, data model for properties and loans, and dashboard UI with charts. |
| Dependencies | v2 serverless foundation (2.6), user account system, persistent database. |
| Estimated priority | P2: strong retention mechanism, but requires significant infrastructure. Build after email parsing or in parallel with a separate team. |

### 3.4 Multi-state expansion framework

| Attribute | Detail |
|-----------|--------|
| Description | Extend platform from NSW to VIC, QLD, and other states. Each state requires: stamp duty data, grant/concession data, LGA list, and state-specific disclaimers. Content modules updated for state-specific processes and regulations. |
| User value | High: opens total addressable market by 3-4x. Victoria and Queensland are the natural next states by property transaction volume. |
| Technical complexity | Medium: the data schema is already designed for multi-state (see data-schema.md v2 expansion notes). Effort is in data collection and content creation, not architecture. |
| Dependencies | All state-specific data files must be created and validated. Content modules need state branching logic. |
| Estimated priority | P1: high commercial impact with moderate technical effort due to forward-compatible schema design. |

### 3.5 Automated affordability updates

| Attribute | Detail |
|-----------|--------|
| Description | System monitors RBA cash rate announcements, lender rate changes, and policy updates (APRA buffer changes, grant threshold changes). Automatically updates calculator defaults and notifies affected users via email. |
| User value | Medium-High: keeps calculator outputs accurate without manual intervention. Timely notifications create re-engagement. |
| Technical complexity | Medium: requires web scraping or API integration for rate data, change detection, notification queue, and email delivery. |
| Dependencies | v2 serverless foundation (2.6), notification system, email service provider. |
| Estimated priority | P2: important for trust and accuracy, but can be handled manually at lower volume. |

### 3.6 Partner dashboard (self-service)

| Attribute | Detail |
|-----------|--------|
| Description | Web dashboard for partners to view leads, update profiles, report outcomes, and access analytics. Replaces email-based lead notifications and manual reporting. |
| User value | Medium for partners: reduces friction, improves response times, provides transparency. Indirectly improves user experience through faster partner responses. |
| Technical complexity | Medium: requires authentication (partner accounts), role-based access control, read/write API for partner data, and dashboard UI. |
| Dependencies | v2 serverless foundation (2.6), authentication system, API layer. |
| Estimated priority | P2: improves partner experience but email-based system is functional at v1/v2 scale. |

---

## Migration path: v1 static site to v2 dynamic capabilities

### Phase 1: Infrastructure (months 3-4)

```
v1 static site
      |
      v
+ Deploy Cloudflare Workers (or AWS Lambda)
+ Set up PostgreSQL database (Supabase or Railway)
+ Implement custom form endpoints (parallel to Formspree)
+ Build lead database schema
+ Migrate existing lead data from Formspree export
+ Set up SendGrid or Postmark for transactional email
      |
      v
[v1.5] Static site + serverless backend for forms only
```

**Risk mitigation**: Run Formspree and custom endpoints in parallel for 2 weeks. Compare delivery rates. Roll back to Formspree instantly if issues arise.

### Phase 2: Partner logic (months 5-6)

```
[v1.5]
  |
  v
+ Move partner matching from client-side to serverless function
+ Build lead quality scoring in backend
+ Implement partner notification via email service
+ Add outcome reporting endpoints
+ Build automated reporting (email digests)
  |
  v
[v2.0-alpha] Serverless backend handles all referral logic
```

### Phase 3: User accounts (months 7-8)

```
[v2.0-alpha]
  |
  v
+ Implement user registration and authentication
+ Add saved calculator sessions (user can return to previous calculations)
+ Build profile page with persona and journey stage
+ Add basic portfolio entry (manual property addition)
  |
  v
[v2.0] Full v2 feature set with user accounts
```

**Authentication approach**: Magic link email (passwordless) to reduce friction. OAuth options (Google, Apple) for faster signup. No password storage = reduced security surface area.

### Phase 4: Feature rollout (months 9+)

```
[v2.0]
  |
  v
+ Launch deal analyser (2.5) and DSR calculator (2.1)
+ Release post-purchase content (2.2) and refinance guide (2.3)
+ Launch quantity surveyor integration (2.4)
+ Begin multi-state data collection (3.4)
+ Soft-launch email parsing beta (3.1)
  |
  v
[v3.0] Dynamic platform with advanced tools and multi-state support
```

### Data migration considerations

| v1 asset | Migration approach | Effort |
|----------|-------------------|--------|
| JSON data files | Direct: schema remains compatible, loader changes from `fetch` to `fetch` or API call | Low |
| Form submissions (Formspree) | Export CSV → transform → import to database | Low |
| Partner profiles | JSON file → database records via migration script | Low |
| Analytics (Plausible) | Retain Plausible, supplement with database events | Low |
| User sessions (anonymous) | Not migrated: v2 user accounts start fresh | N/A |
| Disclaimer library | Direct copy: schema unchanged | Low |

### Technical architecture evolution

| Layer | v1 | v2 | v3 |
|-------|-----|-----|-----|
| Front-end | Static HTML/CSS/JS | Static + JS enhancements | Next.js / React SPA |
| Hosting | Static (Cloudflare Pages / Netlify) | Static + Cloudflare Workers | Full-stack platform |
| API | None | Cloudflare Workers | Dedicated API layer |
| Database | None | PostgreSQL (Supabase) | PostgreSQL + Redis |
| Auth | None | Magic link + OAuth | Magic link + OAuth |
| Forms | Formspree / Basin | Custom endpoints | Custom endpoints |
| Email | Formspree native | Postmark / SendGrid | Postmark / SendGrid |
| Storage | None (no uploads) | Object storage (R2/S3) | Object storage |
| Analytics | Plausible | Plausible + database events | Plausible + warehouse |

### Cost evolution (indicative monthly)

| Component | v1 | v2 | v3 |
|-----------|-----|-----|-----|
| Hosting | Free tier | $20-50 | $100-200 |
| Database | N/A | $25-50 | $50-100 |
| Email | N/A | $20-40 | $50-100 |
| Analytics | $20 | $20 | $50 |
| Serverless | N/A | $10-30 | $50-100 |
| **Total** | **~$20** | **~$100-200** | **~$300-550** |

---

## Priority summary

### Immediate (v1 maintenance)
- Monitor partner SLA compliance
- Refine lead quality scoring based on partner feedback
- Onboard additional partners to ensure coverage across LGAs

### Short term (v2, months 3-9)
1. **P0**: Serverless foundation (2.6): enables everything else
2. **P1**: DSR calculator (2.1), post-purchase content (2.2), refinance guide (2.3), deal analyser (2.5)
3. **P1**: Multi-state expansion framework (3.4): high commercial impact
4. **P2**: Quantity surveyor integration (2.4)

### Medium term (v3, months 9-18)
1. **P1**: Advanced deal analyser (3.2): builds on v2 deal analyser
2. **P1**: Email parsing (3.1): major differentiator, defer until infrastructure stable
3. **P2**: Portfolio tracking dashboard (3.3)
4. **P2**: Partner dashboard (3.6)
5. **P2**: Automated affordability updates (3.5)

### Sequencing logic

The recommended build order follows dependency chains:

```
v1 static site
    |
    +-- Serverless foundation (P0)
            |
            +-- User accounts + auth
            |       |
            |       +-- Portfolio dashboard (P2)
            |       +-- Saved calculations (implicit)
            |
            +-- Custom form endpoints
            |       |
            |       +-- Lead quality scoring
            |       +-- Partner dashboard (P2)
            |
            +-- Deal analyser
            |       |
            |       +-- Advanced deal analyser (P1)
            |
            +-- Email service
                    |
                    +-- Email parsing (P1)
                    +-- Automated notifications (P2)
```

Multi-state expansion (3.4) can proceed in parallel with serverless work: it is primarily a data and content effort, not a technical one.
