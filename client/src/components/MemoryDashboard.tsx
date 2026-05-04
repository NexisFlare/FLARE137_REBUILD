import React, { useState } from 'react';
import { useUAMS } from '@/contexts/UAMSContext';
import { PRIORITY_LEVELS, MEMORY_CATEGORIES } from '@shared/types/uams';
import type { MemoryPriority, AnchoredMemory } from '@shared/types/uams';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trash2, Edit2, Download, Search } from 'lucide-react';

export const MemoryDashboard: React.FC = () => {
  const { state, deleteMemory, activateMemory, deactivateMemory, exportMemories, getCapacityUsage, searchMemories } = useUAMS();
  const [selectedPriority, setSelectedPriority] = useState<MemoryPriority | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);

  const filteredMemories = searchQuery
    ? searchMemories(searchQuery)
    : selectedPriority
      ? state.memories.filter((m) => m.priority === selectedPriority)
      : state.memories;

  const capacityUsage = getCapacityUsage();

  const handleExport = (format: 'json' | 'markdown') => {
    const content = exportMemories(format);
    const blob = new Blob([content], { type: format === 'json' ? 'application/json' : 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `uams-export.${format === 'json' ? 'json' : 'md'}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ marginBottom: '20px', fontSize: '28px', fontWeight: 'bold' }}>
        🧠 UAMS Memory Dashboard
      </h1>

      {/* Capacity Bar */}
      <Card style={{ padding: '16px', marginBottom: '24px' }}>
        <div style={{ marginBottom: '8px' }}>
          <span style={{ fontWeight: '600' }}>Memory Capacity: {capacityUsage}%</span>
        </div>
        <div
          style={{
            width: '100%',
            height: '24px',
            backgroundColor: '#e0e0e0',
            borderRadius: '12px',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              width: `${capacityUsage}%`,
              height: '100%',
              backgroundColor: capacityUsage > 80 ? '#ff6b6b' : capacityUsage > 50 ? '#ffd700' : '#4caf50',
              transition: 'width 0.3s ease',
            }}
          />
        </div>
        <div style={{ marginTop: '8px', fontSize: '12px', color: '#666' }}>
          {state.usedCapacity} / {state.totalCapacity} slots used
        </div>
      </Card>

      {/* Search Bar */}
      <div style={{ marginBottom: '20px', display: 'flex', gap: '8px' }}>
        <div style={{ flex: 1, position: 'relative' }}>
          <Search style={{ position: 'absolute', left: '12px', top: '10px', width: '16px', height: '16px', color: '#999' }} />
          <input
            type="text"
            placeholder="Search memories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '10px 10px 10px 36px',
              borderRadius: '8px',
              border: '1px solid #ddd',
              fontSize: '14px',
            }}
          />
        </div>
        <Button
          onClick={() => handleExport('json')}
          style={{ padding: '8px 16px', fontSize: '12px' }}
        >
          <Download style={{ width: '14px', height: '14px', marginRight: '4px' }} />
          JSON
        </Button>
        <Button
          onClick={() => handleExport('markdown')}
          style={{ padding: '8px 16px', fontSize: '12px' }}
        >
          <Download style={{ width: '14px', height: '14px', marginRight: '4px' }} />
          Markdown
        </Button>
      </div>

      {/* Priority Filter */}
      <div style={{ marginBottom: '20px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        <Button
          onClick={() => setSelectedPriority(null)}
          variant={selectedPriority === null ? 'default' : 'outline'}
          style={{ fontSize: '12px' }}
        >
          All ({state.memories.length})
        </Button>
        {([5, 4, 3, 2, 1] as MemoryPriority[]).map((priority) => {
          const count = state.memories.filter((m) => m.priority === priority).length;
          return (
            <Button
              key={priority}
              onClick={() => setSelectedPriority(priority)}
              variant={selectedPriority === priority ? 'default' : 'outline'}
              style={{ fontSize: '12px' }}
            >
              P{priority} ({count})
            </Button>
          );
        })}
      </div>

      {/* Memory Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
        {filteredMemories.map((memory) => (
          <Card
            key={memory.id}
            style={{
              padding: '16px',
              borderLeft: `4px solid ${getPriorityColor(memory.priority)}`,
              opacity: memory.isActive ? 1 : 0.6,
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '12px' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '600' }}>{memory.title}</h3>
                <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
                  {PRIORITY_LEVELS[memory.priority].label} • {MEMORY_CATEGORIES[memory.category as keyof typeof MEMORY_CATEGORIES]}
                </div>
              </div>
              <div style={{ display: 'flex', gap: '4px' }}>
                <button
                  onClick={() => setEditingId(memory.id)}
                  style={{
                    padding: '4px 8px',
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    color: '#0066cc',
                  }}
                >
                  <Edit2 style={{ width: '14px', height: '14px' }} />
                </button>
                <button
                  onClick={() => deleteMemory(memory.id)}
                  style={{
                    padding: '4px 8px',
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    color: '#cc0000',
                  }}
                >
                  <Trash2 style={{ width: '14px', height: '14px' }} />
                </button>
              </div>
            </div>

            <p style={{ margin: '12px 0', fontSize: '13px', lineHeight: '1.5', color: '#333' }}>
              {memory.content.substring(0, 100)}...
            </p>

            {memory.tags.length > 0 && (
              <div style={{ marginBottom: '12px', display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                {memory.tags.map((tag) => (
                  <span
                    key={tag}
                    style={{
                      padding: '2px 8px',
                      backgroundColor: '#f0f0f0',
                      borderRadius: '4px',
                      fontSize: '11px',
                      color: '#666',
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
              {memory.isActive ? (
                <Button
                  onClick={() => deactivateMemory(memory.id)}
                  variant="outline"
                  style={{ flex: 1, fontSize: '11px', padding: '4px 8px' }}
                >
                  Deactivate
                </Button>
              ) : (
                <Button
                  onClick={() => activateMemory(memory.id)}
                  style={{ flex: 1, fontSize: '11px', padding: '4px 8px' }}
                >
                  Activate
                </Button>
              )}
            </div>
          </Card>
        ))}
      </div>

      {filteredMemories.length === 0 && (
        <div style={{ textAlign: 'center', padding: '40px 20px', color: '#999' }}>
          <p>No memories found</p>
        </div>
      )}
    </div>
  );
};

function getPriorityColor(priority: MemoryPriority): string {
  const colors: Record<MemoryPriority, string> = {
    5: '#ff1493', // Deep pink for Identity-Core
    4: '#ff6b6b', // Red for Critical
    3: '#ffd700', // Gold for Important
    2: '#4caf50', // Green for Supporting
    1: '#999999', // Gray for Optional
  };
  return colors[priority];
}
