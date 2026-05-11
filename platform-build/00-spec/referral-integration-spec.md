# Referral Integration Specification: Property Purchase Guidance Platform (NSW v1)

## Document metadata
| Property | Value |
|----------|-------|
| Version | 1.0 |
| Architecture | Static site (no backend server) |
| Form handling | Formspree (primary), Basin (fallback) |
| Analytics | Plausible (privacy-focused) |
| Revenue model | Warm referral fees from partner professionals |

---

## 1. Referral system overview

The platform generates revenue by connecting users with verified professional partners at moments of high intent: e.g., after using a calculator, reading a guide, or completing a checklist. The system captures lead context, validates consent, and hands off structured data to partners.

Design constraints:
- No backend server or database at v1
- All lead capture via third-party form services
- Client-side analytics only (no user tracking cookies)
- All data handling must comply with Australian Privacy Act 1988 and Spam Act 2003

### Lead lifecycle

```
User interacts with content
        |
        v
Contextual CTA triggers (based on persona + journey stage)
        |
        v
Modal or inline form captures lead details + intent
        |
        v
Consent checkbox + privacy notice (mandatory)
        |
        v
Form submits to form service (Formspree / Basin)
        |
        v
Form service triggers notifications:
  - Email to partner (immediate)
  - Email to platform ops (log)
  - Optional: webhook to partner CRM (v2)
        |
        v
Partner contacts lead within agreed SLA
        |
        v
Partner reports outcome (converted / not converted / invalid)
        |
        v
Platform records attribution for reporting
```

---

## 2. CTA technical design

### 2.1 CTA placement strategy

CTAs appear at high-intent moments defined by content module and persona:

| Content module | CTA type | Primary target | Trigger moment |
|----------------|----------|----------------|----------------|
| Stamp duty calculator result | Inline form | All personas | After viewing estimate |
| FHB grant eligibility result | Inline form | FHB-OO, INV-NEW | After eligibility check |
| Pre-approval guide | Sticky banner | FHB-OO, INV-NEW | Scroll depth > 70% |
| Conveyancing checklist | Inline form | All personas | After checklist completion |
| Suburb analysis page | Modal | INV-NEW, INV-EXP | After 60 seconds on page |
| Deal analyser result (v2) | Inline form | INV-NEW, INV-EXP | After saving analysis |
| Post-purchase ownership guide | Inline form | FHB-OO | After guide completion |

### 2.2 CTA rendering modes

**Inline form**
- Embedded directly below the content element (e.g., calculator results)
- Always visible, no click required to reveal
- Best for: high-intent moments where the user has just consumed value

**Modal overlay**
- Triggered by user action (button click) or scroll/time threshold
- Dimmed background, centred form, close button (ESC key works)
- Best for: lower-intent moments where the CTA could interrupt reading

**Sticky banner**
- Fixed-position bar at bottom of viewport on mobile, top-right on desktop
- Contains headline + CTA button that opens modal
- Dismissible with 24-hour cookie (no personal data stored)
- Best for: passive nurturing on long-form content pages

**External link (de-emphasised)**
- Opens partner website in new tab
- UTM parameters appended automatically
- No lead capture: used only for directory listings where user browses multiple partners
- Best for: professional directory browsing

### 2.3 CTA component specification

```javascript
// CTA configuration schema (embedded in content front matter)
{
  "cta_id": "stamp-duty-calc-mortgage-broker",  // Unique for tracking
  "cta_type": "inline_form",                    // inline_form | modal | sticky_banner | external_link
  "headline": "Want to lock in your budget?",
  "subheadline": "A mortgage broker can help you understand your borrowing power.",
  "primary_action": "Get matched with a broker",
  "partner_type": "mortgage_broker",            // Filters which partners receive the lead
  "persona_target": ["FHB-OO", "INV-NEW"],
  "context_fields": {                           // Pre-filled from calculator state
    "estimated_purchase_price": "{{calculator.purchase_price}}",
    "persona": "{{user.persona}}",
    "calculator_used": "stamp_duty"
  },
  "disclaimer_key": "referral_disclosure",
  "show_consent_checkbox": true
}
```

