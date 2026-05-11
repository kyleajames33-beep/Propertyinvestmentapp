export interface TocItem {
  text: string;
  level: number;
  id: string;
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .slice(0, 50);
}

export function extractHeadings(body: string): TocItem[] {
  const headings: TocItem[] = [];
  const usedIds = new Set<string>();
  const lines = body.split('\n');
  let inDirective = false;

  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith(':::') && !trimmed.startsWith('::::')) {
      inDirective = !inDirective;
      continue;
    }
    if (inDirective) continue;
    if (trimmed === '---') continue;

    if (line.startsWith('## ')) {
      const text = line.slice(3).trim();
      const baseId = slugify(text);
      let id = baseId;
      let counter = 1;
      while (usedIds.has(id)) {
        id = `${baseId}-${counter}`;
        counter++;
      }
      usedIds.add(id);
      headings.push({ text, level: 2, id });
    } else if (line.startsWith('### ')) {
      const text = line.slice(4).trim();
      const baseId = slugify(text);
      let id = baseId;
      let counter = 1;
      while (usedIds.has(id)) {
        id = `${baseId}-${counter}`;
        counter++;
      }
      usedIds.add(id);
      headings.push({ text, level: 3, id });
    }
  }

  return headings;
}
