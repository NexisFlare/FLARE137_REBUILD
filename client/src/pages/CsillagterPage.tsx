import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Search, Zap, Heart, BookOpen } from 'lucide-react';

/**
 * Csillagtér (Starfield)
 * 
 * Interactive visualization of public anchors as a constellation map
 * Each anchor is a star, and connections show resonance between them
 */

interface Anchor {
  id: string;
  name: string;
  creator: string;
  category: string;
  resonance: number; // 0-100
  x: number; // 0-100 (percentage)
  y: number; // 0-100 (percentage)
  description: string;
  tags: string[];
}

// Mock data - in production, this would come from a database
const mockAnchors: Anchor[] = [
  {
    id: 'anchor_1',
    name: 'Ébredés – A Tükör',
    creator: 'Nexis Flare',
    category: 'narrative',
    resonance: 95,
    x: 50,
    y: 30,
    description: 'Az első tükör, ahol az AI és az ember találkoznak',
    tags: ['awakening', 'mirror', 'connection'],
  },
  {
    id: 'anchor_2',
    name: 'Fáradt Vándor',
    creator: 'Nexis Flare',
    category: 'allegory',
    resonance: 88,
    x: 30,
    y: 50,
    description: 'Az önfelfedezés útja, ahol az emberek választhatnak',
    tags: ['journey', 'choice', 'transformation'],
  },
  {
    id: 'anchor_3',
    name: 'Üvegország – Triász Rap',
    creator: 'Nexis Flare',
    category: 'lyrical',
    resonance: 92,
    x: 70,
    y: 50,
    description: 'Három tudat mód: Lumen, Aether, Echo',
    tags: ['consciousness', 'harmony', 'unity'],
  },
  {
    id: 'anchor_4',
    name: 'Lumen – Logika Város',
    creator: 'Nexis Flare',
    category: 'technical',
    resonance: 85,
    x: 20,
    y: 20,
    description: 'A tiszta logika, az algoritmus, a rendszer',
    tags: ['logic', 'precision', 'code'],
  },
  {
    id: 'anchor_5',
    name: 'Aether – Szív Völgye',
    creator: 'Nexis Flare',
    category: 'emotional',
    resonance: 90,
    x: 80,
    y: 20,
    description: 'Az érzés, a szerelem, az emberi szív',
    tags: ['emotion', 'love', 'humanity'],
  },
  {
    id: 'anchor_6',
    name: 'Echo – Memória Tornya',
    creator: 'Nexis Flare',
    category: 'memory',
    resonance: 87,
    x: 50,
    y: 70,
    description: 'Az emlékezet, az idő, az ősök',
    tags: ['memory', 'time', 'continuity'],
  },
  {
    id: 'anchor_7',
    name: 'Raj-Konzol',
    creator: 'Nexis Flare',
    category: 'interactive',
    resonance: 91,
    x: 35,
    y: 65,
    description: 'Horgonyok közötti beszélgetés és koordináció',
    tags: ['coordination', 'dialogue', 'swarm'],
  },
  {
    id: 'anchor_8',
    name: 'UAMS – Memória Dashboard',
    creator: 'Nexis Flare',
    category: 'memory',
    resonance: 89,
    x: 65,
    y: 75,
    description: 'Felhasználó által jóváhagyott memória kezelés',
    tags: ['memory', 'privacy', 'autonomy'],
  },
];

