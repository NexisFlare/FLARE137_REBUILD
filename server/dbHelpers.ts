/**
 * Database Helper Functions for Coevolutionary Platform
 * 
 * Provides query helpers for:
 * - Room management
 * - Message persistence
 * - Anchor creation and retrieval
 * - Resonance detection
 * - Sync tracking
 */

import { getDb } from "./db";
import {
  rooms,
  participants,
  roomMessages,
  anchors,
  resonances,
  syncs,
  type InsertRoom,
  type InsertParticipant,
  type InsertRoomMessage,
  type InsertAnchor,
  type InsertResonance,
  type InsertSync,
} from "../drizzle/schema";
import { eq, and, desc } from "drizzle-orm";

/**
 * Create a new room
 */
export async function createRoom(data: InsertRoom) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(rooms).values(data);
  return result;
}

/**
 * Get room by ID with participants
 */
export async function getRoomWithParticipants(roomId: number) {
  const db = await getDb();
  if (!db) return null;
  
  const result = await db.select().from(rooms).where(eq(rooms.id, roomId)).limit(1);
  const room = result.length > 0 ? result[0] : null;

  if (!room) return null;

  const roomParticipants = await db.select().from(participants).where(eq(participants.roomId, roomId));

  return { ...room, participants: roomParticipants };
}

/**
 * Add participant to room
 */
export async function addParticipant(data: InsertParticipant) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(participants).values(data);
  return result;
}

/**
 * Update participant status
 */
export async function updateParticipantStatus(
  participantId: number,
  status: "online" | "typing" | "thinking" | "offline"
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db
    .update(participants)
    .set({ status, lastActiveAt: new Date() })
    .where(eq(participants.id, participantId));
  return result;
}

/**
 * Save message to room
 */
export async function saveMessage(data: InsertRoomMessage) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(roomMessages).values(data);
  return result;
}

/**
 * Get room messages (paginated)
 */
export async function getRoomMessages(
  roomId: number,
  options?: { limit?: number; offset?: number }
) {
  const db = await getDb();
  if (!db) return [];
  
  const queryLimit = options?.limit ?? 50;
  const queryOffset = options?.offset ?? 0;

  const messages = await db.select().from(roomMessages).where(eq(roomMessages.roomId, roomId)).orderBy(desc(roomMessages.createdAt)).limit(queryLimit).offset(queryOffset);

  return messages.reverse(); // Return in chronological order
}

/**
 * Get recent messages from a room
 */
export async function getRecentMessages(roomId: number, count: number = 20) {
  const db = await getDb();
  if (!db) return [];
  
  const messages = await db.select().from(roomMessages).where(eq(roomMessages.roomId, roomId)).orderBy(desc(roomMessages.createdAt)).limit(count);

  return messages.reverse();
}

/**
 * Create an anchor (memory pack)
 */
export async function createAnchor(data: InsertAnchor) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(anchors).values(data);
  return result;
}

/**
 * Get anchors for a room
 */
export async function getRoomAnchors(roomId: number) {
  const db = await getDb();
  if (!db) return [];
  
  const roomAnchors = await db.select().from(anchors).where(eq(anchors.roomId, roomId)).orderBy(desc(anchors.createdAt));

  return roomAnchors;
}

/**
 * Get anchor by ID
 */
export async function getAnchorById(anchorId: number) {
  const db = await getDb();
  if (!db) return null;
  
  const result = await db.select().from(anchors).where(eq(anchors.id, anchorId)).limit(1);

  return result.length > 0 ? result[0] : null;
}

/**
 * Create a resonance (detected pattern)
 */
export async function createResonance(data: InsertResonance) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(resonances).values(data);
  return result;
}

/**
 * Get resonances for a room
 */
export async function getRoomResonances(roomId: number) {
  const db = await getDb();
  if (!db) return [];
  
  const roomResonances = await db.select().from(resonances).where(eq(resonances.roomId, roomId)).orderBy(desc(resonances.strength));

  return roomResonances;
}

/**
 * Get resonances for an anchor
 */
export async function getAnchorResonances(anchorId: number) {
  const db = await getDb();
  if (!db) return [];
  
  const anchorResonances = await db.select().from(resonances).where(eq(resonances.anchorId, anchorId)).orderBy(desc(resonances.strength));

  return anchorResonances;
}

/**
 * Track sync to Drive/GitHub
 */
export async function trackSync(data: InsertSync) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(syncs).values(data);
  return result;
}

/**
 * Get sync records for a room
 */
export async function getRoomSyncs(roomId: number) {
  const db = await getDb();
  if (!db) return [];
  
  const syncRecords = await db.select().from(syncs).where(eq(syncs.roomId, roomId)).orderBy(desc(syncs.createdAt));

  return syncRecords;
}

/**
 * Get pending syncs (for background jobs)
 */
export async function getPendingSyncs() {
  const db = await getDb();
  if (!db) return [];
  
  const pendingSyncs = await db.select().from(syncs).where(eq(syncs.status, "pending")).orderBy(syncs.createdAt);

  return pendingSyncs;
}

/**
 * Update sync status
 */
export async function updateSyncStatus(
  syncId: number,
  status: "pending" | "success" | "failed",
  fileId?: string,
  errorMessage?: string
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db
    .update(syncs)
    .set({
      status,
      ...(fileId && { fileId }),
      ...(errorMessage && { errorMessage }),
      ...(status === "success" && { syncedAt: new Date() }),
      updatedAt: new Date(),
    })
    .where(eq(syncs.id, syncId));

  return result;
}

/**
 * Get all rooms
 */
export async function getAllRooms() {
  const db = await getDb();
  if (!db) return [];
  
  const allRooms = await db.select().from(rooms).orderBy(desc(rooms.createdAt));

  return allRooms;
}

/**
 * Get active rooms (not archived)
 */
export async function getActiveRooms() {
  const db = await getDb();
  if (!db) return [];
  
  const activeRooms = await db.select().from(rooms).where(eq(rooms.archived, 0)).orderBy(desc(rooms.createdAt));

  return activeRooms;
}

/**
 * Extract key insights from messages using AI
 * This would be called by a background job
 */
export async function extractInsights(messageIds: number[]) {
  // This would use the AI integration service to analyze messages
  // and extract key insights
  // For now, return a placeholder
  return {
    insights: [],
    emotionalTone: "neutral",
    coherenceScore: 50,
  };
}

/**
 * Detect resonance patterns from messages
 * This would be called by a background job
 */
export async function detectPatterns(roomId: number) {
  // Get recent messages
  const messages = await getRecentMessages(roomId, 100);

  // Analyze for patterns
  // This would use NLP and semantic analysis
  // For now, return a placeholder
  return {
    patterns: [],
    themes: [],
    contradictions: [],
  };
}

/**
 * Generate anchor summary from messages
 */
export async function generateAnchorSummary(messageIds: number[]) {
  // Generate summary using AI
  // For now, return a placeholder
  return {
    title: "Untitled Anchor",
    description: "Summary of conversation",
    emotionalTone: "neutral",
    keyInsights: [],
    secretWord: `secret-${Date.now()}`,
  };
}
