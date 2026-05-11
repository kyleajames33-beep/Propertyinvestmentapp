# Data Schema Specification: Property Purchase Guidance Platform (NSW v1)

## Document metadata
| Property | Value |
|----------|-------|
| Version | 1.0 |
| Scope | NSW only: architected for multi-state expansion in v2/v3 |
| JSON Schema dialect | draft-07 |
| Mandatory root fields | `_schema_version`, `_notes` on every data file |

---

## 1. nsw-stamp-duty-brackets.json

### Purpose
Stamp duty liability calculation brackets for NSW. Supports sliding-scale duty plus First Home Buyer (FHB) concession overlays. Used by the stamp duty calculator component.

### Schema

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "required": ["_schema_version", "_notes", "state", "effective_date", "standard_brackets", "concessions"],
  "properties": {
    "_schema_version": {
      "type": "string",
      "const": "1.0",
      "description": "Schema version for migration tracking"
    },
    "_notes": {
      "type": "string",
      "description": "Human-readable context and caveats"
    },
    "state": {
      "type": "string",
      "const": "NSW",
      "description": "State or territory identifier"
    },
    "effective_date": {
      "type": "string",
      "format": "date",
      "description": "Date from which these rates apply (YYYY-MM-DD)"
    },
    "source_url": {
      "type": "string",
      "format": "uri",
      "description": "Link to Revenue NSW source document"
    },
    "standard_brackets": {
      "type": "array",
      "description": "Progressive duty brackets for non-concessional purchases",
      "items": {
        "type": "object",
        "required": ["threshold_min", "threshold_max", "base_amount", "rate_over_threshold"],
        "properties": {
          "threshold_min": {
            "type": "number",
            "description": "Dollar value where this bracket begins (inclusive)"
          },
          "threshold_max": {
            "type": ["number", "null"],
            "description": "Dollar value where this bracket ends (null = no upper limit)"
          },
          "base_amount": {
            "type": "number",
            "description": "Flat duty amount payable at the bottom of this bracket"
          },
          "rate_over_threshold": {
            "type": "number",
            "description": "Percentage applied to the amount exceeding threshold_min"
          }
        }
      }
    },
    "concessions": {
      "type": "object",
      "description": "Concession overlays keyed by purchaser type",
      "required": ["fhb_owner_occupied"],
      "properties": {
        "fhb_owner_occupied": {
          "type": "object",
          "required": ["scheme_name", "exempt_threshold", "concessional_threshold", "concessional_brackets", "new_build_only", "eligibility_cross_ref"],
          "properties": {
            "scheme_name": {
              "type": "string",
              "description": "Official scheme name as published by Revenue NSW"
            },
            "exempt_threshold": {
              "type": "number",
              "description": "Purchase price below which duty is fully waived"
            },
            "concessional_threshold": {
              "type": "number",
              "description": "Purchase price cap above which standard rates apply"
            },
            "concessional_brackets": {
              "type": "array",
              "description": "Progressive brackets between exempt and full concession thresholds",
              "items": {
                "type": "object",
                "required": ["threshold_min", "threshold_max", "base_amount", "rate_over_threshold"],
                "properties": {
                  "threshold_min": { "type": "number" },
                  "threshold_max": { "type": ["number", "null"] },
                  "base_amount": { "type": "number" },
                  "rate_over_threshold": { "type": "number" }
                }
              }
            },
            "new_build_only": {
              "type": "boolean",
              "description": "Whether concession is restricted to new or substantially renovated homes"
            },
            "eligibility_cross_ref": {
              "type": "string",
              "description": "Reference to the grant eligibility schema entry that governs this concession"
            }
          }
        }
      }
    }
  }
}
```

### Example

```json
{
  "_schema_version": "1.0",
  "_notes": "NSW transfer duty rates effective 1 July 2023. FHB concessions assume First Home Buyer Assistance scheme. Always validate against Revenue NSW before publish.",
  "state": "NSW",
  "effective_date": "2023-07-01",
  "source_url": "https://www.revenue.nsw.gov.au/taxes-duties-levies-royalties/transfer-duty",
  "standard_brackets": [
    { "threshold_min": 0,       "threshold_max": 16000,   "base_amount": 0,     "rate_over_threshold": 0.0125 },
    { "threshold_min": 16000,   "threshold_max": 32000,   "base_amount": 200,   "rate_over_threshold": 0.0150 },
    { "threshold_min": 32000,   "threshold_max": 85000,   "base_amount": 440,   "rate_over_threshold": 0.0175 },
    { "threshold_min": 85000,   "threshold_max": 319000,  "base_amount": 1367,  "rate_over_threshold": 0.0350 },
    { "threshold_min": 319000,  "threshold_max": 1071550, "base_amount": 9552,  "rate_over_threshold": 0.0450 },
    { "threshold_min": 1071550, "threshold_max": null,    "base_amount": 44070, "rate_over_threshold": 0.0550 }
  ],
  "concessions": {
    "fhb_owner_occupied": {
      "scheme_name": "First Home Buyer Assistance scheme",
      "exempt_threshold": 800000,
      "concessional_threshold": 1000000,
      "concessional_brackets": [
        { "threshold_min": 800000, "threshold_max": 1000000, "base_amount": 0, "rate_over_threshold": 0.0 }
      ],
      "new_build_only": false,
      "eligibility_cross_ref": "fhb-assistance-scheme"
    }
  }
}
```

### v2 state expansion

- Add sibling files: `vic-stamp-duty-brackets.json`, `qld-stamp-duty-brackets.json`, etc.
- Front-end uses a `state` parameter to load the correct file at runtime.
- Common schema structure allows a shared loader component.
- Consider merging into a single `stamp-duty-brackets.json` keyed by state code if file count grows.

---

## 2. nsw-fhb-grant-eligibility.json

### Purpose
All First Home Buyer (FHB) grants, concessions, and assistance schemes available in NSW. Covers grants for owner-occupiers and investors (where applicable). Used by the eligibility checker component.

### Schema

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "required": ["_schema_version", "_notes", "state", "last_updated", "schemes"],
  "properties": {
    "_schema_version": {
      "type": "string",
      "const": "1.0"
    },
    "_notes": {
      "type": "string",
      "description": "Summary of coverage and known gaps"
    },
    "state": {
      "type": "string",
      "const": "NSW"
    },
    "last_updated": {
      "type": "string",
      "format": "date",
      "description": "Last review date for scheme accuracy"
    },
    "source_url": {
      "type": "string",
      "format": "uri"
    },
    "schemes": {
      "type": "array",
      "description": "Individual assistance schemes",
      "items": {
        "type": "object",
        "required": ["scheme_id", "scheme_name", "administering_body", "grant_type", "eligibility", "amount", "property_thresholds", "applies_to_personas"],
        "properties": {
          "scheme_id": {
            "type": "string",
            "description": "Stable identifier used for cross-referencing (kebab-case)"
          },
          "scheme_name": {
            "type": "string",
            "description": "Official scheme name"
          },
          "administering_body": {
            "type": "string",
            "description": "Government agency administering the scheme"
          },
          "grant_type": {
            "type": "string",
            "enum": ["cash_grant", "stamp_duty_concession", "combined", "guarantee"],
            "description": "Category of assistance"
          },
          "description": {
            "type": "string",
            "description": "Plain-language summary of the scheme"
          },
          "eligibility": {
            "type": "object",
            "required": ["must_be_first_home_buyer", "property_types", "occupancy_requirement", "income_tests", "previous_ownership_tests"],
            "properties": {
              "must_be_first_home_buyer": {
                "type": "boolean"
              },
              "property_types": {
                "type": "array",
                "items": {
                  "type": "string",
                  "enum": ["established_home", "new_build", "vacant_land", "apartment", "townhouse"]
                }
              },
              "occupancy_requirement": {
                "type": "object",
                "properties": {
                  "minimum_occupancy_months": {
                    "type": ["integer", "null"]
                  },
                  "must_move_in_within_months": {
                    "type": ["integer", "null"]
                  }
                }
              },
              "income_tests": {
                "type": "object",
                "properties": {
                  "applies": { "type": "boolean" },
                  "single_income_threshold": { "type": ["number", "null"] },
                  "joint_income_threshold": { "type": ["number", "null"] },
                  "notes": { "type": "string" }
                }
              },
              "previous_ownership_tests": {
                "type": "object",
                "properties": {
                  "never_owned_property_anywhere": { "type": "boolean" },
                  "never_owned_in_australia": { "type": "boolean" },
                  "time_since_previous_ownership_years": { "type": ["integer", "null"] }
                }
              },
              "age_requirement": {
                "type": "object",
                "properties": {
                  "minimum_age": { "type": ["integer", "null"] },
                  "applies": { "type": "boolean" }
                }
              },
              "citizenship_residency": {
                "type": "object",
                "properties": {
                  "must_be_citizen_or_pr": { "type": "boolean" },
                  "minimum_residency_months": { "type": ["integer", "null"] }
                }
              }
            }
          },
          "amount": {
            "type": "object",
            "required": ["maximum", "calculation_method"],
            "properties": {
              "maximum": {
                "type": "number",
                "description": "Maximum dollar value of assistance"
              },
              "calculation_method": {
                "type": "string",
                "enum": ["fixed", "sliding_scale", "percentage_of_duty", "full_exemption"],
                "description": "How the benefit amount is determined"
              },
              "fixed_amount": {
                "type": ["number", "null"],
                "description": "If fixed, the dollar amount"
              }
            }
          },
          "property_thresholds": {
            "type": "object",
            "required": ["purchase_price_cap", "regional_adjustments"],
            "properties": {
              "purchase_price_cap": {
                "type": ["number", "null"],
                "description": "Maximum purchase price to qualify (null = no cap)"
              },
              "property_value_cap": {
                "type": ["number", "null"]
              },
              "regional_adjustments": {
                "type": "object",
                "properties": {
                  "applies": { "type": "boolean" },
                  "regional_premium": { "type": ["number", "null"] },
                  "metro_cap": { "type": ["number", "null"] },
                  "regional_cap": { "type": ["number", "null"] }
                }
              }
            }
          },
          "applies_to_personas": {
            "type": "array",
            "items": {
              "type": "string",
              "enum": ["FHB-OO", "INV-NEW", "INV-EXP"]
            },
            "description": "Which user personas are eligible for this scheme"
          },
          "application_deadline": {
            "type": "string",
            "description": "Deadline for lodging application after settlement"
          },
          "more_info_url": {
            "type": "string",
            "format": "uri"
          }
        }
      }
    }
  }
}
```

