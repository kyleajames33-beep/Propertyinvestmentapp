import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import {
  BookOpen, AlertTriangle, Lightbulb, Star, ChevronDown, ChevronUp,
  CheckCircle, Brain, Target, Layers, FlaskConical,
} from 'lucide-react';
import {
  MindMapDiagram, FlowChartDiagram, ComparisonTable,
  AtAGlanceCard, CheckInCard, AccordionContainer,
} from '@/components/diagrams';
import type { TocItem } from '@/lib/toc';

interface Props { content: string; tocItems?: TocItem[]; }

/* ── Helpers ── */
function splitSections(content: string): Array<{ title: string; body: string; num: number }> {
  const sections: Array<{ title: string; body: string; num: number }> = [];
  const lines = content.split('\n');
  let currentTitle = '', currentBody: string[] = [], sectionNum = 0, inFrontmatter = false;
  for (const line of lines) {
    if (line.trim() === '---') { inFrontmatter = !inFrontmatter; continue; }
    if (inFrontmatter) continue;
    if (line.startsWith('## ')) {
      if (currentTitle || currentBody.length > 0) sections.push({ title: currentTitle, body: currentBody.join('\n'), num: sectionNum });
      sectionNum++; currentTitle = line.slice(3).trim(); currentBody = [];
    } else { currentBody.push(line); }
  }
  if (currentTitle || currentBody.length > 0) sections.push({ title: currentTitle, body: currentBody.join('\n'), num: sectionNum });
  return sections;
}

function extractKeyConcept(body: string): string | null {
  const lines = body.split('\n').filter(l => l.trim());
  return lines.find(l => l.length > 60 && !l.startsWith('>') && !l.startsWith('#')) || null;
}
function extractBullets(body: string): string[] {
  return body.split('\n').filter(l => l.trim().startsWith('- ') || l.trim().startsWith('* '))
    .map(l => l.replace(/^[-*]\s+/, '').trim()).filter(l => l.length > 10 && l.length < 120).slice(0, 4);
}
function isCallout(text: string): { variant: string; tag: string } | null {
  const lower = text.toLowerCase();
  if (lower.includes('must know') || lower.includes('key point') || lower.includes('important:')) return { variant: 'amber', tag: 'Must know' };
  if (lower.includes('common error') || lower.includes('common mistake') || lower.includes('warning:') || lower.includes('trap:')) return { variant: 'red', tag: 'Watch out' };
  if (lower.includes('insight') || lower.includes('tip:') || lower.includes('pro tip')) return { variant: 'blue', tag: 'Insight' };
  if (lower.includes('source:') || lower.includes('disclaimer')) return { variant: 'blue', tag: 'Note' };
  return null;
}
function isQuickTip(text: string): boolean {
  const lower = text.toLowerCase();
  return (lower.includes('tip:') || lower.includes('remember:') || lower.includes('quick tip')) && text.length < 200;
}

/* ── Color rotations for numbered cards ── */
const CARD_VARIANTS = ['', 'teal', 'amber', 'green', 'red', 'purple', 'teal', 'amber', 'green', 'red', 'purple'] as const;

/* ── Parse special directive blocks from markdown ── */
function parseDirectives(body: string): Array<{ type: 'text' | 'mindmap' | 'flowchart' | 'compare' | 'glance' | 'checkin' | 'accordion'; content: string }> {
  const parts: Array<{ type: 'text' | 'mindmap' | 'flowchart' | 'compare' | 'glance' | 'checkin' | 'accordion'; content: string }> = [];
  const directiveRegex = /:::([a-z]+)\s*\n([\s\S]*?)\n:::/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = directiveRegex.exec(body)) !== null) {
    if (match.index > lastIndex) parts.push({ type: 'text', content: body.slice(lastIndex, match.index) });
    const dirType = match[1] as 'mindmap' | 'flowchart' | 'compare' | 'glance' | 'checkin' | 'accordion';
    if (['mindmap', 'flowchart', 'compare', 'glance', 'checkin', 'accordion'].includes(dirType)) {
      parts.push({ type: dirType, content: match[2].trim() });
    } else {
      parts.push({ type: 'text', content: match[0] });
    }
    lastIndex = match.index + match[0].length;
  }
  if (lastIndex < body.length) parts.push({ type: 'text', content: body.slice(lastIndex) });
  if (parts.length === 0) parts.push({ type: 'text', content: body });
  return parts;
}

