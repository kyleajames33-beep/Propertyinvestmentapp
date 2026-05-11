import { BookOpen, AlertTriangle, Lightbulb, CheckCircle, Star } from 'lucide-react';

interface HSCContentRendererProps {
  content: string;
}

// Parse markdown content into structured HSC blocks
interface ContentBlock {
  type: 'heading' | 'paragraph' | 'callout' | 'formula' | 'worked-example' | 'summary' | 'table' | 'list' | 'blockquote';
  level?: number;
  content: string;
  variant?: 'amber' | 'red' | 'blue' | 'teal';
  tag?: string;
  steps?: Array<{ num: string; text: string }>;
  rows?: Array<Record<string, string>>;
}

function parseContentBlocks(raw: string): ContentBlock[] {
  const blocks: ContentBlock[] = [];
  const lines = raw.split('\n');
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];
    const trimmed = line.trim();

    // Skip frontmatter
    if (trimmed === '---') {
      i++;
      while (i < lines.length && lines[i].trim() !== '---') i++;
      i++;
      continue;
    }

    // Headings
    if (trimmed.startsWith('# ')) {
      blocks.push({ type: 'heading', level: 1, content: cleanMarkdown(trimmed.slice(2)) });
      i++;
      continue;
    }
    if (trimmed.startsWith('## ')) {
      blocks.push({ type: 'heading', level: 2, content: cleanMarkdown(trimmed.slice(3)) });
      i++;
      continue;
    }
    if (trimmed.startsWith('### ')) {
      blocks.push({ type: 'heading', level: 3, content: cleanMarkdown(trimmed.slice(4)) });
      i++;
      continue;
    }
    if (trimmed.startsWith('#### ')) {
      blocks.push({ type: 'heading', level: 4, content: cleanMarkdown(trimmed.slice(5)) });
      i++;
      continue;
    }

    // Blockquote → callout detection
    if (trimmed.startsWith('>')) {
      const quoteLines: string[] = [];
      while (i < lines.length && lines[i].trim().startsWith('>')) {
        quoteLines.push(lines[i].slice(lines[i].indexOf('>') + 1).trim());
        i++;
      }
      const fullText = quoteLines.join(' ');
      // Detect callout type from content
      let variant: ContentBlock['variant'] = 'blue';
      let tag = 'Note';
      const lower = fullText.toLowerCase();
      if (lower.includes('must know') || lower.includes('important') || lower.includes('key point')) {
        variant = 'amber'; tag = 'Must know';
      } else if (lower.includes('common error') || lower.includes('common mistake') || lower.includes('warning') || lower.includes('trap')) {
        variant = 'red'; tag = 'Common error';
      } else if (lower.includes('tip') || lower.includes('insight') || lower.includes('pro tip')) {
        variant = 'blue'; tag = 'Insight';
      } else if (lower.includes('example') || lower.includes('for example')) {
        variant = 'teal'; tag = 'Example';
      } else if (lower.includes('source') || lower.includes('disclaimer')) {
        variant = 'blue'; tag = 'Note';
      }
      blocks.push({ type: 'callout', content: cleanMarkdown(fullText), variant, tag });
      continue;
    }

    // Tables
    if (trimmed.startsWith('|') && trimmed.endsWith('|') && trimmed.includes('---')) {
      const tableLines: string[] = [];
      while (i < lines.length && lines[i].trim().startsWith('|')) {
        tableLines.push(lines[i]);
        i++;
      }
      if (tableLines.length >= 2) {
        const headers = tableLines[0].split('|').map(h => h.trim()).filter(Boolean);
        const dataRows = tableLines.slice(2).map(row => {
          const cells = row.split('|').map(c => c.trim()).filter(Boolean);
          const obj: Record<string, string> = {};
          headers.forEach((h, idx) => { obj[h] = cells[idx] || ''; });
          return obj;
        });
        blocks.push({ type: 'table', content: '', rows: dataRows });
      }
      continue;
    }

    // Numbered lists with step pattern → worked example
    if (/^\d+\.\s+\*\*Step/.test(trimmed) || /^\d+\.\s+\*\*\d+\./.test(trimmed)) {
      const steps: Array<{ num: string; text: string }> = [];
      while (i < lines.length && /^\d+\.\s+/.test(lines[i].trim())) {
        const match = lines[i].trim().match(/^\d+\.\s+(.*)$/);
        if (match) {
          steps.push({ num: String(steps.length + 1), text: cleanMarkdown(match[1]) });
        }
        i++;
      }
      if (steps.length >= 2) {
        blocks.push({ type: 'worked-example', content: '', steps });
        continue;
      }
    }

    // Bullet lists
    if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
      const items: string[] = [];
      while (i < lines.length && (lines[i].trim().startsWith('- ') || lines[i].trim().startsWith('* '))) {
        items.push(cleanMarkdown(lines[i].trim().slice(2)));
        i++;
      }
      blocks.push({ type: 'list', content: items.join('\n') });
      continue;
    }

    // Regular paragraphs (non-empty)
    if (trimmed.length > 0) {
      const paraLines: string[] = [trimmed];
      i++;
      while (i < lines.length && lines[i].trim().length > 0 && !lines[i].trim().startsWith('#') && !lines[i].trim().startsWith('>') && !lines[i].trim().startsWith('|') && !lines[i].trim().startsWith('- ') && !lines[i].trim().startsWith('* ') && !lines[i].startsWith('---')) {
        paraLines.push(lines[i].trim());
        i++;
      }
      blocks.push({ type: 'paragraph', content: cleanMarkdown(paraLines.join(' ')) });
      continue;
    }

    // Empty line
    i++;
  }

  return blocks;
}

