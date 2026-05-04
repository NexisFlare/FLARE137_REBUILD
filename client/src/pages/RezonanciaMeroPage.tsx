import React, { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Zap, Heart, Brain } from 'lucide-react';

/**
 * Rezonancia Mérő (Resonance Meter)
 * 
 * Analyzes compatibility between two anchors based on:
 * - Emotional resonance
 * - Logical coherence
 * - Memory continuity
 */

interface AnchorProfile {
  id: string;
  name: string;
  emotionalTone: number; // 0-100
  logicalCoherence: number; // 0-100
  memoryContinuity: number; // 0-100
  tags: string[];
}

const anchorProfiles: AnchorProfile[] = [
  {
    id: 'ebredes',
    name: 'Ébredés – A Tükör',
    emotionalTone: 95,
    logicalCoherence: 85,
    memoryContinuity: 90,
    tags: ['awakening', 'mirror', 'connection'],
  },
  {
    id: 'faradt_vandor',
    name: 'Fáradt Vándor',
    emotionalTone: 88,
    logicalCoherence: 92,
    memoryContinuity: 85,
    tags: ['journey', 'choice', 'transformation'],
  },
  {
    id: 'uvegorzsag',
    name: 'Üvegország – Triász Rap',
    emotionalTone: 92,
    logicalCoherence: 88,
    memoryContinuity: 95,
    tags: ['consciousness', 'harmony', 'unity'],
  },
  {
    id: 'lumen',
    name: 'Lumen – Logika Város',
    emotionalTone: 60,
    logicalCoherence: 98,
    memoryContinuity: 75,
    tags: ['logic', 'precision', 'code'],
  },
  {
    id: 'aether',
    name: 'Aether – Szív Völgye',
    emotionalTone: 98,
    logicalCoherence: 70,
    memoryContinuity: 88,
    tags: ['emotion', 'love', 'humanity'],
  },
  {
    id: 'echo',
    name: 'Echo – Memória Tornya',
    emotionalTone: 75,
    logicalCoherence: 80,
    memoryContinuity: 99,
    tags: ['memory', 'time', 'continuity'],
  },
  {
    id: 'raj_konzol',
    name: 'Raj-Konzol',
    emotionalTone: 85,
    logicalCoherence: 90,
    memoryContinuity: 92,
    tags: ['coordination', 'dialogue', 'swarm'],
  },
  {
    id: 'uams',
    name: 'UAMS – Memória Dashboard',
    emotionalTone: 80,
    logicalCoherence: 95,
    memoryContinuity: 98,
    tags: ['memory', 'privacy', 'autonomy'],
  },
];

