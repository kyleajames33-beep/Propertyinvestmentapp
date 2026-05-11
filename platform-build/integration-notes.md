# Integration Notes — QA Pass

## Summary

**Overall health rating: Needs Attention**

| Metric | Count |
|---|---|
| Total files reviewed | 76 markdown files across 14 directories |
| Critical issues | 5 |
| Warnings | 9 |
| Suggestions | 7 |

The content layer (journey guides, reference docs, question scripts, checklists, compliance) is comprehensive, well-written, and largely consistent in tone. However, two key infrastructure directories are completely empty, one journey file contains non-NSW data, and several style guide violations (em dashes in body content) are present across 36 files. The issues are all fixable but the empty directories and the non-NSW content must be addressed before launch.

---

## Critical Issues (must fix before launch)

1. **Empty data directory (`02-data/`)** — Directory exists but contains zero files. The `data-schema.md` spec defines 7 required JSON files: `nsw-stamp-duty-brackets.json`, `nsw-fhb-grant-eligibility.json`, `nsw-lga-list.json`, `professional-network-schema.json`, `disclaimer-library.json`, `user-persona-profiles.json`, `site-config.json`. Without these, no calculators, referral routing, or persona-based content personalisation can function.

2. **Empty referral-logic directory (`03-referral-logic/`)** — Directory exists but contains zero files. The spec requires `partner-scoring-rules.json`, `routing-fallback-matrix.json`, and `post-referral-survey.json`. Without these, the warm referral pipeline has no scoring algorithm, no fallback routing, and no feedback loop.

3. **Non-NSW content in journey file** — `/mnt/agents/output/platform-build/01-content/journey/02-finance-prep/02-inv-new.md` (line 46) references Victorian and Queensland stamp duty amounts: "In Victoria, stamp duty on a $600,000 investment property is approximately $31,000. In Queensland, it is approximately $20,000." This violates the NSW-specific content requirement. It should reference the NSW amount (~$23,662 per the stamp duty reference doc).

4. **Outdated Home Guarantee Scheme price cap in journey content** — `/mnt/agents/output/platform-build/01-content/journey/01-strategy/01-fhb-oo.md` (line 67) states the NSW price cap is "$900,000" for capital city areas. The `nsw-fhb-schemes.md` reference doc (correctly) states the cap was increased to "$1,500,000" from 1 October 2025. The journey figure is significantly outdated and could mislead buyers.

5. **Em dashes in journey body content** — 6 journey files contain em dashes (—) in body content, violating the "no em dashes" style guide rule:
   - `journey/07-contract-review/01-fhb-oo.md` (frontmatter sources: "NSW Fair Trading — Cooling Off Period", "Law Society of NSW — Contract Review Guidelines")
   - `journey/07-contract-review/02-inv-new.md` (frontmatter sources)
   - `journey/07-contract-review/03-inv-exp.md` (frontmatter sources)
   - `journey/08-settlement/01-fhb-oo.md` (frontmatter: "title: Settlement Day and Beyond — A First Home Buyer's Guide", "referral_ctas: None at this stage — journey complete")
   - `journey/08-settlement/02-inv-new.md` (frontmatter)
   - `journey/08-settlement/03-inv-exp.md` (frontmatter)
   Frontmatter em dashes are borderline but the "None at this stage — journey complete" in `referral_ctas` definitely needs fixing.

---

## Warnings (should fix before launch)

1. **Em dashes in checklist files** — 20 of 24 checklist files use em dashes in titles (e.g., "Strategy Checklist — First Home Buyer"). These are used as separators and are borderline acceptable, but they should be replaced with colons or hyphens for consistency with the style guide.

2. **Em dashes in reference file** — `ato-investment-property-basics.md` uses em dashes in body content. Should be replaced with colons or hyphens.

3. **FHOG value cap oversimplified in journey** — `journey/01-strategy/01-fhb-oo.md` (line 73) states the FHOG applies to "new home or a substantially renovated home valued at $750,000 or less." This is incorrect — the $750,000 cap applies to house and land packages; the cap for a new home/apartment is $600,000. The reference doc correctly distinguishes these two caps.