function cleanMarkdown(text: string): string {
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-primary underline">$1</a>');
}

function detectFormulaBlock(text: string): boolean {
  // Check if paragraph contains key financial formulas
  const formulas = [
    /\$\d+[,.\d]*\s*(×|\*)\s*\d+/,
    /\d+%\s*of\s*\$/,
    /\d+\s*years?\s*=\s*\d+/,
    /deposit\s*=\s*\d+/i,
    /LVR\s*=\s*\d+/i,
    /stamp duty/i,
    /borrowing capacity/i,
    /serviceability/i,
  ];
  return formulas.some(f => f.test(text));
}

export function HSCContentRenderer({ content }: HSCContentRendererProps) {
  const blocks = parseContentBlocks(content);
  let cardCounter = 0;

  return (
    <div className="space-y-2">
      {blocks.map((block, idx) => {
        switch (block.type) {
          case 'heading':
            if (block.level === 1) {
              return <h1 key={idx} className="text-3xl md:text-4xl font-bold tracking-tight font-serif mt-6 mb-4" dangerouslySetInnerHTML={{ __html: block.content }} />;
            }
            if (block.level === 2) {
              cardCounter++;
              return (
                <div key={idx} className="pp-card" style={{ marginTop: 32 }}>
                  <div className="pp-card-header">
                    <div className="pp-card-num">{cardCounter}</div>
                    <div>
                      <h2 className="pp-card-title" dangerouslySetInnerHTML={{ __html: block.content }} />
                    </div>
                  </div>
                </div>
              );
            }
            if (block.level === 3) {
              return <h3 key={idx} className="text-lg font-semibold mt-6 mb-3 text-slate-800 font-serif" dangerouslySetInnerHTML={{ __html: block.content }} />;
            }
            return <h4 key={idx} className="text-base font-semibold mt-4 mb-2" dangerouslySetInnerHTML={{ __html: block.content }} />;

          case 'callout':
            return <CalloutBox key={idx} content={block.content} variant={block.variant || 'blue'} tag={block.tag || 'Note'} />;

          case 'paragraph': {
            // Check if this should be a "conceptual first" paragraph (italic/intro style)
            const isConceptual = block.content.includes('<em>') && block.content.length < 300;
            if (isConceptual) {
              return <div key={idx} className="pp-conceptual-first" dangerouslySetInnerHTML={{ __html: block.content }} />;
            }
            // Check if this is a formula-heavy paragraph
            if (detectFormulaBlock(block.content)) {
              return <FormulaPanel key={idx} content={block.content} />;
            }
            return <p key={idx} className="text-[15px] leading-[1.75] text-slate-600 mb-4" dangerouslySetInnerHTML={{ __html: block.content }} />;
          }

          case 'list': {
            const items = block.content.split('\n');
            return (
              <ul key={idx} className="space-y-2 my-4 ml-1">
                {items.map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-[15px] text-slate-600 leading-relaxed">
                    <CheckCircle className="h-4 w-4 text-primary flex-shrink-0 mt-1" />
                    <span dangerouslySetInnerHTML={{ __html: item }} />
                  </li>
                ))}
              </ul>
            );
          }

          case 'table':
            return block.rows && block.rows.length > 0 ? (
              <div key={idx} className="overflow-x-auto my-4 rounded-xl border border-slate-200">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-slate-50">
                      {Object.keys(block.rows[0]).map(h => (
                        <th key={h} className="text-left px-4 py-3 font-semibold text-slate-700 border-b">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {block.rows.map((row, ri) => (
                      <tr key={ri} className={ri % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}>
                        {Object.values(row).map((v, vi) => (
                          <td key={vi} className="px-4 py-3 text-slate-600 border-b border-slate-100" dangerouslySetInnerHTML={{ __html: cleanMarkdown(String(v)) }} />
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : null;

          case 'worked-example':
            return block.steps ? (
              <WorkedExample key={idx} steps={block.steps} />
            ) : null;

          default:
            return null;
        }
      })}
    </div>
  );
}

// ── Sub-components ──

function CalloutBox({ content, variant, tag }: { content: string; variant: string; tag: string }) {
  const icons = {
    amber: <Star className="h-4 w-4" />,
    red: <AlertTriangle className="h-4 w-4" />,
    blue: <Lightbulb className="h-4 w-4" />,
    teal: <BookOpen className="h-4 w-4" />,
  };

  return (
    <div className={`pp-callout pp-callout-${variant}`}>
      <span className="pp-callout-tag flex items-center gap-1">
        {icons[variant as keyof typeof icons]}
        {tag}
      </span>
      <div className="text-[14px] leading-[1.7]" dangerouslySetInnerHTML={{ __html: content }} />
    </div>
  );
}

function FormulaPanel({ content }: { content: string }) {
  return (
    <div className="pp-formula-panel my-4">
      <div className="pp-formula-header">
        <div className="text-xl">📐</div>
        <h3>Key Formula</h3>
      </div>
      <div className="pp-formula-row">
        <div className="text-[14px] leading-[1.7] text-white/90" dangerouslySetInnerHTML={{ __html: content }} />
      </div>
    </div>
  );
}

function WorkedExample({ steps }: { steps: Array<{ num: string; text: string }> }) {
  return (
    <div className="pp-worked-example my-6">
      <span className="pp-we-label flex items-center gap-2">
        <BookOpen className="h-3.5 w-3.5" />
        Worked Example
      </span>
      <div className="space-y-4 mt-4">
        {steps.map((step, i) => (
          <div key={i} className="pp-step">
            <div className="pp-step-num">{step.num}</div>
            <div className="pp-step-body">
              <p dangerouslySetInnerHTML={{ __html: step.text }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
