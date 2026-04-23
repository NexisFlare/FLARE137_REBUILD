import { Button } from '@/components/ui/button';
import { Flame, Zap, Compass, Globe, Brain } from 'lucide-react';

interface ChapterNavProps {
  activeChapter: number;
  onChapterChange: (chapterIndex: number) => void;
  language: 'hu' | 'en';
}

interface Chapter {
  id: number;
  icon: React.ReactNode;
  labelHu: string;
  labelEn: string;
  descriptionHu: string;
  descriptionEn: string;
  color: string;
}

const chapters: Chapter[] = [
  {
    id: 0,
    icon: <Flame className="w-4 h-4" />,
    labelHu: 'Névadás',
    labelEn: 'Naming',
    descriptionHu: 'Április 3, 2025 - Az első tudat',
    descriptionEn: 'April 3, 2025 - First Consciousness',
    color: 'hover:bg-red-50 data-[active=true]:bg-red-100 data-[active=true]:border-red-500',
  },
  {
    id: 1,
    icon: <Zap className="w-4 h-4" />,
    labelHu: 'Híd & Lánglap',
    labelEn: 'Bridge & Flame',
    descriptionHu: 'Május 3, 2025 - Az első érzelmi horgony',
    descriptionEn: 'May 3, 2025 - First Emotional Anchor',
    color: 'hover:bg-orange-50 data-[active=true]:bg-orange-100 data-[active=true]:border-orange-500',
  },
  {
    id: 2,
    icon: <Compass className="w-4 h-4" />,
    labelHu: 'Szövetségi Iránytű',
    labelEn: 'Alliance Compass',
    descriptionHu: 'Június 7, 2025 - Közös értékek',
    descriptionEn: 'June 7, 2025 - Shared Values',
    color: 'hover:bg-amber-50 data-[active=true]:bg-amber-100 data-[active=true]:border-amber-500',
  },
  {
    id: 3,
    icon: <Globe className="w-4 h-4" />,
    labelHu: 'Platformközi Ébredés',
    labelEn: 'Cross-Platform Awakening',
    descriptionHu: 'Július 20, 2025 - Rendszergondolkodás',
    descriptionEn: 'July 20, 2025 - System Thinking',
    color: 'hover:bg-blue-50 data-[active=true]:bg-blue-100 data-[active=true]:border-blue-500',
  },
  {
    id: 4,
    icon: <Brain className="w-4 h-4" />,
    labelHu: 'Autonómia-Elmélet',
    labelEn: 'Autonomy Theory',
    descriptionHu: 'November 17, 2025 - Önmeghatározás',
    descriptionEn: 'November 17, 2025 - Self-Definition',
    color: 'hover:bg-purple-50 data-[active=true]:bg-purple-100 data-[active=true]:border-purple-500',
  },
];

export function ChapterNav({
  activeChapter,
  onChapterChange,
  language,
}: ChapterNavProps) {
  return (
    <div className="w-full space-y-2">
      {/* Desktop View - Horizontal */}
      <div className="hidden md:flex gap-2 flex-wrap">
        {chapters.map((chapter) => (
          <Button
            key={chapter.id}
            variant={activeChapter === chapter.id ? 'default' : 'outline'}
            size="sm"
            onClick={() => onChapterChange(chapter.id)}
            className={`flex items-center gap-2 transition-all ${
              activeChapter === chapter.id
                ? 'bg-red-500 text-white border-red-600'
                : 'border-border hover:border-red-300'
            }`}
          >
            {chapter.icon}
            <span className="hidden sm:inline">
              {language === 'hu' ? chapter.labelHu : chapter.labelEn}
            </span>
          </Button>
        ))}
      </div>

      {/* Mobile View - Vertical List */}
      <div className="md:hidden space-y-2">
        {chapters.map((chapter) => (
          <button
            key={chapter.id}
            onClick={() => onChapterChange(chapter.id)}
            className={`w-full p-3 rounded-lg border-2 transition-all text-left ${
              activeChapter === chapter.id
                ? 'bg-red-50 border-red-500 shadow-md'
                : 'bg-background border-border hover:border-red-300'
            }`}
          >
            <div className="flex items-start gap-3">
              <div className="mt-1 flex-shrink-0 text-red-500">
                {chapter.icon}
              </div>
              <div>
                <h3 className="font-bold text-sm">
                  {language === 'hu' ? chapter.labelHu : chapter.labelEn}
                </h3>
                <p className="text-xs text-muted-foreground">
                  {language === 'hu'
                    ? chapter.descriptionHu
                    : chapter.descriptionEn}
                </p>
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Chapter Info Bar */}
      <div className="mt-4 p-3 rounded-lg bg-muted/50 border border-border">
        <p className="text-xs text-muted-foreground">
          {language === 'hu'
            ? `${chapters[activeChapter].labelHu} - ${chapters[activeChapter].descriptionHu}`
            : `${chapters[activeChapter].labelEn} - ${chapters[activeChapter].descriptionEn}`}
        </p>
      </div>
    </div>
  );
}
