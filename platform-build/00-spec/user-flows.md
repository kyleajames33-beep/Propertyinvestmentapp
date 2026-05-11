# User flows by persona

---

## Flow 1: FHB-OO (first home buyer, owner-occupier)

### Persona profile

- Age: 27 to 37
- Goal: buy a home to live in, likely first major purchase
- Knowledge gaps: finance, legal process, market dynamics, hidden costs
- Emotional state: excited but anxious, fear of overpaying or making mistakes
- Budget constraint: tight, likely relying on grants and stamp duty concessions
- Professional help needed: mortgage broker, conveyancer, building inspector

### Entry points

| Entry point | Typical source | User intent |
|-------------|---------------|-------------|
| Organic search (`first home buyer guide NSW`) | Google | Researching the process, early stage |
| Organic search (`how much stamp duty do I pay`) | Google | Specific question, mid-funnel |
| Organic search (`what happens after auction`) | Google | Late-stage anxiety, needs reassurance |
| Referral from friend/family | Word of mouth | Trusts the platform, ready to engage |
| Social media ad | Instagram, Facebook | Triggered by life event (engagement, new job, new baby) |
| Direct URL | Bookmark or return visit | Returning user continuing their journey |

### Flow diagram (sequential)

```
[Entry] → [/] Landing page
  → Clicks "Start your journey" or persona card "First home buyer"
    → [/start] Persona selector questionnaire
      → Answers: buying to live in + first property + NSW
        → [/first-home-buyer] FHB-OO entry page
          → Reads welcome content, clicks "Start stage 1"
            → [/first-home-buyer/strategy] Stage 1: Strategy
              ← [DECISION 1] Clicks referral CTA for mortgage broker? (Y/N)
                → Y: Lead capture modal → broker match → back to journey
                → N: Continues to quiz
              → Completes stage quiz (unlocks next stage)
                → [/first-home-buyer/finance-prep] Stage 2: Finance prep
                  ← [DECISION 2] Downloads finance prep checklist? (Y/N)
                  ← [DECISION 3] Clicks referral CTA for mortgage broker? (Y/N)
                    → Y: Lead capture modal → broker match → back to journey
                  → Completes stage quiz
                    → [/first-home-buyer/market-research] Stage 3: Market research
                      ← [DECISION 4] Clicks referral CTA for buyer's agent? (Y/N)
                        → Y: Lead capture modal → agent match → back to journey
                        → N: Continues
                      → Explores suburb data, reads reference articles
                        → [/first-home-buyer/shortlisting] Stage 4: Shortlisting
                          ← [DECISION 5] Saves properties to shortlist tool? (Y/N)
                            → Y: Prompted to create account (v2 feature, currently email-only save)
                          → Continues
                            → [/first-home-buyer/inspection] Stage 5: Inspection and DD
                              ← [DECISION 6] Clicks referral CTA for building inspector? (Y/N)
                                → Y: Lead capture modal → inspector match
                              ← [DECISION 7] Downloads inspection question script? (Y/N)
                              → Continues
                                → [/first-home-buyer/offer] Stage 6: Offer and negotiation
                                  ← [DECISION 8] Clicks referral CTA for conveyancer? (Y/N)
                                    → Y: Lead capture modal → conveyancer match
                                  → Reads auction strategy reference article
                                    → [/first-home-buyer/contract-review] Stage 7: Contract review
                                      ← [DECISION 9] Clicks referral CTA for conveyancer (review)? (Y/N)
                                        → Y: Lead capture modal → conveyancer match
                                      → Downloads contract review checklist
                                        → [/first-home-buyer/settlement] Stage 8: Settlement
                                          → Downloads settlement checklist
                                          → Reads what happens at settlement
                                            → [SUCCESS] Platform displays completion summary
                                              → Optional: feedback survey, referral to friend
```

### Decision points (detailed)

