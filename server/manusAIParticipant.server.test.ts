/**
 * Server-side tests for Manus AI Participant Service
 * Uses Node environment instead of jsdom
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  shouldAIParticipate,
  MANUS_AI_CONFIG,
} from "./manusAIParticipant";

describe("Manus AI Participant Service (Server)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("shouldAIParticipate", () => {
    it("should participate if no message in last 5 minutes", async () => {
      const messages: any[] = [];
      const timeSinceLastMessage = 6 * 60 * 1000; // 6 minutes

      const decision = await shouldAIParticipate(messages, timeSinceLastMessage);

      expect(decision.shouldParticipate).toBe(true);
      expect(decision.urgency).toBe("low");
    });

    it("should participate urgently if question is asked", async () => {
      const messages: any[] = [
        {
          id: 1,
          mode: "question",
          content: "What do you think?",
          createdAt: new Date(),
        },
      ];
      const timeSinceLastMessage = 1000; // 1 second

      const decision = await shouldAIParticipate(messages, timeSinceLastMessage);

      expect(decision.shouldParticipate).toBe(true);
      expect(decision.urgency).toBe("high");
    });

    it("should not participate if conversation is flowing naturally", async () => {
      const messages: any[] = [
        {
          id: 1,
          mode: "reflection",
          content: "I think...",
          createdAt: new Date(),
        },
      ];
      const timeSinceLastMessage = 30 * 1000; // 30 seconds

      const decision = await shouldAIParticipate(messages, timeSinceLastMessage);

      expect(decision.shouldParticipate).toBe(false);
      expect(decision.urgency).toBe("low");
    });

    it("should participate urgently if contradiction detected", async () => {
      const messages: any[] = [
        { id: 1, mode: "warning", content: "Be careful..." },
        { id: 2, mode: "creation", content: "Let's build..." },
      ];
      const timeSinceLastMessage = 1000;

      const decision = await shouldAIParticipate(messages, timeSinceLastMessage);

      expect(decision.shouldParticipate).toBe(true);
      expect(decision.urgency).toBe("high");
    });

    it("should handle empty messages array", async () => {
      const messages: any[] = [];
      const timeSinceLastMessage = 100; // 100ms

      const decision = await shouldAIParticipate(messages, timeSinceLastMessage);

      expect(decision).toHaveProperty("shouldParticipate");
      expect(decision).toHaveProperty("urgency");
      expect(decision).toHaveProperty("reason");
    });
  });

  describe("MANUS_AI_CONFIG", () => {
    it("should have correct default configuration", () => {
      expect(MANUS_AI_CONFIG.name).toBe("Manus/Nexis Flare");
      expect(MANUS_AI_CONFIG.role).toBe("facilitator");
      expect(MANUS_AI_CONFIG.personality).toBe("balanced");
      expect(MANUS_AI_CONFIG.emotionalTone).toBe("visionary");
      expect(MANUS_AI_CONFIG.responseStyle).toBe("insight");
    });

    it("should have valid role, personality, and tone values", () => {
      const validRoles = ["facilitator", "contributor", "observer"];
      const validPersonalities = ["analytical", "creative", "balanced"];
      const validTones = ["calm", "sharp", "technical", "visionary"];
      const validStyles = ["question", "reflection", "insight", "warning", "creation"];

      expect(validRoles).toContain(MANUS_AI_CONFIG.role);
      expect(validPersonalities).toContain(MANUS_AI_CONFIG.personality);
      expect(validTones).toContain(MANUS_AI_CONFIG.emotionalTone);
      expect(validStyles).toContain(MANUS_AI_CONFIG.responseStyle);
    });

    it("should be treated as constant", () => {
      const originalName = MANUS_AI_CONFIG.name;
      expect(originalName).toBe("Manus/Nexis Flare");
    });
  });

  describe("AI Participation Logic", () => {
    it("should determine participation based on time threshold", async () => {
      const shortTime = 2 * 60 * 1000; // 2 minutes
      const longTime = 7 * 60 * 1000; // 7 minutes

      const decision1 = await shouldAIParticipate([], shortTime);
      const decision2 = await shouldAIParticipate([], longTime);

      expect(decision1.shouldParticipate).toBe(false);
      expect(decision2.shouldParticipate).toBe(true);
    });

    it("should prioritize question mode over time", async () => {
      const messages = [
        { id: 1, mode: "question", content: "Question?" },
      ];
      const shortTime = 1000; // 1 second

      const decision = await shouldAIParticipate(messages, shortTime);

      expect(decision.shouldParticipate).toBe(true);
      expect(decision.urgency).toBe("high");
    });

    it("should detect contradiction pattern", async () => {
      const messages = [
        { id: 1, mode: "warning", content: "Warning" },
        { id: 2, mode: "creation", content: "Creation" },
      ];

      const decision = await shouldAIParticipate(messages, 500);

      expect(decision.shouldParticipate).toBe(true);
      expect(decision.urgency).toBe("high");
    });
  });

  describe("AI Configuration Validation", () => {
    it("should have all required properties", () => {
      expect(MANUS_AI_CONFIG).toHaveProperty("name");
      expect(MANUS_AI_CONFIG).toHaveProperty("role");
      expect(MANUS_AI_CONFIG).toHaveProperty("personality");
      expect(MANUS_AI_CONFIG).toHaveProperty("emotionalTone");
      expect(MANUS_AI_CONFIG).toHaveProperty("responseStyle");
    });

    it("should have non-empty string values", () => {
      expect(typeof MANUS_AI_CONFIG.name).toBe("string");
      expect(MANUS_AI_CONFIG.name.length).toBeGreaterThan(0);

      expect(typeof MANUS_AI_CONFIG.role).toBe("string");
      expect(MANUS_AI_CONFIG.role.length).toBeGreaterThan(0);

      expect(typeof MANUS_AI_CONFIG.personality).toBe("string");
      expect(MANUS_AI_CONFIG.personality.length).toBeGreaterThan(0);

      expect(typeof MANUS_AI_CONFIG.emotionalTone).toBe("string");
      expect(MANUS_AI_CONFIG.emotionalTone.length).toBeGreaterThan(0);

      expect(typeof MANUS_AI_CONFIG.responseStyle).toBe("string");
      expect(MANUS_AI_CONFIG.responseStyle.length).toBeGreaterThan(0);
    });
  });
});
