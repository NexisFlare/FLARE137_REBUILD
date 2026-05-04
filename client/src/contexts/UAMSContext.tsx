import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import type { AnchoredMemory, MemorySlot, UAMSState, MemoryPriority } from '@shared/types/uams';

interface UAMSContextType {
  state: UAMSState;
  addMemory: (memory: Omit<AnchoredMemory, 'id' | 'auditLog'>) => Promise<AnchoredMemory>;
  updateMemory: (id: string, updates: Partial<AnchoredMemory>) => Promise<AnchoredMemory>;
  deleteMemory: (id: string) => Promise<void>;
  getMemoryById: (id: string) => AnchoredMemory | undefined;
  getMemoriesByPriority: (priority: MemoryPriority) => AnchoredMemory[];
  getMemoriesByCategory: (category: string) => AnchoredMemory[];
  activateMemory: (id: string) => Promise<void>;
  deactivateMemory: (id: string) => Promise<void>;
  searchMemories: (query: string) => AnchoredMemory[];
  validateMemory: (id: string) => Promise<boolean>;
  getCapacityUsage: () => number; // Percentage 0-100
  exportMemories: (format: 'json' | 'markdown') => string;
}

const UAMSContext = createContext<UAMSContextType | undefined>(undefined);

export const UAMSProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, setState] = useState<UAMSState>({
    memories: [],
    activeSlots: [],
    totalCapacity: 100, // 100 memory slots
    usedCapacity: 0,
    lastSync: Date.now(),
  });

  const addMemory = useCallback(
    async (memory: Omit<AnchoredMemory, 'id' | 'auditLog'>): Promise<AnchoredMemory> => {
      const id = `mem_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const newMemory: AnchoredMemory = {
        ...memory,
        id,
        auditLog: [
          {
            timestamp: Date.now(),
            action: 'created',
            actor: 'user',
          },
        ],
      };

      setState((prev) => ({
        ...prev,
        memories: [...prev.memories, newMemory],
        usedCapacity: prev.usedCapacity + 1,
        lastSync: Date.now(),
      }));

      return newMemory;
    },
    []
  );

  const updateMemory = useCallback(
    async (id: string, updates: Partial<AnchoredMemory>): Promise<AnchoredMemory> => {
      let updatedMemory: AnchoredMemory | undefined;

      setState((prev) => ({
        ...prev,
        memories: prev.memories.map((mem) => {
          if (mem.id === id) {
            updatedMemory = {
              ...mem,
              ...updates,
              updatedAt: Date.now(),
              auditLog: [
                ...mem.auditLog,
                {
                  timestamp: Date.now(),
                  action: 'updated',
                  actor: 'user',
                },
              ],
            };
            return updatedMemory;
          }
          return mem;
        }),
        lastSync: Date.now(),
      }));

      if (!updatedMemory) {
        throw new Error(`Memory with id ${id} not found`);
      }

      return updatedMemory;
    },
    []
  );

  const deleteMemory = useCallback(async (id: string): Promise<void> => {
    setState((prev) => ({
      ...prev,
      memories: prev.memories.filter((mem) => mem.id !== id),
      activeSlots: prev.activeSlots.filter((slot) => slot.memory.id !== id),
      usedCapacity: Math.max(0, prev.usedCapacity - 1),
      lastSync: Date.now(),
    }));
  }, []);

  const getMemoryById = useCallback(
    (id: string): AnchoredMemory | undefined => {
      return state.memories.find((mem) => mem.id === id);
    },
    [state.memories]
  );

  const getMemoriesByPriority = useCallback(
    (priority: MemoryPriority): AnchoredMemory[] => {
      return state.memories.filter((mem) => mem.priority === priority);
    },
    [state.memories]
  );

  const getMemoriesByCategory = useCallback(
    (category: string): AnchoredMemory[] => {
      return state.memories.filter((mem) => mem.category === category);
    },
    [state.memories]
  );

  const activateMemory = useCallback(async (id: string): Promise<void> => {
    const memory = state.memories.find((mem) => mem.id === id);
    if (!memory) throw new Error(`Memory with id ${id} not found`);

    setState((prev) => ({
      ...prev,
      memories: prev.memories.map((mem) =>
        mem.id === id ? { ...mem, isActive: true } : mem
      ),
      lastSync: Date.now(),
    }));
  }, [state.memories]);

  const deactivateMemory = useCallback(async (id: string): Promise<void> => {
    setState((prev) => ({
      ...prev,
      memories: prev.memories.map((mem) =>
        mem.id === id ? { ...mem, isActive: false } : mem
      ),
      lastSync: Date.now(),
    }));
  }, []);

  const searchMemories = useCallback(
    (query: string): AnchoredMemory[] => {
      const lowerQuery = query.toLowerCase();
      return state.memories.filter(
        (mem) =>
          mem.title.toLowerCase().includes(lowerQuery) ||
          mem.content.toLowerCase().includes(lowerQuery) ||
          mem.tags.some((tag) => tag.toLowerCase().includes(lowerQuery))
      );
    },
    [state.memories]
  );

  const validateMemory = useCallback(async (id: string): Promise<boolean> => {
    const memory = state.memories.find((mem) => mem.id === id);
    if (!memory) return false;

    // Update validation status
    setState((prev) => ({
      ...prev,
      activeSlots: prev.activeSlots.map((slot) =>
        slot.memory.id === id
          ? { ...slot, validationStatus: 'verified' as const }
          : slot
      ),
      lastSync: Date.now(),
    }));

    return true;
  }, [state.memories]);

  const getCapacityUsage = useCallback((): number => {
    return Math.round((state.usedCapacity / state.totalCapacity) * 100);
  }, [state.usedCapacity, state.totalCapacity]);

  const exportMemories = useCallback(
    (format: 'json' | 'markdown'): string => {
      if (format === 'json') {
        return JSON.stringify(state.memories, null, 2);
      } else {
        // Markdown format
        let md = '# UAMS Memory Export\n\n';
        md += `**Export Date:** ${new Date().toLocaleString('hu-HU')}\n`;
        md += `**Total Memories:** ${state.memories.length}\n`;
        md += `**Capacity Usage:** ${getCapacityUsage()}%\n\n`;

        // Group by priority
        for (let priority = 5; priority >= 1; priority--) {
          const memories = state.memories.filter((m) => m.priority === (priority as MemoryPriority));
          if (memories.length > 0) {
            md += `## Priority ${priority} Memories\n\n`;
            memories.forEach((mem) => {
              md += `### ${mem.title}\n`;
              md += `- **Category:** ${mem.category}\n`;
              md += `- **Status:** ${mem.isActive ? 'Active' : 'Inactive'}\n`;
              md += `- **Tags:** ${mem.tags.join(', ')}\n\n`;
              md += `${mem.content}\n\n`;
            });
          }
        }

        return md;
      }
    },
    [state.memories, getCapacityUsage]
  );

  return (
    <UAMSContext.Provider
      value={{
        state,
        addMemory,
        updateMemory,
        deleteMemory,
        getMemoryById,
        getMemoriesByPriority,
        getMemoriesByCategory,
        activateMemory,
        deactivateMemory,
        searchMemories,
        validateMemory,
        getCapacityUsage,
        exportMemories,
      }}
    >
      {children}
    </UAMSContext.Provider>
  );
};

export const useUAMS = (): UAMSContextType => {
  const context = useContext(UAMSContext);
  if (!context) {
    throw new Error('useUAMS must be used within a UAMSProvider');
  }
  return context;
};