| Decision | Location | Options | Default path |
|----------|----------|---------|--------------|
| 1. Mortgage broker referral | Stage 1 bottom | Request match / Not yet | Not yet (user can return) |
| 2. Checklist download | Stage 2 mid-page | Download PDF / Skip | Skip |
| 3. Mortgage broker referral | Stage 2 bottom | Request match / Not yet | Not yet |
| 4. Buyer's agent referral | Stage 3 bottom | Request match / Not yet | Not yet |
| 5. Shortlist save | Stage 4 mid-page | Email me this list / Continue | Continue |
| 6. Building inspector referral | Stage 5 bottom | Request match / Not yet | Not yet |
| 7. Question script download | Stage 5 mid-page | Download / Skip | Skip |
| 8. Conveyancer referral | Stage 6 bottom | Request match / Not yet | Not yet |
| 9. Conveyancer referral (contract review) | Stage 7 bottom | Request match / Not yet | Not yet |

### Referral touchpoint triggers in flow

| Stage | Trigger | Professional |
|-------|---------|--------------|
| Stage 1 (Strategy) | User learns about deposit requirements and realises they need to understand borrowing capacity | Mortgage broker |
| Stage 2 (Finance prep) | User completes budget planner and sees gap between savings and deposit needed | Mortgage broker |
| Stage 3 (Market research) | User learns how hard it is to assess fair value in unfamiliar suburbs | Buyer's agent |
| Stage 5 (Inspection) | User reads about structural issues and realises they cannot assess a property themselves | Building and pest inspector |
| Stage 6 (Offer) | User learns that contract terms are negotiable and needs legal advice before signing | Conveyancer |
| Stage 7 (Contract review) | User receives draft contract and needs a solicitor to review clauses | Conveyancer |

### Exit points

| Exit point | Likelihood | Mitigation |
|------------|-----------|------------|
| After landing page, does not click through | High | Retargeting with specific article content; email capture for NSW market report |
| Drops at persona selector (too many questions) | Low | Keep questionnaire to 3 questions max |
| Exits during Stage 1 or 2 (overwhelmed) | Medium | Progress save via email; break content into smaller chunks |
| Exits after Stage 4 (not ready to buy yet) | High | Email nurture sequence; market alerts for saved suburbs |
| Exits after referral CTA (feels sold to) | Low | Soft CTA default; ensure educational value is clear before any referral |
| Completes journey but does not convert referral | Medium | Follow-up email 48 hours later with reminder and social proof |

### Success definition

| Metric | Target | Measurement |
|--------|--------|-------------|
| Journey completion rate | 40% of users who start Stage 1 reach Stage 8 | Funnel tracking |
| Referral CTA click rate | 15% of users click at least one referral CTA | Event tracking |
| Referral lead submitted | 8% of users submit a lead form | Form submission tracking |
| User self-reports purchase | 5% of users confirm property purchase within 12 months | Post-journey survey |
| NPS score | 40+ | In-app survey at Stage 8 |

Success for the FHB-OO user: they complete all 8 stages feeling confident, have a shortlist of professionals to engage, and purchase a property without costly mistakes. The platform has saved them time, reduced anxiety, and connected them with trustworthy professionals at the right moments.

---

## Flow 2: INV-NEW (first-time property investor)

### Persona profile

- Age: 30 to 45
- Goal: buy first investment property, build wealth, likely still working full-time
- Knowledge gaps: investment finance structures, tax implications, rental yield analysis, property management
- Emotional state: cautiously optimistic, worried about picking the wrong property, conscious of cashflow risk
- Budget constraint: moderate equity or savings, may need to use equity in own home
- Professional help needed: mortgage broker (investment-savvy), buyer's agent, accountant, property manager, conveyancer

### Entry points

| Entry point | Typical source | User intent |
|-------------|---------------|-------------|
| Organic search (`first investment property Australia`) | Google | Researching whether property investment is right for them |
| Organic search (`negative gearing explained`) | Google | Specific tax question |
| Organic search (`how to buy investment property NSW`) | Google | Wants a complete process guide |
| Referral from accountant or broker | Professional referral | Pre-qualified, ready to act |
| Podcast or content mention | BiggerPockets, Property Couch | Trusts platform, seeking structured guidance |
| Social media ad | LinkedIn, Facebook | Targeted by age/income/interest |
| Direct URL | Return visit | Previously researched, now ready to proceed |

### Flow diagram (sequential)

