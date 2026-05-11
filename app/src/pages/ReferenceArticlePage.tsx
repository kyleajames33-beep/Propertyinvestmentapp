import { useParams, Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { MarkdownRenderer } from '@/components/MarkdownRenderer';
import { ArrowLeft, BookOpen, Clock, RefreshCw } from 'lucide-react';
import { BookmarkButton } from '@/components/BookmarkButton';
import { SEO } from '@/components/SEO';

// Import reference markdown files
import stampDuty from '@/content/reference/nsw-stamp-duty-rules.md?raw';
import fhbSchemes from '@/content/reference/nsw-fhb-schemes.md?raw';
import landTax from '@/content/reference/nsw-land-tax.md?raw';
import apra from '@/content/reference/apra-serviceability-basics.md?raw';
import ato from '@/content/reference/ato-investment-property-basics.md?raw';
import strata from '@/content/reference/strata-vs-torrens.md?raw';
import inspection from '@/content/reference/building-pest-inspection-guide.md?raw';
import conveyancing from '@/content/reference/conveyancer-vs-solicitor-nsw.md?raw';
import offset from '@/content/reference/offset-vs-redraw.md?raw';
import preApproval from '@/content/reference/pre-approval-process.md?raw';
import { parseFrontmatter } from '@/content/parser';
import { ContentFeedback } from '@/components/ContentFeedback';

const referenceRegistry: Record<string, string> = {
  'nsw-stamp-duty-rules': stampDuty,
  'nsw-fhb-schemes': fhbSchemes,
  'nsw-land-tax': landTax,
  'apra-serviceability-basics': apra,
  'ato-investment-property-basics': ato,
  'strata-vs-torrens': strata,
  'building-pest-inspection-guide': inspection,
  'conveyancer-vs-solicitor-nsw': conveyancing,
  'offset-vs-redraw': offset,
  'pre-approval-process': preApproval,
};

const referenceTitles: Record<string, string> = {
  'nsw-stamp-duty-rules': 'NSW Stamp Duty Rules',
  'nsw-fhb-schemes': 'NSW First Home Buyer Schemes',
  'nsw-land-tax': 'NSW Land Tax Guide',
  'apra-serviceability-basics': 'APRA Serviceability Basics',
  'ato-investment-property-basics': 'ATO Investment Property Basics',
  'strata-vs-torrens': 'Strata vs Torrens Title',
  'building-pest-inspection-guide': 'Building and Pest Inspection Guide',
  'conveyancer-vs-solicitor-nsw': 'Conveyancer vs Solicitor in NSW',
  'offset-vs-redraw': 'Offset Account vs Redraw Facility',
  'pre-approval-process': 'The Pre-Approval Process',
};

const referenceLastUpdated: Record<string, string> = {
  'nsw-stamp-duty-rules': 'April 2025',
  'nsw-fhb-schemes': 'April 2025',
  'nsw-land-tax': 'April 2025',
  'apra-serviceability-basics': 'March 2025',
  'ato-investment-property-basics': 'March 2025',
  'strata-vs-torrens': 'February 2025',
  'building-pest-inspection-guide': 'February 2025',
  'conveyancer-vs-solicitor-nsw': 'March 2025',
  'offset-vs-redraw': 'January 2025',
  'pre-approval-process': 'March 2025',
};

export function ReferenceArticlePage() {
  const { slug } = useParams<{ slug: string }>();
  const raw = slug ? referenceRegistry[slug] : null;
  const content = raw ? parseFrontmatter(raw) : null;
  const title = slug ? (content?.frontmatter?.title || referenceTitles[slug] || slug.replace(/-/g, ' ')) : '';
  const lastUpdated = slug ? (content?.frontmatter?.last_reviewed || referenceLastUpdated[slug] || '2025') : '';

  if (!content) {
    return (
      <div className="pp-container py-20 text-center">
        <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h1 className="text-xl font-semibold mb-2">Article not found</h1>
        <p className="text-muted-foreground mb-4">The reference article you are looking for does not exist.</p>
        <Link to="/reference" className="text-primary hover:underline">Back to reference library</Link>
      </div>
    );
  }

  return (
    <div className="pp-container py-12">
      <SEO title={`${String(title)} — PropertyPath Reference`} description={`Learn about ${String(title)}. Educational reference guides for NSW property buyers.`} />
      <div className="max-w-4xl mx-auto">
        <Link to="/reference" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors">
          <ArrowLeft className="h-4 w-4" />
          Back to reference library
        </Link>

        <div className="mb-8">
          <div className="flex items-center gap-2 mb-3 flex-wrap">
            <Badge variant="secondary">Reference</Badge>
            {lastUpdated && (
              <Badge variant="outline" className="text-xs text-muted-foreground flex items-center gap-1">
                <Clock className="h-3 w-3" />
                Updated {String(lastUpdated)}
              </Badge>
            )}
          </div>
          <div className="flex items-start justify-between gap-4">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">{String(title)}</h1>
            <BookmarkButton
              bookmark={{
                id: `ref-${slug}`,
                type: 'reference',
                title: String(title),
                url: `/reference/${slug}`,
              }}
            />
          </div>
        </div>

        <MarkdownRenderer content={content.body} />

        {content.frontmatter?.sources && (
          <div className="mt-10 pt-6 border-t">
            <h3 className="text-sm font-semibold text-muted-foreground mb-2">Sources</h3>
            <ul className="text-sm text-muted-foreground space-y-1">
              {(content.frontmatter.sources as string[]).map((src: string, i: number) => (
                <li key={i} className="flex items-start gap-2">
                  <RefreshCw className="h-3 w-3 mt-1 flex-shrink-0" />
                  {src}
                </li>
              ))}
            </ul>
            {lastUpdated && (
              <p className="text-xs text-muted-foreground mt-3">
                Last reviewed: {String(lastUpdated)}
              </p>
            )}
          </div>
        )}

        <Card className="mt-10 border-primary/10 bg-primary/5">
          <div className="p-4 text-sm text-muted-foreground">
            <p className="font-medium text-foreground mb-2">Disclaimer</p>
            <p>
              This article provides general information only and does not constitute financial, legal, or tax advice. 
              Rules and thresholds change regularly. Verify current information with the relevant government authority 
              and seek professional advice before making decisions.
            </p>
          </div>
        </Card>

        <ContentFeedback pageId={slug || 'unknown'} pageType="reference" />
      </div>
    </div>
  );
}