### Example

```json
{
  "_schema_version": "1.0",
  "_notes": "NSW schemes as at July 2024. Does not include Commonwealth schemes (Home Guarantee Scheme). Always validate against Revenue NSW.",
  "state": "NSW",
  "last_updated": "2024-07-01",
  "source_url": "https://www.revenue.nsw.gov.au/grants-schemes",
  "schemes": [
    {
      "scheme_id": "fhb-assistance-scheme",
      "scheme_name": "First Home Buyer Assistance scheme",
      "administering_body": "Revenue NSW",
      "grant_type": "stamp_duty_concession",
      "description": "Exemption or concession on transfer duty for first home buyers purchasing an existing home, new home, or vacant land intended as the place of residence.",
      "eligibility": {
        "must_be_first_home_buyer": true,
        "property_types": ["established_home", "new_build", "vacant_land"],
        "occupancy_requirement": {
          "minimum_occupancy_months": 6,
          "must_move_in_within_12_months": 12
        },
        "income_tests": {
          "applies": false,
          "single_income_threshold": null,
          "joint_income_threshold": null,
          "notes": "No income test applies"
        },
        "previous_ownership_tests": {
          "never_owned_property_anywhere": true,
          "never_owned_in_australia": false,
          "time_since_previous_ownership_years": null
        },
        "age_requirement": {
          "minimum_age": 18,
          "applies": true
        },
        "citizenship_residency": {
          "must_be_citizen_or_pr": true,
          "minimum_residency_months": null
        }
      },
      "amount": {
        "maximum": 0,
        "calculation_method": "full_exemption",
        "fixed_amount": null
      },
      "property_thresholds": {
        "purchase_price_cap": null,
        "property_value_cap": 1000000,
        "regional_adjustments": {
          "applies": false
        }
      },
      "applies_to_personas": ["FHB-OO"],
      "application_deadline": "Within 12 months of settlement",
      "more_info_url": "https://www.revenue.nsw.gov.au/grants-schemes/first-home-buyer/assistance"
    },
    {
      "scheme_id": "fhb-choice",
      "scheme_name": "First Home Buyer Choice",
      "administering_body": "Revenue NSW",
      "grant_type": "stamp_duty_concession",
      "description": "Allows first home buyers to opt into an annual property tax instead of paying upfront transfer duty on properties up to $1.5 million.",
      "eligibility": {
        "must_be_first_home_buyer": true,
        "property_types": ["established_home", "new_build", "apartment", "townhouse"],
        "occupancy_requirement": {
          "minimum_occupancy_months": 6,
          "must_move_in_within_months": 12
        },
        "income_tests": {
          "applies": false,
          "notes": "No income test applies"
        },
        "previous_ownership_tests": {
          "never_owned_property_anywhere": true,
          "never_owned_in_australia": false,
          "time_since_previous_ownership_years": null
        },
        "age_requirement": {
          "minimum_age": 18,
          "applies": true
        },
        "citizenship_residency": {
          "must_be_citizen_or_pr": true,
          "minimum_residency_months": null
        }
      },
      "amount": {
        "maximum": 0,
        "calculation_method": "full_exemption",
        "fixed_amount": null
      },
      "property_thresholds": {
        "purchase_price_cap": 1500000,
        "property_value_cap": 1500000,
        "regional_adjustments": {
          "applies": false
        }
      },
      "applies_to_personas": ["FHB-OO"],
      "application_deadline": "Before settlement",
      "more_info_url": "https://www.revenue.nsw.gov.au/grants-schemes/first-home-buyer/choice"
    },
    {
      "scheme_id": "fhb-10k-grant",
      "scheme_name": "$10,000 First Home Owner Grant (New Home)",
      "administering_body": "Revenue NSW",
      "grant_type": "cash_grant",
      "description": "$10,000 grant for first home buyers purchasing a new home or building a home.",
      "eligibility": {
        "must_be_first_home_buyer": true,
        "property_types": ["new_build", "vacant_land"],
        "occupancy_requirement": {
          "minimum_occupancy_months": 6,
          "must_move_in_within_months": 12
        },
        "income_tests": {
          "applies": false,
          "notes": "No income test applies"
        },
        "previous_ownership_tests": {
          "never_owned_property_anywhere": true,
          "never_owned_in_australia": false,
          "time_since_previous_ownership_years": null
        },
        "age_requirement": {
          "minimum_age": 18,
          "applies": true
        },
        "citizenship_residency": {
          "must_be_citizen_or_pr": true,
          "minimum_residency_months": null
        }
      },
      "amount": {
        "maximum": 10000,
        "calculation_method": "fixed",
        "fixed_amount": 10000
      },
      "property_thresholds": {
        "purchase_price_cap": 750000,
        "property_value_cap": 750000,
        "regional_adjustments": {
          "applies": true,
          "regional_premium": 0,
          "metro_cap": 600000,
          "regional_cap": 750000
        }
      },
      "applies_to_personas": ["FHB-OO"],
      "application_deadline": "Within 12 months of settlement or construction completion",
      "more_info_url": "https://www.revenue.nsw.gov.au/grants-schemes/first-home-buyer/new-homes"
    }
  ]
}
```

