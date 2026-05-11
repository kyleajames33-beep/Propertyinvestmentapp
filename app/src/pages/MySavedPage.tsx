import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Heart, BookOpen, Map, Calculator, Trash2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { getBookmarks, removeBookmark, type Bookmark } from '@/lib/bookmarks';
import { SEO } from '@/components/SEO';

const typeIcons: Record<string, React.ReactNode> = {
  stage: <Map className="h-4 w-4" />,
  reference: <BookOpen className="h-4 w-4" />,
  calculator: <Calculator className="h-4 w-4" />,
};

const typeLabels: Record<string, string> = {
  stage: 'Journey Stage',
  reference: 'Reference Article',
  calculator: 'Calculator',
};

export function MySavedPage() {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);

  useEffect(() => {
    setBookmarks(getBookmarks());
  }, []);

  const handleRemove = (id: string) => {
    removeBookmark(id);
    setBookmarks(getBookmarks());
  };

  return (
    <div className="pp-container py-12">
      <SEO title="My Saved Items — PropertyPath" description="Your saved journey stages, reference articles, and calculators." />
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center h-14 w-14 rounded-2xl bg-rose-50 mb-4">
            <Heart className="h-7 w-7 text-rose-500" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight font-serif mb-3">My Saved Items</h1>
          <p className="text-muted-foreground">
            Journey stages, articles, and calculators you have bookmarked.
          </p>
        </div>

        {bookmarks.length === 0 ? (
          <Card className="p-8 text-center">
            <Heart className="h-10 w-10 text-slate-300 mx-auto mb-3" />
            <h3 className="font-semibold text-slate-800 mb-1">Nothing saved yet</h3>
            <p className="text-sm text-slate-500 mb-4">
              Browse the journey, reference library, or calculators and click the heart icon to save items here.
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              <Button size="sm" asChild>
                <Link to="/journey">Explore journey</Link>
              </Button>
              <Button size="sm" variant="outline" asChild>
                <Link to="/reference">Browse references</Link>
              </Button>
            </div>
          </Card>
        ) : (
          <div className="space-y-3">
            {bookmarks.map(b => (
              <div key={b.id} className="flex items-center gap-3 p-4 rounded-xl border bg-white hover:shadow-md transition-shadow">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                  {typeIcons[b.type] || <BookOpen className="h-4 w-4" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{typeLabels[b.type] || b.type}</span>
                  </div>
                  <Link to={b.url} className="font-medium text-foreground hover:text-primary transition-colors truncate block">
                    {b.title}
                  </Link>
                </div>
                <Button size="sm" variant="ghost" className="text-slate-400 hover:text-rose-500" onClick={() => handleRemove(b.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

