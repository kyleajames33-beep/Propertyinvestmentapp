# Lead Capture Field Specifications

## Version: 1.0 | Jurisdiction: NSW, Australia

This document defines the lead capture form fields for each professional type in the referral system. All forms comply with the platform's design rules: maximum 9 fields per form (split into two steps if exceeded), phone number optional on all forms, disclosure below every form, and progressive disclosure patterns.

---

## Table of Contents

1. [Universal Fields](#universal-fields)
2. [Mortgage Broker](#mortgage-broker)
3. [Conveyancer](#conveyancer)
4. [Buyer's Agent](#buyers-agent)
5. [Building Inspector](#building-inspector)
6. [Property Manager](#property-manager)
7. [Accountant / Tax Specialist](#accountant-tax-specialist)
8. [Privacy Consent](#privacy-consent)
9. [Progressive Disclosure Layout](#progressive-disclosure-layout)
10. [Field Type Reference](#field-type-reference)

---

## Universal Fields

The following fields appear on every lead capture form across all professional types:

| Field Name | Field Type | Required | Validation | Purpose |
|-----------|------------|----------|------------|---------|
| `full_name` | text | Yes | Min 2 chars, max 100 chars, letters/spaces/hyphens only | Identify the lead for the professional |
| `email_address` | email | Yes | Valid email format, max 254 chars | Primary contact method and lead delivery |
| `phone_number` | tel | No | Australian mobile or landline format (E.164 or 04XX XXX XXX / 0X XXXX XXXX) | Preferred contact method. Optional but recommended |
| `preferred_contact_time` | select | No | Options: morning (8am-12pm), afternoon (12pm-5pm), evening (5pm-8pm), any_time | Respects user's availability |
| `privacy_consent` | checkbox | Yes | Must be checked to submit | Legal requirement for data collection |
| `referral_disclosure_seen` | hidden | Yes | Auto-set to true | Tracks that disclosure was displayed |

**Universal field count: 6 fields** (4 visible, 1 optional, 1 hidden)

This leaves room for **3 additional profession-specific fields** before hitting the 9-field limit.

---

## Mortgage Broker

**Form ID**: `lead-form-mortgage-broker`

### Field Specification

| Field Name | Field Type | Required | Validation Rules | Purpose |
|-----------|------------|----------|------------------|---------|
| `full_name` | text | Yes | Universal validation | Lead identification |
| `email_address` | email | Yes | Universal validation | Primary contact |
| `phone_number` | tel | No | Universal validation | Preferred contact |
| `approximate_purchase_price` | select | Yes | Options: under_500k, 500k_to_750k, 750k_to_1m, 1m_to_1_5m, 1_5m_plus | Determines loan size and lender options |
| `deposit_saved_estimate` | select | Yes | Options: under_5pct, 5pct_to_10pct, 10pct_to_20pct, over_20pct, unsure | Determines LVR, LMI requirement, scheme eligibility |
| `employment_type` | select | Yes | Options: payg_fulltime, payg_parttime, casual, self_employed, contractor, other | Affects lender options and documentation requirements |
| `preferred_contact_time` | select | No | Universal options | Scheduling |
| `existing_debts` | multi_select | No | Options: credit_card, car_loan, hecs_help, personal_loan, none | Affects servicing calculation |
| `property_type_interest` | select | No | Options: owner_occupied, investment, both | Determines loan product recommendations |
| `privacy_consent` | checkbox | Yes | Must be checked | Legal compliance |

### Form Layout

**Step 1 (always shown):** full_name, email_address, phone_number
**Step 2 (revealed after Step 1 complete):** approximate_purchase_price, deposit_saved_estimate, employment_type, existing_debts, property_type_interest, preferred_contact_time, privacy_consent

**Total visible fields: 10** -- requires 2-step split.

### Profession-Specific Notes

- `employment_type` = "self_employed" or "contractor" triggers a follow-up question about years of financials available (2 full years required by most lenders)
- `deposit_saved_estimate` = "under_5pct" triggers scheme eligibility notes (Help to Buy, Home Guarantee Scheme)
- `approximate_purchase_price` informs which lenders and products the broker should prepare

---

## Conveyancer

**Form ID**: `lead-form-conveyancer`

### Field Specification

| Field Name | Field Type | Required | Validation Rules | Purpose |
|-----------|------------|----------|------------------|---------|
| `full_name` | text | Yes | Universal validation | Lead identification |
| `email_address` | email | Yes | Universal validation | Primary contact |
| `phone_number` | tel | No | Universal validation | Preferred contact |
| `property_address` | text | No | Max 200 chars | Identifies the property for conflict checking |
| `purchase_method` | select | Yes | Options: private_treaty, auction, off_the_plan, unsure | Determines urgency and service type |
| `contract_review_urgency` | select | No | Options: within_24hrs, within_48hrs, within_1_week, flexible | Determines scheduling priority |
| `auction_date` | date | No | Must be today or future date | Critical deadline for the conveyancer |
| `special_conditions_needed` | textarea | No | Max 500 chars | Identifies specific client concerns |
| `preferred_contact_time` | select | No | Universal options | Scheduling |
| `privacy_consent` | checkbox | Yes | Must be checked | Legal compliance |
| `contract_upload` | file | No | PDF, max 10MB | Contract review if already available |

### Form Layout

**Step 1 (always shown):** full_name, email_address, phone_number
**Step 2 (revealed after Step 1):** property_address, purchase_method, contract_review_urgency, auction_date, special_conditions_needed, contract_upload, preferred_contact_time, privacy_consent

**Total visible fields: 11** -- requires 2-step split. File upload only appears on contract review forms (per design rule).

### Profession-Specific Notes

- `purchase_method` = "auction" requires `auction_date` to become a required field
- `auction_date` within 72 hours triggers urgent routing (bypasses standard queue)
- `contract_upload` is optional; form can be submitted without it
- Property address used for conflict of interest checking

---

## Buyer's Agent

**Form ID**: `lead-form-buyers-agent`

### Field Specification

| Field Name | Field Type | Required | Validation Rules | Purpose |
|-----------|------------|----------|------------------|---------|
| `full_name` | text | Yes | Universal validation | Lead identification |
| `email_address` | email | Yes | Universal validation | Primary contact |
| `phone_number` | tel | No | Universal validation | Preferred contact |
| `target_suburbs_regions` | textarea | Yes | Max 300 chars | Defines search geography for the agent |
| `budget_range` | select | Yes | Options: under_500k, 500k_to_750k, 750k_to_1m, 1m_to_1_5m, 1_5m_to_2m, over_2m | Determines property search parameters |
| `property_type_preference` | multi_select | Yes | Options: house, townhouse, apartment, duplex, land, acreage | Narches property search |
| `buyer_type` | select | Yes | Options: owner_occupier, first_home_buyer, investor, developer | Determines service approach |
| `must_haves` | textarea | No | Max 300 chars | Client priorities (schools, transport, etc.) |
| `timeline_to_purchase` | select | No | Options: immediate, 1_to_3_months, 3_to_6_months, 6_to_12_months, just_researching | Determines engagement intensity |
| `preferred_contact_time` | select | No | Universal options | Scheduling |
| `privacy_consent` | checkbox | Yes | Must be checked | Legal compliance |

### Form Layout

**Step 1 (always shown):** full_name, email_address, phone_number
**Step 2 (revealed after Step 1):** target_suburbs_regions, budget_range, property_type_preference, buyer_type, must_haves, timeline_to_purchase, preferred_contact_time, privacy_consent

**Total visible fields: 11** -- requires 2-step split.

### Profession-Specific Notes

- `buyer_type` = "first_home_buyer" triggers FHB-specific agent matching
- `buyer_type` = "investor" triggers additional fields about yield/growth preference
- `target_suburbs_regions` used to match with agents who service those areas
- `timeline_to_purchase` = "immediate" triggers priority routing

---

## Building Inspector

**Form ID**: `lead-form-building-inspector`

### Field Specification

| Field Name | Field Type | Required | Validation Rules | Purpose |
|-----------|------------|----------|------------------|---------|
| `full_name` | text | Yes | Universal validation | Lead identification |
| `email_address` | email | Yes | Universal validation | Primary contact |
| `phone_number` | tel | No | Universal validation | Preferred contact |
| `property_address` | text | Yes | Max 200 chars | Location for the inspector |
| `property_type` | select | Yes | Options: house, townhouse, apartment, unit, villa, other | Determines inspection scope and pricing |
| `property_age_decade` | select | No | Options: pre_1910, 1910_to_1949, 1950_to_1969, 1970_to_1989, 1990_to_2009, 2010_to_present, unknown | Identifies likely issues (e.g., asbestos, lead paint) |
| `inspection_urgency` | select | Yes | Options: this_week, next_week, flexible | Determines scheduling priority |
| `is_auction` | select | No | Options: yes, no, unsure | Auction properties need pre-auction inspection |
| `auction_date` | date | No | Must be today or future, required if is_auction=yes | Hard deadline for inspection |
| `inspection_type` | multi_select | No | Options: building_inspection, pest_inspection, pool_compliance, strata_report | Determines scope and quote |
| `preferred_contact_time` | select | No | Universal options | Scheduling |
| `privacy_consent` | checkbox | Yes | Must be checked | Legal compliance |

### Form Layout

**Step 1 (always shown):** full_name, email_address, phone_number
**Step 2 (revealed after Step 1):** property_address, property_type, property_age_decade, inspection_urgency, is_auction, auction_date, inspection_type, preferred_contact_time, privacy_consent

**Total visible fields: 12** -- requires 2-step split.

### Profession-Specific Notes

- `is_auction` = "yes" makes `auction_date` required and triggers urgent routing
- `property_age_decade` = "pre_1910" triggers heritage/lead-paint notes
- `inspection_type` default includes building_inspection and pest_inspection pre-selected
- Inspector matching based on property address (LGAs serviced)

---

## Property Manager

**Form ID**: `lead-form-property-manager`

### Field Specification

| Field Name | Field Type | Required | Validation Rules | Purpose |
|-----------|------------|----------|------------------|---------|
| `full_name` | text | Yes | Universal validation | Lead identification |
| `email_address` | email | Yes | Universal validation | Primary contact |
| `phone_number` | tel | No | Universal validation | Preferred contact |
| `property_address` | text | Yes | Max 200 chars | Location for manager matching |
| `property_type` | select | Yes | Options: house, townhouse, apartment, duplex, granny_flat, other | Determines management approach |
| `expected_settlement_date` | date | No | Must be today or future | Determines onboarding timing |
| `number_of_properties` | select | No | Options: 1, 2_to_5, 6_to_10, 11_plus | Determines service tier |
| `services_needed` | multi_select | Yes | Options: full_management, tenant_finding, rental_appraisal, condition_report, lease_preparation | Determines quote scope |
| `previous_property_manager` | select | No | Options: self_managed, other_manager, first_time_landlord, other | Identifies switching/transition needs |
| `preferred_contact_time` | select | No | Universal options | Scheduling |
| `privacy_consent` | checkbox | Yes | Must be checked | Legal compliance |

### Form Layout

**Step 1 (always shown):** full_name, email_address, phone_number
**Step 2 (revealed after Step 1):** property_address, property_type, expected_settlement_date, number_of_properties, services_needed, previous_property_manager, preferred_contact_time, privacy_consent

**Total visible fields: 11** -- requires 2-step split.

### Profession-Specific Notes

- `number_of_properties` > 1 triggers portfolio management tier
- `services_needed` = "full_management" is the most common selection
- `previous_property_manager` = "other_manager" triggers switching protocol
- `expected_settlement_date` within 14 days triggers priority onboarding

---

## Accountant / Tax Specialist

**Form ID**: `lead-form-accountant`

### Field Specification

| Field Name | Field Type | Required | Validation Rules | Purpose |
|-----------|------------|----------|------------------|---------|
| `full_name` | text | Yes | Universal validation | Lead identification |
| `email_address` | email | Yes | Universal validation | Primary contact |
| `phone_number` | tel | No | Universal validation | Preferred contact |
| `service_type` | multi_select | Yes | Options: tax_return, negative_gearing, depreciation_schedule, trust_setup, smsf_admin, portfolio_structuring, capital_gains, bookkeeping | Determines specialist matching |
| `number_of_properties` | select | No | Options: 0, 1, 2_to_5, 6_plus | Determines complexity and service tier |
| `current_ownership_structure` | select | No | Options: individual, joint, trust, smsf, company, mixed, unsure | Determines advice scope |
| `annual_taxable_income_range` | select | No | Options: under_50k, 50k_to_100k, 100k_to_150k, 150k_to_200k, over_200k, prefer_not_to_say | Helps match with appropriately experienced accountant |
| `primary_question` | textarea | No | Max 500 chars | Allows client to describe their specific needs |
| `preferred_contact_time` | select | No | Universal options | Scheduling |
| `privacy_consent` | checkbox | Yes | Must be checked | Legal compliance |

### Form Layout

**Step 1 (always shown):** full_name, email_address, phone_number
**Step 2 (revealed after Step 1):** service_type, number_of_properties, current_ownership_structure, annual_taxable_income_range, primary_question, preferred_contact_time, privacy_consent

**Total visible fields: 10** -- requires 2-step split.

### Profession-Specific Notes

- `service_type` = "smsf_admin" or "trust_setup" triggers specialist accountant matching
- `number_of_properties` = "0" with `service_type` including negative_gearing -- warn that negative gearing only applies to existing investments
- `current_ownership_structure` = "unsure" triggers structuring-focused consultation
- `primary_question` helps the accountant prepare for the initial call

---

## Privacy Consent

### Checkbox Text (Default, All Forms)

```
I consent to {{platform_name}} collecting my personal information and sharing it with relevant professional service providers to process my request. I have read and understand the Privacy Policy and referral disclosure. I understand I am under no obligation to proceed with any referred professional.
```

### Checkbox Configuration

- **Default state**: Unchecked (user must actively check)
- **Required**: Yes (form cannot submit without it)
- **Position**: Bottom of form, immediately above the submit button
- **Link**: Privacy policy and referral disclosure pages linked inline
- **Font size**: Same as form body text, not smaller

### Consent Variants by Professional Type

**Mortgage Broker variant:**
```
I consent to {{platform_name}} sharing my contact details and financial situation summary with a licensed mortgage broker for the purpose of a borrowing capacity assessment. I understand the broker will contact me directly and that {{platform_name}} may receive a referral fee if I proceed.
```

**Conveyancer variant:**
```
I consent to {{platform_name}} sharing my contact details and property information with a licensed conveyancer for contract review or settlement services. I understand the conveyancer will contact me directly.
```

**Buyer's Agent variant:**
```
I consent to {{platform_name}} sharing my contact details, property preferences, and budget range with a licensed buyer's agent. I understand the agent will contact me directly to discuss my property search.
```

**Building Inspector variant:**
```
I consent to {{platform_name}} sharing my contact details and property address with a licensed building and pest inspector to arrange an inspection. I understand the inspector will contact me directly to schedule.
```

**Property Manager variant:**
```
I consent to {{platform_name}} sharing my contact details and property information with licensed property managers in the relevant area to obtain management quotes. I understand managers will contact me directly.
```

**Accountant variant:**
```
I consent to {{platform_name}} sharing my contact details and service requirements with a qualified tax accountant. I understand the accountant will contact me directly and that any tax advice will be provided under their own engagement terms.
```

---

## Progressive Disclosure Layout

### Step 1: Contact Details (Universal)

Always shown first. Minimum friction. 3 fields.

```
[Full Name *        ]
[Email Address *    ]
[Phone Number       ]  <- Optional, marked as "Preferred contact method"

[Continue to Details]  <- Button
```

### Step 2: Context-Specific Details

Revealed after Step 1 is valid. Profession-specific fields. Up to 6 additional fields.

```
[Field 4 *          ]
[Field 5 *          ]
[Field 6            ]
[Field 7            ]
[Field 8            ]
[Preferred contact time]

[ ] I consent to {{platform_name}} collecting my personal information...
    [Privacy Policy] [Referral Disclosure]

[Submit Request]  <- Button
```

### Design Principles

1. **No form appears without context.** The user must scroll through the stage content before a CTA is displayed.
2. **Soft CTA is default.** The soft variant is the primary displayed text. Medium and direct variants shown via A/B testing or progressive disclosure (user clicks "learn more" to see direct option).
3. **Maximum 9 fields per form.** If a form exceeds 9 fields, split into two steps: step 1 (contact details, 3 fields), step 2 (contextual details, remaining fields).
4. **Phone number is optional on all forms.** The user can submit with email only. Phone marked as "preferred contact method."
5. **File upload only on contract review forms.** No other stage asks for file uploads.
6. **Disclosure appears below every form.** Copy: "We receive a referral fee from professionals we introduce. This does not affect what you pay. You are under no obligation to proceed. Read our disclosure." (links to `/disclosure`)
7. **Confirmation state.** After submission, the user sees: (a) confirmation message, (b) estimated response time (24 to 48 hours), (c) "Continue your journey" button, (d) option to download the relevant checklist while they wait.
8. **No repeated referrals.** If a user has already submitted a lead for a professional type, the form changes to: "Your [professional] introduction is in progress. [Professional name] will contact you within 24 hours. Need to update your request?"

---

## Field Type Reference

| Field Type | HTML Input | Validation | Notes |
|-----------|------------|------------|-------|
| `text` | `<input type="text">` | Min/max length, character whitelist | Standard text input |
| `email` | `<input type="email">` | RFC 5322 compliant, DNS check optional | Primary contact field |
| `tel` | `<input type="tel">` | Australian phone format | Optional on all forms |
| `select` | `<select>` | Value must be in defined options | Single selection dropdown |
| `multi_select` | Checkbox group or multi-select | At least one option if required | Multiple selections allowed |
| `textarea` | `<textarea>` | Min/max length, character whitelist | Free text input |
| `date` | `<input type="date">` | Must be today or future date | Used for deadlines |
| `file` | `<input type="file">` | PDF, max 10MB | Contract upload only |
| `checkbox` | `<input type="checkbox">` | Must be checked if required | Privacy consent, disclosures |
| `hidden` | `<input type="hidden">` | Auto-set value | Tracking and analytics |

---

## Field Summary by Professional Type

| Field Category | Mortgage Broker | Conveyancer | Buyer's Agent | Building Inspector | Property Manager | Accountant |
|---------------|----------------|-------------|---------------|-------------------|------------------|------------|
| Universal fields | 6 | 6 | 6 | 6 | 6 | 6 |
| Specific fields | 4 | 5 | 5 | 6 | 5 | 4 |
| **Total fields** | **10** | **11** | **11** | **12** | **11** | **10** |
| Requires 2-step | Yes | Yes | Yes | Yes | Yes | Yes |
| Has file upload | No | Yes | No | No | No | No |
| Phone required | No | No | No | No | No | No |

All 6 professional types require 2-step progressive disclosure.