### 2.4 Modal specification

- Max width: 560px on desktop, 100% - 32px padding on mobile
- Backdrop: rgba(0,0,0,0.5), click or ESC to close
- Focus trap: Tab cycles within modal, focus returns to trigger on close
- ARIA: `role="dialog"`, `aria-modal="true"`, `aria-labelledby` pointing to headline
- Animation: 200ms fade-in on backdrop, 300ms slide-up on content
- Close button: top-right, 44x44px touch target

---

## 3. Lead capture mechanism

### 3.1 Form fields

All referral forms collect the following fields. Required fields are marked with *.

| Field | Type | Required | Validation | Notes |
|-------|------|----------|------------|-------|
| Full name* | text | Yes | Min 2 chars, max 100 | Stored as `full_name` |
| Email address* | email | Yes | RFC 5322 compliant | Primary contact method |
| Phone number* | tel | Yes | Australian mobile or landline format | E.164 normalisation |
| Preferred contact | select | No | `email`, `phone`, `either` | Default: `either` |
| Postcode* | text | Yes | 4-digit Australian postcode | Used for LGA matching |
| Persona | hidden | Yes | `FHB-OO`, `INV-NEW`, `INV-EXP` | Auto-filled from session |
| Calculator context | hidden | No | JSON string | Key-value pairs from calculator state |
| CTA ID | hidden | Yes | string | Identifies which CTA generated the lead |
| Page path | hidden | Yes | string | `window.location.pathname` at submission |
| Consent* | checkbox | Yes | Must be checked | "I agree to be contacted and have read the privacy notice" |
| Partner preference | select | No | Specific partner ID or `any` | Shown if multiple active partners |

### 3.2 Context payload structure

The `calculator_context` hidden field contains a JSON-serialised object:

```json
{
  "calculator_used": "stamp_duty",
  "inputs": {
    "purchase_price": 850000,
    "property_type": "established_home",
    "first_home_buyer": true,
    "foreign_purchaser": false
  },
  "results": {
    "stamp_duty": 1367,
    "concession_applied": "fhb_assistance",
    "savings": 32083
  },
  "timestamp": "2024-07-15T09:30:00.000Z"
}
```

This context is critical for lead quality: it tells the partner exactly what the user was doing and what their estimated position is.

### 3.3 Field validation rules

**Client-side (pre-submission)**
- Full name: non-empty, matches `/^[\p{L}\s'-]{2,100}$/u`
- Email: HTML5 email validation + regex `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`
- Phone: Australian format: strips non-digits, validates length 10 (landline with area code) or 9-10 (mobile starting with 04), normalises to E.164 (+61)
- Postcode: 4 digits, matches known Australian postcode ranges
- Consent: must be checked: form submit blocked if unchecked

**Server-side (form service)**
- Formspree runs basic spam filtering (honeypot, Akismet)
- Duplicate submissions within 5 minutes from same email are flagged
- Blocklist of known spam domains applied

### 3.4 Storage approach for static site

Since there is no backend, lead data is stored in three places:

1. **Form service (primary store)**: Formspree holds all submissions in their dashboard
2. **Partner notification email**: Immediate email with lead details sent to matched partner
3. **Platform operations email**: BCC copy sent to platform ops for reconciliation

No client-side storage of lead data (no `localStorage`, `sessionStorage`, or cookies containing PII). Session context (persona, calculator inputs) is held in memory only and lost on page refresh.

**v2 migration path**: Replace form-service storage with direct API calls to a serverless function (AWS Lambda / Cloudflare Worker) that writes to a database and triggers richer notifications.

---

## 4. Tracking and attribution

### 4.1 UTM parameter scheme

All external links to partner websites include UTM parameters:

| Parameter | Value format | Example |
|-----------|-------------|---------|
| `utm_source` | `propertyguide` | Fixed platform identifier |
| `utm_medium` | `referral` | Fixed for all partner referrals |
| `utm_campaign` | `{persona_id}_{journey_stage}` | `fhb-oo_pre-purchase` |
| `utm_content` | `{cta_id}` | `stamp-duty-calc-mortgage-broker` |
| `utm_term` | `{partner_id}` | `acme-brokers` |