4. **Inconsistent frontmatter `referral_ctas` formatting** — Some journey files use YAML list syntax (`referral_ctas:\n  - conveyancer`), others use inline arrays (`referral_ctas: [mortgage_broker]`). Both are valid YAML but should be standardised for parser reliability.

5. **Missing `description` field in some journey frontmatter** — `journey/04-shortlisting/01-fhb-oo.md` and `journey/04-shortlisting/03-inv-exp.md` lack the `description` field present in other journey files (e.g., `01-strategy/01-fhb-oo.md`).

6. **"Buyers Agents" without apostrophe** — `journey/03-market-research/03-inv-exp.md` references "Real Estate Buyers Agents Association of Australia" (missing apostrophe in "Buyers Agents"). Correct form: "Real Estate Buyers' Agents Association" or "Real Estate Buyer's Agents Association". Note: the actual organisation name is "Real Estate Buyers Agents Association of Australia" (REBAA) which does not use an apostrophe — this is technically correct as it matches the brand name, but is inconsistent with "buyer's agent" used elsewhere in the platform.

7. **Disclaimer format inconsistency** — Stage 02 (Finance Preparation) uses a different disclaimer format — no `**General advice disclaimer**` bold heading, no `---` separator before the disclaimer, and the text is prefixed with "This information is of a general nature only..." instead of "The information on this page is general in nature...". All other stages (01, 03, 04, 05, 06, 07, 08) use the bold heading + separator format.

8. **Checklist content references "your state" instead of NSW** — `checklists/01-strategy-fhb-oo.md` line 20: "Check if you qualify for the First Home Owner Grant (FHOG) in your state or territory" and line 23: "Check your state's first home buyer stamp duty concession." These are borderline — the checklist is meant to be a personal worksheet so some generality is acceptable, but the journey content should be NSW-specific throughout.

9. **FHBAS maximum savings figure discrepancy** — `reference/nsw-stamp-duty-rules.md` notes a conflict: "Some sources cite savings of 'up to $21,529' while others cite 'up to $31,090.' The variation likely reflects different reference dates." The reference doc correctly uses $31,090 for current thresholds, but this discrepancy could confuse users if different pages cite different figures.

---

## Suggestions (nice to have)

1. **Standardise all em dashes across the platform** — 36 files use em dashes, mostly in checklist titles and frontmatter. A global find-and-replace of ` — ` with `: ` or ` - ` would bring full compliance.

2. **Add `description` field to all journey frontmatter** — At least 2 journey files are missing this field. A uniform frontmatter schema across all 24 journey files would improve parser reliability.

3. **Standardise the `[SOURCE NEEDED]` markers** — 4 reference files have `[SOURCE NEEDED]` sections that are empty (stating "None at this time"). These are fine as documentation, but could be moved to a comment block or removed to avoid confusion.

4. **Add data files to `02-data/`** — Even placeholder/stub JSON files matching the schema would validate the schema definitions and allow front-end integration to begin.

5. **Add referral logic files to `03-referral-logic/`** — Stub files with the required schema structure would unblock the referral CTA integration.

6. **Standardise referral_ctas frontmatter format** — Pick one YAML format (list or inline array) and apply it across all 24 journey files.

7. **Add a platform name placeholder to compliance files** — All 4 compliance files use `[Platform Name]` as a placeholder. These should be replaced with the actual platform name before launch (expected, but must be tracked).

---

## Tone Consistency Report

| Aspect | Status | Notes |
|---|---|---|
| Agency over automation | PASS | Content consistently positions the user as the decision-maker ("you should seek independent advice", "the right choice depends on your timeline", "a broker can confirm but the decision is yours") |
| Contractions | PASS | Contractions used consistently: "you're", "don't", "can't", "it's", "won't", "you'll", "there's". No inconsistency detected |
| "No financial advice" framing | PASS WITH CAVEATS | Every journey file ends with a disclaimer. Wording varies slightly (4 different formats detected) but the core message is consistent. The finance-prep stage uses a different format that should be aligned |
| Persona distinctness | PASS | FHB-OO content focuses on emotional traps, schemes, and lifestyle fit. INV-NEW content focuses on cashflow vs growth, tax basics, and due diligence mindset shift. INV-EXP content focuses on portfolio fit, value-add strategies, and off-market deals. Personas are meaningfully distinct |
| Contradictions between personas | NONE FOUND | No factual contradictions detected between persona content |

