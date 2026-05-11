import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';

interface MarkdownRendererProps {
  content: string;
}

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
  return (
    <div className="pp-prose">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw]}
        components={{
          h1: ({ children }) => <h1 className="text-3xl md:text-4xl font-bold tracking-tight mt-8 mb-6">{children}</h1>,
          h2: ({ children }) => <h2 className="text-2xl font-semibold tracking-tight mt-10 mb-4 text-foreground">{children}</h2>,
          h3: ({ children }) => <h3 className="text-xl font-semibold tracking-tight mt-8 mb-3 text-foreground">{children}</h3>,
          h4: ({ children }) => <h4 className="text-lg font-semibold tracking-tight mt-6 mb-2 text-foreground">{children}</h4>,
          p: ({ children }) => <p className="mb-4 leading-relaxed text-base">{children}</p>,
          ul: ({ children }) => <ul className="mb-4 ml-6 list-disc space-y-1">{children}</ul>,
          ol: ({ children }) => <ol className="mb-4 ml-6 list-decimal space-y-1">{children}</ol>,
          li: ({ children }) => <li className="leading-relaxed">{children}</li>,
          strong: ({ children }) => <strong className="font-semibold text-foreground">{children}</strong>,
          a: ({ href, children }) => (
            <a href={href} className="text-primary underline underline-offset-2 hover:text-primary/80 transition-colors">
              {children}
            </a>
          ),
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-primary/30 bg-muted/40 pl-4 py-3 pr-4 my-6 rounded-r-lg">
              {children}
            </blockquote>
          ),
          hr: () => <hr className="my-8 border-border" />,
          table: ({ children }) => (
            <div className="overflow-x-auto my-6">
              <table className="w-full text-sm border-collapse border border-border">{children}</table>
            </div>
          ),
          thead: ({ children }) => <thead className="bg-muted">{children}</thead>,
          th: ({ children }) => <th className="border border-border px-4 py-2 text-left font-semibold">{children}</th>,
          td: ({ children }) => <td className="border border-border px-4 py-2">{children}</td>,
          code: ({ children }) => (
            <code className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono">{children}</code>
          ),
          pre: ({ children }) => (
            <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm my-4">{children}</pre>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