/* ── Parse mindmap data ── */
function parseMindMapData(text: string): { title: string; center: string; branches: Array<{ label: string; color: string; children?: Array<{ label: string }> }> } {
  const lines = text.split('\n').filter(l => l.trim());
  const title = lines[0]?.replace(/^#\s*/, '') || 'Concept Map';
  const center = lines[1]?.replace(/^center:\s*/, '') || 'Core';
  const branches: Array<{ label: string; color: string; children?: Array<{ label: string }> }> = [];
  let currentBranch: typeof branches[0] | null = null;
  const COLORS = ['#2563eb', '#f59e0b', '#16a34a', '#ef4444', '#7c3aed', '#0891b2'];

  for (let i = 2; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line.startsWith('- ') && !line.startsWith('  -')) {
      currentBranch = { label: line.replace(/^-\s*/, ''), color: COLORS[branches.length % COLORS.length], children: [] };
      branches.push(currentBranch);
    } else if (line.startsWith('  - ') && currentBranch) {
      currentBranch.children!.push({ label: line.replace(/^\s+-\s*/, '') });
    }
  }
  return { title, center, branches };
}

/* ── Parse flowchart data ── */
function parseFlowchartData(text: string): { title: string; nodes: Array<{ id: string; label: string; type: 'start' | 'process' | 'decision' | 'end' | 'note'; description?: string; color?: string; x: number; y: number; w?: number; h?: number }>; edges: Array<{ from: string; to: string; label?: string }> } {
  const lines = text.split('\n').filter(l => l.trim());
  const title = lines[0]?.replace(/^#\s*/, '') || 'Flow Chart';
  const nodes: Array<{ id: string; label: string; type: 'start' | 'process' | 'decision' | 'end' | 'note'; description?: string; color?: string; x: number; y: number; w?: number; h?: number }> = [];
  const edges: Array<{ from: string; to: string; label?: string }> = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line.startsWith('node:')) {
      const parts = line.replace(/^node:\s*/, '').split('|').map(p => p.trim());
      const [id, label, type, x, y, color] = parts;
      nodes.push({ id, label, type: (type as any) || 'process', x: parseInt(x) || 50, y: parseInt(y) || 50, color, w: type === 'decision' ? 100 : 120, h: type === 'decision' ? 60 : 40 });
    } else if (line.startsWith('edge:')) {
      const parts = line.replace(/^edge:\s*/, '').split('|').map(p => p.trim());
      edges.push({ from: parts[0], to: parts[1], label: parts[2] });
    }
  }
  return { title, nodes, edges };
}

/* ── Parse compare table data ── */
function parseCompareData(text: string): { title: string; labels: string[]; columns: Array<{ header: string; color?: string; features: Array<{ value: string | boolean; highlight?: boolean }> }> } {
  const lines = text.split('\n').filter(l => l.trim());
  const title = lines[0]?.replace(/^#\s*/, '') || 'Comparison';
  const labels: string[] = [];
  const columns: Array<{ header: string; color?: string; features: Array<{ value: string | boolean; highlight?: boolean }> }> = [];

  let labelMode = false;
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line.startsWith('labels:')) { labelMode = true; continue; }
    if (line.startsWith('col:')) {
      labelMode = false;
      const parts = line.replace(/^col:\s*/, '').split('|').map(p => p.trim());
      columns.push({ header: parts[0], color: parts[1], features: [] });
    } else if (labelMode && line.startsWith('- ')) {
      labels.push(line.replace(/^-\s*/, ''));
    } else if (!labelMode && line.startsWith('- ') && columns.length > 0) {
      const val = line.replace(/^-\s*/, '');
      const isBool = val === 'yes' || val === 'true' || val === 'no' || val === 'false';
      const highlight = val.startsWith('*') && val.endsWith('*');
      const cleanVal = highlight ? val.slice(1, -1) : val;
      columns[columns.length - 1].features.push({
        value: isBool ? (cleanVal === 'yes' || cleanVal === 'true') : cleanVal,
        highlight,
      });
    }
  }
  return { title, labels, columns };
}