### v2 state expansion

- Sibling files per state: `vic-fhb-grant-eligibility.json`, etc.
- The `schemes` array structure is designed to accommodate state-specific variation in eligibility criteria.
- v3 may introduce a unified `grant-eligibility.json` with a top-level `states` key if the schema proves stable across jurisdictions.

---

## 3. nsw-lga-list.json

### Purpose
Complete list of NSW Local Government Areas (LGAs) for suburb grouping, regional analytics, and localised content. Used to populate dropdowns, filter suburb-level data, and associate professionals with service areas.

### Schema

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "required": ["_schema_version", "_notes", "state", "lgas"],
  "properties": {
    "_schema_version": {
      "type": "string",
      "const": "1.0"
    },
    "_notes": {
      "type": "string",
      "description": "Data source and known caveats"
    },
    "state": {
      "type": "string",
      "const": "NSW"
    },
    "last_updated": {
      "type": "string",
      "format": "date"
    },
    "source_url": {
      "type": "string",
      "format": "uri",
      "description": "Link to ABS or NSW Government LGA dataset"
    },
    "lgas": {
      "type": "array",
      "items": {
        "type": "object",
        "required": ["lga_code", "lga_name", "region", "classification", "suburbs_sample"],
        "properties": {
          "lga_code": {
            "type": "string",
            "description": "ABS LGA code (e.g., 'LGA10050')"
          },
          "lga_name": {
            "type": "string",
            "description": "Official LGA name"
          },
          "region": {
            "type": "string",
            "description": "Broad geographical region (e.g., 'Greater Sydney', 'Regional NSW')"
          },
          "classification": {
            "type": "string",
            "enum": ["urban", "regional", "rural", "remote"],
            "description": "Urban/rural classification for content tailoring"
          },
          "suburbs_sample": {
            "type": "array",
            "items": { "type": "string" },
            "description": "Representative suburbs in this LGA (not exhaustive: for display/discovery only)"
          },
          "median_house_price": {
            "type": ["number", "null"],
            "description": "Most recent quarterly median (null if unavailable)"
          },
          "median_unit_price": {
            "type": ["number", "null"]
          },
          "price_source_quarter": {
            "type": ["string", "null"],
            "description": "Quarter the median price relates to (e.g., 'Q2 2024')"
          }
        }
      }
    }
  }
}
```

### Example (abbreviated: full file contains all 128 NSW LGAs)

```json
{
  "_schema_version": "1.0",
  "_notes": "NSW LGAs per ABS 2023 boundaries. Median prices sourced from Domain quarterly reports. Suburb lists are indicative samples, not exhaustive.",
  "state": "NSW",
  "last_updated": "2024-07-01",
  "source_url": "https://www.abs.gov.au/statistics/standards/australian-statistical-geography-standard-asgs-edition-3/jul2021-jun2026/access-and-downloads",
  "lgas": [
    {
      "lga_code": "LGA14170",
      "lga_name": "Sydney",
      "region": "Greater Sydney",
      "classification": "urban",
      "suburbs_sample": ["Sydney CBD", "The Rocks", "Millers Point", "Barangaroo", "Haymarket"],
      "median_house_price": null,
      "median_unit_price": 1100000,
      "price_source_quarter": "Q2 2024"
    },
    {
      "lga_code": "LGA18500",
      "lga_name": "Waverley",
      "region": "Greater Sydney",
      "classification": "urban",
      "suburbs_sample": ["Bondi", "Bondi Beach", "Bronte", "Tamarama", "Waverley"],
      "median_house_price": 3800000,
      "median_unit_price": 1250000,
      "price_source_quarter": "Q2 2024"
    },
    {
      "lga_code": "LGA11600",
      "lga_name": "Newcastle",
      "region": "Hunter",
      "classification": "regional",
      "suburbs_sample": ["Newcastle", "Merewether", "The Junction", "Cooks Hill", "Bar Beach"],
      "median_house_price": 920000,
      "median_unit_price": 680000,
      "price_source_quarter": "Q2 2024"
    },
    {
      "lga_code": "LGA15950",
      "lga_name": "Wagga Wagga",
      "region": "Riverina",
      "classification": "regional",
      "suburbs_sample": ["Wagga Wagga", "Bourkelands", "Kooringal", "Lake Albert", "Glenfield Park"],
      "median_house_price": 540000,
      "median_unit_price": 320000,
      "price_source_quarter": "Q2 2024"
    }
  ]
}
```

### v2 state expansion

- Each state gets its own `{state}-lga-list.json` file.
- The `region` field values are state-specific, so no normalisation is required at v1.
- v3 could introduce a national `lga-master-index.json` with cross-state normalised regions if needed for interstate portfolio tracking.
- The `median_house_price` and `median_unit_price` fields are optional to allow the LGA list to be published independently of price data refreshes.

---

## 4. professional-network-schema.json

### Purpose
Empty schema template for partner and referral partner data. Defines the structure for the professional directory: mortgage brokers, buyer's agents, conveyancers, property managers, quantity surveyors, and financial planners. The platform populates this file as partners are onboarded.

### Schema

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "required": ["_schema_version", "_notes", "partners"],
  "properties": {
    "_schema_version": {
      "type": "string",
      "const": "1.0"
    },
    "_notes": {
      "type": "string",
      "description": "Context on the partner network and onboarding status"
    },
    "last_updated": {
      "type": "string",
      "format": "date"
    },
    "partners": {
      "type": "array",
      "description": "List of referral partners",
      "items": {
        "type": "object",
        "required": ["partner_id", "business_name", "partner_type", "contact", "service_areas", "status", "onboarded_date"],
        "properties": {
          "partner_id": {
            "type": "string",
            "description": "Stable unique identifier (kebab-case: 'acme-brokers')"
          },
          "business_name": {
            "type": "string",
            "description": "Trading name of the business"
          },
          "legal_name": {
            "type": ["string", "null"],
            "description": "Registered legal name if different from trading name"
          },
          "partner_type": {
            "type": "string",
            "enum": ["mortgage_broker", "buyers_agent", "conveyancer", "property_manager", "quantity_surveyor", "financial_planner", "building_inspector", "real_estate_agent", "buyers_agent"],
            "description": "Primary service category"
          },
          "partner_subtype": {
            "type": "array",
            "items": { "type": "string" },
            "description": "Additional specialisations or tags"
          },
          "contact": {
            "type": "object",
            "required": ["phone", "email"],
            "properties": {
              "phone": { "type": "string" },
              "email": { "type": "string", "format": "email" },
              "website": { "type": ["string", "null"], "format": "uri" },
              "address": {
                "type": "object",
                "properties": {
                  "street": { "type": "string" },
                  "suburb": { "type": "string" },
                  "state": { "type": "string", "const": "NSW" },
                  "postcode": { "type": "string" }
                }
              }
            }
          },
          "service_areas": {
            "type": "array",
            "items": {
              "type": "object",
              "properties": {
                "lga_code": { "type": "string" },
                "lga_name": { "type": "string" },
                "service_type": {
                  "type": "string",
                  "enum": ["primary", "secondary", "remote"],
                  "description": "Whether this LGA is a primary, secondary, or remote service area"
                }
              }
            },
            "description": "LGAs this partner services: cross-references lga-list"
          },
          "specialisations": {
            "type": "array",
            "items": { "type": "string" },
            "description": "Free-text specialisations (e.g., 'first_home_buyers', 'investment_loans')"
          },
          "credentials": {
            "type": "array",
            "items": {
              "type": "object",
              "properties": {
                "credential_type": { "type": "string", "enum": ["license", "membership", "award", "certification"] },
                "issuing_body": { "type": "string" },
                "credential_name": { "type": "string" },
                "expiry_date": { "type": ["string", "null"], "format": "date" }
              }
            }
          },
          "target_personas": {
            "type": "array",
            "items": {
              "type": "string",
              "enum": ["FHB-OO", "INV-NEW", "INV-EXP"]
            },
            "description": "Which personas this partner is best suited for"
          },
          "referral_terms": {
            "type": "object",
            "properties": {
              "fee_structure": {
                "type": "string",
                "enum": ["cpa", "flat_fee", "hourly", "percentage", "none"],
                "description": "How the partner charges clients"
              },
              "platform_referral_fee": {
                "type": ["number", "null"],
                "description": "Platform commission per successful referral (dollars, null if not applicable)"
              },
              "platform_referral_type": {
                "type": ["string", "null"],
                "enum": ["cpa", "flat_fee", "percentage", "none"]
              }
            }
          },
          "status": {
            "type": "string",
            "enum": ["pending", "active", "paused", "terminated"],
            "description": "Current onboarding lifecycle status"
          },
          "onboarded_date": {
            "type": "string",
            "format": "date"
          },
          "review_rating": {
            "type": ["number", "null"],
            "minimum": 0,
            "maximum": 5,
            "description": "Aggregated client review score (null until first review)"
          },
          "review_count": {
            "type": "integer",
            "minimum": 0,
            "description": "Number of reviews received"
          },
          "lead_volume_monthly_cap": {
            "type": ["integer", "null"],
            "description": "Maximum leads partner can accept per month (null = unlimited)"
          }
        }
      }
    }
  }
}
```

