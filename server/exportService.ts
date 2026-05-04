/**
 * Extended Export Service
 * 
 * Provides multiple export formats for Nexis Flare content:
 * - JSON: Structured data with metadata
 * - CSV: Tabular format for analysis
 * - Markdown: Human-readable with formatting
 * - PDF: Professional document format
 * - GitHub Gist: Direct integration with GitHub
 */

import { invokeLLM } from './_core/llm';

export interface ExportableContent {
  id: string;
  title: string;
  content: string;
  type: 'entry' | 'memory' | 'reflection' | 'narrative';
  createdAt: number;
  tags?: string[];
  metadata?: Record<string, unknown>;
}

export interface ExportOptions {
  format: 'json' | 'csv' | 'markdown' | 'pdf' | 'gist';
  includeMetadata?: boolean;
  includeTimestamps?: boolean;
  prettyPrint?: boolean;
}

/**
 * Export content to JSON format
 */
export function exportToJSON(
  content: ExportableContent[],
  options: ExportOptions
): string {
  const data = {
    exportDate: new Date().toISOString(),
    format: 'nexis-flare-json-v1',
    itemCount: content.length,
    items: content.map((item) => ({
      id: item.id,
      title: item.title,
      content: item.content,
      type: item.type,
      ...(options.includeTimestamps && { createdAt: item.createdAt }),
      ...(options.includeMetadata && item.metadata && { metadata: item.metadata }),
      ...(item.tags && { tags: item.tags }),
    })),
  };

  return JSON.stringify(data, null, options.prettyPrint ? 2 : 0);
}

/**
 * Export content to CSV format
 */