/* ── Parse glance data ── */
function parseGlanceData(text: string): { title: string; items: Array<{ icon: any; label: string; value: string; color?: string }> } {
  const lines = text.split('\n').filter(l => l.trim());
  const title = lines[0]?.replace(/^#\s*/, '') || 'At a Glance';
  const items: Array<{ icon: any; label: string; value: string; color?: string }> = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line.startsWith('- ')) {
      const parts = line.replace(/^-\s*/, '').split('|').map(p => p.trim());
      items.push({ icon: parts[0] as any, label: parts[1], value: parts[2], color: parts[3] });
    }
  }
  return { title, items };
}

/* ── Parse checkin data ── */
function parseCheckinData(text: string): { title: string; subtitle: string; items: Array<{ label: string; checked?: boolean }> } {
  const lines = text.split('\n').filter(l => l.trim());
  const title = lines[0]?.replace(/^#\s*/, '') || 'Check-In';
  const subtitle = lines[1]?.replace(/^sub:\s*/, '') || 'Before proceeding, make sure you have:';
  const items: Array<{ label: string; checked?: boolean }> = [];

  for (let i = 2; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line.startsWith('- ')) {
      const checked = line.startsWith('- [x] ');
      items.push({ label: line.replace(/^- \[[ x]\]\s*/, '').replace(/^-\s*/, ''), checked });
    }
  }
  return { title, subtitle, items };
}

/* ── Parse accordion data ── */
function parseAccordionData(text: string): { title: string; items: Array<{ title: string; content: string; badge?: string; badgeColor?: string; defaultOpen?: boolean }> } {
  const lines = text.split('\n');
  const title = lines[0]?.trim().replace(/^#\s*/, '') || '';
  const items: Array<{ title: string; content: string; badge?: string; badgeColor?: string; defaultOpen?: boolean }> = [];

  let currentItem: typeof items[0] | null = null;
  let contentLines: string[] = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    if (line.match(/^##\s+/)) {
      if (currentItem) { currentItem.content = contentLines.join('\n').trim(); items.push(currentItem); }
      const headerLine = line.replace(/^##\s*/, '');
      const badgeMatch = headerLine.match(/\[([^\]]+)\](\{([^}]+)\})?/);
      currentItem = {
        title: badgeMatch ? headerLine.replace(/\[[^\]]+\](\{[^}]+\})?/, '').trim() : headerLine,
        badge: badgeMatch ? badgeMatch[1] : undefined,
        badgeColor: badgeMatch ? badgeMatch[3] : undefined,
        defaultOpen: items.length === 0,
        content: '',
      };
      contentLines = [];
    } else if (currentItem) {
      contentLines.push(line);
    }
  }
  if (currentItem) { currentItem.content = contentLines.join('\n').trim(); items.push(currentItem); }
  return { title, items };
}

/* ── Inline highlight parser: replaces ==text== with styled spans ── */
function renderWithHighlights(text: string): string {
  return text.replace(/==([^=]+)==/g, '<span class="pp-inline-highlight">$1</span>');
}