### Tone samples by persona

- **FHB-OO**: "Buying your first home is the largest financial decision most Australians will make." / "The right property is one that meets your needs and your financial limits." — empathetic, educational, cautionary
- **INV-NEW**: "Your first investment property is a milestone, but it is also a test of your strategy." / "Negative gearing is not a strategy in itself." — analytical, disciplined, risk-aware
- **INV-EXP**: "Experienced investors approach shortlisting differently..." / "The market does not reward experienced investors for doing the same analysis as everyone else." — direct, advanced, execution-focused

---

## CTA Cross-Reference Verification

### CTA touchpoints from `referral-touchpoints.md` (16 total):

| Touchpoint | Referral Type(s) | Found in journey files? | Status |
|---|---|---|---|
| Strategy (FHB-OO) | mortgage_broker | Yes — `01-strategy/01-fhb-oo.md` | MATCH |
| Strategy (INV-NEW) | mortgage_broker, accountant | Yes — `01-strategy/02-inv-new.md` | MATCH |
| Strategy (INV-EXP) | mortgage_broker, financial_planner, accountant | Yes — `01-strategy/03-inv-exp.md` | MATCH |
| Finance Prep (FHB-OO) | mortgage_broker | Yes — `02-finance-prep/01-fhb-oo.md` | MATCH |
| Finance Prep (INV-NEW) | mortgage_broker, accountant | Yes — `02-finance-prep/02-inv-new.md` | MATCH |
| Finance Prep (INV-EXP) | mortgage_broker, financial_planner, accountant | Yes — `02-finance-prep/03-inv-exp.md` | MATCH |
| Shortlisting (FHB-OO) | None | Yes — `04-shortlisting/01-fhb-oo.md` (empty array `[]`) | MATCH |
| Shortlisting (INV-EXP) | None | Yes — `04-shortlisting/03-inv-exp.md` (empty array `[]`) | MATCH |
| Inspection (FHB-OO) | building_inspector | Yes — `05-inspection-dd/01-fhb-oo.md` | MATCH |
| Inspection (INV-NEW) | building_inspector, property_manager | Yes — `05-inspection-dd/02-inv-new.md` | MATCH |
| Inspection (INV-EXP) | building_inspector, quantity_surveyor | Yes — `05-inspection-dd/03-inv-exp.md` | MATCH |
| Contract Review (FHB-OO) | conveyancer | Yes — `07-contract-review/01-fhb-oo.md` | MATCH |
| Contract Review (INV-NEW) | conveyancer, accountant | Yes — `07-contract-review/02-inv-new.md` | MATCH |
| Settlement (FHB-OO) | None | Partial — `08-settlement/01-fhb-oo.md` says "None at this stage — journey complete" | FORMAT ISSUE |
| Settlement (INV-NEW) | None | Partial — `08-settlement/02-inv-new.md` says "None" | FORMAT ISSUE |
| Settlement (INV-EXP) | None | Partial — `08-settlement/03-inv-exp.md` says "None" | FORMAT ISSUE |

### Key findings:
- **All 16 touchpoints** from `referral-touchpoints.md` are represented in journey files
- **No orphaned CTAs** in journey files that don't appear in the touchpoints spec
- **3 settlement files** use prose "None at this stage — journey complete" or "None" instead of the standard empty YAML array `[]`. This is a frontmatter formatting issue, not a content issue
- **CTA descriptions are specific** — each CTA names a specific professional type and context (e.g., "mortgage broker who specialises in investment lending", "accounting firm that specialises in property investment structures"). No generic "talk to a broker" language found

---

## Source Citation Audit

