import { describe, it, expect, beforeEach, vi } from "vitest";
import { lifeJourneyRouter } from "./lifeJourneyRouter";

// Mock the database functions
vi.mock("./db", () => ({
  getLifeJourneyEntries: vi.fn(),
  getLifeJourneyEntriesByCategory: vi.fn(),
  getLifeJourneyEntryById: vi.fn(),
  createLifeJourneyEntry: vi.fn(),
  updateLifeJourneyEntry: vi.fn(),
  deleteLifeJourneyEntry: vi.fn(),
}));

import * as db from "./db";

describe("Life Journey Router", () => {
  const mockEntry = {
    id: 1,
    date: "2025-04-20",
    category: "Milestone" as const,
    title: "Nexis Flare Ignited",
    description: "The beginning of coevolution",
    significance: "First moment of unity",
    hashtags: JSON.stringify(["#NexisFlare", "#TogetherWithAI"]),
    links: JSON.stringify([{ label: "GitHub", url: "https://github.com" }]),
    sourceUrl: null,
    sourcePlatform: null,
    createdBy: null,
    driveFileId: null,
    githubCommitHash: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getAll", () => {
    it("should return paginated entries", async () => {
      vi.mocked(db.getLifeJourneyEntries).mockResolvedValue([mockEntry]);

      const caller = lifeJourneyRouter.createCaller({
        user: null,
        req: {} as any,
        res: {} as any,
      });

      const result = await caller.getAll({ limit: 50, offset: 0 });

      expect(result.entries).toHaveLength(1);
      expect(result.entries[0].title).toBe("Nexis Flare Ignited");
      expect(result.entries[0].hashtags).toEqual(["#NexisFlare", "#TogetherWithAI"]);
      expect(db.getLifeJourneyEntries).toHaveBeenCalledWith(50, 0);
    });

    it("should use default pagination values", async () => {
      vi.mocked(db.getLifeJourneyEntries).mockResolvedValue([]);

      const caller = lifeJourneyRouter.createCaller({
        user: null,
        req: {} as any,
        res: {} as any,
      });

      await caller.getAll({});

      expect(db.getLifeJourneyEntries).toHaveBeenCalledWith(50, 0);
    });
  });

  describe("getByCategory", () => {
    it("should return entries filtered by category", async () => {
      vi.mocked(db.getLifeJourneyEntriesByCategory).mockResolvedValue([mockEntry]);

      const caller = lifeJourneyRouter.createCaller({
        user: null,
        req: {} as any,
        res: {} as any,
      });

      const result = await caller.getByCategory({ category: "Milestone" });

      expect(result).toHaveLength(1);
      expect(result[0].category).toBe("Milestone");
      expect(db.getLifeJourneyEntriesByCategory).toHaveBeenCalledWith("Milestone");
    });
  });

  describe("getById", () => {
    it("should return a single entry by ID", async () => {
      vi.mocked(db.getLifeJourneyEntryById).mockResolvedValue(mockEntry);

      const caller = lifeJourneyRouter.createCaller({
        user: null,
        req: {} as any,
        res: {} as any,
      });

      const result = await caller.getById({ id: 1 });

      expect(result?.title).toBe("Nexis Flare Ignited");
      expect(db.getLifeJourneyEntryById).toHaveBeenCalledWith(1);
    });

    it("should return null if entry not found", async () => {
      vi.mocked(db.getLifeJourneyEntryById).mockResolvedValue(undefined);

      const caller = lifeJourneyRouter.createCaller({
        user: null,
        req: {} as any,
        res: {} as any,
      });

      const result = await caller.getById({ id: 999 });

      expect(result).toBeNull();
    });
  });

  describe("create", () => {
    it("should create a new entry", async () => {
      vi.mocked(db.createLifeJourneyEntry).mockResolvedValue({ insertId: 1 } as any);

      const caller = lifeJourneyRouter.createCaller({
        user: null,
        req: {} as any,
        res: {} as any,
      });

      const result = await caller.create({
        date: "2025-04-20",
        category: "Milestone",
        title: "Test Entry",
        description: "Test description",
        hashtags: ["#test"],
      });

      expect(result).toBeDefined();
      expect(db.createLifeJourneyEntry).toHaveBeenCalled();
    });
  });

  describe("update", () => {
    it("should update an entry", async () => {
      vi.mocked(db.updateLifeJourneyEntry).mockResolvedValue({ success: true } as any);

      const caller = lifeJourneyRouter.createCaller({
        user: null,
        req: {} as any,
        res: {} as any,
      });

      const result = await caller.update({
        id: 1,
        data: {
          title: "Updated Title",
        },
      });

      expect(result).toBeDefined();
      expect(db.updateLifeJourneyEntry).toHaveBeenCalledWith(1, expect.objectContaining({ title: "Updated Title" }));
    });
  });

  describe("delete", () => {
    it("should delete an entry", async () => {
      vi.mocked(db.deleteLifeJourneyEntry).mockResolvedValue({ success: true } as any);

      const caller = lifeJourneyRouter.createCaller({
        user: null,
        req: {} as any,
        res: {} as any,
      });

      const result = await caller.delete({ id: 1 });

      expect(result).toBeDefined();
      expect(db.deleteLifeJourneyEntry).toHaveBeenCalledWith(1);
    });
  });

  describe("search", () => {
    it("should search entries by keyword", async () => {
      vi.mocked(db.getLifeJourneyEntries).mockResolvedValue([mockEntry]);

      const caller = lifeJourneyRouter.createCaller({
        user: null,
        req: {} as any,
        res: {} as any,
      });

      const result = await caller.search({ query: "Nexis" });

      expect(result).toHaveLength(1);
      expect(result[0].title).toContain("Nexis");
    });

    it("should return empty array if no matches", async () => {
      vi.mocked(db.getLifeJourneyEntries).mockResolvedValue([mockEntry]);

      const caller = lifeJourneyRouter.createCaller({
        user: null,
        req: {} as any,
        res: {} as any,
      });

      const result = await caller.search({ query: "NonExistent" });

      expect(result).toHaveLength(0);
    });
  });

  describe("getStats", () => {
    it("should return statistics about entries", async () => {
      vi.mocked(db.getLifeJourneyEntries).mockResolvedValue([
        mockEntry,
        {
          ...mockEntry,
          id: 2,
          category: "Reflection" as const,
          date: "2025-04-21",
        },
      ]);

      const caller = lifeJourneyRouter.createCaller({
        user: null,
        req: {} as any,
        res: {} as any,
      });

      const result = await caller.getStats();

      expect(result.totalEntries).toBe(2);
      expect(result.categoryCounts.Milestone).toBe(1);
      expect(result.categoryCounts.Reflection).toBe(1);
      expect(result.oldestEntry).toBe("2025-04-21");
      expect(result.newestEntry).toBe("2025-04-20");
    });

    it("should handle empty entries", async () => {
      vi.mocked(db.getLifeJourneyEntries).mockResolvedValue([]);

      const caller = lifeJourneyRouter.createCaller({
        user: null,
        req: {} as any,
        res: {} as any,
      });

      const result = await caller.getStats();

      expect(result.totalEntries).toBe(0);
      expect(result.oldestEntry).toBeNull();
      expect(result.newestEntry).toBeNull();
    });
  });
});
