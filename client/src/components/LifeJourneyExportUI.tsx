import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Download, FileJson, FileText, FileCode, Loader2 } from 'lucide-react';
import { trpc } from '@/lib/trpc';
import { toast } from 'sonner';

interface LifeJourneyExportUIProps {
  category?: 'Milestone' | 'Reflection' | 'Sharing' | 'Music' | 'Statement' | null;
}

export function LifeJourneyExportUI({ category }: LifeJourneyExportUIProps) {
  const [isExporting, setIsExporting] = useState(false);
  const [exportingFormat, setExportingFormat] = useState<string | null>(null);

  // Export all entries
  const { refetch: refetchJSON } = trpc.lifeJourney.exportJSON.useQuery(undefined, { enabled: false });
  const { refetch: refetchCSV } = trpc.lifeJourney.exportCSV.useQuery(undefined, { enabled: false });
  const { refetch: refetchMarkdown } = trpc.lifeJourney.exportMarkdown.useQuery(undefined, { enabled: false });

  // Export by category (only query when needed)
  const { refetch: refetchByCategory } = trpc.lifeJourney.exportByCategory.useQuery(
    { category: category || 'Milestone', format: 'json' },
    { enabled: false }
  );

  const handleExport = async (format: 'json' | 'csv' | 'md') => {
    setIsExporting(true);
    setExportingFormat(format);

    try {
      let data: string | undefined;
      let filename: string | undefined;

      if (category) {
        // Export by category - need to pass the right format
        const result = await refetchByCategory();
        if (result.data?.data && result.data?.filename) {
          data = result.data.data;
          filename = result.data.filename;
        }
      } else {
        // Export all
        let result;
        if (format === 'json') {
          result = await refetchJSON();
        } else if (format === 'csv') {
          result = await refetchCSV();
        } else {
          result = await refetchMarkdown();
        }

        if (result.data?.data && result.data?.filename) {
          data = result.data.data;
          filename = result.data.filename;
        }
      }

      if (data && filename) {
        downloadFile(data, filename, getMimeType(format));
        toast.success(`✅ Export Successful: ${filename}`);
      } else {
        toast.error('⚠️ Export Failed: No data received from server');
      }
    } catch (error) {
      console.error('Export failed:', error);
      toast.error(`❌ Export Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsExporting(false);
      setExportingFormat(null);
    }
  };

  const downloadFile = (content: string, filename: string, mimeType: string) => {
    const blob = new Blob([content], { type: mimeType });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  const getMimeType = (format: string): string => {
    const mimeMap: Record<string, string> = {
      json: 'application/json',
      csv: 'text/csv',
      md: 'text/markdown',
    };
    return mimeMap[format] || 'text/plain';
  };

  return (
    <Card className="p-6 bg-secondary/30 border-primary/20">
      <div className="flex items-center gap-2 mb-4">
        <Download className="w-5 h-5 text-primary" />
        <h3 className="text-lg font-bold">Export Life Journey</h3>
      </div>

      <p className="text-sm text-muted-foreground mb-4">
        {category ? `Export all ${category} entries` : 'Export all entries'} in your preferred format
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {/* JSON Export */}
        <Button
          onClick={() => handleExport('json')}
          disabled={isExporting}
          variant="outline"
          className="flex items-center gap-2"
        >
          {isExporting && exportingFormat === 'json' ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <FileJson className="w-4 h-4" />
          )}
          JSON
        </Button>

        {/* CSV Export */}
        <Button
          onClick={() => handleExport('csv')}
          disabled={isExporting}
          variant="outline"
          className="flex items-center gap-2"
        >
          {isExporting && exportingFormat === 'csv' ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <FileText className="w-4 h-4" />
          )}
          CSV
        </Button>

        {/* Markdown Export */}
        <Button
          onClick={() => handleExport('md')}
          disabled={isExporting}
          variant="outline"
          className="flex items-center gap-2"
        >
          {isExporting && exportingFormat === 'md' ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <FileCode className="w-4 h-4" />
          )}
          Markdown
        </Button>
      </div>

      <p className="text-xs text-muted-foreground mt-4">
        Files are generated on-demand and downloaded directly to your device.
      </p>
    </Card>
  );
}