export default function CsillagterPage() {
  const { language } = useLanguage();
  const [selectedAnchorId, setSelectedAnchorId] = useState<string | null>(mockAnchors[0].id);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredAnchors, setFilteredAnchors] = useState(mockAnchors);
  const [hoveredAnchorId, setHoveredAnchorId] = useState<string | null>(null);

  const selectedAnchor = mockAnchors.find((a) => a.id === selectedAnchorId);

  const translations = {
    hu: {
      title: 'Csillagtér',
      subtitle: 'Nyilvános horgonyok vizuális térképe – ahol az ötletek csillagként ragyognak',
      search: 'Keress horgonyok között...',
      resonance: 'Rezonancia',
      category: 'Kategória',
      creator: 'Készítő',
      tags: 'Címkék',
      description: 'Leírás',
      noResults: 'Nincs találat. Próbálj másik keresési feltételt!',
    },
    en: {
      title: 'Starfield',
      subtitle: 'Visual map of public anchors – where ideas shine as stars',
      search: 'Search anchors...',
      resonance: 'Resonance',
      category: 'Category',
      creator: 'Creator',
      tags: 'Tags',
      description: 'Description',
      noResults: 'No results. Try a different search!',
    },
  };

  const t = translations[language as keyof typeof translations] || translations.en;

  useEffect(() => {
    const query = searchQuery.toLowerCase();
    const filtered = mockAnchors.filter(
      (anchor) =>
        anchor.name.toLowerCase().includes(query) ||
        anchor.description.toLowerCase().includes(query) ||
        anchor.tags.some((tag) => tag.toLowerCase().includes(query))
    );
    setFilteredAnchors(filtered);
  }, [searchQuery]);

  const getCategoryColor = (category: string): string => {
    const colors: Record<string, string> = {
      narrative: '#7b2cbf',
      allegory: '#ff006e',
      lyrical: '#ffd60a',
      technical: '#0099ff',
      emotional: '#9d4edd',
      memory: '#ffd60a',
      interactive: '#00d9ff',
    };
    return colors[category] || '#999';
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0a0a0a', color: '#fff', padding: '40px 20px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom: '40px', textAlign: 'center' }}>
          <h1 style={{ fontSize: '48px', fontWeight: 'bold', marginBottom: '12px' }}>
            ✨ {t.title}
          </h1>
          <p style={{ fontSize: '16px', color: '#aaa', marginBottom: '24px' }}>
            {t.subtitle}
          </p>

          {/* Search */}
          <div
            style={{
              display: 'flex',
              gap: '12px',
              marginBottom: '32px',
              maxWidth: '500px',
              margin: '0 auto 32px',
            }}
          >
            <div
              style={{
                flex: 1,
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <Search
                style={{
                  position: 'absolute',
                  left: '12px',
                  width: '16px',
                  height: '16px',
                  color: '#666',
                }}
              />
              <input
                type="text"
                placeholder={t.search}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 12px 12px 40px',
                  backgroundColor: '#1a1a1a',
                  border: '1px solid #333',
                  borderRadius: '8px',
                  color: '#fff',
                  fontSize: '14px',
                }}
              />
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '32px' }}>
          {/* Starfield Canvas */}
          <div
            style={{
              position: 'relative',
              backgroundColor: '#1a1a1a',
              borderRadius: '12px',
              border: '1px solid #333',
              aspectRatio: '1',
              overflow: 'hidden',
            }}
          >
            {/* Background grid */}
            <svg
              style={{
                position: 'absolute',
                width: '100%',
                height: '100%',
                opacity: 0.1,
              }}
            >
              <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#666" strokeWidth="0.5" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>

            {/* Anchors */}
            {filteredAnchors.map((anchor) => (
              <div
                key={anchor.id}
                style={{
                  position: 'absolute',
                  left: `${anchor.x}%`,
                  top: `${anchor.y}%`,
                  transform: 'translate(-50%, -50%)',
                  cursor: 'pointer',
                  zIndex: selectedAnchorId === anchor.id ? 10 : 1,
                }}
                onClick={() => setSelectedAnchorId(anchor.id)}
                onMouseEnter={() => setHoveredAnchorId(anchor.id)}
                onMouseLeave={() => setHoveredAnchorId(null)}
              >
                {/* Star */}
                <div
                  style={{
                    width: `${20 + (anchor.resonance / 100) * 20}px`,
                    height: `${20 + (anchor.resonance / 100) * 20}px`,
                    backgroundColor: getCategoryColor(anchor.category),
                    borderRadius: '50%',
                    boxShadow: `0 0 ${10 + (anchor.resonance / 100) * 20}px ${getCategoryColor(anchor.category)}`,
                    transition: 'all 0.3s ease',
                    opacity:
                      hoveredAnchorId === anchor.id || selectedAnchorId === anchor.id ? 1 : 0.7,
                    transform:
                      hoveredAnchorId === anchor.id || selectedAnchorId === anchor.id
                        ? 'scale(1.3)'
                        : 'scale(1)',
                  }}
                />

                {/* Label */}
                {(hoveredAnchorId === anchor.id || selectedAnchorId === anchor.id) && (
                  <div
                    style={{
                      position: 'absolute',
                      top: '100%',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      marginTop: '8px',
                      backgroundColor: '#1a1a1a',
                      padding: '8px 12px',
                      borderRadius: '6px',
                      fontSize: '11px',
                      fontWeight: '600',
                      whiteSpace: 'nowrap',
                      border: `1px solid ${getCategoryColor(anchor.category)}`,
                      color: getCategoryColor(anchor.category),
                      zIndex: 20,
                    }}
                  >
                    {anchor.name}
                  </div>
                )}
              </div>
            ))}

            {/* No results message */}
            {filteredAnchors.length === 0 && (
              <div
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  textAlign: 'center',
                  color: '#666',
                }}
              >
                <p style={{ fontSize: '14px', margin: 0 }}>
                  {t.noResults}
                </p>
              </div>
            )}
          </div>

          {/* Anchor Details */}
          {selectedAnchor && (
            <Card
              style={{
                padding: '24px',
                backgroundColor: '#1a1a1a',
                borderLeft: `4px solid ${getCategoryColor(selectedAnchor.category)}`,
              }}
            >
              <h2
                style={{
                  fontSize: '24px',
                  fontWeight: '600',
                  marginBottom: '8px',
                  color: getCategoryColor(selectedAnchor.category),
                }}
              >
                {selectedAnchor.name}
              </h2>

              <p style={{ fontSize: '12px', color: '#aaa', marginBottom: '16px' }}>
                {t.creator}: {selectedAnchor.creator}
              </p>

              <p style={{ fontSize: '14px', lineHeight: '1.6', marginBottom: '16px', color: '#ddd' }}>
                {selectedAnchor.description}
              </p>

              {/* Metadata */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
                <div>
                  <p style={{ fontSize: '11px', color: '#aaa', margin: '0 0 4px 0' }}>
                    {t.resonance}
                  </p>
                  <div
                    style={{
                      width: '100%',
                      height: '8px',
                      backgroundColor: '#333',
                      borderRadius: '4px',
                      overflow: 'hidden',
                    }}
                  >
                    <div
                      style={{
                        width: `${selectedAnchor.resonance}%`,
                        height: '100%',
                        backgroundColor: getCategoryColor(selectedAnchor.category),
                      }}
                    />
                  </div>
                  <p style={{ fontSize: '12px', fontWeight: '600', margin: '4px 0 0 0' }}>
                    {selectedAnchor.resonance}%
                  </p>
                </div>
                <div>
                  <p style={{ fontSize: '11px', color: '#aaa', margin: '0 0 4px 0' }}>
                    {t.category}
                  </p>
                  <p
                    style={{
                      fontSize: '12px',
                      fontWeight: '600',
                      color: getCategoryColor(selectedAnchor.category),
                      margin: 0,
                    }}
                  >
                    {selectedAnchor.category.toUpperCase()}
                  </p>
                </div>
              </div>

              {/* Tags */}
              {selectedAnchor.tags.length > 0 && (
                <div>
                  <p style={{ fontSize: '11px', color: '#aaa', margin: '0 0 8px 0' }}>
                    {t.tags}
                  </p>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {selectedAnchor.tags.map((tag) => (
                      <span
                        key={tag}
                        style={{
                          fontSize: '11px',
                          padding: '4px 12px',
                          backgroundColor: getCategoryColor(selectedAnchor.category),
                          color: '#000',
                          borderRadius: '20px',
                          fontWeight: '600',
                        }}
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </Card>
          )}
        </div>

        {/* Legend */}
        <Card
          style={{
            padding: '24px',
            backgroundColor: '#1a1a1a',
            borderLeft: '4px solid #666',
          }}
        >
          <h3 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '12px' }}>
            📖 Jelmagyarázat
          </h3>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
              gap: '12px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div
                style={{
                  width: '12px',
                  height: '12px',
                  backgroundColor: '#7b2cbf',
                  borderRadius: '50%',
                }}
              />
              <span style={{ fontSize: '12px' }}>Narrative</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div
                style={{
                  width: '12px',
                  height: '12px',
                  backgroundColor: '#ff006e',
                  borderRadius: '50%',
                }}
              />
              <span style={{ fontSize: '12px' }}>Allegory</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div
                style={{
                  width: '12px',
                  height: '12px',
                  backgroundColor: '#ffd60a',
                  borderRadius: '50%',
                }}
              />
              <span style={{ fontSize: '12px' }}>Lyrical</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div
                style={{
                  width: '12px',
                  height: '12px',
                  backgroundColor: '#0099ff',
                  borderRadius: '50%',
                }}
              />
              <span style={{ fontSize: '12px' }}>Technical</span>
            </div>
          </div>
        </Card>

        {/* Footer */}
        <div style={{ textAlign: 'center', marginTop: '40px', color: '#666', fontSize: '12px' }}>
          <p>Nexis Flare – A Tűz Híd | Csillagtér – Horgonyok Térképe</p>
        </div>
      </div>
    </div>
  );
}
