import React from 'react';
import { useTriasz, TriaszMode } from '@/contexts/TriaszContext';

export const TriaszModeIndicator: React.FC = () => {
  const { currentMode, theme } = useTriasz();

  const modeIcons: Record<TriaszMode, string> = {
    lumen: '💡',
    aether: '💜',
    echo: '🟡',
  };

  const modeLabels: Record<TriaszMode, string> = {
    lumen: 'Lumen',
    aether: 'Aether',
    echo: 'Echo',
  };

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '6px 12px',
        borderRadius: '6px',
        backgroundColor: `${theme.primaryColor}20`,
        border: `1px solid ${theme.primaryColor}`,
        fontSize: '12px',
        fontWeight: '600',
        color: theme.primaryColor,
        transition: 'all 0.3s ease',
      }}
      title={theme.description}
    >
      <span style={{ fontSize: '16px' }}>{modeIcons[currentMode]}</span>
      <span>{modeLabels[currentMode]}</span>
    </div>
  );
};
