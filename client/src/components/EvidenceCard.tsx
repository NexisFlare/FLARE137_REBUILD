import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ExternalLink, Copy } from 'lucide-react';
import { useState } from 'react';

interface EvidenceCardProps {
  author: string;
  year: number;
  title: string;
  definition: string;
  connection: string;
  doi?: string;
  arxiv?: string;
  url?: string;
  language?: 'hu' | 'en';
}

export function EvidenceCard({
  author,
  year,
  title,
  definition,
  connection,
  doi,
  arxiv,
  url,
  language = 'hu',
}: EvidenceCardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const citation = `${author} (${year}). ${title}.`;
    navigator.clipboard.writeText(citation);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const citationUrl = doi ? `https://doi.org/${doi}` : arxiv ? `https://arxiv.org/abs/${arxiv}` : url;

  return (
    <Card className="p-6 border-l-4 border-l-blue-400 hover:shadow-md transition-shadow duration-200 bg-slate-50 dark:bg-slate-900">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <p className="text-sm font-mono text-muted-foreground">
              {author} ({year})
            </p>
            <h4 className="text-lg font-semibold text-foreground mt-1">
              {title}
            </h4>
          </div>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCopy}
              title={language === 'hu' ? 'Másolás' : 'Copy'}
            >
              <Copy className="w-4 h-4" />
            </Button>
            {citationUrl && (
              <Button
                variant="ghost"
                size="sm"
                asChild
              >
                <a href={citationUrl} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="w-4 h-4" />
                </a>
              </Button>
            )}
          </div>
        </div>

        {/* Definition */}
        <div className="space-y-2">
          <p className="text-xs font-mono text-muted-foreground uppercase tracking-wider">
            {language === 'hu' ? 'Definíció' : 'Definition'}
          </p>
          <p className="text-sm text-foreground leading-relaxed italic">
            "{definition}"
          </p>
        </div>

        {/* Connection to Nexis Flare */}
        <div className="space-y-2 pt-2 border-t border-border">
          <p className="text-xs font-mono text-muted-foreground uppercase tracking-wider">
            {language === 'hu' ? 'Nexis Flare kapcsolódás' : 'Nexis Flare Connection'}
          </p>
          <p className="text-sm text-foreground leading-relaxed">
            {connection}
          </p>
        </div>

        {/* Citation info */}
        {(doi || arxiv) && (
          <div className="flex gap-2 pt-2 text-xs text-muted-foreground">
            {doi && (
              <span className="font-mono">
                DOI: <code className="bg-background px-1 py-0.5 rounded">{doi}</code>
              </span>
            )}
            {arxiv && (
              <span className="font-mono">
                arXiv: <code className="bg-background px-1 py-0.5 rounded">{arxiv}</code>
              </span>
            )}
          </div>
        )}

        {/* Copy confirmation */}
        {copied && (
          <p className="text-xs text-green-600 dark:text-green-400 animate-pulse">
            ✓ {language === 'hu' ? 'Másolva!' : 'Copied!'}
          </p>
        )}
      </div>
    </Card>
  );
}