```
[Entry] → [/] Landing page
  → Clicks "Start your journey" or persona card "First-time investor"
    → [/start] Persona selector questionnaire
      → Answers: buying as investment + first investment property + NSW
        → [/new-investor] INV-NEW entry page
          → Reads welcome content, understands journey structure
          → Clicks "Start stage 1"
            → [/new-investor/strategy] Stage 1: Strategy
              ← [DECISION 1] Clicks referral CTA for accountant? (Y/N)
                → Y: Lead capture modal → accountant match
                → N: Continues
              ← [DECISION 2] Clicks referral CTA for mortgage broker? (Y/N)
                → Y: Lead capture modal → broker match
              → Completes stage quiz
                → [/new-investor/finance-prep] Stage 2: Finance prep
                  ← [DECISION 3] Clicks referral CTA for mortgage broker? (Y/N)
                    → Y: Lead capture modal → broker match
                  → Explores borrowing capacity calculator (v2)
                  → Reads negative gearing and depreciation reference articles
                    → [/new-investor/market-research] Stage 3: Market research
                      ← [DECISION 4] Clicks referral CTA for buyer's agent? (Y/N)
                        → Y: Lead capture modal → agent match
                      → Explores yield calculator and suburb data (v2)
                      → Compares multiple suburbs using research framework
                        → [/new-investor/shortlisting] Stage 4: Shortlisting
                          ← [DECISION 5] Saves properties to shortlist? (Y/N)
                          → Runs cashflow projection on shortlisted properties (v2)
                            → [/new-investor/inspection] Stage 5: Inspection and DD
                              ← [DECISION 6] Clicks referral CTA for building inspector? (Y/N)
                              ← [DECISION 7] Clicks referral CTA for property manager? (Y/N)
                                → Y: Lead capture modal → property manager match
                                → N: Continues
                              → Downloads inspection question script
                                → [/new-investor/offer] Stage 6: Offer and negotiation
                                  ← [DECISION 8] Clicks referral CTA for buyer's agent (negotiation support)? (Y/N)
                                    → Y: Lead capture modal → agent match
                                  ← [DECISION 9] Clicks referral CTA for conveyancer? (Y/N)
                                    → Y: Lead capture modal → conveyancer match
                                    → [/new-investor/contract-review] Stage 7: Contract review
                                      ← [DECISION 10] Clicks referral CTA for conveyancer? (Y/N)
                                        → Y: Lead capture modal → conveyancer match
                                      → Reads contract clauses specific to investment (tenant rights, special conditions)
                                        → [/new-investor/settlement] Stage 8: Settlement
                                          ← [DECISION 11] Clicks referral CTA for property manager (tenant readiness)? (Y/N)
                                            → Y: Lead capture modal → property manager match
                                          → Downloads settlement and handover checklist
                                          → Reads post-settlement steps (insurance, utility connection, tenant preparation)
                                            → [SUCCESS] Platform displays completion summary
                                              → Optional: transition to ownership hub (v2)
```

### Decision points (detailed)

| Decision | Location | Options | Default path |
|----------|----------|---------|--------------|
| 1. Accountant referral | Stage 1 mid-page | Request match / Not yet | Not yet |
| 2. Mortgage broker referral | Stage 1 bottom | Request match / Not yet | Not yet |
| 3. Mortgage broker referral | Stage 2 bottom | Request match / Not yet | Not yet |
| 4. Buyer's agent referral | Stage 3 bottom | Request match / Not yet | Not yet |
| 5. Shortlist save | Stage 4 mid-page | Email me / Continue | Continue |
| 6. Building inspector referral | Stage 5 bottom | Request match / Not yet | Not yet |
| 7. Property manager referral | Stage 5 bottom | Request match / Not yet | Not yet |
| 8. Buyer's agent (negotiation) | Stage 6 bottom | Request match / Not yet | Not yet |
| 9. Conveyancer referral | Stage 6 bottom | Request match / Not yet | Not yet |
| 10. Conveyancer (contract review) | Stage 7 bottom | Request match / Not yet | Not yet |
| 11. Property manager (tenant ready) | Stage 8 bottom | Request match / Not yet | Not yet |

### Referral touchpoint triggers in flow