### Example (empty network with one sample partner)

```json
{
  "_schema_version": "1.0",
  "_notes": "Professional partner network. Partners are onboarded via the workflow in referral-integration-spec.md. Only active partners with signed referral agreements appear here.",
  "last_updated": "2024-07-01",
  "partners": [
    {
      "partner_id": "sample-mortgage-broking",
      "business_name": "Sample Mortgage Broking Pty Ltd",
      "legal_name": "Sample Mortgage Broking Pty Ltd",
      "partner_type": "mortgage_broker",
      "partner_subtype": ["residential", "investment"],
      "contact": {
        "phone": "02 9000 0000",
        "email": "enquiries@samplemortgages.com.au",
        "website": "https://www.samplemortgages.com.au",
        "address": {
          "street": "123 Sample Street",
          "suburb": "Sydney",
          "state": "NSW",
          "postcode": "2000"
        }
      },
      "service_areas": [
        { "lga_code": "LGA14170", "lga_name": "Sydney", "service_type": "primary" },
        { "lga_code": "LGA16370", "lga_name": "Willoughby", "service_type": "secondary" }
      ],
      "specialisations": ["first_home_buyers", "investment_loans", "self_employed"],
      "credentials": [
        { "credential_type": "license", "issuing_body": "ASIC", "credential_name": "Australian Credit Licence 000000", "expiry_date": null },
        { "credential_type": "membership", "issuing_body": "MFAA", "credential_name": "Accredited Mortgage Consultant", "expiry_date": null }
      ],
      "target_personas": ["FHB-OO", "INV-NEW", "INV-EXP"],
      "referral_terms": {
        "fee_structure": "none",
        "platform_referral_fee": null,
        "platform_referral_type": null
      },
      "status": "active",
      "onboarded_date": "2024-06-15",
      "review_rating": null,
      "review_count": 0,
      "lead_volume_monthly_cap": 50
    }
  ]
}
```

