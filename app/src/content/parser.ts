export interface ParsedContent {
  frontmatter: Record<string, unknown>;
  body: string;
}

export function parseFrontmatter(raw: string): ParsedContent {
  if (raw.startsWith('---')) {
    const parts = raw.split('---', 3);
    if (parts.length >= 3) {
      const fm = parts[1].trim();
      const body = parts[2].trim();
      const frontmatter: Record<string, unknown> = {};
      let currentKey = '';
      for (const line of fm.split('\n')) {
        const trimmed = line.trim();
        if (!trimmed) continue;
        if (trimmed.startsWith('- ')) {
          const val = trimmed.slice(2).trim();
          if (currentKey && Array.isArray(frontmatter[currentKey])) {
            (frontmatter[currentKey] as unknown[]).push(val);
          } else if (currentKey) {
            frontmatter[currentKey] = [frontmatter[currentKey], val];
          }
        } else if (trimmed.includes(':')) {
          const idx = trimmed.indexOf(':');
          const key = trimmed.slice(0, idx).trim();
          let val: string | string[] = trimmed.slice(idx + 1).trim();
          val = val.replace(/^["']|["']$/g, '');
          if (val.startsWith('[') && val.endsWith(']')) {
            val = val.slice(1, -1).split(',').map((v: string) => v.trim().replace(/^["']|["']$/g, ''));
          }
          frontmatter[key] = val;
          currentKey = key;
        }
      }
      return { frontmatter, body };
    }
  }
  return { frontmatter: {}, body: raw };
}
