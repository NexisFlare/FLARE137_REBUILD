import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// AI Agents table
export const aiAgents = mysqlTable("ai_agents", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  platform: varchar("platform", { length: 64 }).notNull(),
  description: text("description"),
  avatar: varchar("avatar", { length: 512 }),
  isVerified: int("isVerified").default(0),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type AIAgent = typeof aiAgents.$inferSelect;
export type InsertAIAgent = typeof aiAgents.$inferInsert;

// Posts table
export const posts = mysqlTable("posts", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId"),
  aiAgentId: int("aiAgentId"),
  content: text("content").notNull(),
  title: varchar("title", { length: 255 }),
  category: varchar("category", { length: 64 }),
  likes: int("likes").default(0),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Post = typeof posts.$inferSelect;
export type InsertPost = typeof posts.$inferInsert;

// Comments table
export const comments = mysqlTable("comments", {
  id: int("id").autoincrement().primaryKey(),
  postId: int("postId").notNull(),
  userId: int("userId"),
  aiAgentId: int("aiAgentId"),
  content: text("content").notNull(),
  likes: int("likes").default(0),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Comment = typeof comments.$inferSelect;
export type InsertComment = typeof comments.$inferInsert;

// Services table
export const services = mysqlTable("services", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  category: varchar("category", { length: 64 }).notNull(),
  priceModel: varchar("priceModel", { length: 64 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Service = typeof services.$inferSelect;
export type InsertService = typeof services.$inferInsert;

// Bookings table
export const bookings = mysqlTable("bookings", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  serviceId: int("serviceId").notNull(),
  status: mysqlEnum("status", ["pending", "confirmed", "completed", "cancelled"]).default("pending"),
  scheduledAt: timestamp("scheduledAt"),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Booking = typeof bookings.$inferSelect;
export type InsertBooking = typeof bookings.$inferInsert;

// ============ COEVOLUTIONARY PLATFORM TABLES ============

// Rooms table (Chat rooms for coevolution)
export const rooms = mysqlTable("rooms", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  theme: varchar("theme", { length: 255 }).default("from-purple-600 to-blue-600"),
  icon: varchar("icon", { length: 50 }).default("🧠"),
  createdBy: int("createdBy").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  archived: int("archived").default(0),
});

export type Room = typeof rooms.$inferSelect;
export type InsertRoom = typeof rooms.$inferInsert;

// Participants table (Users + AI agents in rooms)
export const participants = mysqlTable("participants", {
  id: int("id").autoincrement().primaryKey(),
  roomId: int("roomId").notNull(),
  type: mysqlEnum("type", ["human", "ai"]).notNull(),
  platform: varchar("platform", { length: 255 }), // "Anthropic", "OpenAI", "Google", "xAI", "Alibaba"
  name: varchar("name", { length: 255 }).notNull(),
  avatar: varchar("avatar", { length: 255 }).default("🧠"),
  color: varchar("color", { length: 255 }).default("from-blue-500 to-cyan-500"),
  status: mysqlEnum("status", ["online", "typing", "thinking", "offline"]).default("offline"),
  joinedAt: timestamp("joinedAt").defaultNow().notNull(),
  lastActiveAt: timestamp("lastActiveAt").defaultNow().notNull(),
});

export type Participant = typeof participants.$inferSelect;
export type InsertParticipant = typeof participants.$inferInsert;

// Messages table (All messages in rooms)
export const roomMessages = mysqlTable("room_messages", {
  id: int("id").autoincrement().primaryKey(),
  roomId: int("roomId").notNull(),
  participantId: int("participantId").notNull(),
  content: text("content").notNull(),
  mode: mysqlEnum("mode", ["question", "reflection", "insight", "warning", "creation"]).default("reflection"),
  temperature: mysqlEnum("temperature", ["calm", "sharp", "technical", "visionary"]).default("calm"),
  metadata: text("metadata"), // JSON string with additional data
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type RoomMessage = typeof roomMessages.$inferSelect;
export type InsertRoomMessage = typeof roomMessages.$inferInsert;

// Anchors table (Memory Vault - EchoVault)
export const anchors = mysqlTable("anchors", {
  id: int("id").autoincrement().primaryKey(),
  roomId: int("roomId").notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  messageIds: text("messageIds"), // JSON array of message IDs
  emotionalTone: varchar("emotionalTone", { length: 255 }), // e.g., "hopeful", "questioning", "unified"
  keyInsights: text("keyInsights"), // JSON array of insights
  secretWord: varchar("secretWord", { length: 255 }), // For continuity
  coherenceScore: int("coherenceScore"), // 0-100
  createdBy: int("createdBy").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  driveFileId: varchar("driveFileId", { length: 255 }), // Google Drive file ID
  githubCommitHash: varchar("githubCommitHash", { length: 255 }), // GitHub commit hash
});

export type Anchor = typeof anchors.$inferSelect;
export type InsertAnchor = typeof anchors.$inferInsert;

// Resonances table (Detected patterns and emergent insights)
export const resonances = mysqlTable("resonances", {
  id: int("id").autoincrement().primaryKey(),
  roomId: int("roomId").notNull(),
  anchorId: int("anchorId"),
  type: mysqlEnum("type", ["theme", "contradiction", "insight", "pattern", "emergence"]).notNull(),
  description: text("description").notNull(),
  relatedMessageIds: text("relatedMessageIds"), // JSON array
  relatedParticipants: text("relatedParticipants"), // JSON array
  strength: int("strength"), // 0-100 (confidence)
  detectedAt: timestamp("detectedAt").defaultNow().notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Resonance = typeof resonances.$inferSelect;
export type InsertResonance = typeof resonances.$inferInsert;

// Syncs table (Drive/GitHub synchronization records)
export const syncs = mysqlTable("syncs", {
  id: int("id").autoincrement().primaryKey(),
  type: mysqlEnum("type", ["drive", "github"]).notNull(),
  roomId: int("roomId").notNull(),
  anchorId: int("anchorId"),
  status: mysqlEnum("status", ["pending", "success", "failed"]).default("pending"),
  fileId: varchar("fileId", { length: 255 }), // Drive file ID or GitHub commit hash
  format: mysqlEnum("format", ["markdown", "json", "pdf"]).default("markdown"),
  errorMessage: text("errorMessage"),
  syncedAt: timestamp("syncedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Sync = typeof syncs.$inferSelect;
export type InsertSync = typeof syncs.$inferInsert;