/* ── Main component ── */
export function HSCJourneyContent({ content, tocItems }: Props) {
  const sections = splitSections(content);
  const [collapsed, setCollapsed] = useState<Record<number, boolean>>({});
  const toggle = (idx: number) => setCollapsed(prev => ({ ...prev, [idx]: !prev[idx] }));

  let tocIdx = 0;
  const getNextId = () => {
    const item = tocItems?.[tocIdx];
    tocIdx++;
    return item?.id;
  };

  // Build learning outcomes
  const allBullets = sections.slice(0, 6).flatMap(s => extractBullets(s.body));
  const knowItems = allBullets.filter((_, i) => i % 3 === 0).slice(0, 3);
  const understandItems = allBullets.filter((_, i) => i % 3 === 1).slice(0, 3);
  const candoItems = allBullets.filter((_, i) => i % 3 === 2).slice(0, 3);
  const hasOutcomes = knowItems.length + understandItems.length + candoItems.length >= 3;

  // Extract key concept from intro
  const introSection = sections.find(s => s.num === 0 && !s.title);
  const keyConcept = introSection ? extractKeyConcept(introSection.body) : null;

  const markdownComponents = {
    h3: ({ children }: { children?: React.ReactNode }) => (
      <h3 id={getNextId()} className="text-[15px] font-bold mt-5 mb-2 text-slate-700 flex items-center gap-2">
        <Target className="h-3.5 w-3.5 text-slate-400" />
        {children}
      </h3>
    ),
    blockquote: ({ children }: { children?: React.ReactNode }) => {
      const text = String(children);
      const callout = isCallout(text);
      if (callout) return <Callout variant={callout.variant} tag={callout.tag}>{children}</Callout>;
      if (isQuickTip(text)) return <QuickTip>{children}</QuickTip>;
      return <blockquote className="border-l-4 border-primary/30 bg-muted/40 pl-4 py-3 pr-4 my-4 rounded-r-lg italic text-slate-600 text-[13px]">{children}</blockquote>;
    },
  };

  /* ── Render directive components ── */
  const renderDirectives = (body: string) => {
    const parts = parseDirectives(body);
    return parts.map((part, idx) => {
      if (part.type === 'text') {
        const processed = renderWithHighlights(part.content);
        return (
          <div key={idx} className="pp-card-v3-body">
            <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]} components={markdownComponents}>{processed}</ReactMarkdown>
          </div>
        );
      }

      if (part.type === 'mindmap') {
        try { const data = parseMindMapData(part.content); return <MindMapDiagram key={idx} title={data.title} centerLabel={data.center} branches={data.branches} />; }
        catch { return <div key={idx} className="pp-callout pp-callout-red"><span className="pp-callout-tag">Error</span>Could not parse mind map data.</div>; }
      }

      if (part.type === 'flowchart') {
        try { const data = parseFlowchartData(part.content); return <FlowChartDiagram key={idx} title={data.title} nodes={data.nodes} edges={data.edges} />; }
        catch { return <div key={idx} className="pp-callout pp-callout-red"><span className="pp-callout-tag">Error</span>Could not parse flowchart data.</div>; }
      }

      if (part.type === 'compare') {
        try { const data = parseCompareData(part.content); return <ComparisonTable key={idx} title={data.title} columns={data.columns} rowLabels={data.labels.length > 0 ? data.labels : undefined} />; }
        catch { return <div key={idx} className="pp-callout pp-callout-red"><span className="pp-callout-tag">Error</span>Could not parse comparison data.</div>; }
      }

      if (part.type === 'glance') {
        try { const data = parseGlanceData(part.content); return <AtAGlanceCard key={idx} title={data.title} items={data.items} />; }
        catch { return <div key={idx} className="pp-callout pp-callout-red"><span className="pp-callout-tag">Error</span>Could not parse glance data.</div>; }
      }

      if (part.type === 'checkin') {
        try { const data = parseCheckinData(part.content); return <CheckInCard key={idx} title={data.title} subtitle={data.subtitle} items={data.items} />; }
        catch { return <div key={idx} className="pp-callout pp-callout-red"><span className="pp-callout-tag">Error</span>Could not parse check-in data.</div>; }
      }

      if (part.type === 'accordion') {
        try {
          const data = parseAccordionData(part.content);
          const accordionItems = data.items.map(item => ({
            ...item,
            content: <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>{renderWithHighlights(item.content)}</ReactMarkdown>,
          }));
          return <AccordionContainer key={idx} title={data.title || undefined} items={accordionItems} />;
        }
        catch { return <div key={idx} className="pp-callout pp-callout-red"><span className="pp-callout-tag">Error</span>Could not parse accordion data.</div>; }
      }

      return null;
    });
  };

  return (
    <div className="space-y-4">

      {/* ═══════ KEY CONCEPT PANEL ═══════ */}
      {keyConcept && (
        <div className="pp-key-panel">
          <div className="pp-key-panel-header">
            <FlaskConical className="h-4 w-4 text-amber-400" />
            <h3>Key Concept — This Stage</h3>
          </div>
          <div className="pp-key-panel-body">{keyConcept}</div>
          <div className="pp-key-panel-note">This principle underpins everything in this section. Understand this before moving on.</div>
        </div>
      )}

      {/* ═══════ LEARNING OUTCOME CARDS ═══════ */}
      {hasOutcomes && (
        <div className="pp-outcomes-grid">
          {knowItems.length > 0 && (
            <div className="pp-outcome-card know">
              <div className="pp-outcome-header"><BookOpen className="h-4 w-4" />Know</div>
              <ul className="pp-outcome-list">{knowItems.map((item, i) => <li key={i}>{item}</li>)}</ul>
            </div>
          )}
          {understandItems.length > 0 && (
            <div className="pp-outcome-card understand">
              <div className="pp-outcome-header"><Brain className="h-4 w-4" />Understand</div>
              <ul className="pp-outcome-list">{understandItems.map((item, i) => <li key={i}>{item}</li>)}</ul>
            </div>
          )}
          {candoItems.length > 0 && (
            <div className="pp-outcome-card cando">
              <div className="pp-outcome-header"><CheckCircle className="h-4 w-4" />Can Do</div>
              <ul className="pp-outcome-list">{candoItems.map((item, i) => <li key={i}>{item}</li>)}</ul>
            </div>
          )}
        </div>
      )}

      {/* ═══════ CORE CONTENT LABEL ═══════ */}
      <div className="pp-core-label"><Layers className="h-3.5 w-3.5" />Core Content</div>

      {/* ═══════ INTRO ═══════ */}
      {introSection && introSection.body.trim() && (
        <div className="pp-card-v3-body text-slate-600 mb-4">
          <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]} components={markdownComponents}>{introSection.body}</ReactMarkdown>
        </div>
      )}

      {/* ═══════ NUMBERED SECTION CARDS ═══════ */}
      {sections.map((section, idx) => {
        if (section.num === 0 && !section.title) return null;
        const variant = CARD_VARIANTS[section.num] || '';
        const isCollapsed = collapsed[idx];
        const sectionId = getNextId();

        return (
          <div key={idx} id={sectionId} className={`pp-card-v3 ${variant}`}>
            <button className="pp-card-v3-header w-full text-left cursor-pointer" onClick={() => toggle(idx)}>
              <div className="pp-card-v3-num">{section.num}</div>
              <div className="flex-1"><h2 className="pp-card-v3-title">{section.title}</h2></div>
              {isCollapsed ? <ChevronDown className="h-5 w-5 text-slate-400 flex-shrink-0" /> : <ChevronUp className="h-5 w-5 text-slate-400 flex-shrink-0" />}
            </button>
            {!isCollapsed && renderDirectives(section.body)}
          </div>
        );
      })}
    </div>
  );
}

/* ── Inline highlight style (added via CSS) ── */
export function InlineHighlightStyles() {
  return null; // Styles are in index.css
}

/* ── Callout sub-component ── */
function Callout({ children, variant, tag }: { children: React.ReactNode; variant: string; tag: string }) {
  const icons: Record<string, React.ReactNode> = { amber: <Star className="h-3.5 w-3.5" />, red: <AlertTriangle className="h-3.5 w-3.5" />, blue: <Lightbulb className="h-3.5 w-3.5" />, teal: <BookOpen className="h-3.5 w-3.5" /> };
  return (
    <div className={`pp-callout pp-callout-${variant} my-4`}>
      <span className="pp-callout-tag flex items-center gap-1">{icons[variant]}{tag}</span>
      <div className="text-[14px] leading-[1.7]">{children}</div>
    </div>
  );
}

/* ── Quick Tip sub-component ── */
function QuickTip({ children }: { children: React.ReactNode }) {
  return (
    <div className="pp-quick-tip my-4">
      <span className="pp-quick-tip-label">Quick Tip</span>
      <div className="pp-quick-tip-body">{children}</div>
    </div>
  );
}