### v2 state expansion

- Partners naturally span multiple states, so `service_areas` should include LGAs from other states as the network grows.
- The `contact.address.state` field constrains to "NSW" at v1: relax this in v2.
- v3 introduces a `partner_locations` collection for multi-office partners.

---

## 5. disclaimer-library.json

### Purpose
Centralised disclaimer templates keyed by type. Every calculator output, guide page, and referral CTA pulls its disclaimer from this file. Ensures consistency and makes compliance updates atomic.

### Schema

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "required": ["_schema_version", "_notes", "last_updated", "disclaimers"],
  "properties": {
    "_schema_version": {
      "type": "string",
      "const": "1.0"
    },
    "_notes": {
      "type": "string",
      "description": "Overview of disclaimer coverage and review cadence"
    },
    "last_updated": {
      "type": "string",
      "format": "date"
    },
    "reviewed_by": {
      "type": ["string", "null"],
      "description": "Legal/compliance reviewer identifier"
    },
    "disclaimers": {
      "type": "array",
      "items": {
        "type": "object",
        "required": ["key", "category", "severity", "title", "body"],
        "properties": {
          "key": {
            "type": "string",
            "description": "Stable identifier for referencing in components (snake_case)"
          },
          "category": {
            "type": "string",
            "enum": ["general", "calculator", "financial", "legal", "referral", "investment", "tax"],
            "description": "Broad grouping for UI placement logic"
          },
          "severity": {
            "type": "string",
            "enum": ["info", "warning", "critical"],
            "description": "Visual prominence level"
          },
          "title": {
            "type": ["string", "null"],
            "description": "Optional heading for the disclaimer block"
          },
          "body": {
            "type": "string",
            "description": "Full disclaimer text. Supports {placeholder} substitution."
          },
          "applies_to_personas": {
            "type": "array",
            "items": {
              "type": "string",
              "enum": ["FHB-OO", "INV-NEW", "INV-EXP", "all"]
            },
            "description": "Which personas this disclaimer applies to"
          },
          "applies_to_states": {
            "type": "array",
            "items": { "type": "string" },
            "description": "States where this disclaimer is relevant"
          },
          "related_calculators": {
            "type": "array",
            "items": { "type": "string" },
            "description": "Calculator keys that should display this disclaimer"
          },
          "effective_from": {
            "type": "string",
            "format": "date"
          },
          "effective_to": {
            "type": ["string", "null"],
            "format": "date",
            "description": "Expiry date for time-bound disclaimers (null = ongoing)"
          }
        }
      }
    }
  }
}
```

### Example

```json
{
  "_schema_version": "1.0",
  "_notes": "Disclaimer library for NSW property guidance platform. All bodies reviewed by compliance counsel. Calculators pull disclaimers by key at runtime. Review quarterly.",
  "last_updated": "2024-07-01",
  "reviewed_by": "compliance@platform.example",
  "disclaimers": [
    {
      "key": "general_information_only",
      "category": "general",
      "severity": "info",
      "title": "General information",
      "body": "The information on this website is general in nature and does not take into account your personal objectives, financial situation, or needs. You should consider whether the information is appropriate to your circumstances before acting on it.",
      "applies_to_personas": ["all"],
      "applies_to_states": ["NSW"],
      "related_calculators": [],
      "effective_from": "2024-07-01",
      "effective_to": null
    },
    {
      "key": "stamp_duty_estimate",
      "category": "calculator",
      "severity": "warning",
      "title": "Stamp duty estimate",
      "body": "This estimate is based on NSW transfer duty rates effective {effective_date} and the First Home Buyer Assistance scheme as published by Revenue NSW. It does not account for foreign purchaser surcharges, premium property duty, or other exceptional circumstances. Always confirm your liability with Revenue NSW or a qualified conveyancer before proceeding with a purchase.",
      "applies_to_personas": ["FHB-OO", "INV-NEW", "INV-EXP"],
      "applies_to_states": ["NSW"],
      "related_calculators": ["stamp-duty"],
      "effective_from": "2024-07-01",
      "effective_to": null
    },
    {
      "key": "fhb_grant_eligibility",
      "category": "calculator",
      "severity": "warning",
      "title": "Grant eligibility",
      "body": "Eligibility for First Home Buyer grants and concessions depends on your individual circumstances including prior property ownership, occupancy intentions, citizenship status, and property value. This tool provides an indicative assessment only. Final eligibility is determined by Revenue NSW upon formal application.",
      "applies_to_personas": ["FHB-OO", "INV-NEW"],
      "applies_to_states": ["NSW"],
      "related_calculators": ["fhb-eligibility"],
      "effective_from": "2024-07-01",
      "effective_to": null
    },
    {
      "key": "not_financial_advice",
      "category": "financial",
      "severity": "critical",
      "title": "Not financial advice",
      "body": "This website does not provide financial product advice. Nothing on this site should be construed as a recommendation to acquire, dispose of, or hold any financial product. Before making any investment decision, you should seek independent financial advice from an Australian Financial Services Licence holder.",
      "applies_to_personas": ["all"],
      "applies_to_states": ["NSW"],
      "related_calculators": ["deal-analyser", "affordability"],
      "effective_from": "2024-07-01",
      "effective_to": null
    },
    {
      "key": "referral_disclosure",
      "category": "referral",
      "severity": "info",
      "title": "Referral partner disclosure",
      "body": "We may receive a referral fee if you engage a professional introduced through this platform. This does not affect the price you pay. Partners are selected based on expertise relevant to your situation, not referral fees alone. We do not accept commissions that create a conflict of interest.",
      "applies_to_personas": ["all"],
      "applies_to_states": ["NSW"],
      "related_calculators": [],
      "effective_from": "2024-07-01",
      "effective_to": null
    },
    {
      "key": "investment_risk",
      "category": "investment",
      "severity": "critical",
      "title": "Investment risk warning",
      "body": "Property investment involves significant risk. Past performance is not indicative of future returns. Property values can fall as well as rise. You may lose some or all of your capital. Borrowing to invest (gearing) magnifies both gains and losses. You should seek independent professional advice before making any investment decision.",
      "applies_to_personas": ["INV-NEW", "INV-EXP"],
      "applies_to_states": ["NSW"],
      "related_calculators": ["deal-analyser"],
      "effective_from": "2024-07-01",
      "effective_to": null
    },
    {
      "key": "tax_depreciation",
      "category": "tax",
      "severity": "warning",
      "title": "Tax depreciation",
      "body": "Tax depreciation deductions are available under Division 40 and Division 43 of the Income Tax Assessment Act 1997. The availability and value of deductions depends on the age of the property, the assets included, and your individual tax position. A qualified quantity surveyor can provide a depreciation schedule. This platform does not provide tax advice: consult a registered tax agent.",
      "applies_to_personas": ["INV-NEW", "INV-EXP"],
      "applies_to_states": ["NSW"],
      "related_calculators": ["depreciation-estimate"],
      "effective_from": "2024-07-01",
      "effective_to": null
    },
    {
      "key": "data_accuracy",
      "category": "general",
      "severity": "info",
      "title": "Data accuracy",
      "body": "While we make every effort to keep information current, government policies, rates, and thresholds change frequently. Data was last reviewed on {last_updated}. Always verify time-sensitive information with the relevant government authority.",
      "applies_to_personas": ["all"],
      "applies_to_states": ["NSW"],
      "related_calculators": [],
      "effective_from": "2024-07-01",
      "effective_to": null
    }
  ]
}
```

### v2 state expansion

- Add state-specific disclaimer variants as new entries with `applies_to_states` expanded.
- The `{placeholder}` substitution system (e.g., `{effective_date}`, `{last_updated}`) should be implemented in the front-end disclaimer renderer.
- v3 introduces multi-language disclaimer variants for CALD communities.

---

## 6. user-persona-profiles.json

### Purpose
Persona definitions used for content tailoring, journey mapping, and calculator defaults. Each persona has distinct content pathways, default assumptions, and eligible referral partners.

### Schema

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "required": ["_schema_version", "_notes", "personas"],
  "properties": {
    "_schema_version": {
      "type": "string",
      "const": "1.0"
    },
    "_notes": {
      "type": "string"
    },
    "personas": {
      "type": "array",
      "items": {
        "type": "object",
        "required": ["persona_id", "label", "description", "journey_stage", "default_assumptions", "eligible_schemes", "eligible_referral_types", "content_priority"],
        "properties": {
          "persona_id": {
            "type": "string",
            "enum": ["FHB-OO", "INV-NEW", "INV-EXP"]
          },
          "label": {
            "type": "string",
            "description": "Human-readable label"
          },
          "description": {
            "type": "string",
            "description": "One-line summary of this persona's situation"
          },
          "journey_stage": {
            "type": "string",
            "enum": ["pre_purchase", "active_purchase", "post_purchase", "portfolio_growth"],
            "description": "Default journey stage for content sequencing"
          },
          "default_assumptions": {
            "type": "object",
            "description": "Default values pre-filled in calculators",
            "properties": {
              "deposit_percentage": { "type": "number" },
              "loan_term_years": { "type": "integer" },
              "interest_rate_assumption": { "type": "number" },
              "lmi_capitalisation": { "type": "boolean" },
              "buffer_rate": { "type": "number", "description": "Assessed at interest rate + buffer" }
            }
          },
          "eligible_schemes": {
            "type": "array",
            "items": { "type": "string" },
            "description": "Scheme IDs this persona can access"
          },
          "eligible_referral_types": {
            "type": "array",
            "items": {
              "type": "string",
              "enum": ["mortgage_broker", "buyers_agent", "conveyancer", "property_manager", "quantity_surveyor", "financial_planner", "building_inspector"]
            }
          },
          "content_priority": {
            "type": "array",
            "items": { "type": "string" },
            "description": "Ordered list of content module keys for this persona's journey"
          }
        }
      }
    }
  }
}
```