Example:
```
https://acmebrokers.com.au/contact?utm_source=propertyguide&utm_medium=referral&utm_campaign=fhb-oo_pre-purchase&utm_content=stamp-duty-calc-mortgage-broker&utm_term=acme-brokers
```

### 4.2 Referral source tagging

Every lead carries metadata for end-to-end attribution:

```json
{
  "referral_source": {
    "platform": "propertyguide",
    "version": "1.0",
    "page_path": "/guides/stamp-duty-nsw",
    "cta_id": "stamp-duty-calc-mortgage-broker",
    "content_module": "stamp_duty_calculator",
    "persona": "FHB-OO",
    "journey_stage": "pre_purchase",
    "timestamp_utc": "2024-07-15T09:30:00.000Z",
    "session_id": "anon_169a7f2e"  // Ephemeral, not linked to identity
  }
}
```

The `session_id` is a random 16-character string generated on first visit, stored in a first-party cookie with no PII. It expires at browser close. Used only for session-level analytics (page sequences, calculator usage), not for cross-session tracking.

### 4.3 Conversion attribution

Partner-reported conversion is the attribution mechanism at v1:

1. Partner receives lead with a unique `lead_reference` in the notification email
2. Partner clicks outcome-reporting link (one-click: converted, not converted, invalid)
3. Platform records outcome against the lead reference
4. Monthly reconciliation via email digest

**v2 enhancement**: Outcome reporting via partner dashboard with auto-reminders.

### 4.4 Analytics events

Plausible tracks the following custom events (privacy-focused, no cookies, no personal data):

| Event name | Trigger | Props |
|------------|---------|-------|
| `cta_view` | CTA enters viewport | `cta_id`, `cta_type`, `content_module` |
| `cta_click` | User clicks CTA button | `cta_id`, `cta_type`, `persona` |
| `form_start` | User focuses first form field | `cta_id`, `form_type` |
| `form_submit` | Form passes validation and submits | `cta_id`, `partner_type`, `persona` |
| `form_error` | Validation fails | `cta_id`, `field_name`, `error_type` |
| `form_abandon` | User starts form but does not submit within 60s | `cta_id`, `fields_completed` |
| `consent_given` | Consent checkbox checked | `cta_id` |
| `partner_match` | Partner matched to lead | `partner_id`, `partner_type`, `lga` |
| `external_referral` | User clicks external partner link | `partner_id`, `utm_campaign` |

All events are anonymous. No email, name, phone, or postcode is sent to analytics.

---

## 5. Handoff to partners

### 5.1 Partner matching logic

When a lead is submitted, the platform selects the best-matching partner:

```
1. Filter by partner_type (e.g., mortgage_broker)
2. Filter by status = "active"
3. Filter by service_areas containing lead's LGA (derived from postcode)
4. Filter by target_personas containing lead's persona
5. Filter by remaining monthly capacity (lead_volume_monthly_cap)
6. Select highest-rated partner with capacity
7. If no LGA match, select nearest metro partner with "remote" service type
8. If multiple equally-rated partners, round-robin
```

Matching is deterministic and reproducible: the same lead context always produces the same partner match. This is important for fair lead distribution.

### 5.2 Partner notification email

Each lead triggers an immediate email to the matched partner:

```
Subject: New referral: {persona_label} in {suburb} ({postcode})

---

Lead reference: PG-2024-07-15-a7f2e
Received: 15 July 2024 at 7:30 PM AEST

CONTACT DETAILS
Name: {full_name}
Email: {email}
Phone: {phone}
Preferred contact: {preferred_contact}
Location: {postcode} → {lga_name}

CONTEXT
Persona: {persona_label}
Journey stage: {journey_stage}
Content module: {content_module}
CTA: {cta_id}

CALCULATOR CONTEXT
{Formatted key-value pairs from calculator_context}

REFERRAL TERMS
This lead is provided under your active referral agreement.
Please report outcome within 14 days:
[Converted] [Not converted] [Invalid lead]

---
This email was sent by Property Purchase Guidance Platform.
Platform contact: hello@propertyguide.example
```

