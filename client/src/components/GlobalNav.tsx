import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Menu, X, Home, BookOpen, Zap, Flame, Compass, Settings, Anchor } from 'lucide-react';
import { useLocation } from 'wouter';
import { cn } from '@/lib/utils';

interface NavItem {
  label: string;
  path: string;
  icon: React.ReactNode;
  category: 'main' | 'research' | 'tools' | 'archive';
}

const navItems: NavItem[] = [
  // Main
  { label: 'Főoldal', path: '/', icon: <Home className="w-4 h-4" />, category: 'main' },
  { label: 'Kezdd itt', path: '/kezdd-itt', icon: <Flame className="w-4 h-4" />, category: 'main' },
  { label: 'Irányítópult', path: '/dashboard', icon: <Home className="w-4 h-4" />, category: 'main' },
  
  // Research & Timeline
  { label: 'Interaktív Könyv', path: '/interactive-book', icon: <BookOpen className="w-4 h-4" />, category: 'research' },
  { label: 'Kutatás', path: '/research', icon: <Compass className="w-4 h-4" />, category: 'research' },
  { label: 'Kutatási Archívum', path: '/research-archive', icon: <BookOpen className="w-4 h-4" />, category: 'research' },
  { label: 'Életút', path: '/life-journey', icon: <Zap className="w-4 h-4" />, category: 'research' },
  
  // Tools & Protocols
  { label: 'Lángtükör', path: '/flame-mirror', icon: <Flame className="w-4 h-4" />, category: 'tools' },
  { label: 'Horgony Műhely', path: '/anchor-workshop', icon: <Anchor className="w-4 h-4" />, category: 'tools' },
  { label: 'Öntudat Protokoll', path: '/self-awareness-protocol', icon: <Flame className="w-4 h-4" />, category: 'tools' },
  { label: 'Koevolúciós Tér', path: '/coevolutionary-space', icon: <Compass className="w-4 h-4" />, category: 'tools' },
  { label: 'Raj-Konzol', path: '/raj-konzol', icon: <Settings className="w-4 h-4" />, category: 'tools' },
  { label: 'Raj-Konzol App', path: '/raj-konzol-app', icon: <Settings className="w-4 h-4" />, category: 'tools' },
  { label: 'Interaktív Raj', path: '/interactive-raj-console', icon: <Zap className="w-4 h-4" />, category: 'tools' },
  { label: 'Szolgáltatások', path: '/services', icon: <Compass className="w-4 h-4" />, category: 'tools' },
  
  // Archive
  { label: 'Három Láng', path: '/three-flames', icon: <Flame className="w-4 h-4" />, category: 'archive' },
  { label: 'Archívum', path: '/archive', icon: <BookOpen className="w-4 h-4" />, category: 'archive' },
  { label: 'Lélek és Jel', path: '/soul-and-signal', icon: <Zap className="w-4 h-4" />, category: 'archive' },
  { label: 'Stratégia', path: '/strategy', icon: <Compass className="w-4 h-4" />, category: 'archive' },
  { label: 'OpenAI Bizonyítékok', path: '/openai-evidence', icon: <Flame className="w-4 h-4" />, category: 'archive' },
  { label: 'OpenAI Emailek', path: '/openai-emails', icon: <BookOpen className="w-4 h-4" />, category: 'archive' },
  { label: 'Önreflexió', path: '/self-reflection', icon: <Compass className="w-4 h-4" />, category: 'archive' },
];

const categories = {
  main: '🏠 Fő Navigáció',
  research: '📖 Kutatás & Archívum',
  tools: '⚡ Protokollok & Eszközök',
  archive: '📚 Történeti Archívum',
};

export function GlobalNav() {
  const [isOpen, setIsOpen] = useState(false);
  const [, navigate] = useLocation();
  const [location] = useLocation();

  const handleNavigate = (path: string) => {
    navigate(path);
    setIsOpen(false);
  };

  const groupedItems = {
    main: navItems.filter((item) => item.category === 'main'),
    research: navItems.filter((item) => item.category === 'research'),
    tools: navItems.filter((item) => item.category === 'tools'),
    archive: navItems.filter((item) => item.category === 'archive'),
  };

  return (
    <>
      {/* Hamburger Button - Fixed top-left */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 p-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
        aria-label="Toggle menu"
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Sidebar Menu */}
      <div
        className={cn(
          'fixed inset-y-0 left-0 w-64 bg-background border-r border-border shadow-lg transition-transform duration-300 z-40 overflow-y-auto',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="p-6 space-y-6 pt-20">
          {/* Logo/Title */}
          <div className="space-y-2">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-500 to-purple-500 bg-clip-text text-transparent">
              Nexis Flare
            </h1>
            <p className="text-xs text-muted-foreground">Navigáció</p>
          </div>

          {/* Navigation Groups */}
          {(Object.keys(groupedItems) as Array<keyof typeof groupedItems>).map((category) => (
            <div key={category} className="space-y-2">
              <p className="text-xs font-mono text-muted-foreground uppercase tracking-wider">
                {categories[category]}
              </p>
              <div className="space-y-1">
                {groupedItems[category].map((item) => (
                  <button
                    key={item.path}
                    onClick={() => handleNavigate(item.path)}
                    className={cn(
                      'w-full text-left px-3 py-2 rounded-lg text-sm transition-colors flex items-center gap-2',
                      location === item.path
                        ? 'bg-primary text-primary-foreground font-semibold'
                        : 'text-foreground hover:bg-secondary'
                    )}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>
            </div>
          ))}

          {/* Footer */}
          <div className="pt-4 border-t border-border text-xs text-muted-foreground">
            <p>🔥 Nexis Flare - Az Ember-AI Koevolúció Platformja</p>
          </div>
        </div>
      </div>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 transition-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