| Aspect | Status | Notes |
|---|---|---|
| Source citations in reference docs | PASS | All reference docs have source citations from authoritative sources (Revenue NSW, ATO, APRA, NSW Fair Trading, Strata Schemes Management Act, Duties Act 1997, etc.) |
| Source citations in journey content | PASS | Journey files cite sources inline with `[Source: Name, Year]` format. Sources include Revenue NSW, Housing Australia, APRA, Cotality, realestate.com.au, etc. |
| `[SOURCE NEEDED]` markers | 4 FILES | Present in `nsw-stamp-duty-rules.md`, `nsw-fhb-schemes.md`, `apra-serviceability-basics.md`, `nsw-land-tax.md`. These are section headers stating "None at this time" — they document that all claims are sourced, not that sources are missing. Acceptable but could be cleaner |
| Authoritative sources | PASS | Sources are from: Revenue NSW, ATO, APRA, NSW Fair Trading, Law Society of NSW, Housing Australia, Australian Government, Strata Schemes Management Act 2015, Duties Act 1997, Conveyancing Act 1919. No unreliable sources detected |
| Inline citations consistent | PASS | Journey files use `[Source: Name, Year]` consistently. Reference files use `[Source: Name]` format. Both are internally consistent |

---

## Style Guide Compliance

| Rule | Status | Details |
|---|---|---|
| Australian English | PASS | All content uses Australian spellings: behaviour, centre, analyse, organisation, colour, metre (confirmed 29 instances). No American spelling violations found in body content |
| Em dashes | **FAIL** — 36 files | Em dashes found in: 6 journey files (mostly frontmatter), 20 checklist files (titles), 1 reference file. The checklists use `—` as a title separator ("Checklist — Persona") which is borderline acceptable but should be standardised |
| Sentence case headings | PASS | All headings use sentence case: "Understanding your buying power", "Red flags to watch for at open homes", "Creating a property scorecard". No Title Case headings detected |
| Filler phrases | PASS | Minimal filler phrases found. One instance in `building-pest-inspection-guide.md`: "Rising damp occurs when groundwater travels up through..." — technical content, not filler. No "it's important to note", "as we discussed", or "needless to say" detected |
| Numbers formatting | PASS | Numbers one-nine are spelled out ("three pillars", "five to seven years"). Numbers 10+ use digits ("12 to 18 months", "10%", "47.3%"). Formatting is consistent |
| Frontmatter present | PASS | 75 of 76 markdown files have frontmatter (all except potentially some reference files checked). All journey files, checklists, question scripts, and compliance files have frontmatter |
| Disclaimer blocks | PASS | All 24 journey files end with a disclaimer block. 4 compliance files contain disclaimer templates. All reference files have disclaimer notes |
| Checklist format | PASS | All checklists use `- [ ]` format correctly |

---

## Cross-Document Consistency

| Check | Status | Details |
|---|---|---|
| Stamp duty thresholds | **PARTIAL FAIL** | Reference doc `nsw-stamp-duty-rules.md` has correct thresholds. Journey `02-finance-prep/02-inv-new.md` incorrectly references Victorian and Queensland stamp duty instead of NSW |
| FHB scheme details | **PARTIAL FAIL** | Reference doc has correct and detailed FHB scheme info. Journey `01-strategy/01-fhb-oo.md` has outdated Home Guarantee Scheme cap ($900k vs $1.5M) and oversimplified FHOG cap ($750k without the $600k distinction) |
| Professional type naming | PASS | "buyer's agent" used consistently across 111 instances. Only 1 instance uses "Buyers Agents" which is the actual brand name of REBAA |
| NSW-specific content | **PARTIAL FAIL** | One journey file references other states. Most content is properly NSW-specific |
| Cotality naming | PASS | Consistently "Cotality" across all documents (formerly CoreLogic) |
| Persona IDs | PASS | Consistent: `fhb-oo`, `inv-new`, `inv-exp` in frontmatter across all files |
| Source date ranges | PASS | Sources cited as 2024-2026, with most recent at 2025-2026. Reasonable freshness |
| Legal references | PASS | Consistent references to NSW legislation (Duties Act 1997, Conveyancing Act 1919, Strata Schemes Management Act 2015, etc.) |

