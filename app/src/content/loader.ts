import type { Persona } from '@/types/content';
import { parseFrontmatter, type ParsedContent } from './parser';

// Dynamic loader — only imports the markdown file that is needed
export async function getJourneyContent(stageId: string, persona: Persona): Promise<ParsedContent> {
  const files: Record<string, Record<string, () => Promise<string>>> = {
    '01-strategy': {
      'fhb-oo': async () => (await import('./journey/01-strategy/01-fhb-oo.md?raw')).default,
      'inv-new': async () => (await import('./journey/01-strategy/02-inv-new.md?raw')).default,
      'inv-exp': async () => (await import('./journey/01-strategy/03-inv-exp.md?raw')).default,
    },
    '02-finance-prep': {
      'fhb-oo': async () => (await import('./journey/02-finance-prep/01-fhb-oo.md?raw')).default,
      'inv-new': async () => (await import('./journey/02-finance-prep/02-inv-new.md?raw')).default,
      'inv-exp': async () => (await import('./journey/02-finance-prep/03-inv-exp.md?raw')).default,
    },
    '03-market-research': {
      'fhb-oo': async () => (await import('./journey/03-market-research/01-fhb-oo.md?raw')).default,
      'inv-new': async () => (await import('./journey/03-market-research/02-inv-new.md?raw')).default,
      'inv-exp': async () => (await import('./journey/03-market-research/03-inv-exp.md?raw')).default,
    },
    '04-shortlisting': {
      'fhb-oo': async () => (await import('./journey/04-shortlisting/01-fhb-oo.md?raw')).default,
      'inv-new': async () => (await import('./journey/04-shortlisting/02-inv-new.md?raw')).default,
      'inv-exp': async () => (await import('./journey/04-shortlisting/03-inv-exp.md?raw')).default,
    },
    '05-inspection-dd': {
      'fhb-oo': async () => (await import('./journey/05-inspection-dd/01-fhb-oo.md?raw')).default,
      'inv-new': async () => (await import('./journey/05-inspection-dd/02-inv-new.md?raw')).default,
      'inv-exp': async () => (await import('./journey/05-inspection-dd/03-inv-exp.md?raw')).default,
    },
    '06-offer-negotiation': {
      'fhb-oo': async () => (await import('./journey/06-offer-negotiation/01-fhb-oo.md?raw')).default,
      'inv-new': async () => (await import('./journey/06-offer-negotiation/02-inv-new.md?raw')).default,
      'inv-exp': async () => (await import('./journey/06-offer-negotiation/03-inv-exp.md?raw')).default,
    },
    '07-contract-review': {
      'fhb-oo': async () => (await import('./journey/07-contract-review/01-fhb-oo.md?raw')).default,
      'inv-new': async () => (await import('./journey/07-contract-review/02-inv-new.md?raw')).default,
      'inv-exp': async () => (await import('./journey/07-contract-review/03-inv-exp.md?raw')).default,
    },
    '08-settlement': {
      'fhb-oo': async () => (await import('./journey/08-settlement/01-fhb-oo.md?raw')).default,
      'inv-new': async () => (await import('./journey/08-settlement/02-inv-new.md?raw')).default,
      'inv-exp': async () => (await import('./journey/08-settlement/03-inv-exp.md?raw')).default,
    },
  };

  const loader = files[stageId]?.[persona];
  if (!loader) return { frontmatter: {}, body: '' };
  const raw = await loader();
  return parseFrontmatter(raw);
}