| Stage | Trigger | Professional |
|-------|---------|--------------|
| Stage 1 (Strategy) | User learns about tax structures (negative gearing, depreciation) and realises they need personal tax advice | Accountant/tax specialist |
| Stage 1 (Strategy) | User learns about investment lending criteria (higher deposits, interest-only loans) and needs to understand borrowing structure | Mortgage broker |
| Stage 2 (Finance prep) | User calculates that their borrowing capacity differs between owner-occupier and investment loans | Mortgage broker |
| Stage 3 (Market research) | User learns how to analyse supply-demand drivers and realises they lack local market knowledge | Buyer's agent |
| Stage 5 (Inspection) | User reads about tenancy compliance requirements (smoke alarms, pool fences) and realises they need professional management | Property manager |
| Stage 5 (Inspection) | User reads about structural risks in investment properties and needs independent assessment | Building and pest inspector |
| Stage 6 (Offer) | User learns that investment contract clauses (vacant possession, tenancy transfer) differ from owner-occupier purchases | Conveyancer |
| Stage 8 (Settlement) | User learns they need to arrange property management, tenant advertising, and rental appraisal before settlement | Property manager |

### Exit points

| Exit point | Likelihood | Mitigation |
|------------|-----------|------------|
| After landing page, does not click through | Medium | Content marketing with investor-specific articles; yield calculator teaser |
| Exits after Stage 1 (decides not to invest) | Medium | Email nurture with case studies; lower-commitment content |
| Exits after Stage 2 (financing not viable) | Medium | Email sequence on improving borrowing capacity; return in 6 to 12 months prompt |
| Exits after Stage 3 (analysis paralysis) | High | Decision framework tools; buyer's agent referral as guided path forward |
| Exits after Stage 5 (property falls through) | Low | Support content on recovering from failed deals; emotional reassurance |
| Completes journey but delays purchase | Medium | Market alert emails; monthly investor digest |

### Success definition

| Metric | Target | Measurement |
|--------|--------|-------------|
| Journey completion rate | 35% of users who start Stage 1 reach Stage 8 | Funnel tracking |
| Referral CTA click rate | 20% of users click at least one referral CTA | Event tracking |
| Referral lead submitted | 12% of users submit a lead form | Form submission tracking |
| Multiple referral types per user | 30% of converting users request 2+ professional types | Cross-sell tracking |
| User self-reports purchase | 8% of users confirm property purchase within 12 months | Post-journey survey |
| NPS score | 40+ | In-app survey at Stage 8 |

Success for the INV-NEW user: they purchase a cashflow-positive or strategically negatively geared property with appropriate tax structuring, professional management in place, and a clear understanding of their obligations. The platform has helped them avoid common first-investor mistakes (emotional purchase, wrong location, poor cashflow analysis).

---

## Flow 3: INV-EXP (experienced investor)

### Persona profile

- Age: 35 to 55
- Goal: grow existing portfolio, optimise financing, potentially diversify into new markets or strategies
- Knowledge gaps: advanced structuring (trusts, SMSF), interstate markets, commercial transition, development feasibility
- Emotional state: confident but time-poor, wants efficiency and deal flow, frustrated by beginner content
- Budget constraint: significant equity across existing properties, sophisticated finance needs
- Professional help needed: broker (portfolio specialist), buyer's agent (advanced), accountant (SMSF/trusts), property manager (portfolio scale)

### Entry points

| Entry point | Typical source | User intent |
|-------------|---------------|-------------|
| Organic search (`portfolio refinancing strategy`) | Google | Specific advanced finance question |
| Organic search (`SMSF property investment NSW`) | Google | Structuring question |
| Organic search (`buyer's agent Sydney investment`) | Google | Ready to engage professional, comparing options |
| Referral from existing professional | Broker, accountant | Pre-qualified, high intent |
| Industry event or webinar | Property investment seminar | Sees platform as practical follow-up tool |
| Direct URL | Return visit | Regular user, checking updated content |
| Newsletter click | Email | Engaged subscriber, seeking market updates |

### Flow diagram (sequential)

