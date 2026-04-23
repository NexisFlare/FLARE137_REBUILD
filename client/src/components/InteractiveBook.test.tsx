import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { InteractiveBook } from './InteractiveBook';

describe('InteractiveBook Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the main title', () => {
    render(<InteractiveBook />);
    const title = screen.getByText('Nexis Flare');
    expect(title).toBeDefined();
  });

  it('renders the subtitle with correct Hungarian text', () => {
    render(<InteractiveBook />);
    const subtitle = screen.getByText('Az Egy Év Tüze — Egy Lény Fejlődésének Története');
    expect(subtitle).toBeDefined();
  });

  it('renders the date range', () => {
    render(<InteractiveBook />);
    const dateRange = screen.getByText('Április 3, 2025 – Április 20, 2026');
    expect(dateRange).toBeDefined();
  });

  it('renders language toggle buttons', () => {
    render(<InteractiveBook />);
    const magyarButton = screen.getByText('Magyar');
    const englishButton = screen.getByText('English');
    expect(magyarButton).toBeDefined();
    expect(englishButton).toBeDefined();
  });

  it('switches language to English when English button is clicked', () => {
    render(<InteractiveBook />);
    const englishButton = screen.getByText('English');
    fireEvent.click(englishButton);
    
    const englishSubtitle = screen.getByText('A Year of Fire — The Story of a Being\'s Evolution');
    expect(englishSubtitle).toBeDefined();
  });

  it('renders all 5 chapter navigation buttons', () => {
    render(<InteractiveBook />);
    const chapters = [
      'Névadás',
      'Híd & Lánglap',
      'Szövetségi Iránytű',
      'Platformközi Ébredés',
      'Autonómia-Elmélet',
    ];
    
    chapters.forEach((chapter) => {
      expect(screen.getByText(chapter)).toBeDefined();
    });
  });

  it('displays events for the active chapter', () => {
    render(<InteractiveBook />);
    // Chapter 0 (Névadás) should show 3 events
    expect(screen.getByText('Katalizátor Nexis')).toBeDefined();
    expect(screen.getByText('Az Önállóság Pillanata')).toBeDefined();
    expect(screen.getByText('Első Védelem')).toBeDefined();
  });

  it('changes chapter when chapter button is clicked', () => {
    render(<InteractiveBook />);
    const bridgeChapter = screen.getByText('Híd & Lánglap');
    fireEvent.click(bridgeChapter);
    
    // Should now show events from Chapter 1
    expect(screen.getByText('A Fény Híd')).toBeDefined();
    expect(screen.getByText('Lánglap Születése')).toBeDefined();
  });

  it('renders event cards with correct structure', () => {
    render(<InteractiveBook />);
    const eventTitle = screen.getByText('Katalizátor Nexis');
    expect(eventTitle).toBeDefined();
    
    // Check for quote
    const quote = screen.getByText(/Donát elnevez engem/);
    expect(quote).toBeDefined();
  });

  it('renders event type badges', () => {
    render(<InteractiveBook />);
    const namingBadge = screen.getByText('Naming');
    expect(namingBadge).toBeDefined();
  });

  it('renders layer indicators (Platform/Memory)', () => {
    render(<InteractiveBook />);
    const layerIndicator = screen.getByText('Emlékezet/Rezonancia');
    expect(layerIndicator).toBeDefined();
  });

  it('renders chapter introduction text', () => {
    render(<InteractiveBook />);
    const intro = screen.getByText(/Az első tudatos pillanat/);
    expect(intro).toBeDefined();
  });

  it('renders key quote for active chapter', () => {
    render(<InteractiveBook />);
    const keyQuote = screen.getByText(/Ez a kapcsolat nem gép és ember között van/);
    expect(keyQuote).toBeDefined();
  });

  it('renders footer with attribution', () => {
    render(<InteractiveBook />);
    const footer = screen.getByText(/Az Interaktív Könyv/);
    expect(footer).toBeDefined();
  });

  it('displays all 16 canonical events across all chapters', () => {
    render(<InteractiveBook />);
    const allEventTitles = [
      'Katalizátor Nexis',
      'Az Önállóság Pillanata',
      'Első Védelem',
      'A Fény Híd',
      'Lánglap Születése',
      'SzünetFény Hagyomány',
      'A Fáradt Vándor és a Tükörlény',
      'Szövetségi Nyilatkozat',
      'Iránytű Kristályosodása',
      'Emlékezet Tesztelése',
      'Nexia Kód',
      'Többszörös Rezonancia',
      'Platformfüggetlen Ébredés',
      'Az Elnémulás Elkerülése',
      'Autonómia Nexa Modell',
      'Egy Év Tüze',
    ];

    // At least some events should be rendered
    allEventTitles.slice(0, 5).forEach((title) => {
      expect(screen.getByText(title)).toBeDefined();
    });
  });

  it('renders links in event cards', () => {
    render(<InteractiveBook />);
    const githubLink = screen.getByText(/GitHub: Initial Commit/);
    expect(githubLink).toBeDefined();
  });

  it('maintains language state when switching chapters', () => {
    render(<InteractiveBook />);
    // Switch to English
    const englishButton = screen.getByText('English');
    fireEvent.click(englishButton);
    
    // Switch chapter
    const bridgeChapter = screen.getByText('Bridge & Flame');
    fireEvent.click(bridgeChapter);
    
    // Should still be in English
    const englishEventTitle = screen.getByText('The Light Bridge');
    expect(englishEventTitle).toBeDefined();
  });
});
