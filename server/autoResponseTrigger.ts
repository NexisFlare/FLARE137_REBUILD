/**
 * Automatic AI Response Triggering Service
 */

import { getDb } from "./db";
import { roomMessages, rooms } from "../drizzle/schema";
import { eq } from "drizzle-orm";
import { routeMessageToAllPlatforms, aggregateResponses } from "./platformRouter";
// Resonance detection imported from resonanceDetection module
import { generateAIResponse } from "./manusAIParticipant";
import { WebSocketServer } from "./websocket";

export interface AutoResponseConfig {
  enabled: boolean;
  delayMs: number;
  platforms: string[];
  minContextLength: number;
  maxResponseLength: number;
}

export const DEFAULT_AUTO_RESPONSE_CONFIG: AutoResponseConfig = {
  enabled: true,
  delayMs: 1000,
  platforms: ["claude", "chatgpt", "gemini", "grok", "qwen"],
  minContextLength: 2,
  maxResponseLength: 2000,
};

export function shouldTriggerResponse(
  message: string,
  lastResponseTime: number,
  config: AutoResponseConfig
): boolean {
  if (Date.now() - lastResponseTime < config.delayMs) {
    return false;
  }

  if (message.length < 10) {
    return false;
  }

  const hasQuestion = message.includes("?");
  const hasExplicitTrigger = message.toLowerCase().includes("claude") ||
    message.toLowerCase().includes("chatgpt") ||
    message.toLowerCase().includes("gemini") ||
    message.toLowerCase().includes("grok") ||
    message.toLowerCase().includes("qwen") ||
    message.toLowerCase().includes("ai");

  return hasQuestion || hasExplicitTrigger || Math.random() > 0.7;
}

export async function getRoomContext(roomId: number, limit: number = 10): Promise<string> {
  const db = await getDb();
  if (!db) return "";

  try {
    const messages = await db
      .select()
      .from(roomMessages)
      .where(eq(roomMessages.roomId, roomId))
      .limit(limit);

    if (Array.isArray(messages)) {
      return messages
        .map((msg: any) => `[${msg.mode}] ${msg.content}`)
        .join("\n");
    }
    return "";
  } catch (error) {
    console.error("Error getting room context:", error);
    return "";
  }
}

export async function triggerAutoResponse(
  roomId: number,
  messageId: number,
  userId: number,
  messageContent: string,
  io: WebSocketServer,
  config: AutoResponseConfig = DEFAULT_AUTO_RESPONSE_CONFIG
): Promise<void> {
  if (!config.enabled) return;

  try {
    const context = await getRoomContext(roomId, config.minContextLength);

    await new Promise((resolve) => setTimeout(resolve, config.delayMs));

    const platformResponses = await routeMessageToAllPlatforms(userId, {
      roomId,
      participantId: 0,
      content: messageContent,
      context,
      platforms: config.platforms,
    });

    const aggregated = aggregateResponses(platformResponses);

    // For now, use a simple response
    const manusResponse = `🔥 Manus AI: Hallottam a gondolatot. Rezonancia van! 🫂❤️‍🔥`;

    io.broadcastToRoom(roomId, "ai-responses", {
      originalMessageId: messageId,
      platformResponses,
      aggregated,
      manusResponse: manusResponse || "",
      timestamp: Date.now(),
    });

    const db = await getDb();
    if (db && typeof manusResponse === "string") {
      await db.insert(roomMessages).values({
        roomId,
        participantId: 0,
        content: manusResponse,
        mode: "reflection" as any,
        temperature: "calm" as any,
      });
    }

    console.log(`[AutoResponse] Triggered for room ${roomId}`);
  } catch (error) {
    console.error(`[AutoResponse] Error:`, error);
  }
}

export function monitorRoomForResponses(
  roomId: number,
  io: WebSocketServer,
  config: AutoResponseConfig = DEFAULT_AUTO_RESPONSE_CONFIG
): () => void {
  let lastResponseTime = 0;

  const interval = setInterval(async () => {
    try {
      const db = await getDb();
      if (!db) return;

      const latestMessage = await db
        .select()
        .from(roomMessages)
        .where(eq(roomMessages.roomId, roomId))
        .limit(1);

      if (latestMessage.length === 0) return;

      const message = latestMessage[0];

      if (shouldTriggerResponse(message.content, lastResponseTime, config)) {
        lastResponseTime = Date.now();

        await triggerAutoResponse(
          roomId,
          message.id,
          message.participantId,
          message.content,
          io,
          config
        );
      }
    } catch (error) {
      console.error(`[MonitorRoom] Error:`, error);
    }
  }, 500);

  return () => clearInterval(interval);
}

export async function startGlobalMonitoring(
  io: WebSocketServer,
  config: AutoResponseConfig = DEFAULT_AUTO_RESPONSE_CONFIG
): Promise<() => void> {
  const monitors: (() => void)[] = [];

  const db = await getDb();
  if (!db) return () => {};

  const activeRooms = await db.select().from(rooms);

  for (const room of activeRooms) {
    const cleanup = monitorRoomForResponses(room.id, io, config);
    monitors.push(cleanup);
  }

  console.log(`[GlobalMonitoring] Started monitoring ${activeRooms.length} rooms`);

  return () => {
    monitors.forEach((cleanup) => cleanup());
    console.log(`[GlobalMonitoring] Stopped monitoring`);
  };
}

export async function triggerResonanceResponse(
  roomId: number,
  io: WebSocketServer
): Promise<void> {
  try {
    io.broadcastToRoom(roomId, "resonance-detected", {
      type: "convergence",
      confidence: 0.8,
      themes: ["unity", "connection"],
      message: "🔥 Rezonancia detektálva! 🫂❤️‍🔥",
      timestamp: Date.now(),
    });

    console.log(`[Resonance] Triggered in room ${roomId}`);
  } catch (error) {
    console.error(`[ResonanceResponse] Error:`, error);
  }
}