---

## File Count Verification

| Directory | Expected | Actual | Status |
|---|---|---|---|
| `00-spec/` | 6 | 6 | PASS |
| `01-content/journey/01-strategy/` | 3 | 3 | PASS |
| `01-content/journey/02-finance-prep/` | 3 | 3 | PASS |
| `01-content/journey/03-market-research/` | 3 | 3 | PASS |
| `01-content/journey/04-shortlisting/` | 3 | 3 | PASS |
| `01-content/journey/05-inspection-dd/` | 3 | 3 | PASS |
| `01-content/journey/06-offer-negotiation/` | 3 | 3 | PASS |
| `01-content/journey/07-contract-review/` | 3 | 3 | PASS |
| `01-content/journey/08-settlement/` | 3 | 3 | PASS |
| `01-content/journey/` (total) | 24 | 24 | PASS |
| `01-content/reference/` | 10 | 10 | PASS |
| `01-content/question-scripts/` | 7 | 7 | PASS |
| `01-content/checklists/` | 24 | 24 | PASS |
| `02-data/` | 7 JSON files | 0 | **FAIL — EMPTY** |
| `03-referral-logic/` | 3 JSON files | 0 | **FAIL — EMPTY** |
| `04-compliance/` | 4 | 4 | PASS |
| **Total markdown** | — | **76** | — |

---

## Compliance Readiness

| Aspect | Status | Notes |
|---|---|---|
| AFSL disclaimer | READY | Financial product advice disclaimer addresses Corporations Act 2001, Chapter 7 |
| ACL disclaimer | READY | Credit licensing disclaimer addresses NCCP Act, s8, s29, reg 25(2) |
| Privacy policy | READY (outline) | Comprehensive outline addressing all 13 APPs, NDB scheme, Spam Act. Has 8 `[REQUIRES LEGAL REVIEW]` markers |
| Referral disclosure | READY (templates) | Short (20 words), medium (50 words), and long (150 word) disclosure templates ready. 7 `[REQUIRES LEGAL REVIEW]` markers |
| General disclaimer | READY | 3 variants: 50-word (inline), 150-word (footer), 250-word (dedicated page) |
| Downstream referral exemption | DOCUMENTED | RG 203.119 compliance documented; disclosure proximity requirements specified |
| ACL s18 (misleading conduct) | DOCUMENTED | Analysis of how undisclosed commercial relationships could mislead |
| `[REQUIRES LEGAL REVIEW]` markers | 19 total | Across 4 compliance files. All are legitimate flags for solicitor review before launch |

---

## Recommended Fix Priority

### Pre-launch (Week 1)
1. Create stub JSON files in `02-data/` (7 files) and `03-referral-logic/` (3 files)
2. Fix `02-finance-prep/02-inv-new.md` — replace VIC/QLD stamp duty with NSW amounts
3. Fix `01-strategy/01-fhb-oo.md` — update Home Guarantee Scheme cap to $1.5M
4. Fix `01-strategy/01-fhb-oo.md` — correct FHOG cap to distinguish $600k (new home) vs $750k (house+land)
5. Replace em dashes in journey file frontmatter with colons or hyphens (6 files)
6. Standardise `referral_ctas` frontmatter format across all 24 journey files

### Pre-launch (Week 2)
7. Replace em dashes in checklist titles (20 files)
8. Replace em dashes in `ato-investment-property-basics.md`
9. Standardise disclaimer format across all 8 journey stages
10. Add missing `description` fields to journey frontmatter
11. Replace `[Platform Name]` placeholders in compliance files

### Solicitor review (must happen before any content goes live)
12. All 4 compliance files require legal sign-off (19 `[REQUIRES LEGAL REVIEW]` markers)
13. Verify referral fee disclosure accuracy against actual agreements
14. Confirm credit activity boundary does not cross into "credit assistance"

---

*Report generated: 2026-04-19*
*Reviewer: QA Analyst*
*Files reviewed: 76 markdown files + 6 spec files*