### 5.3 Platform operations email

A copy is BCC'd to platform operations:

```
Subject: [LEAD LOG] {persona} → {partner_type} → {partner_name}
```

This is used for manual reconciliation, dispute resolution, and reporting.

### 5.4 CRM integration points (v2)

Form services support webhook forwarding:

| CRM | Integration method | Trigger |
|-----|-------------------|---------|
| HubSpot | Formspree → Zapier → HubSpot | New submission |
| Salesforce | Formspree → Zapier → Salesforce | New submission |
| Pipedrive | Basin native webhook | New submission |
| Custom CRM | Direct webhook from form service | New submission |

Webhook payload structure:

```json
{
  "event": "lead.submitted",
  "timestamp": "2024-07-15T09:30:00.000Z",
  "data": {
    "lead_reference": "PG-2024-07-15-a7f2e",
    "full_name": "...",
    "email": "...",
    "phone": "...",
    "postcode": "...",
    "lga_name": "...",
    "persona": "FHB-OO",
    "partner_type": "mortgage_broker",
    "partner_id": "acme-brokers",
    "calculator_context": { ... },
    "utm": { ... }
  }
}
```

### 5.5 Partner SLA

| Metric | Requirement | Enforcement |
|--------|-------------|-------------|
| First contact | Within 4 business hours | Manual check via partner self-reporting |
| Outcome reporting | Within 14 days of lead receipt | Automated reminder email at 10 days |
| Lead quality feedback | Monthly survey | Email-based, optional |
| Maximum response time | 24 hours | Escalation to platform ops after breach |

---

## 6. Privacy considerations

### 6.1 Consent flow

Every form includes a mandatory consent block:

```
[ ] I agree to be contacted by a {partner_type} about my property 
    enquiry. I have read and understand the [privacy notice].
    
    - Your information will be shared with {partner_name}
    - They may contact you by {preferred_contact_method}
    - You can withdraw consent at any time
    - See our full [privacy policy] for details
```

- Checkbox is unchecked by default (opt-in, not opt-out)
- Form submission is blocked until checkbox is checked
- The `[privacy notice]` link opens a modal with the full privacy disclosure
- The privacy notice is persona-aware (simpler language for FHB-OO)

### 6.2 Data handling

| Aspect | Approach |
|--------|----------|
| Data minimisation | Only collect fields essential for partner handoff |
| Storage location | Formspree (US-hosted): disclose in privacy policy. Consider Basin (EU-hosted) for GDPR alignment. |
| Retention | 12 months in form service, then archived or deleted |
| Access | Platform ops (view only), matched partner (full lead), no other third parties |
| Encryption | HTTPS in transit, form service encryption at rest |
| Anonymisation | Analytics events never contain PII |
| Breach notification | Partners must notify platform within 24 hours of any data breach |

### 6.3 Privacy policy requirements

The platform privacy policy must cover:

1. **Collection**: What data is collected and why
2. **Use**: How data is used (referral matching only)
3. **Disclosure**: Which partners receive data and under what terms
4. **Storage**: Where and for how long data is stored
5. **Rights**: How users access, correct, or delete their data
6. **Complaints**: How to lodge a privacy complaint
7. **Cross-border disclosure**: Formspree data storage in the US
8. **Notifiable Data Breaches scheme**: Commitment to report eligible breaches under the Privacy Act

### 6.4 Spam Act compliance

- All commercial emails from partners must include an unsubscribe mechanism
- Platform provides template unsubscribe footer for partner notification emails
- Partners agree not to use lead data for marketing unrelated to the original enquiry
- Platform monitors for spam complaints and can terminate partner agreements

---

## 7. Partner onboarding workflow

### 7.1 Onboarding stages

```
APPLIED
  |
  v
VETTED ←── Background check, credential verification, reference check
  |
  v
AGREED ←── Referral agreement signed (CPA or flat fee structure)
  |
  v
ACTIVE ←── Profile published, eligible for lead matching
  |
  v
PAUSED ←── Temporarily not accepting leads (manual toggle)
  |
  v
TERMINATED ←── Agreement ended, profile unpublished
```

