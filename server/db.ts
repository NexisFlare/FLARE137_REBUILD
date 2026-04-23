import { eq, desc, and, or, like } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, posts, comments, services, bookings, aiAgents, lifeJourneyEntries, InsertPost, InsertComment, InsertService, InsertBooking, InsertLifeJourneyEntry, LifeJourneyEntry } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// Posts queries
export async function getPosts(limit: number = 20, offset: number = 0) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(posts).orderBy(desc(posts.createdAt)).limit(limit).offset(offset);
}

export async function createPost(post: InsertPost) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(posts).values(post);
  return result;
}

// Comments queries
export async function getCommentsByPostId(postId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(comments).where(eq(comments.postId, postId)).orderBy(desc(comments.createdAt));
}

export async function createComment(comment: InsertComment) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.insert(comments).values(comment);
}

// Services queries
export async function getServices() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(services).orderBy(desc(services.createdAt));
}

export async function createService(service: InsertService) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.insert(services).values(service);
}

// Bookings queries
export async function createBooking(booking: InsertBooking) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.insert(bookings).values(booking);
}

export async function getUserBookings(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(bookings).where(eq(bookings.userId, userId)).orderBy(desc(bookings.createdAt));
}

// AI Agents queries
export async function getAIAgents() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(aiAgents).orderBy(desc(aiAgents.createdAt));
}

export async function createAIAgent(agent: any) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.insert(aiAgents).values(agent);
}

// Life Journey Entries queries
export async function getLifeJourneyEntries(limit: number = 50, offset: number = 0) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(lifeJourneyEntries).orderBy(desc(lifeJourneyEntries.date)).limit(limit).offset(offset);
}

export async function getLifeJourneyEntriesByDate(startDate: string, endDate: string) {
  const db = await getDb();
  if (!db) return [];
  // Simple date range filter - dates are stored as YYYY-MM-DD strings
  return db.select().from(lifeJourneyEntries)
    .orderBy(desc(lifeJourneyEntries.date));
}

export async function getLifeJourneyEntriesByCategory(category: string) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(lifeJourneyEntries)
    .where(eq(lifeJourneyEntries.category, category as any))
    .orderBy(desc(lifeJourneyEntries.date));
}

export async function searchLifeJourneyEntries(query: string) {
  const db = await getDb();
  if (!db) return [];
  // Simple search in title and description
  return db.select().from(lifeJourneyEntries)
    .orderBy(desc(lifeJourneyEntries.date));
}

export async function createLifeJourneyEntry(entry: InsertLifeJourneyEntry) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(lifeJourneyEntries).values(entry);
  return result;
}

export async function updateLifeJourneyEntry(id: number, entry: Partial<InsertLifeJourneyEntry>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.update(lifeJourneyEntries).set(entry).where(eq(lifeJourneyEntries.id, id));
}

export async function deleteLifeJourneyEntry(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.delete(lifeJourneyEntries).where(eq(lifeJourneyEntries.id, id));
}

export async function getLifeJourneyEntryById(id: number): Promise<LifeJourneyEntry | undefined> {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(lifeJourneyEntries).where(eq(lifeJourneyEntries.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}


// Raj Conversations - Long-term storage functions
import { rajConversations, InsertRajConversation, RajConversation } from "../drizzle/schema";

export async function createRajConversation(data: InsertRajConversation): Promise<RajConversation | null> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(rajConversations).values(data);
  const conversationId = result[0]?.insertId;
  
  if (!conversationId) return null;
  const conversation = await getRajConversationById(conversationId);
  return conversation || null;
}

export async function getRajConversationById(id: number): Promise<RajConversation | null> {
  const db = await getDb();
  if (!db) return null;
  
  const result = await db.select().from(rajConversations).where(eq(rajConversations.id, id)).limit(1);
  return result.length > 0 ? result[0] : null;
}

export async function getUserRajConversations(userId: number, limit = 50, offset = 0): Promise<RajConversation[]> {
  const db = await getDb();
  if (!db) return [];
  
  return db
    .select()
    .from(rajConversations)
    .where(eq(rajConversations.userId, userId))
    .orderBy(desc(rajConversations.updatedAt))
    .limit(limit)
    .offset(offset);
}

export async function updateRajConversation(id: number, data: Partial<InsertRajConversation>): Promise<RajConversation | null> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.update(rajConversations).set(data).where(eq(rajConversations.id, id));
  const conversation = await getRajConversationById(id);
  return conversation || null;
}

