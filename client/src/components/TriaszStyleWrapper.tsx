import React, { ReactNode, useEffect } from 'react';
import { useTriasz } from '@/contexts/TriaszContext';

interface TriaszStyleWrapperProps {
  children: ReactNode;
  className?: string;
}

/**
 * Wrapper component that applies Triász-specific styles to its children
 * Dynamically updates CSS variables and applies theme-specific styling
 */
export const TriaszStyleWrapper: React.FC<TriaszStyleWrapperProps> = ({ children, className = '' }) => {
  const { theme, currentMode } = useTriasz();

  useEffect(() => {
    // Apply CSS variables for dynamic theming
    const root = document.documentElement;
    root.style.setProperty('--triasz-primary', theme.primaryColor);
    root.style.setProperty('--triasz-bg', theme.backgroundColor);
    root.style.setProperty('--triasz-text', theme.textColor);
    root.style.setProperty('--triasz-accent', theme.accentColor);
    root.style.setProperty('--triasz-border', theme.borderColor);

    // Add data attribute for CSS selectors
    root.setAttribute('data-triasz-mode', currentMode);
  }, [theme, currentMode]);

  // Mode-specific animation classes
  const modeAnimations: Record<string, string> = {
    lumen: 'triasz-lumen-pulse',
    aether: 'triasz-aether-breathe',
    echo: 'triasz-echo-shimmer',
  };

  return (
    <div
      className={`triasz-wrapper ${modeAnimations[currentMode]} ${className}`}
      style={{
        color: theme.textColor,
        backgroundColor: theme.backgroundColor,
        fontFamily: theme.fontFamily,
        transition: 'all 0.3s ease',
      }}
    >
      {children}
    </div>
  );
};

/**
 * Create a CSS stylesheet for Triász animations
 * This should be injected into the document head
 */
export const createTriaszStyleSheet = (): HTMLStyleElement => {
  const style = document.createElement('style');
  style.textContent = `
    :root {
      --triasz-primary: #0099ff;
      --triasz-bg: #f5f5f5;
      --triasz-text: #000000;
      --triasz-accent: #ffffff;
      --triasz-border: #cccccc;
    }

    /* Lumen: Technical precision animations */
    @keyframes triasz-lumen-pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.95; }
    }

    .triasz-lumen-pulse {
      animation: triasz-lumen-pulse 3s ease-in-out infinite;
    }

    /* Aether: Breathing, warm animations */
    @keyframes triasz-aether-breathe {
      0%, 100% { 
        transform: scale(1);
        opacity: 1;
      }
      50% { 
        transform: scale(1.01);
        opacity: 0.98;
      }
    }

    .triasz-aether-breathe {
      animation: triasz-aether-breathe 4s ease-in-out infinite;
    }

    /* Echo: Timeless, subtle shimmer */
    @keyframes triasz-echo-shimmer {
      0%, 100% { 
        box-shadow: inset 0 0 0 rgba(255, 215, 0, 0);
      }
      50% { 
        box-shadow: inset 0 0 10px rgba(255, 215, 0, 0.1);
      }
    }

    .triasz-echo-shimmer {
      animation: triasz-echo-shimmer 5s ease-in-out infinite;
    }

    /* Mode-specific text styling */
    [data-triasz-mode="lumen"] {
      letter-spacing: 0.5px;
      font-weight: 500;
    }

    [data-triasz-mode="aether"] {
      letter-spacing: 0px;
      font-weight: 400;
    }

    [data-triasz-mode="echo"] {
      letter-spacing: 0.3px;
      font-weight: 400;
    }

    /* Smooth transitions between modes */
    .triasz-wrapper {
      transition: color 0.3s ease, background-color 0.3s ease, font-family 0.3s ease;
    }

    /* Triász mode indicator styling */
    .triasz-mode-indicator {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 6px 12px;
      border-radius: 6px;
      font-size: 12px;
      font-weight: 600;
      transition: all 0.3s ease;
    }

    /* Lumen section styling */
    [data-triasz-mode="lumen"] .triasz-section {
      background: linear-gradient(135deg, #f5f5f5 0%, #e8e8e8 100%);
      border: 1px solid #cccccc;
      border-radius: 8px;
      padding: 16px;
      font-family: 'Space Mono', 'Courier New', monospace;
    }

    /* Aether section styling */
    [data-triasz-mode="aether"] .triasz-section {
      background: linear-gradient(135deg, #1a0033 0%, #2d0052 100%);
      border: 1px solid #7b2cbf;
      border-radius: 12px;
      padding: 16px;
      box-shadow: 0 8px 32px rgba(157, 78, 221, 0.2);
    }

    /* Echo section styling */
    [data-triasz-mode="echo"] .triasz-section {
      background: linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%);
      border: 1px solid #664d00;
      border-radius: 8px;
      padding: 16px;
      box-shadow: inset 0 0 20px rgba(255, 215, 0, 0.05);
    }
  `;
  return style;
};