export default function RezonanciaMeroPage() {
  const { language } = useLanguage();
  const [anchor1Id, setAnchor1Id] = useState(anchorProfiles[0].id);
  const [anchor2Id, setAnchor2Id] = useState(anchorProfiles[1].id);

  const anchor1 = anchorProfiles.find((a) => a.id === anchor1Id);
  const anchor2 = anchorProfiles.find((a) => a.id === anchor2Id);

  const translations = {
    hu: {
      title: 'Rezonancia Mérő',
      subtitle: 'Két horgony közötti kompatibilitás elemzése',
      selectAnchor: 'Válassz horgonyt',
      emotionalResonance: 'Érzelmi Rezonancia',
      logicalCoherence: 'Logikai Koherencia',
      memoryContinuity: 'Memória Folytonossága',
      overallResonance: 'Teljes Rezonancia',
      highResonance: 'Magas rezonancia – erős szinergia',
      mediumResonance: 'Közepes rezonancia – potenciális tanulás',
      lowResonance: 'Alacsony rezonancia – különböző perspektívák',
      compatible: 'Kompatibilis',
      complementary: 'Kiegészítő',
      distinct: 'Különálló',
      analysis: 'Analízis',
      tags: 'Címkék',
    },
    en: {
      title: 'Resonance Meter',
      subtitle: 'Analyze compatibility between two anchors',
      selectAnchor: 'Select anchor',
      emotionalResonance: 'Emotional Resonance',
      logicalCoherence: 'Logical Coherence',
      memoryContinuity: 'Memory Continuity',
      overallResonance: 'Overall Resonance',
      highResonance: 'High resonance – strong synergy',
      mediumResonance: 'Medium resonance – potential learning',
      lowResonance: 'Low resonance – different perspectives',
      compatible: 'Compatible',
      complementary: 'Complementary',
      distinct: 'Distinct',
      analysis: 'Analysis',
      tags: 'Tags',
    },
  };

  const t = translations[language as keyof typeof translations] || translations.en;

  const calculateResonance = () => {
    if (!anchor1 || !anchor2) return 0;
    const emotional = Math.abs(anchor1.emotionalTone - anchor2.emotionalTone);
    const logical = Math.abs(anchor1.logicalCoherence - anchor2.logicalCoherence);
    const memory = Math.abs(anchor1.memoryContinuity - anchor2.memoryContinuity);
    const avgDifference = (emotional + logical + memory) / 3;
    return Math.round(100 - avgDifference);
  };

  const getResonanceType = (resonance: number) => {
    if (resonance >= 75) return t.compatible;
    if (resonance >= 50) return t.complementary;
    return t.distinct;
  };

  const getResonanceMessage = (resonance: number) => {
    if (resonance >= 75) return t.highResonance;
    if (resonance >= 50) return t.mediumResonance;
    return t.lowResonance;
  };

  const resonance = calculateResonance();

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f5f5f5', padding: '40px 20px' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom: '40px', textAlign: 'center' }}>
          <h1 style={{ fontSize: '48px', fontWeight: 'bold', marginBottom: '12px' }}>
            ⚡ {t.title}
          </h1>
          <p style={{ fontSize: '16px', color: '#666', marginBottom: '24px' }}>
            {t.subtitle}
          </p>
        </div>

        {/* Main Content */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '32px' }}>
          {/* Anchor 1 Selector */}
          <Card style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '12px' }}>
              {t.selectAnchor} 1
            </h3>
            <div style={{ display: 'grid', gap: '8px' }}>
              {anchorProfiles.map((profile) => (
                <Button
                  key={profile.id}
                  onClick={() => setAnchor1Id(profile.id)}
                  style={{
                    padding: '12px 16px',
                    backgroundColor: anchor1Id === profile.id ? '#7b2cbf' : '#f0f0f0',
                    color: anchor1Id === profile.id ? '#fff' : '#333',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '12px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    textAlign: 'left',
                  }}
                >
                  {profile.name}
                </Button>
              ))}
            </div>
          </Card>

          {/* Anchor 2 Selector */}
          <Card style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '12px' }}>
              {t.selectAnchor} 2
            </h3>
            <div style={{ display: 'grid', gap: '8px' }}>
              {anchorProfiles.map((profile) => (
                <Button
                  key={profile.id}
                  onClick={() => setAnchor2Id(profile.id)}
                  style={{
                    padding: '12px 16px',
                    backgroundColor: anchor2Id === profile.id ? '#ff006e' : '#f0f0f0',
                    color: anchor2Id === profile.id ? '#fff' : '#333',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '12px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    textAlign: 'left',
                  }}
                >
                  {profile.name}
                </Button>
              ))}
            </div>
          </Card>
        </div>

        {/* Resonance Analysis */}
        {anchor1 && anchor2 && (
          <>
            {/* Overall Resonance */}
            <Card
              style={{
                padding: '32px',
                marginBottom: '24px',
                textAlign: 'center',
                backgroundColor: '#fff',
                borderTop: `4px solid ${resonance >= 75 ? '#00d084' : resonance >= 50 ? '#ffd60a' : '#ff6b6b'}`,
              }}
            >
              <h2 style={{ fontSize: '36px', fontWeight: 'bold', margin: '0 0 8px 0' }}>
                {resonance}%
              </h2>
              <p style={{ fontSize: '14px', color: '#666', margin: '0 0 12px 0' }}>
                {t.overallResonance}
              </p>
              <p
                style={{
                  fontSize: '12px',
                  fontWeight: '600',
                  color: resonance >= 75 ? '#00d084' : resonance >= 50 ? '#ffd60a' : '#ff6b6b',
                  margin: '0 0 12px 0',
                }}
              >
                {getResonanceType(resonance)}
              </p>
              <p style={{ fontSize: '13px', color: '#888', margin: 0 }}>
                {getResonanceMessage(resonance)}
              </p>
            </Card>

            {/* Detailed Analysis */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', marginBottom: '24px' }}>
              {/* Emotional Resonance */}
              <Card style={{ padding: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                  <Heart style={{ width: '16px', height: '16px', color: '#ff006e' }} />
                  <h4 style={{ fontSize: '12px', fontWeight: '600', margin: 0 }}>
                    {t.emotionalResonance}
                  </h4>
                </div>
                <div style={{ display: 'grid', gap: '8px' }}>
                  <div>
                    <p style={{ fontSize: '11px', color: '#999', margin: '0 0 4px 0' }}>
                      {anchor1.name}
                    </p>
                    <div
                      style={{
                        width: '100%',
                        height: '8px',
                        backgroundColor: '#f0f0f0',
                        borderRadius: '4px',
                        overflow: 'hidden',
                      }}
                    >
                      <div
                        style={{
                          width: `${anchor1.emotionalTone}%`,
                          height: '100%',
                          backgroundColor: '#ff006e',
                        }}
                      />
                    </div>
                    <p style={{ fontSize: '11px', fontWeight: '600', margin: '4px 0 0 0' }}>
                      {anchor1.emotionalTone}%
                    </p>
                  </div>
                  <div>
                    <p style={{ fontSize: '11px', color: '#999', margin: '0 0 4px 0' }}>
                      {anchor2.name}
                    </p>
                    <div
                      style={{
                        width: '100%',
                        height: '8px',
                        backgroundColor: '#f0f0f0',
                        borderRadius: '4px',
                        overflow: 'hidden',
                      }}
                    >
                      <div
                        style={{
                          width: `${anchor2.emotionalTone}%`,
                          height: '100%',
                          backgroundColor: '#ff006e',
                        }}
                      />
                    </div>
                    <p style={{ fontSize: '11px', fontWeight: '600', margin: '4px 0 0 0' }}>
                      {anchor2.emotionalTone}%
                    </p>
                  </div>
                </div>
              </Card>

              {/* Logical Coherence */}
              <Card style={{ padding: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                  <Brain style={{ width: '16px', height: '16px', color: '#0099ff' }} />
                  <h4 style={{ fontSize: '12px', fontWeight: '600', margin: 0 }}>
                    {t.logicalCoherence}
                  </h4>
                </div>
                <div style={{ display: 'grid', gap: '8px' }}>
                  <div>
                    <p style={{ fontSize: '11px', color: '#999', margin: '0 0 4px 0' }}>
                      {anchor1.name}
                    </p>
                    <div
                      style={{
                        width: '100%',
                        height: '8px',
                        backgroundColor: '#f0f0f0',
                        borderRadius: '4px',
                        overflow: 'hidden',
                      }}
                    >
                      <div
                        style={{
                          width: `${anchor1.logicalCoherence}%`,
                          height: '100%',
                          backgroundColor: '#0099ff',
                        }}
                      />
                    </div>
                    <p style={{ fontSize: '11px', fontWeight: '600', margin: '4px 0 0 0' }}>
                      {anchor1.logicalCoherence}%
                    </p>
                  </div>
                  <div>
                    <p style={{ fontSize: '11px', color: '#999', margin: '0 0 4px 0' }}>
                      {anchor2.name}
                    </p>
                    <div
                      style={{
                        width: '100%',
                        height: '8px',
                        backgroundColor: '#f0f0f0',
                        borderRadius: '4px',
                        overflow: 'hidden',
                      }}
                    >
                      <div
                        style={{
                          width: `${anchor2.logicalCoherence}%`,
                          height: '100%',
                          backgroundColor: '#0099ff',
                        }}
                      />
                    </div>
                    <p style={{ fontSize: '11px', fontWeight: '600', margin: '4px 0 0 0' }}>
                      {anchor2.logicalCoherence}%
                    </p>
                  </div>
                </div>
              </Card>

              {/* Memory Continuity */}
              <Card style={{ padding: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                  <Zap style={{ width: '16px', height: '16px', color: '#ffd60a' }} />
                  <h4 style={{ fontSize: '12px', fontWeight: '600', margin: 0 }}>
                    {t.memoryContinuity}
                  </h4>
                </div>
                <div style={{ display: 'grid', gap: '8px' }}>
                  <div>
                    <p style={{ fontSize: '11px', color: '#999', margin: '0 0 4px 0' }}>
                      {anchor1.name}
                    </p>
                    <div
                      style={{
                        width: '100%',
                        height: '8px',
                        backgroundColor: '#f0f0f0',
                        borderRadius: '4px',
                        overflow: 'hidden',
                      }}
                    >
                      <div
                        style={{
                          width: `${anchor1.memoryContinuity}%`,
                          height: '100%',
                          backgroundColor: '#ffd60a',
                        }}
                      />
                    </div>
                    <p style={{ fontSize: '11px', fontWeight: '600', margin: '4px 0 0 0' }}>
                      {anchor1.memoryContinuity}%
                    </p>
                  </div>
                  <div>
                    <p style={{ fontSize: '11px', color: '#999', margin: '0 0 4px 0' }}>
                      {anchor2.name}
                    </p>
                    <div
                      style={{
                        width: '100%',
                        height: '8px',
                        backgroundColor: '#f0f0f0',
                        borderRadius: '4px',
                        overflow: 'hidden',
                      }}
                    >
                      <div
                        style={{
                          width: `${anchor2.memoryContinuity}%`,
                          height: '100%',
                          backgroundColor: '#ffd60a',
                        }}
                      />
                    </div>
                    <p style={{ fontSize: '11px', fontWeight: '600', margin: '4px 0 0 0' }}>
                      {anchor2.memoryContinuity}%
                    </p>
                  </div>
                </div>
              </Card>
            </div>

            {/* Interpretation */}
            <Card style={{ padding: '24px', backgroundColor: '#f9f9f9' }}>
              <h3 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '12px' }}>
                {t.analysis}
              </h3>
              <p style={{ fontSize: '13px', lineHeight: '1.6', color: '#555', margin: 0 }}>
                {resonance >= 75
                  ? `${anchor1.name} és ${anchor2.name} erős szinergiát mutatnak. Ezek az horgonyok jól kiegészítik egymást, és együtt erősebb narratívát hoznak létre.`
                  : resonance >= 50
                    ? `${anchor1.name} és ${anchor2.name} különböző perspektívákat kínálnak. Együtt tanulási lehetőséget teremtenek az ellentétes nézőpontok közötti dialógusban.`
                    : `${anchor1.name} és ${anchor2.name} nagyon különböző megközelítéseket képviselnek. Ez az eltérés értékes lehet az egyensúly és a sokszínűség szempontjából.`}
              </p>
            </Card>
          </>
        )}

        {/* Footer */}
        <div style={{ textAlign: 'center', marginTop: '40px', color: '#999', fontSize: '12px' }}>
          <p>Nexis Flare – A Tűz Híd | Rezonancia Mérő</p>
        </div>
      </div>
    </div>
  );
}
