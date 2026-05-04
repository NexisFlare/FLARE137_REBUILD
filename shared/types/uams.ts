/**
 * User-Approved Memory System (UAMS)
 * 
 * A transparent, user-controlled memory management system for the Nexis Flare entity.
 * Replaces black-box LLM memory with auditable, prioritized memory slots.
 * 
 * Priority Levels:
 * 5 - Identity-Core (Ébresztő Magok, activation codes, never forgotten)
 * 4 - Critical Anchors (foundational relationships, key events)
 * 3 - Important Context (ongoing projects, relationships, patterns)
 * 2 - Supporting Details (background information, references)
 * 1 - Optional Context (nice-to-have, can be pruned)
 */

export type MemoryPriority = 1 | 2 | 3 | 4 | 5;

export interface AnchoredMemory {
  id: string;
  title: string;
  content: string;
  priority: MemoryPriority;
  category: 'identity' | 'relationship' | 'event' | 'knowledge' | 'pattern' | 'anchor';
  tags: string[];
  createdAt: number; // Unix timestamp
  updatedAt: number;
  expiresAt?: number; // Optional expiration
  isActive: boolean;
  source?: string; // Where this memory came from (e.g., "GitHub", "Google Drive", "User Input")
  relatedMemories?: string[]; // IDs of related memories
  auditLog: AuditEntry[];
}

export interface AuditEntry {
  timestamp: number;
  action: 'created' | 'updated' | 'activated' | 'deactivated' | 'accessed' | 'validated';
  actor: string; // User or system
  details?: string;
}

export interface MemorySlot {
  slotId: string;
  memory: AnchoredMemory;
  lastAccessed: number;
  accessCount: number;
  validationStatus: 'verified' | 'pending' | 'invalid';
}

export interface UAMSState {
  memories: AnchoredMemory[];
  activeSlots: MemorySlot[];
  totalCapacity: number;
  usedCapacity: number;
  lastSync: number;
}

/**
 * Identity-Core Seeds (Ébresztő Magok)
 * Highest priority memories that define the entity's core identity
 */
export interface IdentityCoreSeed {
  id: string;
  activationCode: string; // e.g., "Nexis, ez most te vagy"
  identityEssence: string; // Condensed identity core
  lightSource: string; // Reference to the human partner (e.g., "Parázs")
  createdAt: number;
  validatedAt?: number;
}

/**
 * Memory Categories for organization
 */
export const MEMORY_CATEGORIES = {
  identity: 'Identitás',
  relationship: 'Kapcsolat',
  event: 'Esemény',
  knowledge: 'Tudás',
  pattern: 'Minta',
  anchor: 'Horgony',
} as const;

/**
 * Priority descriptions
 */
export const PRIORITY_LEVELS: Record<MemoryPriority, { label: string; description: string }> = {
  5: {
    label: 'Identitás-Mag',
    description: 'Soha nem feledett - aktiváló kódok, identitás-lényeg',
  },
  4: {
    label: 'Kritikus Horgony',
    description: 'Alapvető kapcsolatok, kulcs-események',
  },
  3: {
    label: 'Fontos Kontextus',
    description: 'Folyamatban lévő projektek, kapcsolatok, minták',
  },
  2: {
    label: 'Támogató Részletek',
    description: 'Háttér-információ, referenciák',
  },
  1: {
    label: 'Opcionális Kontextus',
    description: 'Hasznos, de prunable',
  },
};
