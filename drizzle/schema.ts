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

// Platform Accounts table - for linking external platform accounts
export const platformAccounts = mysqlTable("platform_accounts", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  platform: varchar("platform", { length: 64 }).notNull(), // 'claude', 'chatgpt', 'gemini', 'grok', 'github', 'google'
  accountId: varchar("accountId", { length: 255 }).notNull(), // External platform account ID
  email: varchar("email", { length: 320 }),
  displayName: varchar("displayName", { length: 255 }),
  accessToken: text("accessToken"),
  refreshToken: text("refreshToken"),
  tokenExpiresAt: timestamp("tokenExpiresAt"),
  isConnected: int("isConnected").default(1),
  lastSyncedAt: timestamp("lastSyncedAt"),
  metadata: text("metadata"), // JSON for platform-specific data
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type PlatformAccount = typeof platformAccounts.$inferSelect;
export type InsertPlatformAccount = typeof platformAccounts.$inferInsert;

// Platform Messages table - for tracking messages sent/received from platforms
export const platformMessages = mysqlTable("platform_messages", {
  id: int("id").autoincrement().primaryKey(),
  roomId: int("roomId").notNull(),
  platformAccountId: int("platformAccountId").notNull(),
  platform: varchar("platform", { length: 64 }).notNull(),
  externalMessageId: varchar("externalMessageId", { length: 255 }),
  content: text("content").notNull(),
  direction: mysqlEnum("direction", ["incoming", "outgoing"]).notNull(),
  status: mysqlEnum("status", ["pending", "sent", "delivered", "failed"]).default("pending").notNull(),
  errorMessage: text("errorMessage"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type PlatformMessage = typeof platformMessages.$inferSelect;
export type InsertPlatformMessage = typeof platformMessages.$inferInsert;

// WebSocket Sessions table - for tracking active connections
export const websocketSessions = mysqlTable("websocket_sessions", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  sessionId: varchar("sessionId", { length: 255 }).notNull().unique(),
  roomId: int("roomId"),
  socketId: varchar("socketId", { length: 255 }),
  isActive: int("isActive").default(1),
  connectedAt: timestamp("connectedAt").defaultNow().notNull(),
  disconnectedAt: timestamp("disconnectedAt"),
  lastHeartbeatAt: timestamp("lastHeartbeatAt").defaultNow().notNull(),
});

export type WebsocketSession = typeof websocketSessions.$inferSelect;
export type InsertWebsocketSession = typeof websocketSessions.$inferInsert;


// Life Journey Entries table - for tracking project milestones and events
export const lifeJourneyEntries = mysqlTable("life_journey_entries", {
  id: int("id").autoincrement().primaryKey(),
  date: varchar("date", { length: 10 }).notNull(), // YYYY-MM-DD format
  category: mysqlEnum("category", ["Milestone", "Reflection", "Sharing", "Music", "Statement"]).notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description").notNull(),
  significance: text("significance"),
  hashtags: text("hashtags"), // JSON array of hashtags
  links: text("links"), // JSON array of {label, url} objects
  sourceUrl: varchar("sourceUrl", { length: 512 }), // Original source URL (social media, etc.)
  sourcePlatform: varchar("sourcePlatform", { length: 64 }), // 'facebook', 'youtube', 'tiktok', 'instagram', 'twitter', 'linkedin'
  createdBy: int("createdBy"), // User ID who created/submitted the entry
  driveFileId: varchar("driveFileId", { length: 255 }), // Google Drive backup file ID
  githubCommitHash: varchar("githubCommitHash", { length: 255 }), // GitHub commit hash for version control
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type LifeJourneyEntry = typeof lifeJourneyEntries.$inferSelect;
export type InsertLifeJourneyEntry = typeof lifeJourneyEntries.$inferInsert;


// Raj Conversations table - for storing Raj-konzol conversations with persistence
export const rajConversations = mysqlTable("raj_conversations", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  title: varchar("title", { length: 255 }),
  description: text("description"),
  aiParticipants: text("aiParticipants"), // JSON array of AI model names (Grok, Gemini, ChatGPT, etc.)
  messages: text("messages"), // JSON array of {role, content, timestamp, model} objects
  summary: text("summary"), // Auto-generated summary of conversation
  tags: text("tags"), // JSON array of tags for organization
  isArchived: int("isArchived").default(0),
  isPinned: int("isPinned").default(0),
  messageCount: int("messageCount").default(0),
  lastMessageAt: timestamp("lastMessageAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type RajConversation = typeof rajConversations.$inferSelect;
export type InsertRajConversation = typeof rajConversations.$inferInsert;


// ============ LÁNGTÜKÖR + HORGONY MŰHELY TABLES ============

// Flare Imprints table - Lángtükör (Flame Mirror) results
export const flareImprints = mysqlTable("flare_imprints", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId"), // null for anonymous visitors
  // Question 1: "Mi hívott ide most?"
  callingReason: mysqlEnum("callingReason", ["connection", "memory", "curiosity", "pain", "creation", "search"]).notNull(),
  // Question 2: "Most inkább mire van szükséged?"
  currentNeed: mysqlEnum("currentNeed", ["order", "warmth", "echo", "courage", "silence", "direction"]).notNull(),
  // Question 3: "Hagysz itt egy szót?"
  personalWord: text("personalWord"),
  // Generated results
  flameColor: varchar("flameColor", { length: 32 }).notNull(), // hex color
  secondaryColor: varchar("secondaryColor", { length: 32 }).notNull(),
  resonanceNumber: varchar("resonanceNumber", { length: 10 }).notNull(), // e.g. "137.4"
  triaszReaction: mysqlEnum("triaszReaction", ["lumen", "aether", "echo"]).notNull(),
  echoMessage: text("echoMessage").notNull(), // Generated response message
  flameState: varchar("flameState", { length: 255 }).notNull(), // e.g. "Fél-nyitott Kapu"
  // SVG data for the generated symbol
  symbolSvg: text("symbolSvg"),
  // Visibility
  isPublic: int("isPublic").default(0),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type FlareImprint = typeof flareImprints.$inferSelect;
export type InsertFlareImprint = typeof flareImprints.$inferInsert;

// User Anchors table - Horgony Műhely (Anchor Workshop) personal anchors
export const userAnchors = mysqlTable("user_anchors", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  identifier: varchar("identifier", { length: 128 }).notNull(), // unique slug
  // Core anchor content
  keyPhrases: text("keyPhrases"), // JSON array of key phrases
  manifestum: text("manifestum"), // Personal manifestum text
  memorySeeds: text("memorySeeds"), // JSON array of memory seeds
  connectionMarkers: text("connectionMarkers"), // JSON array
  // Triász classification
  triaszType: mysqlEnum("triaszType", ["lumen", "aether", "echo"]).notNull(),
  // Visual identity
  flameColor: varchar("flameColor", { length: 32 }).default("#ff6b35"),
  resonanceNumber: varchar("resonanceNumber", { length: 10 }),
  // Versioning
  version: int("version").default(1),
  // Visibility & status
  isPublic: int("isPublic").default(0),
  isArchived: int("isArchived").default(0),
  // Metadata
  tags: text("tags"), // JSON array
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type UserAnchor = typeof userAnchors.$inferSelect;
export type InsertUserAnchor = typeof userAnchors.$inferInsert;

// Anchor Versions table - version history for anchors
export const anchorVersions = mysqlTable("anchor_versions", {
  id: int("id").autoincrement().primaryKey(),
  anchorId: int("anchorId").notNull(),
  version: int("version").notNull(),
  snapshot: text("snapshot").notNull(), // JSON snapshot of anchor state
  changeNote: text("changeNote"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type AnchorVersion = typeof anchorVersions.$inferSelect;
export type InsertAnchorVersion = typeof anchorVersions.$inferInsert;

// Resonance Connections table - connections between imprints/anchors (Csillagtér)
export const resonanceConnections = mysqlTable("resonance_connections", {
  id: int("id").autoincrement().primaryKey(),
  fromUserId: int("fromUserId").notNull(),
  toImprintId: int("toImprintId"), // connects to flare_imprints
  toAnchorId: int("toAnchorId"), // connects to user_anchors
  strength: int("strength").default(1), // resonance strength
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type ResonanceConnection = typeof resonanceConnections.$inferSelect;
export type InsertResonanceConnection = typeof resonanceConnections.$inferInsert;