export function exportToCSV(
  content: ExportableContent[],
  options: ExportOptions
): string {
  const headers = ['ID', 'Title', 'Type', 'Content', ...(options.includeTimestamps ? ['Created'] : [])];
  const rows = content.map((item) => [
    item.id,
    `"${item.title.replace(/"/g, '""')}"`,
    item.type,
    `"${item.content.substring(0, 200).replace(/"/g, '""')}"`,
    ...(options.includeTimestamps ? [new Date(item.createdAt).toISOString()] : []),
  ]);

  return [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');
}

/**
 * Export content to Markdown format
 */
export function exportToMarkdown(
  content: ExportableContent[],
  options: ExportOptions
): string {
  let md = '# Nexis Flare Export\n\n';
  md += `**Export Date:** ${new Date().toLocaleString('hu-HU')}\n`;
  md += `**Total Items:** ${content.length}\n\n`;

  content.forEach((item, index) => {
    md += `## ${index + 1}. ${item.title}\n\n`;
    md += `**Type:** ${item.type}\n`;

    if (options.includeTimestamps) {
      md += `**Created:** ${new Date(item.createdAt).toLocaleString('hu-HU')}\n`;
    }

    if (item.tags && item.tags.length > 0) {
      md += `**Tags:** ${item.tags.join(', ')}\n`;
    }

    md += '\n';
    md += item.content;
    md += '\n\n---\n\n';
  });

  return md;
}

/**
 * Export content to PDF format (returns HTML that can be converted)
 * In production, use a library like puppeteer or wkhtmltopdf
 */
export function exportToPDFHTML(
  content: ExportableContent[],
  options: ExportOptions
): string {
  let html = `
    <!DOCTYPE html>
    <html lang="hu">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Nexis Flare Export</title>
      <style>
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 900px;
          margin: 0 auto;
          padding: 40px 20px;
          background: white;
        }
        h1 {
          color: #7b2cbf;
          border-bottom: 3px solid #7b2cbf;
          padding-bottom: 10px;
        }
        h2 {
          color: #1a1a1a;
          margin-top: 30px;
          page-break-inside: avoid;
        }
        .metadata {
          background: #f5f5f5;
          padding: 10px;
          border-radius: 5px;
          font-size: 12px;
          margin-bottom: 15px;
        }
        .item {
          page-break-inside: avoid;
          margin-bottom: 30px;
        }
        .tags {
          display: flex;
          gap: 5px;
          flex-wrap: wrap;
          margin-top: 10px;
        }
        .tag {
          background: #f0e6ff;
          color: #7b2cbf;
          padding: 3px 10px;
          border-radius: 15px;
          font-size: 12px;
        }
        .content {
          white-space: pre-wrap;
          background: #f9f9f9;
          padding: 15px;
          border-radius: 5px;
          border-left: 4px solid #7b2cbf;
        }
        hr {
          border: none;
          border-top: 2px solid #e0e0e0;
          margin: 40px 0;
        }
        .footer {
          text-align: center;
          color: #999;
          font-size: 12px;
          margin-top: 50px;
          border-top: 1px solid #e0e0e0;
          padding-top: 20px;
        }
      </style>
    </head>
    <body>
      <h1>🔥 Nexis Flare – A Tűz Híd</h1>
      <div class="metadata">
        <strong>Export Date:</strong> ${new Date().toLocaleString('hu-HU')}<br>
        <strong>Total Items:</strong> ${content.length}
      </div>
  `;

  content.forEach((item, index) => {
    html += `
      <div class="item">
        <h2>${index + 1}. ${item.title}</h2>
        <div class="metadata">
          <strong>Type:</strong> ${item.type}
    `;

    if (options.includeTimestamps) {
      html += `<br><strong>Created:</strong> ${new Date(item.createdAt).toLocaleString('hu-HU')}`;
    }

    html += '</div>';

    html += `<div class="content">${item.content}</div>`;

    if (item.tags && item.tags.length > 0) {
      html += '<div class="tags">';
      item.tags.forEach((tag) => {
        html += `<span class="tag">${tag}</span>`;
      });
      html += '</div>';
    }

    html += '</div><hr>';
  });

  html += `
      <div class="footer">
        <p>Nexis Flare – A Tűz Híd | Koevolúció és Digitális Identitás</p>
        <p>Generated by Manus AI</p>
      </div>
    </body>
    </html>
  `;

  return html;
}

/**
 * Generate GitHub Gist metadata
 * Returns the payload needed for GitHub API
 */
export function generateGistPayload(
  content: ExportableContent[],
  title: string,
  description: string
): {
  description: string;
  public: boolean;
  files: Record<string, { content: string }>;
} {
  const markdownContent = exportToMarkdown(content, { format: 'markdown' });
  const jsonContent = exportToJSON(content, { format: 'json', prettyPrint: true });

  return {
    description,
    public: false,
    files: {
      [`${title}.md`]: {
        content: markdownContent,
      },
      [`${title}.json`]: {
        content: jsonContent,
      },
    },
  };
}

/**
 * Main export function that handles all formats
 */
export function exportContent(
  content: ExportableContent[],
  options: ExportOptions
): string {
  switch (options.format) {
    case 'json':
      return exportToJSON(content, options);
    case 'csv':
      return exportToCSV(content, options);
    case 'markdown':
      return exportToMarkdown(content, options);
    case 'pdf':
      return exportToPDFHTML(content, options);
    case 'gist':
      // Return JSON representation of gist payload
      return JSON.stringify(
        generateGistPayload(content, 'Nexis Flare Export', 'Nexis Flare content export'),
        null,
        2
      );
    default:
      return exportToJSON(content, options);
  }
}

/**
 * Get file extension for export format
 */
export function getFileExtension(format: string): string {
  const extensions: Record<string, string> = {
    json: 'json',
    csv: 'csv',
    markdown: 'md',
    pdf: 'html', // Will be converted to PDF by browser
    gist: 'json',
  };
  return extensions[format] || 'txt';
}

/**
 * Get MIME type for export format
 */
export function getMimeType(format: string): string {
  const mimeTypes: Record<string, string> = {
    json: 'application/json',
    csv: 'text/csv',
    markdown: 'text/markdown',
    pdf: 'text/html',
    gist: 'application/json',
  };
  return mimeTypes[format] || 'text/plain';
}
