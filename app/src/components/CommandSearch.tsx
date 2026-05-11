import { useState, useEffect, useRef, useMemo } from 'react';
import { Search, X, FileText, Calculator, Map as MapIcon, ClipboardList, HelpCircle, Phone, BookOpen, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { stageOrder, stageTitles, stageDescriptions, stageSlugs } from '@/content/metadata';
import { calcMenu } from '@/content/calculatorMenu';
import { references } from '@/content/referenceList';

interface SearchItem {
  id: string;
  title: string;
  description: string;
  path: string;
  icon: React.ReactNode;
  category: string;
}

const CATEGORY_ORDER = ['Journey', 'Reference', 'Calculators', 'Tools'];

export function CommandSearch() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  // All searchable content — built from actual metadata
  const items: SearchItem[] = useMemo(() => [
    // Journey stages
    ...stageOrder.map((stageId) => ({
      id: `stage-${stageId}`,
      title: stageTitles[stageId] || stageId,
      description: stageDescriptions[stageId] || '',
      path: `/journey/${stageSlugs[stageId]}`,
      icon: <MapIcon className="h-4 w-4" />,
      category: 'Journey',
    })),
    // Reference articles
    ...references.map((ref) => ({
      id: `ref-${ref.slug}`,
      title: ref.title,
      description: ref.description,
      path: `/reference/${ref.slug}`,
      icon: <BookOpen className="h-4 w-4" />,
      category: 'Reference',
    })),
    // Calculators
    ...calcMenu.map((calc) => ({
      id: `calc-${calc.id}`,
      title: calc.title,
      description: calc.description,
      path: `/calculators?c=${calc.id}`,
      icon: <Calculator className="h-4 w-4" />,
      category: 'Calculators',
    })),
    // Tools
    { id: 'tools', title: 'Interactive Tools', description: 'Decision trees, timelines, and more', path: '/tools', icon: <FileText className="h-4 w-4" />, category: 'Tools' },
    { id: 'checklists', title: 'Property Checklists', description: 'Stage-by-stage action checklists', path: '/checklists', icon: <ClipboardList className="h-4 w-4" />, category: 'Tools' },
    { id: 'questions', title: 'Question Scripts', description: 'What to ask professionals', path: '/questions', icon: <HelpCircle className="h-4 w-4" />, category: 'Tools' },
    { id: 'pros', title: 'Find a Professional', description: 'Mortgage brokers, conveyancers, inspectors', path: '/professionals', icon: <Phone className="h-4 w-4" />, category: 'Tools' },
    { id: 'strategy-call', title: 'Free Strategy Call', description: '15-minute call with a property strategist', path: '/strategy-call', icon: <Phone className="h-4 w-4" />, category: 'Tools' },
  ], []);

  const filtered = useMemo(() => {
    if (!query.trim()) return items;
    const q = query.toLowerCase();
    return items.filter(i => i.title.toLowerCase().includes(q) || i.description.toLowerCase().includes(q) || i.category.toLowerCase().includes(q));
  }, [query, items]);

  const grouped = useMemo(() => {
    const groups: Record<string, SearchItem[]> = {};
    for (const item of filtered) {
      if (!groups[item.category]) groups[item.category] = [];
      groups[item.category].push(item);
    }
    const ordered: [string, SearchItem[]][] = [];
    for (const cat of CATEGORY_ORDER) {
      if (groups[cat]) ordered.push([cat, groups[cat]]);
    }
    for (const [cat, catItems] of Object.entries(groups)) {
      if (!CATEGORY_ORDER.includes(cat)) ordered.push([cat, catItems]);
    }
    return ordered;
  }, [filtered]);

  const indexMap = useMemo(() => {
    const map = new Map<string, number>();
    filtered.forEach((item, idx) => map.set(item.id, idx));
    return map;
  }, [filtered]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setOpen(true);
      }
      if (e.key === 'Escape') {
        setOpen(false);
        setQuery('');
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, []);

  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus();
    }
  }, [open]);

  const handleSelect = (item: SearchItem) => {
    navigate(item.path);
    setOpen(false);
    setQuery('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(i => Math.min(i + 1, filtered.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(i => Math.max(i - 1, 0));
    } else if (e.key === 'Enter' && filtered[selectedIndex]) {
      e.preventDefault();
      handleSelect(filtered[selectedIndex]);
    }
  };

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-md text-sm text-muted-foreground bg-muted/50 hover:bg-muted border border-border/50 transition-colors"
      >
        <Search className="h-3.5 w-3.5" />
        <span>Search</span>
        <kbd className="ml-1 text-[10px] px-1.5 py-0.5 rounded bg-muted border border-border font-mono">⌘K</kbd>
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center bg-black/50 pt-[15vh] p-4">
      <div className="w-full max-w-xl rounded-xl bg-white shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Search input */}
        <div className="flex items-center gap-3 px-4 py-3 border-b">
          <Search className="h-5 w-5 text-slate-400" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search calculators, guides, checklists..."
            className="flex-1 text-sm text-slate-800 placeholder:text-slate-400 outline-none bg-transparent"
          />
          <button onClick={() => { setOpen(false); setQuery(''); }} className="text-slate-400 hover:text-slate-600">
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Results */}
        <div className="max-h-[50vh] overflow-y-auto">
          {filtered.length === 0 ? (
            <div className="px-4 py-8 text-center text-sm text-slate-500">
              No results for "{query}". Try a different search term.
            </div>
          ) : (
            <div className="py-2">
              {grouped.map(([category, catItems]) => (
                <div key={category}>
                  <div className="px-4 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wide bg-slate-50 sticky top-0">
                    {category}
                  </div>
                  {catItems.map((item) => {
                    const globalIdx = indexMap.get(item.id) ?? 0;
                    return (
                      <button
                        key={item.id}
                        onClick={() => handleSelect(item)}
                        onMouseEnter={() => setSelectedIndex(globalIdx)}
                        className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors ${
                          globalIdx === selectedIndex ? 'bg-primary/5' : 'hover:bg-slate-50'
                        }`}
                      >
                        <div className={`flex-shrink-0 ${globalIdx === selectedIndex ? 'text-primary' : 'text-slate-400'}`}>
                          {item.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className={`text-sm font-medium truncate ${globalIdx === selectedIndex ? 'text-primary' : 'text-slate-700'}`}>
                            {item.title}
                          </div>
                          <div className="text-xs text-slate-500 truncate">{item.description}</div>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-500 font-medium">
                            {item.category}
                          </span>
                          {globalIdx === selectedIndex && <ArrowRight className="h-3.5 w-3.5 text-primary" />}
                        </div>
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center gap-4 px-4 py-2 bg-slate-50 border-t text-[11px] text-slate-500">
          <span className="flex items-center gap-1"><kbd className="px-1 rounded bg-white border border-slate-200 font-mono">↑↓</kbd> Navigate</span>
          <span className="flex items-center gap-1"><kbd className="px-1 rounded bg-white border border-slate-200 font-mono">↵</kbd> Select</span>
          <span className="flex items-center gap-1"><kbd className="px-1 rounded bg-white border border-slate-200 font-mono">Esc</kbd> Close</span>
          <span className="ml-auto">{filtered.length} results</span>
        </div>
      </div>
    </div>
  );
}
