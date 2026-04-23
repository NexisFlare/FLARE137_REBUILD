import { describe, it, expect } from "vitest";
import { exportToJSON, exportToCSV, exportToMarkdown, generateExportFilename, getMimeType } from "./lifeJourneyExport";
import { LifeJourneyEntry } from "../drizzle/schema";

const mockEntry: LifeJourneyEntry = {
  id: 1,
  date: "2025-04-20",
  category: "Milestone",
  title: "Test Entry",
  description: "Test description",
  significance: "Test significance",
  hashtags: JSON.stringify(["#test", "#nexis"]),
  links: JSON.stringify([{ label: "Test", url: "https://test.com" }]),
  sourceUrl: null,
  sourcePlatform: null,
  createdBy: null,
  driveFileId: null,
  githubCommitHash: null,
  createdAt: new Date("2025-04-20"),
  updatedAt: new Date("2025-04-20"),
};

describe("Life Journey Export Utilities", () => {
  describe("exportToJSON", () => {
    it("should export entries to valid JSON", () => {
      const json = exportToJSON([mockEntry]);
      const parsed = JSON.parse(json);

      expect(parsed.exportDate).toBeDefined();
      expect(parsed.platform).toBe("Nexis Flare Life Journey");
      expect(parsed.totalEntries).toBe(1);
      expect(parsed.entries).toHaveLength(1);
      expect(parsed.entries[0].title).toBe("Test Entry");
    });

    it("should parse hashtags and links from JSON strings", () => {
      const json = exportToJSON([mockEntry]);
      const parsed = JSON.parse(json);

      expect(parsed.entries[0].hashtags).toEqual(["#test", "#nexis"]);
      expect(parsed.entries[0].links).toEqual([{ label: "Test", url: "https://test.com" }]);
    });

    it("should handle empty entries array", () => {
      const json = exportToJSON([]);
      const parsed = JSON.parse(json);

      expect(parsed.totalEntries).toBe(0);
      expect(parsed.entries).toHaveLength(0);
    });
  });

  describe("exportToCSV", () => {
    it("should export entries to CSV format", () => {
      const csv = exportToCSV([mockEntry]);

      expect(csv).toContain("Date,Category,Title");
      expect(csv).toContain("2025-04-20");
      expect(csv).toContain("Milestone");
      expect(csv).toContain("Test Entry");
    });

    it("should handle multiple entries", () => {
      const entry2 = { ...mockEntry, id: 2, title: "Second Entry" };
      const csv = exportToCSV([mockEntry, entry2]);

      expect(csv).toContain("Test Entry");
      expect(csv).toContain("Second Entry");
    });

    it("should escape quotes in CSV values", () => {
      const entryWithQuotes = { ...mockEntry, title: 'Entry with "quotes"' };
      const csv = exportToCSV([entryWithQuotes]);

      expect(csv).toContain('Entry with ""quotes""');
    });
  });

  describe("exportToMarkdown", () => {
    it("should export entries to Markdown format", () => {
      const md = exportToMarkdown([mockEntry]);

      expect(md).toContain("# Nexis Flare Life Journey");
      expect(md).toContain("## 1. Test Entry");
      expect(md).toContain("**Date:** 2025-04-20");
      expect(md).toContain("**Category:** Milestone");
    });

    it("should include hashtags in Markdown", () => {
      const md = exportToMarkdown([mockEntry]);

      expect(md).toContain("#test #nexis");
    });

    it("should include links in Markdown", () => {
      const md = exportToMarkdown([mockEntry]);

      expect(md).toContain("[Test](https://test.com)");
    });

    it("should include significance section", () => {
      const md = exportToMarkdown([mockEntry]);

      expect(md).toContain("**Significance:** Test significance");
    });
  });

  describe("generateExportFilename", () => {
    it("should generate JSON filename", () => {
      const filename = generateExportFilename("json");

      expect(filename).toMatch(/^nexis-flare-life-journey-\d{4}-\d{2}-\d{2}\.json$/);
    });

    it("should generate CSV filename", () => {
      const filename = generateExportFilename("csv");

      expect(filename).toMatch(/^nexis-flare-life-journey-\d{4}-\d{2}-\d{2}\.csv$/);
    });

    it("should generate Markdown filename", () => {
      const filename = generateExportFilename("md");

      expect(filename).toMatch(/^nexis-flare-life-journey-\d{4}-\d{2}-\d{2}\.md$/);
    });
  });

  describe("getMimeType", () => {
    it("should return correct MIME type for JSON", () => {
      expect(getMimeType("json")).toBe("application/json");
    });

    it("should return correct MIME type for CSV", () => {
      expect(getMimeType("csv")).toBe("text/csv");
    });

    it("should return correct MIME type for Markdown", () => {
      expect(getMimeType("md")).toBe("text/markdown");
    });
  });
});