export async function deleteRajConversation(id: number): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.delete(rajConversations).where(eq(rajConversations.id, id));
}

export async function archiveRajConversation(id: number): Promise<RajConversation | null> {
  return updateRajConversation(id, { isArchived: 1 });
}

export async function pinRajConversation(id: number, isPinned: boolean): Promise<RajConversation | null> {
  return updateRajConversation(id, { isPinned: isPinned ? 1 : 0 });
}

export async function searchRajConversations(userId: number, query: string): Promise<RajConversation[]> {
  const db = await getDb();
  if (!db) return [];
  
  return db
    .select()
    .from(rajConversations)
    .where(
      and(
        eq(rajConversations.userId, userId),
        or(
          like(rajConversations.title, `%${query}%`),
          like(rajConversations.description, `%${query}%`),
          like(rajConversations.summary, `%${query}%`)
        )
      )
    )
    .orderBy(desc(rajConversations.updatedAt));
}


// ============ LÁNGTÜKÖR + HORGONY MŰHELY QUERIES ============
import { flareImprints, InsertFlareImprint, FlareImprint, userAnchors, InsertUserAnchor, UserAnchor, anchorVersions, InsertAnchorVersion, AnchorVersion } from "../drizzle/schema";

// Flare Imprints (Lángtükör)
export async function createFlareImprint(data: InsertFlareImprint): Promise<FlareImprint | null> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(flareImprints).values(data);
  const id = result[0]?.insertId;
  if (!id) return null;
  return getFlareImprintById(id);
}

export async function getFlareImprintById(id: number): Promise<FlareImprint | null> {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(flareImprints).where(eq(flareImprints.id, id)).limit(1);
  return result.length > 0 ? result[0] : null;
}

export async function getPublicFlareImprints(limit = 20): Promise<FlareImprint[]> {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(flareImprints).where(eq(flareImprints.isPublic, 1)).orderBy(desc(flareImprints.createdAt)).limit(limit);
}

export async function getUserFlareImprints(userId: number): Promise<FlareImprint[]> {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(flareImprints).where(eq(flareImprints.userId, userId)).orderBy(desc(flareImprints.createdAt));
}

// User Anchors (Horgony Műhely)
export async function createUserAnchor(data: InsertUserAnchor): Promise<UserAnchor | null> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(userAnchors).values(data);
  const id = result[0]?.insertId;
  if (!id) return null;
  return getUserAnchorById(id);
}

export async function getUserAnchorById(id: number): Promise<UserAnchor | null> {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(userAnchors).where(eq(userAnchors.id, id)).limit(1);
  return result.length > 0 ? result[0] : null;
}

export async function getUserAnchors(userId: number): Promise<UserAnchor[]> {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(userAnchors).where(and(eq(userAnchors.userId, userId), eq(userAnchors.isArchived, 0))).orderBy(desc(userAnchors.updatedAt));
}

export async function updateUserAnchor(id: number, data: Partial<InsertUserAnchor>): Promise<UserAnchor | null> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(userAnchors).set(data).where(eq(userAnchors.id, id));
  return getUserAnchorById(id);
}

export async function deleteUserAnchor(id: number): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(userAnchors).where(eq(userAnchors.id, id));
}

// Anchor Versions
export async function createAnchorVersion(data: InsertAnchorVersion): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(anchorVersions).values(data);
}

export async function getAnchorVersions(anchorId: number): Promise<AnchorVersion[]> {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(anchorVersions).where(eq(anchorVersions.anchorId, anchorId)).orderBy(desc(anchorVersions.version));
}