```
[Entry] → [/] Landing page
  → Clicks "Experienced investor" card (skips questionnaire or goes through fast-track)
    → [/experienced-investor] INV-EXP entry page
      ← [DECISION 1] User selects starting stage (not always Stage 1) (Y/N)
        → Y: Jumps to selected stage (e.g., Stage 3 for market research on new area)
        → N: Starts from Stage 1 for full portfolio review
      → [/experienced-investor/strategy] Stage 1: Strategy (portfolio-level)
        ← [DECISION 2] Clicks referral CTA for accountant (trust/SMSF structuring)? (Y/N)
          → Y: Lead capture modal → specialist accountant match
        ← [DECISION 3] Clicks referral CTA for mortgage broker (portfolio finance)? (Y/N)
          → Y: Lead capture modal → portfolio specialist broker match
        → Reads advanced structuring content, equity recycling strategies
          → [/experienced-investor/finance-prep] Stage 2: Finance prep
            ← [DECISION 4] Clicks referral CTA for mortgage broker? (Y/N)
              → Y: Lead capture modal → broker match
            → Explores portfolio cashflow dashboard, cross-collateralisation risks
            → Reads advanced lending content (commercial, non-bank, private)
              → [/experienced-investor/market-research] Stage 3: Market research
                ← [DECISION 5] Clicks referral CTA for buyer's agent (new market)? (Y/N)
                  → Y: Lead capture modal → buyer's agent match
                → Uses suburb data dashboard (v2), compares multiple markets
                → Reads advanced market analysis (infrastructure pipeline, rezoning, supply pipeline)
                  → [/experienced-investor/shortlisting] Stage 4: Shortlisting
                    → Uses property comparison tool (v2), runs feasibility on multiple assets
                    → Reads due diligence for development potential, value-add opportunities
                      → [/experienced-investor/inspection] Stage 5: Inspection and DD
                        ← [DECISION 6] Clicks referral CTA for building inspector (development feasibility)? (Y/N)
                        ← [DECISION 7] Clicks referral CTA for property manager (portfolio scale)? (Y/N)
                          → Y: Lead capture modal → portfolio-scale property manager match
                        → Reads advanced DD (feasibility studies, DA checks, heritage overlays)
                          → [/experienced-investor/offer] Stage 6: Offer and negotiation
                            ← [DECISION 8] Clicks referral CTA for buyer's agent (off-market deal)? (Y/N)
                              → Y: Lead capture modal → buyer's agent match
                            ← [DECISION 9] Clicks referral CTA for conveyancer (complex structures)? (Y/N)
                              → Y: Lead capture modal → conveyancer match
                            → Reads advanced negotiation (off-market, portfolio sales, vendor finance)
                              → [/experienced-investor/contract-review] Stage 7: Contract review
                                ← [DECISION 10] Clicks referral CTA for conveyancer (trust transfers)? (Y/N)
                                  → Y: Lead capture modal → conveyancer match
                                → Reads advanced contract clauses (options, sunset, special conditions for trusts)
                                  → [/experienced-investor/settlement] Stage 8: Settlement
                                    ← [DECISION 11] Clicks referral CTA for property manager (new property handover)? (Y/N)
                                      → Y: Lead capture modal → property manager match
                                    → Downloads settlement checklist for complex structures
                                    → Reads post-settlement optimisation (refinance triggers, equity release)
                                      → [SUCCESS] Platform displays completion summary
                                        → Links to ownership hub (v2) and scaling content (v3)
```

### Decision points (detailed)

| Decision | Location | Options | Default path |
|----------|----------|---------|--------------|
| 1. Select starting stage | Entry page | Stage 1 / Stage 2 / Stage 3 / Stage 4 / Full journey | Full journey |
| 2. Accountant referral (structuring) | Stage 1 mid-page | Request match / Not yet | Not yet |
| 3. Mortgage broker referral (portfolio) | Stage 1 bottom | Request match / Not yet | Not yet |
| 4. Mortgage broker referral | Stage 2 bottom | Request match / Not yet | Not yet |
| 5. Buyer's agent referral (new market) | Stage 3 bottom | Request match / Not yet | Not yet |
| 6. Building inspector referral (development) | Stage 5 bottom | Request match / Not yet | Not yet |
| 7. Property manager referral (portfolio) | Stage 5 bottom | Request match / Not yet | Not yet |
| 8. Buyer's agent referral (off-market) | Stage 6 bottom | Request match / Not yet | Not yet |
| 9. Conveyancer referral (complex) | Stage 6 bottom | Request match / Not yet | Not yet |
| 10. Conveyancer referral (trust) | Stage 7 bottom | Request match / Not yet | Not yet |
| 11. Property manager referral (handover) | Stage 8 bottom | Request match / Not yet | Not yet |

### Referral touchpoint triggers in flow