### Example

```json
{
  "_schema_version": "1.0",
  "_notes": "Persona definitions for content personalisation. Default assumptions are starting points only: users can override in calculators.",
  "personas": [
    {
      "persona_id": "FHB-OO",
      "label": "First home buyer (owner-occupier)",
      "description": "Buying their first property to live in, navigating grants, concessions, and the mortgage process for the first time.",
      "journey_stage": "pre_purchase",
      "default_assumptions": {
        "deposit_percentage": 0.10,
        "loan_term_years": 30,
        "interest_rate_assumption": 6.50,
        "lmi_capitalisation": true,
        "buffer_rate": 3.00
      },
      "eligible_schemes": ["fhb-assistance-scheme", "fhb-choice", "fhb-10k-grant"],
      "eligible_referral_types": ["mortgage_broker", "conveyancer", "building_inspector"],
      "content_priority": ["budgeting", "grants-checker", "suburb-selection", "pre-approval", "settlement"]
    },
    {
      "persona_id": "INV-NEW",
      "label": "First-time investor",
      "description": "Buying their first investment property, transitioning from owner-occupier mindset to investor thinking.",
      "journey_stage": "active_purchase",
      "default_assumptions": {
        "deposit_percentage": 0.20,
        "loan_term_years": 30,
        "interest_rate_assumption": 6.75,
        "lmi_capitalisation": false,
        "buffer_rate": 2.50
      },
      "eligible_schemes": [],
      "eligible_referral_types": ["mortgage_broker", "buyers_agent", "conveyancer", "quantity_surveyor", "financial_planner", "building_inspector"],
      "content_priority": ["investment-strategy", "deal-analysis", "finance-structure", "due-diligence", "settlement"]
    },
    {
      "persona_id": "INV-EXP",
      "label": "Experienced investor",
      "description": "Growing an existing portfolio, focused on deal quality, financing efficiency, and scaling strategies.",
      "journey_stage": "portfolio_growth",
      "default_assumptions": {
        "deposit_percentage": 0.20,
        "loan_term_years": 30,
        "interest_rate_assumption": 6.75,
        "lmi_capitalisation": false,
        "buffer_rate": 2.50
      },
      "eligible_schemes": [],
      "eligible_referral_types": ["mortgage_broker", "buyers_agent", "conveyancer", "quantity_surveyor", "financial_planner", "property_manager"],
      "content_priority": ["portfolio-review", "equity-access", "deal-analysis", "tax-planning", "scaling-strategy"]
    }
  ]
}
```