### 7.2 Application process

1. **Application form**: Public form collecting:
   - Business details (name, ABN, legal structure)
   - Contact details
   - Service categories (select from `partner_type` enum)
   - Service areas (LGA selection)
   - Target personas
   - Credentials (license numbers, memberships)
   - Professional indemnity insurance details
   - Expected lead volume capacity
   - Referees (2 minimum)

2. **Vetting checklist** (platform ops):
   - [ ] ABN lookup and business registration verified
   - [ ] Relevant licence verified (ASIC for brokers, SRA for conveyancers, etc.)
   - [ ] Professional indemnity insurance current
   - [ ] Referees contacted and confirmed
   - [ ] No adverse findings in public records
   - [ ] Interview conducted (phone or video)

3. **Referral agreement** (legal):
   - Exclusivity: non-exclusive (platform may refer to multiple partners)
   - Fee structure: CPA or flat fee per successful conversion
   - Payment terms: 30 days after month-end
   - Data handling: partner agrees to Privacy Act compliance
   - SLA: first contact within 4 hours, outcome reporting within 14 days
   - Termination: 30 days written notice by either party
   - Dispute resolution: mediation, then arbitration

4. **Activation**:
   - Partner profile added to `professional-network-schema.json`
   - Status set to `active`
   - Lead matching begins immediately
   - Partner receives onboarding pack (email templates, reporting links, FAQ)

### 7.3 Partner profile management

Partners can request profile updates by emailing platform ops:

| Change type | Turnaround | Notes |
|-------------|-----------|-------|
| Contact details | 24 hours | Phone, email, address |
| Service areas | 48 hours | May require re-vetting for new LGAs |
| Specialisations | 24 hours | Free-text update |
| Credentials | 48 hours | Requires verification |
| Capacity | Immediate | Platform ops toggle in data file |
| Status (pause/resume) | Immediate | Self-service link in partner pack |

### 7.4 Ongoing quality assurance

- Quarterly partner review: lead volume, conversion rate, response time, user feedback
- Annual re-vetting: credential renewal, insurance status, reference refresh
- Minimum performance threshold: 50% response rate, 20% conversion rate
- Partners falling below threshold placed on improvement plan or terminated

---

## 8. Lead quality scoring

### 8.1 Scoring model

Each lead is scored from 0-100 based on signal strength:

| Signal | Points | Condition |
|--------|--------|-----------|
| Calculator used | +20 | Lead submitted from a calculator page |
| Full context provided | +15 | All calculator inputs and results included |
| Persona identified | +10 | Non-default persona selected |
| Phone provided | +10 | Phone number is valid and Australian mobile |
| Postcode matches LGA | +10 | Postcode resolves to a known NSW LGA |
| Multiple pages visited | +10 | Session includes 3+ page views |
| Return visit | +10 | User has visited site before (same session cookie) |
| Long session | +10 | Session duration > 5 minutes |
| Incomplete form | -10 | Some context fields missing |
| Suspicious pattern | -20 | Rapid form submission (< 5s on page) |
| Known spam domain | -50 | Email domain matches spam list |

### 8.2 Quality tiers

| Score | Tier | Action |
|-------|------|--------|
| 80-100 | Hot | Flag as priority in partner notification |
| 50-79 | Warm | Standard partner notification |
| 20-49 | Cool | Include in notification with low-priority flag |
| 0-19 | Cold | Hold for manual review, do not send to partner |
| < 0 | Rejected | Discard, log for spam analysis |

Scoring is calculated client-side before form submission and included in the payload as `lead_score`. Partners see the tier, not the raw score.

### 8.3 Partner feedback loop

Partners report lead quality after contact:

| Rating | Meaning | Action |
|--------|---------|--------|
| Excellent | Converted or highly likely | Increase partner's lead priority |
| Good | Genuine enquiry, not yet converted | Standard handling |
| Fair | Some interest, timing not right | Add to nurture queue |
| Poor | Uncontactable or wrong number | Review validation rules |
| Invalid | Spam, wrong category, duplicate | Deduct from partner's bill |

---

## 9. Reporting requirements

