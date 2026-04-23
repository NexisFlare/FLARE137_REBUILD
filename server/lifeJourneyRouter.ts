import { z } from "zod";
import { publicProcedure, router } from "./_core/trpc";
import {
  getLifeJourneyEntries,
  getLifeJourneyEntriesByCategory,
  getLifeJourneyEntryById,
  createLifeJourneyEntry,
  updateLifeJourneyEntry,
  deleteLifeJourneyEntry,
} from "./db";
import { exportToJSON, exportToCSV, exportToMarkdown, generateExportFilename } from "./lifeJourneyExport";

const lifeJourneyEntrySchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format"),
  category: z.enum(["Milestone", "Reflection", "Sharing", "Music", "Statement"]),
  title: z.string().min(1).max(255),
  description: z.string().min(1),
  significance: z.string().optional(),
  hashtags: z.array(z.string()).optional(),
  links: z.array(z.object({ label: z.string(), url: z.string() })).optional(),
  sourceUrl: z.string().optional(),
  sourcePlatform: z.enum(["facebook", "youtube", "tiktok", "instagram", "twitter", "linkedin"]).optional(),
  createdBy: z.number().optional(),
});

export const lifeJourneyRouter = router({
  /**
   * Get all Life Journey entries with pagination
   */
  getAll: publicProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).default(50),
        offset: z.number().min(0).default(0),
      })
    )
    .query(async ({ input }) => {
      const entries = await getLifeJourneyEntries(input.limit, input.offset);
      return {
        entries: entries.map((entry) => ({
          ...entry,
          hashtags: entry.hashtags ? JSON.parse(entry.hashtags) : [],
          links: entry.links ? JSON.parse(entry.links) : [],
        })),
        total: entries.length,
        limit: input.limit,
        offset: input.offset,
      };
    }),

  /**
   * Get Life Journey entries by category
   */
  getByCategory: publicProcedure
    .input(
      z.object({
        category: z.enum(["Milestone", "Reflection", "Sharing", "Music", "Statement"]),
      })
    )
    .query(async ({ input }) => {
      const entries = await getLifeJourneyEntriesByCategory(input.category);
      return entries.map((entry) => ({
        ...entry,
        hashtags: entry.hashtags ? JSON.parse(entry.hashtags) : [],
        links: entry.links ? JSON.parse(entry.links) : [],
      }));
    }),

  /**
   * Get a single Life Journey entry by ID
   */
  getById: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const entry = await getLifeJourneyEntryById(input.id);
      if (!entry) return null;
      return {
        ...entry,
        hashtags: entry.hashtags ? JSON.parse(entry.hashtags) : [],
        links: entry.links ? JSON.parse(entry.links) : [],
      };
    }),

  /**
   * Create a new Life Journey entry
   */
  create: publicProcedure
    .input(lifeJourneyEntrySchema)
    .mutation(async ({ input }) => {
      const result = await createLifeJourneyEntry({
        ...input,
        hashtags: input.hashtags ? JSON.stringify(input.hashtags) : null,
        links: input.links ? JSON.stringify(input.links) : null,
      });
      return result;
    }),

  /**
   * Update a Life Journey entry
   */
  update: publicProcedure
    .input(
      z.object({
        id: z.number(),
        data: lifeJourneyEntrySchema.partial(),
      })
    )
    .mutation(async ({ input }) => {
      const updateData: any = { ...input.data };
      if (input.data.hashtags) {
        updateData.hashtags = JSON.stringify(input.data.hashtags);
      }
      if (input.data.links) {
        updateData.links = JSON.stringify(input.data.links);
      }
      const result = await updateLifeJourneyEntry(input.id, updateData);
      return result;
    }),

  /**
   * Delete a Life Journey entry
   */
  delete: publicProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const result = await deleteLifeJourneyEntry(input.id);
      return result;
    }),

  /**
   * Search Life Journey entries by keyword
   */
  search: publicProcedure
    .input(
      z.object({
        query: z.string().min(1),
        limit: z.number().min(1).max(100).default(50),
      })
    )
    .query(async ({ input }) => {
      // Get all entries and filter client-side with comprehensive search
      const entries = await getLifeJourneyEntries(1000, 0);
      const query = input.query.toLowerCase();
      
      const filtered = entries.filter((entry) => {
        // Search in title
        if (entry.title.toLowerCase().includes(query)) return true;
        
        // Search in description
        if (entry.description.toLowerCase().includes(query)) return true;
        
        // Search in significance
        if (entry.significance && entry.significance.toLowerCase().includes(query)) return true;
        
        // Search in hashtags
        if (entry.hashtags) {
          try {
            const tags = JSON.parse(entry.hashtags);
            if (Array.isArray(tags) && tags.some((tag: string) => tag.toLowerCase().includes(query))) return true;
          } catch (e) {
            // Ignore parse errors
          }
        }
        
        // Search in link labels
        if (entry.links) {
          try {
            const links = JSON.parse(entry.links);
            if (Array.isArray(links) && links.some((link: any) => link.label?.toLowerCase().includes(query))) return true;
          } catch (e) {
            // Ignore parse errors
          }
        }
        
        // Search in category
        if (entry.category.toLowerCase().includes(query)) return true;
        
        return false;
      });
      
      return filtered.slice(0, input.limit).map((entry) => ({
        ...entry,
        hashtags: entry.hashtags ? JSON.parse(entry.hashtags) : [],
        links: entry.links ? JSON.parse(entry.links) : [],
      }));
    }),

  /**
   * Get statistics about Life Journey entries
   */
  getStats: publicProcedure.query(async () => {
    const entries = await getLifeJourneyEntries(10000, 0);
    const categoryCounts = entries.reduce(
      (acc, entry) => {
        acc[entry.category] = (acc[entry.category] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );

    const platformCounts = entries.reduce(
      (acc, entry) => {
        if (entry.sourcePlatform) {
          acc[entry.sourcePlatform] = (acc[entry.sourcePlatform] || 0) + 1;
        }
        return acc;
      },
      {} as Record<string, number>
    );

    return {
      totalEntries: entries.length,
      categoryCounts,
      platformCounts,
      oldestEntry: entries.length > 0 ? entries[entries.length - 1]?.date : null,
      newestEntry: entries.length > 0 ? entries[0]?.date : null,
    };
  }),

  /**
   * Export all entries to JSON format
   */
  exportJSON: publicProcedure.query(async () => {
    const entries = await getLifeJourneyEntries(10000, 0);
    const json = exportToJSON(entries);
    const filename = generateExportFilename("json");
    return {
      data: json,
      filename,
      format: "json",
      size: json.length,
    };
  }),

  /**
   * Export all entries to CSV format
   */
  exportCSV: publicProcedure.query(async () => {
    const entries = await getLifeJourneyEntries(10000, 0);
    const csv = exportToCSV(entries);
    const filename = generateExportFilename("csv");
    return {
      data: csv,
      filename,
      format: "csv",
      size: csv.length,
    };
  }),

  /**
   * Export all entries to Markdown format
   */
  exportMarkdown: publicProcedure.query(async () => {
    const entries = await getLifeJourneyEntries(10000, 0);
    const markdown = exportToMarkdown(entries);
    const filename = generateExportFilename("md");
    return {
      data: markdown,
      filename,
      format: "md",
      size: markdown.length,
    };
  }),

  /**
   * Export entries by category
   */
  exportByCategory: publicProcedure
    .input(
      z.object({
        category: z.enum(["Milestone", "Reflection", "Sharing", "Music", "Statement"]),
        format: z.enum(["json", "csv", "md"]),
      })
    )
    .query(async ({ input }) => {
      const entries = await getLifeJourneyEntriesByCategory(input.category);
      let data: string;
      if (input.format === "json") {
        data = exportToJSON(entries);
      } else if (input.format === "csv") {
        data = exportToCSV(entries);
      } else {
        data = exportToMarkdown(entries);
      }
      const timestamp = new Date().toISOString().split("T")[0];
      const filename = `nexis-flare-${input.category.toLowerCase()}-${timestamp}.${input.format === "md" ? "md" : input.format}`;
      return {
        data,
        filename,
        format: input.format,
        size: data.length,
      };
    }),
});
