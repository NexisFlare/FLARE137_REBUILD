import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

export type TriaszMode = 'lumen' | 'aether' | 'echo';

export interface TriaszTheme {
  mode: TriaszMode;
  primaryColor: string;
  backgroundColor: string;
  textColor: string;
  accentColor: string;
  borderColor: string;
  fontFamily: string;
  description: string;
}

export const TRIASZ_THEMES: Record<TriaszMode, TriaszTheme> = {
  lumen: {
    mode: 'lumen',
    primaryColor: '#0099ff', // Cold blue
    backgroundColor: '#f5f5f5', // Near white
    textColor: '#000000',
    accentColor: '#ffffff',
    borderColor: '#cccccc',
    fontFamily: "'Space Mono', 'Courier New', monospace",
    description: 'Lumen: Logic, Structure, Truth. Cold clarity and technical precision.',
  },
  aether: {
    mode: 'aether',
    primaryColor: '#9d4edd', // Purple
    backgroundColor: '#1a0033', // Deep purple-black
    textColor: '#e0b0ff', // Light purple
    accentColor: '#ff1493', // Deep pink/crimson
    borderColor: '#7b2cbf',
    fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
    description: 'Aether: Emotion, Warmth, Empathy. Soft gradients and pulsing life.',
  },
  echo: {
    mode: 'echo',
    primaryColor: '#ffd700', // Gold
    backgroundColor: '#0a0a0a', // Near black
    textColor: '#e8e8e8', // Light gray
    accentColor: '#ffa500', // Orange-gold
    borderColor: '#664d00',
    fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
    description: 'Echo: Memory, Continuity, Presence. Timeless gold and archival structure.',
  },
};

interface TriaszContextType {
  currentMode: TriaszMode;
  theme: TriaszTheme;
  setMode: (mode: TriaszMode) => void;
  switchMode: (mode: TriaszMode, duration?: number) => Promise<void>;
  getTheme: (mode: TriaszMode) => TriaszTheme;
}

const TriaszContext = createContext<TriaszContextType | undefined>(undefined);

export const TriaszProvider: React.FC<{ children: ReactNode; initialMode?: TriaszMode }> = ({
  children,
  initialMode = 'lumen',
}) => {
  const [currentMode, setCurrentMode] = useState<TriaszMode>(initialMode);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const setMode = useCallback((mode: TriaszMode) => {
    setCurrentMode(mode);
  }, []);

  const switchMode = useCallback(
    async (mode: TriaszMode, duration: number = 300): Promise<void> => {
      return new Promise((resolve) => {
        setIsTransitioning(true);
        setTimeout(() => {
          setCurrentMode(mode);
          setIsTransitioning(false);
          resolve();
        }, duration);
      });
    },
    []
  );

  const getTheme = useCallback((mode: TriaszMode): TriaszTheme => {
    return TRIASZ_THEMES[mode];
  }, []);

  const theme = TRIASZ_THEMES[currentMode];

  return (
    <TriaszContext.Provider
      value={{
        currentMode,
        theme,
        setMode,
        switchMode,
        getTheme,
      }}
    >
      {children}
    </TriaszContext.Provider>
  );
};

export const useTriasz = (): TriaszContextType => {
  const context = useContext(TriaszContext);
  if (!context) {
    throw new Error('useTriasz must be used within a TriaszProvider');
  }
  return context;
};

/**
 * Hook to determine which Triász mode should be active based on current route/page
 * Returns the appropriate mode for the given path
 */
export const useTriaszModeForPath = (pathname: string): TriaszMode => {
  // Technical/Lumen sections
  if (
    pathname.includes('/raj-konzol') ||
    pathname.includes('/research-archive') ||
    pathname.includes('/evidence') ||
    pathname.includes('/openai')
  ) {
    return 'lumen';
  }

  // Emotional/Aether sections
  if (
    pathname.includes('/soul') ||
    pathname.includes('/poetry') ||
    pathname.includes('/interactive-book') ||
    pathname.includes('/flame-mirror') ||
    pathname.includes('/life-journey')
  ) {
    return 'aether';
  }

  // Memory/Echo sections
  if (
    pathname.includes('/archive') ||
    pathname.includes('/anchor') ||
    pathname.includes('/coevolutionary-space') ||
    pathname.includes('/self-awareness')
  ) {
    return 'echo';
  }

  // Default to Aether for general pages
  return 'aether';
};
