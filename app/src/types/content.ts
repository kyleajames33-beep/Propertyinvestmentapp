export type Persona = 'fhb-oo' | 'inv-new' | 'inv-exp' | 'downsizer';

export interface PersonaConfig {
  id: Persona;
  label: string;
  tagline: string;
  description: string;
  badgeClass: string;
  icon: string;
}

export interface JourneyStage {
  id: string;
  number: number;
  title: string;
  description: string;
  slug: string;
}

export interface JourneyContent {
  stageId: string;
  persona: Persona;
  title: string;
  content: string;
  referralCTAs: ReferralCTA[];
  sources: string[];
  lastReviewed: string;
}

export interface ReferralCTA {
  id: string;
  professionalType: ProfessionalType;
  trigger: string;
  variants: {
    soft: string;
    medium: string;
    direct: string;
  };
  leadFields: string[];
}

export type ProfessionalType =
  | 'mortgage-broker'
  | 'conveyancer'
  | 'buyers-agent'
  | 'building-inspector'
  | 'property-manager'
  | 'accountant';

export interface ProfessionalConfig {
  id: ProfessionalType;
  label: string;
  description: string;
}
