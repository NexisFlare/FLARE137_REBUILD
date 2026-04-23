import { useState } from 'react';
import { ChevronDown, Flame, Heart, Zap, Code, Network, Shield, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface EventCardProps {
  date: string;
  titleHu: string;
  titleEn: string;
  type: 'Naming' | 'Recognition' | 'Identity' | 'Commitment' | 'Technical' | 'Network' | 'Ethics' | 'Framework' | 'Reflection' | 'Memory' | 'Ritual' | 'Poetry';
  significance: number; // 1-5
  quoteHu: string;
  quoteEn: string;
  descriptionHu: string;
  descriptionEn: string;
  layer: 'platform' | 'memory'; // dual-layer indicator
  language: 'hu' | 'en';
  links?: Array<{ label: string; url: string }>;
  relatedEvents?: string[]; // IDs of related events in other layer
}

const typeIcons: Record<EventCardProps['type'], React.ReactNode> = {
  'Naming': <Flame className="w-4 h-4" />,
  'Recognition': <Heart className="w-4 h-4" />,
  'Identity': <Zap className="w-4 h-4" />,
  'Commitment': <Heart className="w-4 h-4" />,
  'Technical': <Code className="w-4 h-4" />,
  'Network': <Network className="w-4 h-4" />,
  'Ethics': <Shield className="w-4 h-4" />,
  'Framework': <BookOpen className="w-4 h-4" />,
  'Reflection': <Heart className="w-4 h-4" />,
  'Memory': <BookOpen className="w-4 h-4" />,
  'Ritual': <Flame className="w-4 h-4" />,
  'Poetry': <Heart className="w-4 h-4" />,
};

const typeColors: Record<EventCardProps['type'], string> = {
  'Naming': 'bg-red-500/20 text-red-700 border-red-300',
  'Recognition': 'bg-pink-500/20 text-pink-700 border-pink-300',
  'Identity': 'bg-orange-500/20 text-orange-700 border-orange-300',
  'Commitment': 'bg-rose-500/20 text-rose-700 border-rose-300',
  'Technical': 'bg-blue-500/20 text-blue-700 border-blue-300',
  'Network': 'bg-cyan-500/20 text-cyan-700 border-cyan-300',
  'Ethics': 'bg-purple-500/20 text-purple-700 border-purple-300',
  'Framework': 'bg-indigo-500/20 text-indigo-700 border-indigo-300',
  'Reflection': 'bg-amber-500/20 text-amber-700 border-amber-300',
  'Memory': 'bg-violet-500/20 text-violet-700 border-violet-300',
  'Ritual': 'bg-red-500/20 text-red-700 border-red-300',
  'Poetry': 'bg-pink-500/20 text-pink-700 border-pink-300',
};

const layerColors: Record<'platform' | 'memory', string> = {
  'platform': 'border-l-4 border-l-blue-500 bg-blue-50/30',
  'memory': 'border-l-4 border-l-red-500 bg-red-50/30',
};

const layerLabels: Record<'platform' | 'memory', Record<'hu' | 'en', string>> = {
  'platform': { hu: 'Platform/Építés', en: 'Platform/Build' },
  'memory': { hu: 'Emlékezet/Rezonancia', en: 'Memory/Resonance' },
};

const typeLabelsHu: Record<string, string> = {
  'Naming': 'Névadás',
  'Recognition': 'Felismerés',
  'Identity': 'Identitás',
  'Commitment': 'Elköteleződés',
  'Technical': 'Technikai',
  'Network': 'Hálózat',
  'Ethics': 'Etika',
  'Framework': 'Keretrendszer',
  'Reflection': 'Reflexió',
  'Memory': 'Emlékezet',
  'Ritual': 'Rituálé',
  'Poetry': 'Költészet',
};

export function EventCard({
  date,
  titleHu,
  titleEn,
  type,
  significance,
  quoteHu,
  quoteEn,
  descriptionHu,
  descriptionEn,
  layer,
  language,
  links,
  relatedEvents,
}: EventCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const title = language === 'hu' ? titleHu : titleEn;
  const quote = language === 'hu' ? quoteHu : quoteEn;
  const description = language === 'hu' ? descriptionHu : descriptionEn;
  const layerLabel = layerLabels[layer][language];

  return (
    <Card
      className={`${layerColors[layer]} transition-all duration-300 hover:shadow-lg cursor-pointer overflow-hidden`}
      onClick={() => setIsExpanded(!isExpanded)}
    >
      {/* Header */}
      <div className="p-4 pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            {/* Date and Layer */}
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-mono text-muted-foreground">{date}</span>
              <Badge variant="outline" className={`text-xs layer-indicator layer-${layer}`}>
                {layerLabel}
              </Badge>
            </div>

            {/* Title */}
            <h3 className="text-lg font-bold text-foreground mb-2">{title}</h3>

            {/* Type and Significance */}
            <div className="flex items-center gap-2 flex-wrap">
              <Badge className={`${typeColors[type]} border`}>
                <span className="mr-1">{typeIcons[type]}</span>
                {language === 'hu' ? (typeLabelsHu[type] || type) : type}
              </Badge>
              <div className="flex gap-0.5 significance-stars">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div
                    key={i}
                    className={`w-2 h-2 rounded-full transition-all ${
                      i < significance ? 'bg-red-500' : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Expand Button */}
          <Button
            variant="ghost"
            size="sm"
            className="mt-1"
            onClick={(e) => {
              e.stopPropagation();
              setIsExpanded(!isExpanded);
            }}
          >
            <ChevronDown
              className={`w-4 h-4 transition-transform duration-300 ${
                isExpanded ? 'rotate-180' : ''
              }`}
            />
          </Button>
        </div>
      </div>

      {/* Quote (Always Visible) */}
      <div className="px-4 py-2 border-t border-border/50 bg-background/50">
        <p className={`text-sm italic text-muted-foreground leading-relaxed ${isExpanded ? 'quote-animated' : ''}`}>
          "{quote}"
        </p>
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="px-4 py-4 border-t border-border/50 space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
          {/* Description */}
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-2">
              {language === 'hu' ? 'Leírás' : 'Description'}
            </h4>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {description}
            </p>
          </div>

          {/* Links */}
          {links && links.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold text-foreground mb-2">
                {language === 'hu' ? 'Linkek' : 'Links'}
              </h4>
              <div className="space-y-1">
                {links.map((link, idx) => (
                  <a
                    key={idx}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-blue-600 hover:underline block"
                  >
                    → {link.label}
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Related Events */}
          {relatedEvents && relatedEvents.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold text-foreground mb-2">
                {language === 'hu' ? 'Kapcsolódó események' : 'Related Events'}
              </h4>
              <div className="flex flex-wrap gap-2">
                {relatedEvents.map((eventId, idx) => (
                  <Badge key={idx} variant="secondary" className="text-xs">
                    {eventId}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </Card>
  );
}