### 9.1 Metrics tracked

| Category | Metric | Source | Frequency |
|----------|--------|--------|-----------|
| **Traffic** | Unique visitors | Plausible | Daily |
| | Page views by content module | Plausible | Daily |
| | Average session duration | Plausible | Daily |
| **Engagement** | Calculator completions | Plausible events | Daily |
| | Guide completion rate | Plausible events | Daily |
| | CTA impression rate | Plausible events | Daily |
| **Lead generation** | Total leads submitted | Form service | Real-time |
| | Leads by persona | Form submissions | Daily |
| | Leads by partner type | Form submissions | Daily |
| | Leads by LGA | Form submissions (postcode → LGA) | Daily |
| | Average lead quality score | Calculated | Daily |
| | Form abandonment rate | Plausible events | Daily |
| **Partner performance** | Leads sent per partner | Form submissions | Daily |
| | Partner response rate | Partner self-reporting | Weekly |
| | Partner conversion rate | Partner self-reporting | Weekly |
| | Average time to first contact | Partner self-reporting | Weekly |
| | Partner quality ratings | Partner feedback | Monthly |
| **Revenue** | Estimated referral revenue | Calculated (leads × CPA × conversion rate) | Monthly |
| | Revenue by partner type | Calculated | Monthly |
| | Revenue by persona | Calculated | Monthly |

### 9.2 Reporting cadence

| Report | Audience | Frequency | Distribution |
|--------|----------|-----------|--------------|
| Traffic summary | Platform ops | Daily | Email |
| Lead pipeline | Platform ops | Daily | Form service dashboard |
| Partner performance | Platform ops, partners | Weekly | Email digest |
| Revenue estimate | Platform ops, stakeholders | Monthly | Email + spreadsheet |
| Quarterly business review | All stakeholders | Quarterly | Presentation |

### 9.3 v2 reporting enhancements

- Real-time dashboard (serverless backend + frontend dashboard)
- Automated partner scorecards with trend analysis
- Conversion funnel visualisation (visitor → calculator user → lead → converted)
- cohort analysis by acquisition channel and persona
- Revenue forecasting based on lead pipeline and historical conversion rates

---

## 10. Implementation checklist

### Phase 1: Foundation
- [ ] Set up Formspree account with dedicated workspace
- [ ] Configure form endpoints for each partner type
- [ ] Build CTA component (inline, modal, sticky)
- [ ] Build lead capture form with all fields and validation
- [ ] Implement consent checkbox and privacy notice modal
- [ ] Set up Plausible analytics with custom events
- [ ] Configure UTM parameter builder
- [ ] Build partner matching logic (client-side)
- [ ] Create partner notification email template
- [ ] Create platform ops BCC template

### Phase 2: Partner onboarding
- [ ] Build partner application form
- [ ] Create vetting checklist template
- [ ] Draft referral agreement (legal review)
- [ ] Onboard 3-5 pilot partners per category
- [ ] Test end-to-end lead flow with pilot partners
- [ ] Configure outcome reporting links

### Phase 3: Optimisation
- [ ] Implement lead quality scoring
- [ ] A/B test CTA copy and placement
- [ ] Review partner SLAs after 30 days of live leads
- [ ] Refine partner matching algorithm based on feedback
- [ ] Build automated reporting (email digests)

---

## 11. Technology stack summary

| Component | v1 (static) | v2 (serverless) | v3 (full platform) |
|-----------|-------------|-----------------|-------------------|
| Form capture | Formspree / Basin | Cloudflare Worker + database | Custom API |
| Lead storage | Form service dashboard | PostgreSQL / DynamoDB | PostgreSQL + Redis |
| Partner matching | Client-side JS | Serverless function | API service |
| Notifications | Form service email | SendGrid / Postmark | Internal notification service |
| Analytics | Plausible | Plausible + custom events | Plausible + Mixpanel |
| Partner dashboard | N/A (email only) | Next.js dashboard app | Integrated dashboard |
| Reporting | Manual spreadsheet | Automated email + dashboard | Real-time BI |
| CRM integration | Zapier webhooks | Direct API integrations | Native integrations |
