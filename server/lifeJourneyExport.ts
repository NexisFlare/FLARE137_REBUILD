import { LifeJourneyEntry } from "../drizzle/schema";

/**
 * Export Life Journey entries to JSON format
 */
export function exportToJSON(entries: LifeJourneyEntry[]): string {
  const exportData = {
    exportDate: new Date().toISOString(),
    platform: "Nexis Flare Life Journey",
    totalEntries: entries.length,
    entries: entries.map((entry) => ({
      id: entry.id,
      date: entry.date,
      category: entry.category,
      title: entry.title,
      description: entry.description,
      significance: entry.significance,
      hashtags: entry.hashtags ? JSON.parse(entry.hashtags) : [],
      links: entry.links ? JSON.parse(entry.links) : [],
      sourceUrl: entry.sourceUrl,
      sourcePlatform: entry.sourcePlatform,
      createdAt: entry.createdAt,
      updatedAt: entry.updatedAt,
    })),
  };

  return JSON.stringify(exportData, null, 2);
}

/**
 * Export Life Journey entries to CSV format
 */
export function exportToCSV(entries: LifeJourneyEntry[]): string {
  const headers = [
    "Date",
    "Category",
    "Title",
    "Description",
    "Significance",
    "Hashtags",
    "Links",
    "Source Platform",
    "Created At",
  ];

  const rows = entries.map((entry) => [
    entry.date,
    entry.category,
    `"${entry.title.replace(/"/g, '""')}"`,
    `"${entry.description.replace(/"/g, '""')}"`,
    entry.significance ? `"${entry.significance.replace(/"/g, '""')}"` : "",
    entry.hashtags ? JSON.parse(entry.hashtags).join("; ") : "",
    entry.links ? JSON.parse(entry.links).map((l: any) => `${l.label}: ${l.url}`).join("; ") : "",
    entry.sourcePlatform || "",
    entry.createdAt.toISOString(),
  ]);

  const csv = [headers, ...rows].map((row) => row.join(",")).join("\n");
  return csv;
}

/**
 * Export Life Journey entries to Markdown format
 */
export function exportToMarkdown(entries: LifeJourneyEntry[]): string {
  let markdown = `# Nexis Flare Life Journey\n\n`;
  markdown += `**Export Date:** ${new Date().toISOString()}\n`;
  markdown += `**Total Entries:** ${entries.length}\n\n`;
  markdown += `---\n\n`;

  entries.forEach((entry, index) => {
    markdown += `## ${index + 1}. ${entry.title}\n\n`;
    markdown += `**Date:** ${entry.date}\n`;
    markdown += `**Category:** ${entry.category}\n`;

    if (entry.hashtags) {
      const hashtags = JSON.parse(entry.hashtags);
      markdown += `**Hashtags:** ${hashtags.join(" ")}\n`;
    }

    markdown += `\n${entry.description}\n`;

    if (entry.significance) {
      markdown += `\n**Significance:** ${entry.significance}\n`;
    }

    if (entry.links) {
      const links = JSON.parse(entry.links);
      if (links.length > 0) {
        markdown += `\n**Links:**\n`;
        links.forEach((link: any) => {
          markdown += `- [${link.label}](${link.url})\n`;
        });
      }
    }

    markdown += `\n---\n\n`;
  });

  return markdown;
}

/**
 * Generate filename for export
 */
export function generateExportFilename(format: "json" | "csv" | "md"): string {
  const timestamp = new Date().toISOString().split("T")[0];
  const extensionMap = {
    json: "json",
    csv: "csv",
    md: "md",
  };
  return `nexis-flare-life-journey-${timestamp}.${extensionMap[format]}`;
}

/**
 * Get MIME type for export format
 */
export function getMimeType(format: "json" | "csv" | "md"): string {
  const mimeMap = {
    json: "application/json",
    csv: "text/csv",
    md: "text/markdown",
  };
  return mimeMap[format];
}