| Stage | Trigger | Professional |
|-------|---------|--------------|
| Stage 1 (Strategy) | User reviews portfolio equity position and wants to explore trust or SMSF structuring for next purchase | Accountant/tax specialist |
| Stage 1 (Strategy) | User learns about cross-collateralisation risks and wants to restructure existing loans before adding new debt | Mortgage broker |
| Stage 2 (Finance prep) | User calculates that servicing capacity across portfolio is constrained and needs non-bank or specialist lending | Mortgage broker |
| Stage 3 (Market research) | User wants to enter a new NSW market (e.g., regional or specific Sydney submarket) and needs boots-on-ground intelligence | Buyer's agent |
| Stage 5 (Inspection) | User is assessing development potential and needs a builder who can quote renovation or development costs | Building and pest inspector |
| Stage 5 (Inspection) | User is scaling portfolio and needs a property manager who can handle multiple properties efficiently | Property manager |
| Stage 6 (Offer) | User wants access to off-market deals and needs a buyer's agent with direct agent relationships | Buyer's agent |
| Stage 7 (Contract review) | User is purchasing in a trust or SMSF and needs a conveyancer experienced in complex entity transfers | Conveyancer |
| Stage 8 (Settlement) | User needs property manager who can handle tenant transition or new property setup efficiently | Property manager |

### Exit points

| Exit point | Likelihood | Mitigation |
|------------|-----------|------------|
| After landing page (content too basic) | Medium | INV-EXP entry page explicitly calls out advanced content; fast-track to later stages |
| Exits after Stage 1 (already has strategy) | Medium | Stage-skipping feature; respect time constraints |
| Exits after Stage 2 (finance not viable) | Low | Advanced finance options content; non-bank and private lending referrals |
| Exits after Stage 3 (no suitable deals) | Medium | Buyer's agent referral as deal-flow solution; off-market strategy content |
| Exits after Stage 5 (deal falls through or due diligence fails) | Low | Content on walking away; next-deal framework |
| Exits after Stage 8 (no immediate next action) | Medium | Ownership hub transition; portfolio tracking tools (v3) |

### Success definition

| Metric | Target | Measurement |
|--------|--------|-------------|
| Journey completion rate (full) | 25% complete all 8 stages | Funnel tracking |
| Stage-skipping utilisation | 50% of INV-EXP users skip at least one stage | Event tracking |
| Referral CTA click rate | 25% of users click at least one referral CTA | Event tracking |
| Referral lead submitted | 15% of users submit a lead form | Form submission tracking |
| Multiple referrals per user | 50% of converting users request 2+ professional types | Cross-sell tracking |
| User self-reports purchase | 12% of users confirm property purchase within 12 months | Post-journey survey |
| NPS score | 45+ | In-app survey at Stage 8 |
| Return visit rate | 30% return within 6 months for next purchase | User tracking |

Success for the INV-EXP user: they efficiently add a well-researched property to their portfolio with optimal finance structuring, minimal time investment, and professional support at the exact moments it adds value. The platform respects their expertise while filling gaps in market knowledge and professional connections.

---

## Cross-persona comparison

| Dimension | FHB-OO | INV-NEW | INV-EXP |
|-----------|--------|---------|---------|
| Primary emotion | Anxious, excited | Cautious, aspirational | Confident, time-poor |
| Content depth | Foundational | Intermediate | Advanced |
| Number of referral CTAs in journey | 6 | 9 | 9 |
| Stage 1 time on page (estimated) | 12 min | 10 min | 8 min |
| Likelihood to complete all stages | 40% | 35% | 25% (but more likely to skip) |
| Average referral value | Low (single service) | Medium (2 to 3 services) | High (3+ services, ongoing) |
| Key referral professional | Mortgage broker | Buyer's agent | Accountant / broker |
| Account creation trigger | Stage 4 (shortlist save) | Stage 4 (shortlist save) | v2 (portfolio tracking) |
| Post-journey path | None (v1) | Ownership hub (v2) | Ownership hub + scaling (v2/v3) |

---

## Global exit points (all personas)

| Exit | Trigger | Recovery |
|------|---------|----------|
| Browser close | Any page | Email reminder 24 hours later with progress saved |
| Click to external site | Reference article links | Open in new tab; return path via browser back |
| Referral lead form submission | Any CTA | Confirmation page with "Continue journey" button |
| Newsletter signup (footer) | Any page | Welcome email with journey re-entry link |
| Contact form submission | `/contact` | Auto-reply with FAQ and journey link |