---

## 7. site-config.json

### Purpose
Global platform configuration consumed at build time. Controls feature flags, persona routing, analytics IDs, and external service endpoints.

### Schema

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "required": ["_schema_version", "_notes", "platform", "features", "integrations", "content"],
  "properties": {
    "_schema_version": {
      "type": "string",
      "const": "1.0"
    },
    "_notes": {
      "type": "string"
    },
    "platform": {
      "type": "object",
      "required": ["name", "current_state", "supported_states", "default_persona"],
      "properties": {
        "name": { "type": "string" },
        "current_state": { "type": "string", "const": "NSW" },
        "supported_states": {
          "type": "array",
          "items": { "type": "string" },
          "description": "States with full data and content support"
        },
        "default_persona": { "type": "string", "enum": ["FHB-OO", "INV-NEW", "INV-EXP"] },
        "maintenance_mode": { "type": "boolean" }
      }
    },
    "features": {
      "type": "object",
      "description": "Feature flags for progressive rollout",
      "properties": {
        "stamp_duty_calculator": { "type": "boolean" },
        "fhb_grant_checker": { "type": "boolean" },
        "referral_ctas": { "type": "boolean" },
        "professional_directory": { "type": "boolean" },
        "deal_analyser": { "type": "boolean" },
        "dsr_calculator": { "type": "boolean" },
        "portfolio_tracker": { "type": "boolean" },
        "email_parsing": { "type": "boolean" },
        "multi_state": { "type": "boolean" }
      }
    },
    "integrations": {
      "type": "object",
      "description": "Third-party service configuration",
      "properties": {
        "analytics": {
          "type": "object",
          "properties": {
            "provider": { "type": "string" },
            "tracking_id": { "type": "string" },
            "anonymise_ip": { "type": "boolean" }
          }
        },
        "form_service": {
          "type": "object",
          "properties": {
            "provider": { "type": "string", "enum": ["formspree", "basin", "getform", "custom"] },
            "endpoint": { "type": "string" },
            "public_key": { "type": ["string", "null"] }
          }
        },
        "maps": {
          "type": "object",
          "properties": {
            "provider": { "type": "string" },
            "api_key_env_var": { "type": "string" }
          }
        }
      }
    },
    "content": {
      "type": "object",
      "properties": {
        "default_disclaimer_key": { "type": "string" },
        "contact_email": { "type": "string", "format": "email" },
        "review_cadence_days": { "type": "integer" }
      }
    }
  }
}
```

### Example

```json
{
  "_schema_version": "1.0",
  "_notes": "Platform configuration for v1 NSW build. Feature flags enable progressive rollout without code changes. Update this file to activate v2/v3 features.",
  "platform": {
    "name": "Property Purchase Guidance Platform",
    "current_state": "NSW",
    "supported_states": ["NSW"],
    "default_persona": "FHB-OO",
    "maintenance_mode": false
  },
  "features": {
    "stamp_duty_calculator": true,
    "fhb_grant_checker": true,
    "referral_ctas": true,
    "professional_directory": true,
    "deal_analyser": false,
    "dsr_calculator": false,
    "portfolio_tracker": false,
    "email_parsing": false,
    "multi_state": false
  },
  "integrations": {
    "analytics": {
      "provider": "plausible",
      "tracking_id": "propertyguide.example",
      "anonymise_ip": true
    },
    "form_service": {
      "provider": "formspree",
      "endpoint": "https://formspree.io/f/YOUR_FORM_ID",
      "public_key": null
    },
    "maps": {
      "provider": "none",
      "api_key_env_var": "MAPS_API_KEY"
    }
  },
  "content": {
    "default_disclaimer_key": "general_information_only",
    "contact_email": "hello@propertyguide.example",
    "review_cadence_days": 90
  }
}
```

---

## 8. File inventory and loader convention

| File | Purpose | Loaded by |
|------|---------|-----------|
| `nsw-stamp-duty-brackets.json` | Transfer duty calculation | Stamp duty calculator component |
| `nsw-fhb-grant-eligibility.json` | Grant/concession eligibility | FHB grant checker component |
| `nsw-lga-list.json` | Suburb grouping, service areas | Suburb selector, partner directory |
| `professional-network-schema.json` | Partner data (populated) | Referral CTA, partner directory |
| `disclaimer-library.json` | Compliance disclaimers | All calculators and guide pages |
| `user-persona-profiles.json` | Persona definitions | Journey router, content personalisation |
| `site-config.json` | Global configuration | Build pipeline, feature router |

### Loading convention for static site

All JSON files live in `/public/data/` and are fetched at runtime by the front-end:

```javascript
// Loader utility pattern
async function loadDataFile(filename) {
  const response = await fetch(`/data/${filename}`);
  const data = await response.json();
  // Validate _schema_version
  if (!data._schema_version) {
    console.warn(`Missing _schema_version in ${filename}`);
  }
  return data;
}
```

Build-time validation: a pre-build script validates every JSON file against its schema before site generation.

### State expansion pattern (v2)

For multi-state support, introduce a state parameter in the loader:

```javascript
async function loadStateData(state, dataType) {
  const filename = `${state.toLowerCase()}-${dataType}.json`;
  return loadDataFile(filename);
}
```

Files follow the naming convention: `{state}-{data-type}.json` where `state` is the lower-case ISO abbreviation (`nsw`, `vic`, `qld`, etc.).
