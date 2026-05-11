import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BookOpen } from 'lucide-react';
import { SEO } from '@/components/SEO';
import { trackActivity } from '@/lib/badges';
import { references, getRefIcon } from '@/content/referenceList';

export function ReferencePage() {
  useEffect(() => { trackActivity('reference_read'); }, []);

  return (
    <div className="pp-container py-12">
      <SEO title="Property Reference Library — PropertyPath" description="Deep dives into NSW stamp duty, land tax, strata, building inspections, and first home buyer schemes." />
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <div className="flex items-center justify-center gap-2 mb-3">
            <BookOpen className="h-6 w-6 text-primary" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Reference Library</h1>
          <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
            Deep dives into NSW property rules, tax, finance, and due diligence. 
            All content cites primary sources and is regularly reviewed.
          </p>
        </div>

        {/* Tag filters */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {['Essential', 'FHB', 'Investor', 'Finance', 'Tax'].map(tag => (
            <Badge key={tag} variant="outline" className="cursor-pointer hover:bg-muted transition-colors">
              {tag}
            </Badge>
          ))}
        </div>

        {/* Reference cards */}
        <div className="grid md:grid-cols-2 gap-4">
          {references.map(ref => (
            <Link key={ref.slug} to={`/reference/${ref.slug}`} className="group">
              <Card className="h-full transition-all hover:shadow-md hover:border-primary/20">
                <CardHeader>
                  <div className="flex items-start justify-between mb-2">
                    <div className="text-primary">{getRefIcon(ref.iconName, 'h-5 w-5')}</div>
                    <Badge variant="secondary" className="text-xs">{ref.tag}</Badge>
                  </div>
                  <CardTitle className="text-lg group-hover:text-primary transition-colors">
                    {ref.title}
                  </CardTitle>
                  <CardDescription className="mt-1.5">
                    {ref.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>

        {/* Disclaimer */}
        <div className="mt-12 p-4 rounded-lg border border-amber-200 bg-amber-50/50 text-sm text-amber-800">
          <p className="font-medium mb-1">Educational content only</p>
          <p>
            Reference articles provide general information about NSW property rules and processes. 
            Rules change, and your situation may have unique factors. Always verify current rules with 
            the relevant authority (Revenue NSW, ATO, etc.) and seek professional advice before making decisions.
          </p>
        </div>
      </div>
    </div>
  );
}
